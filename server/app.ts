import express, { type Express, type Request, type Response } from "express";
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
import { createViteForDev, serveStatic } from "./vite";

export interface CreateAppOptions {
  nodeEnv?: string;
  isE2E?: boolean;
  runMigrations?: boolean;
  seedDatabase?: boolean;
  enableViteDevServer?: boolean;
  serveStaticAssets?: boolean;
  markReadyOnReturn?: boolean;
  skipMigrationsMessage?: string;
}

export async function createApp(options: CreateAppOptions = {}): Promise<Express> {
  const app = express();

  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV ?? "development";
  const isDevelopment = nodeEnv === "development";
  const isTestLikeEnvironment = nodeEnv === "test" || process.env.E2E === "true";

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = nodeEnv;
  }

  const enableViteDevServer =
    options.enableViteDevServer ?? (nodeEnv !== "production" && process.env.E2E !== "true");
  const serveStaticAssets = options.serveStaticAssets ?? nodeEnv === "production";

  app.locals.isReady = false;

  app.set("trust proxy", 1);

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

  app.use(addRequestId);
  app.use(structuredLogger);

  const resolveRateLimit = (defaultLimit: number, testOverride = 1000) =>
    isTestLikeEnvironment ? Math.max(defaultLimit, testOverride) : defaultLimit;

  const authWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: resolveRateLimit(100),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  });

  const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: resolveRateLimit(1000, 2000),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "API rate limit exceeded" },
  });

  const writeApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: resolveRateLimit(50),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many write requests, please try again later" },
  });

  const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: resolveRateLimit(100, 500),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Search rate limit exceeded" },
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).send("ok");
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.get("/healthz", (_req: Request, res: Response) => {
    const ready = Boolean(app.locals.isReady);
    res.status(ready ? 200 : 503).send(ready ? "ok" : "starting");
  });

  console.log("Testing database connection...");
  const dbHealth = await testDatabaseConnection();
  if (!dbHealth.ok) {
    if (dbHealth.error) {
      console.error("Failed to connect to database. Server will not start.", dbHealth.error);
      throw dbHealth.error;
    }

    throw new Error("Failed to connect to database. Server will not start.");
  }

  app.use("/api/users/login", authWriteLimiter);
  app.use("/api/users/register", authWriteLimiter);
  app.use("/api", generalApiLimiter);
  app.use("/api/properties", writeApiLimiter);
  app.use("/api/services", writeApiLimiter);
  app.use("/api/rentals", writeApiLimiter);
  app.use("/api/inquiries", writeApiLimiter);
  app.use("/api/appointments", writeApiLimiter);
  app.use("/api/hero", writeApiLimiter);
  app.use("/api/search", searchLimiter);
  app.use("/api/suggest", searchLimiter);
  app.use("/intel", searchLimiter);

  registerAllRoutes(app);

  const rentalRoutes = createRentalRoutes();
  app.use("/api/rentals", rentalRoutes);
  app.use("/api", aiSearchRoutes);
  app.use("/api", propertyManagementRoutes);
  app.use("/api", tenantSupportRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api", marketplaceRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/hero", heroRoutes);
  app.use("/api/analytics", analyticsRoutes);

  app.post("/intel/search", intelSearch);
  app.get("/intel/suggest", intelSuggest);

  try {
    const { docsRouter } = await import("./routes/docs");
    app.use("/api/docs", docsRouter);
    console.log("📚 API documentation available at /api/docs");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ Could not mount API docs:", message);
  }

  app.post("/api/analytics/events", async (req, res) => {
    try {
      const { event, properties, userId, timestamp, sessionId, page, referrer, userAgent } = req.body;

      if (!event) {
        res.status(400).json({ error: "Event name is required" });
        return;
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
        createdAt: new Date().toISOString(),
      };

      if (nodeEnv === "development") {
        console.log("📊 Analytics Event:", JSON.stringify(analyticsEvent, null, 2));
      }

      res.json({ success: true, eventId: analyticsEvent.id });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to process analytics event" });
    }
  });

  if (enableViteDevServer) {
    await createViteForDev(app);
  } else if (serveStaticAssets) {
    const served = await serveStatic(app);
    if (served) {
      console.log("📦 Serving static SPA from /dist");
    }
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  if (options.runMigrations) {
    try {
      console.log("🔄 Running database migrations...");
      const { getMigrationManager } = await import("./migration-manager");
      const migrationManager = getMigrationManager();
      await migrationManager.runAllPendingMigrations();
      console.log("✅ Database migrations completed");

      if (options.seedDatabase) {
        try {
          const { seedManager } = await import("./seed-manager");
          console.log("Seeding database...");
          await seedManager.seedAll();
          console.log("✅ Database seeding completed");
        } catch (seedError) {
          console.error("❌ Database seeding failed:", seedError);
        }
      } else if (nodeEnv === "production") {
        console.log("⚠️ Seeding skipped in production environment");
      }
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  } else if (options.skipMigrationsMessage) {
    console.log(options.skipMigrationsMessage);
  }

  if (options.markReadyOnReturn ?? true) {
    app.locals.isReady = true;
  }

  return app;
}
