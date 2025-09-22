import { registerAuthRoutes } from "./auth-routes";
import { registerUserRoutes } from "./user-routes";
import { registerPropertyRoutes } from "./property-routes";
export function registerAllRoutes(app) {
    // Register all route modules
    registerAuthRoutes(app);
    registerUserRoutes(app);
    registerPropertyRoutes(app);
}
// For backwards compatibility
export { registerAllRoutes as registerRoutes };
