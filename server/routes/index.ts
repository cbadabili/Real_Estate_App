import type { Express } from "express";
import { registerAuthRoutes } from "./auth-routes";
import { registerUserRoutes } from "./user-routes";
import { registerPropertyRoutes } from "./property-routes";
import { registerInquiryRoutes } from "./inquiry-routes";
import { registerSearchRoutes } from "./search-routes";
import { registerDocumentRoutes } from "./documents-routes";
import { registerAdminRoutes } from "./admin-routes";

export function registerAllRoutes(app: Express) {
  // Register all route modules
  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerPropertyRoutes(app);
  registerInquiryRoutes(app);
  registerSearchRoutes(app);
  registerDocumentRoutes(app);
  registerAdminRoutes(app);
}

// For backwards compatibility
export { registerAllRoutes as registerRoutes };