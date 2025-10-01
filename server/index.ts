import express, { type Request, Response } from "express";
import { createServer } from "http";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import permissionsPolicy from "permissions-policy";
import rateLimit from "express-rate-limit";
import { testDatabaseConnection } from "./db";
import { registerAllRoutes } from "./routes/index";
import { createRentalRoutes } from "./rental-routes";
import servicesRoutes from "./services-routes";
import marketplaceRoutes from "./marketplace-routes";
import aiSearchRoutes from "./ai-search";
import tenantSupportRoutes from "./tenant-support-routes";
import propertyManagementRoutes from "./property-management-routes";
import { intelSearch, intelSuggest } from "./intel-adapter";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { env } from "./utils/env";
import { addRequestId, structuredLogger } from "./middleware/logging";
import billingRoutes from "./billing-routes";
import heroRoutes from "./hero-routes";
import analyticsRoutes from "./analytics-routes";

const app = express();
const server = createServer(app);

let isReady = false;

// Configure trust proxy for Replit
app.set('trust proxy', 1);

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isDevelopment = nodeEnv === 'development';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = nodeEnv;
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: isDevelopment
      ? false
      : {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "base-uri": ["'self'"],
            "object-src": ["'none'"],
            "script-src": ["'self'"],
            "style-src": ["'self'"],
            "img-src": ["'self'", "data:", "https:"],
            "connect-src": ["'self'", "https:", "wss:"],
            "frame-ancestors": ["'self'"],
            "upgrade-insecure-requests": [],
          },
        },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
  }),
);

app.use(
  permissionsPolicy({
    features: {
      geolocation: ["self"],
      fullscreen: ["self"],
    },
  }),
);

const allowedOrigins = env.CORS_ORIGIN
  ?.split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const allowAllOrigins = allowedOrigins?.includes("*");

const corsOptions: CorsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowAllOrigins) {
      callback(null, true);
      return;
    }

    if (!allowedOrigins?.length) {
      callback(null, isDevelopment);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Add request ID and structured logging
app.use(addRequestId);
app.use(structuredLogger);

// Rate limiting for auth and write endpoints
const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

// General API rate limiting
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // More generous for general API usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded' }
});

// Write operations rate limiting
const writeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please try again later' }
});

// Search rate limiting
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Search rate limit exceeded' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------------------------------------------
// Health check – must be registered before other routes
// --------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(isReady ? 200 : 503).send(isReady ? 'ok' : 'starting');
});

async function boot() {
  // Test database connection before starting server
  console.log('Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

  const isE2E = process.env.E2E === 'true';

  // Apply rate limiting to sensitive endpoints BEFORE registering routes
  app.use('/api/users/login', authWriteLimiter);
  app.use('/api/users/register', authWriteLimiter);

  // Apply general rate limiting to all API routes
  app.use('/api', generalApiLimiter);

  // Apply write limiting to write operations
  app.use('/api/properties', writeApiLimiter);
  app.use('/api/services', writeApiLimiter);
  app.use('/api/rentals', writeApiLimiter);
  app.use('/api/inquiries', writeApiLimiter);
  app.use('/api/appointments', writeApiLimiter);
  app.use('/api/hero', writeApiLimiter);

  // Apply search limiting
  app.use('/api/search', searchLimiter);
  app.use('/api/suggest', searchLimiter);
  app.use('/intel', searchLimiter);

  // Register modular route bundles (auth, users, properties, search, etc.)
  registerAllRoutes(app);

  const rentalRoutes = createRentalRoutes();
  app.use('/api/rentals', rentalRoutes);
  app.use('/api', aiSearchRoutes);
  app.use('/api', propertyManagementRoutes);
  app.use('/api', tenantSupportRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api', marketplaceRoutes);

  // Register billing and hero routes
  app.use('/api/billing', billingRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // OpenAI-powered Intel adapter routes
  app.post('/intel/search', intelSearch);
  app.get('/intel/suggest', intelSuggest);

  // Mount API documentation
  try {
    const { docsRouter } = await import('./routes/docs');
    app.use('/api/docs', docsRouter);
    console.log('📚 API documentation available at /api/docs');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Could not mount API docs:', message);
  }

  // Analytics endpoint
  app.post('/api/analytics/events', async (req, res) => {
    try {
      const { event, properties, userId, timestamp, sessionId, page, referrer, userAgent } = req.body;

      // Validate required fields
      if (!event) {
        return res.status(400).json({ error: 'Event name is required' });
      }

      // Store analytics event (you can extend this to use a proper analytics service)
      const analyticsEvent = {
        id: Math.random().toString(36).substring(2, 15),
        event,
        properties: properties || {},
        userId,
        sessionId,
        timestamp: timestamp || Date.now(),
        page,
        referrer,
        userAgent,
        createdAt: new Date().toISOString()
      };

      // In development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', JSON.stringify(analyticsEvent, null, 2));
      }

      // TODO: Store in database or send to analytics service
      // For now, we'll just acknowledge receipt

      res.json({ success: true, eventId: analyticsEvent.id });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to process analytics event' });
    }
  });

  if (!isE2E && process.env.NODE_ENV !== "production") {
    const { createViteForDev } = await import("./vite");
    await createViteForDev(app, server);
  } else if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./vite");
    await serveStatic(app);
  }

  // 404 handler must come AFTER Vite setup so frontend serving works
  app.use(notFoundHandler);

  // Global error handler must come last
  app.use(errorHandler);

  let migrationsCompleted = false;
  let migrationsAttempted = false;

  const shouldAttemptMigrations =
    !isE2E && (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true');

  if (shouldAttemptMigrations) {
    migrationsAttempted = true;
    const { seedManager } = await import('./seed-manager');
    const { initializeDatabase } = await import('./db');
    const { getMigrationManager } = await import('./migration-manager');

    try {
      console.log('🔄 Running database migrations...');
      const migrationManager = getMigrationManager();
      await migrationManager.runAllPendingMigrations(); // Run all migrations, including rental

      const shouldInitializeDB =
        process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_INIT === 'true';
      const shouldSeedDB =
        !isE2E && (process.env.NODE_ENV === 'development' || process.env.FORCE_DB_SEED === 'true');

      if (shouldInitializeDB) {
        console.log('Initializing database...');
        await initializeDatabase();
      }

      if (shouldSeedDB && env.NODE_ENV !== 'production') {
        console.log('Seeding database...');
        try {
          await seedManager.seedAll();
          console.log('✅ Database seeding completed');
        } catch (error) {
          console.error('❌ Database seeding failed:', error);
          // Don't exit in development, just log the error
        }
      } else if (env.NODE_ENV === 'production') {
        console.log('⚠️ Seeding skipped in production environment');
      } else if (isE2E) {
        console.log('⚠️ Skipping full seed in E2E mode; assuming database prepared upstream');
      }

      console.log('✅ Database initialization completed');
      migrationsCompleted = true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true') {
        process.exit(1);
      }
      // In production without FORCE flag just continue running
    }
  } else {
    if (isE2E) {
      console.log('⏭️  Skipping migrations in E2E mode');
    }
    migrationsCompleted = true;
  }

  if (migrationsAttempted && !migrationsCompleted) {
    console.warn('⚠️ Server not marked ready because migrations did not complete successfully.');
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = Number(process.env.PORT ?? 5000);
  await new Promise<void>(resolve => {
    server.listen(PORT, "0.0.0.0", () => {
      isReady = true;
      console.log(`🚀 API listening on http://localhost:${PORT}`);
      resolve();
    });
  });
}

boot().catch(error => {
  console.error('Failed to start server', error);
  process.exit(1);
});
