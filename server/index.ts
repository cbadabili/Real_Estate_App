import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import { createRentalRoutes } from './rental-routes';
import { db } from './db';
import servicesRoutes from './services-routes';
import marketplaceRoutes from './marketplace-routes';
import aiSearchRoutes from './ai-search';
import tenantSupportRoutes from './tenant-support-routes';
import propertyManagementRoutes from './property-management-routes';
import { intelSearch, intelSuggest } from './intel-adapter';
import { reviewRoutes } from './review-storage';
import realEstateIntelRouter from './real-estate-intel-search';
import { searchAggregator } from './search-aggregator';
import { suggest } from './suggest';
import { errorHandler, notFoundHandler } from './middleware/error';
import { env } from './utils/env';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { addRequestId, structuredLogger } from './middleware/logging';
import billingRoutes from './billing-routes';
import heroRoutes from './hero-routes';
import { registerPropertyRoutes } from "./routes/property-routes";
import { registerUserRoutes } from "./routes/user-routes";
import { registerAuthRoutes } from "./routes/auth-routes";
import { registerMarketIntelligenceRoutes } from "./market-intelligence-routes";
import documentsRoutes from './routes/documents-routes.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", ...(env.NODE_ENV !== 'production' ? ["'unsafe-eval'"] : []), "https://api.mapbox.com", "https://replit.com"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://api.mapbox.com", "https://replit.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com", "wss:", "ws:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' }
}));

app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: true,
}));

// Add request ID and structured logging
app.use(addRequestId);
app.use(structuredLogger);

// Rate limiting for auth and write endpoints
const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

// General API rate limiting
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // More generous for general API usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded' }
});

// Write operations rate limiting
const writeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please try again later' }
});

// Search rate limiting
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
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

(async () => {
  // Test database connection before starting server
  console.log('Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

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

  const server = await registerRoutes(app);

  const rentalRoutes = createRentalRoutes();
  app.use('/api/rentals', rentalRoutes);
  app.use('/api', aiSearchRoutes);
  app.use('/api', propertyManagementRoutes);
  app.use('/api', tenantSupportRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api', marketplaceRoutes);
  app.use('/api/services', marketplaceRoutes); // Mount marketplace routes under services as well

  // Register billing and hero routes
  app.use('/api/billing', billingRoutes);
  app.use('/api/hero', heroRoutes);

  // OpenAI-powered Intel adapter routes
  app.post('/intel/search', intelSearch);
  app.get('/intel/suggest', intelSuggest);

  // Register other routes
  // Import and register routes
  const { registerAllRoutes } = await import('./routes/index.js');
  registerAllRoutes(app);

  // Mount API documentation
  try {
    const { docsRouter } = await import('./routes/docs.js');
    app.use('/api/docs', docsRouter);
    console.log('📚 API documentation available at /api/docs');
  } catch (error) {
    console.warn('⚠️ Could not mount API docs:', error.message);
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

  // Set environment to development if not specified
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 404 handler must come AFTER Vite setup so frontend serving works
  app.use(notFoundHandler);

  // Global error handler must come last
  app.use(errorHandler);

  // Initialize database with migrations
  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true') {
    const { seedManager } = await import('./seed-manager');
    const { initializeDatabase } = await import('./db');
    const { getMigrationManager } = await import('./migration-manager');

    try {
      console.log('🔄 Running database migrations...');
      const migrationManager = getMigrationManager();
      await migrationManager.runAllPendingMigrations(); // Run all migrations, including rental

      // Initialize database only in development or when explicitly requested
      const shouldInitializeDB =
        process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_INIT === 'true';
      const shouldSeedDB =
        process.env.NODE_ENV === 'development' || process.env.FORCE_DB_SEED === 'true';

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
      }

      console.log('✅ Database initialization completed');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true') {
        process.exit(1);
      }
      // In production without FORCE flag just continue running
    }
  }

  // Seed rental data

  // Register all API routes via the main registerRoutes function
  await registerRoutes(app);

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000; // Force port 5000 for consistency with Vite proxy
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();