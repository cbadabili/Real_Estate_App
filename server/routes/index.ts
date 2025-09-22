
import type { Express } from "express";
import { registerAuthRoutes } from "./auth-routes";
import { registerUserRoutes } from "./user-routes";
import { registerPropertyRoutes } from "./property-routes";
import { registerSearchRoutes } from "./search-routes";

export function registerAllRoutes(app: Express) {
  // Register all route modules
  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerPropertyRoutes(app);
  registerSearchRoutes(app);
}

// For backwards compatibility
export { registerAllRoutes as registerRoutes };
