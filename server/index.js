import express from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import { registerAllRoutes } from "./routes/index";
import { createRentalRoutes } from './rental-routes';
import servicesRoutes from './services-routes';
import marketplaceRoutes from './marketplace-routes';
import aiSearchRoutes from './ai-search';
import tenantSupportRoutes from './tenant-support-routes';
import propertyManagementRoutes from './property-management-routes';
import { intelSearch, intelSuggest } from './intel-adapter';
import { errorHandler, notFoundHandler } from './middleware/error';
import { env } from './utils/env';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { addRequestId, structuredLogger } from './middleware/logging';
import billingRoutes from './billing-routes';
import heroRoutes from './hero-routes';
import analyticsRoutes from './analytics-routes';

const app = express();

app.set('trust proxy', 1);

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isDevelopment = nodeEnv === 'development';

app.use(helmet({
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
          upgradeInsecureRequests: [],
        },
      },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
  permissionsPolicy: {
    camera: ['self'],
    microphone: [],
    geolocation: ['self'],
    fullscreen: ['self'],
    payment: [],
    usb: [],
    magnetometer: [],
    accelerometer: [],
    gyroscope: []
  }
}));

app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: true,
}));

app.use(addRequestId);
app.use(structuredLogger);

const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded' }
});

const writeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please try again later' }
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Search rate limit exceeded' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

(async () => {
  console.log('Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

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
    const { docsRouter } = await import('./routes/docs.js');
    app.use('/api/docs', docsRouter);
    console.log('📚 API documentation available at /api/docs');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Could not mount API docs:', message);
  }

  app.post('/api/analytics/events', async (req, res) => {
    try {
      const { event, properties: eventProperties, userId, timestamp, sessionId, page, referrer, userAgent } = req.body;

      if (!event) {
        return res.status(400).json({ error: 'Event name is required' });
      }

      const analyticsEvent = {
        id: Math.random().toString(36).substring(2, 15),
        event,
        properties: eventProperties || {},
        userId,
        sessionId,
        timestamp: timestamp || Date.now(),
        page,
        referrer,
        userAgent,
        createdAt: new Date().toISOString()
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', JSON.stringify(analyticsEvent, null, 2));
      }

      res.json({ success: true, eventId: analyticsEvent.id });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to process analytics event' });
    }
  });

  const server = createServer(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true') {
    const { seedManager } = await import('./seed-manager');
    const { initializeDatabase } = await import('./db');
    const { getMigrationManager } = await import('./migration-manager');

    try {
      console.log('🔄 Running database migrations...');
      const migrationManager = getMigrationManager();
      await migrationManager.runAllPendingMigrations();

      const shouldInitializeDB = process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_INIT === 'true';
      const shouldSeedDB = process.env.NODE_ENV === 'development' || process.env.FORCE_DB_SEED === 'true';

      if (shouldInitializeDB) {
        console.log('Initializing database...');
        await initializeDatabase();
      }

      if (shouldSeedDB && env.NODE_ENV !== 'production') {
        console.log('Seeding database...');
        try {
          await seedManager.seedAll();
          console.log('✅ Database seeding completed');
        } catch (seedError) {
          console.error('❌ Database seeding failed:', seedError);
        }
      } else if (env.NODE_ENV === 'production') {
        console.log('⚠️ Seeding skipped in production environment');
      }

      console.log('✅ Database initialization completed');
    } catch (migrationError) {
      console.error('❌ Database initialization failed:', migrationError);
      if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_MIGRATIONS === 'true') {
        process.exit(1);
      }
    }
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
