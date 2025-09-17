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
import billingRoutes from './billing-routes';
import heroRoutes from './hero-routes';
import { registerPropertyRoutes } from "./routes/property-routes";
import { registerUserRoutes } from "./routes/user-routes";
import { registerAuthRoutes } from "./routes/auth-routes";
import { registerMarketIntelligenceRoutes } from "./market-intelligence-routes";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://api.mapbox.com", "https://replit.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com", "wss:", "ws:"],
      fontSrc: ["'self'", "'unsafe-inline'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: true,
}));

app.use(morgan('combined'));

// Rate limiting for auth and write endpoints
const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

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

  // Search aggregator route
  app.get('/api/search', async (req, res) => {
    try {
      const { query, location, type, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

      const searchParams = {
        query: query as string,
        location: location as string,
        type: type as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms as string) : undefined
      };

      const results = await searchAggregator.search(searchParams);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Search suggestions endpoint
  app.get('/api/search/suggestions', async (req, res) => {
    try {
      const { q } = req.query;
      const query = (q as string)?.toLowerCase() || '';

      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      const suggestions = [];

      // Location suggestions
      const locations = [
        'Gaborone', 'Francistown', 'Maun', 'Kasane', 'Serowe', 'Palapye',
        'Mogoditshane', 'Molepolole', 'Kanye', 'Mahalapye', 'Lobatse',
        'Gaborone West', 'Gaborone CBD', 'Block 6', 'Block 8', 'Block 10',
        'Extension 2', 'Extension 9', 'Extension 12', 'Phakalane'
      ];

      const matchingLocations = locations
        .filter(loc => loc.toLowerCase().includes(query))
        .slice(0, 3)
        .map((loc, index) => ({
          id: `loc-${index}`,
          text: `Properties in ${loc}`,
          type: 'location'
        }));

      suggestions.push(...matchingLocations);

      // Property type suggestions
      const propertyTypes = [
        'house', 'apartment', 'townhouse', 'commercial', 'farm', 'land', 'plot'
      ];

      const matchingTypes = propertyTypes
        .filter(type => type.includes(query) || query.includes(type))
        .slice(0, 2)
        .map((type, index) => ({
          id: `type-${index}`,
          text: `${type.charAt(0).toUpperCase() + type.slice(1)}s for sale`,
          type: 'property_type'
        }));

      suggestions.push(...matchingTypes);

      // Feature suggestions
      const features = [
        'with pool', 'with garden', '3 bedroom', '4 bedroom', '2 bathroom',
        'with garage', 'furnished', 'sea view', 'city view', 'new development'
      ];

      const matchingFeatures = features
        .filter(feature => feature.includes(query) || query.split(' ').some(word => feature.includes(word)))
        .slice(0, 2)
        .map((feature, index) => ({
          id: `feat-${index}`,
          text: `Properties ${feature}`,
          type: 'feature'
        }));

      suggestions.push(...matchingFeatures);

      // Price range suggestions
      if (query.includes('under') || query.includes('below')) {
        suggestions.push({
          id: 'price-under',
          text: 'Properties under BWP 2M',
          type: 'feature'
        });
      }

      if (query.includes('above') || query.includes('over')) {
        suggestions.push({
          id: 'price-over',
          text: 'Properties over BWP 1M',
          type: 'feature'
        });
      }

      // Limit to 6 suggestions
      const limitedSuggestions = suggestions.slice(0, 6);

      res.json({ suggestions: limitedSuggestions });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  });

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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000; // Force port 5000 for consistency with Vite proxy
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();