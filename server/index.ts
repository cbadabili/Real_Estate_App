import express, { type Request, Response } from "express";
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

let READY = false;

// Configure trust proxy for Replit
app.set('trust proxy', 1);

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isDevelopment = nodeEnv === 'development';
const shouldBootMigrations = (process.env.BOOT_RUN_MIGRATIONS ?? '').toLowerCase() !== 'false';

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
  .map((origin: string) => origin.trim())
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

const isTestLikeEnvironment = process.env.NODE_ENV === 'test' || process.env.E2E === 'true';
const resolveRateLimit = (defaultLimit: number, testOverride = 1000) =>
  isTestLikeEnvironment ? Math.max(defaultLimit, testOverride) : defaultLimit;

// Rate limiting for auth and write endpoints
const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: resolveRateLimit(100),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

// General API rate limiting
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: resolveRateLimit(1000, 2000), // More generous for general API usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded' }
});

// Write operations rate limiting
const writeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: resolveRateLimit(50),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please try again later' }
});

// Search rate limiting
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: resolveRateLimit(100, 500),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Search rate limit exceeded' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------------------------------------------
// Health check – must be registered before other routes
// --------------------------------------------------
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('ok');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(READY ? 200 : 503).send(READY ? 'ok' : 'starting');
});

async function boot() {
  console.log('Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

  const isE2E = process.env.E2E === 'true';

  app.use('/api/users/login', authWriteLimiter);
  app.use('/api/users/register', authWriteLimiter);
  app.use('/api', generalApiLimiter);
  app.use('/api/properties', writeApiLimiter);
  app.use('/api/services', writeApiLimiter);
  app.use('/api/rentals', writeApiLimiter);
  app.use('/api/inquiries', writeApiLimiter);
  app.use('/api/appointments', writeApiLimiter);
  app.use('/api/hero', writeApiLimiter);
  app.use('/api/search', searchLimiter);
  app.use('/api/suggest', searchLimiter);
  app.use('/intel', searchLimiter);

  registerAllRoutes(app);

  const rentalRoutes = createRentalRoutes();
  app.use('/api/rentals', rentalRoutes);
  app.use('/api', aiSearchRoutes);
  app.use('/api', propertyManagementRoutes);
  app.use('/api', tenantSupportRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api', marketplaceRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.post('/intel/search', intelSearch);
  app.get('/intel/suggest', intelSuggest);

  try {
    const { docsRouter } = await import('./routes/docs');
    app.use('/api/docs', docsRouter);
    console.log('📚 API documentation available at /api/docs');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Could not mount API docs:', message);
  }

  app.post('/api/analytics/events', async (req, res) => {
    try {
      const { event, properties, userId, timestamp, sessionId, page, referrer, userAgent } = req.body;

      if (!event) {
        return res.status(400).json({ error: 'Event name is required' });
      }

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

      if (nodeEnv === 'development') {
        console.log('📊 Analytics Event:', JSON.stringify(analyticsEvent, null, 2));
      }

      res.json({ success: true, eventId: analyticsEvent.id });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to process analytics event' });
    }
  });

  if (!isE2E && nodeEnv !== 'production') {
    const { createViteForDev } = await import('./vite');
    await createViteForDev(app);
  } else if (nodeEnv === 'production') {
    const { serveStatic } = await import('./vite');
    const served = await serveStatic(app);
    if (served) {
      console.log('📦 Serving static SPA from /dist');
    }
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  const shouldRunMigrations =
    shouldBootMigrations && (!isE2E || process.env.FORCE_DB_MIGRATIONS === 'true');

  if (shouldRunMigrations) {
    try {
      console.log('🔄 Running database migrations...');
      const { getMigrationManager } = await import('./migration-manager');
      const migrationManager = getMigrationManager();
      await migrationManager.runAllPendingMigrations();
      console.log('✅ Database migrations completed');

      const shouldSeed = !isE2E && (nodeEnv === 'development' || process.env.FORCE_DB_SEED === 'true');
      if (shouldSeed) {
        try {
          const { seedManager } = await import('./seed-manager');
          console.log('Seeding database...');
          await seedManager.seedAll();
          console.log('✅ Database seeding completed');
        } catch (seedError) {
          console.error('❌ Database seeding failed:', seedError);
        }
      } else if (nodeEnv === 'production') {
        console.log('⚠️ Seeding skipped in production environment');
      } else if (isE2E) {
        console.log('⚠️ Skipping full seed in E2E mode; assuming database prepared upstream');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      process.exit(1);
    }
  } else if (!shouldBootMigrations) {
    console.log('⏭️  Skipping migrations because BOOT_RUN_MIGRATIONS=false');
  } else {
    console.log('⏭️  Skipping migrations in E2E mode');
  }

  const PORT = Number(process.env.PORT ?? 5000);
  const HOST = process.env.HOST ?? '0.0.0.0';
  await new Promise<void>((resolve) => {
    app.listen(PORT, HOST, () => {
      READY = true;
      console.log(`🚀 API listening on http://${HOST}:${PORT}`);
      resolve();
    });
  });
}

boot().catch(error => {
  console.error('Failed to start server', error);
  process.exit(1);
});
