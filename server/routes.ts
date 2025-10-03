import type { Express } from "express";
import { registerAllRoutes } from "./routes/index";

/**
 * @deprecated Prefer importing from "./routes/index" directly.
 * This thin wrapper exists to preserve compatibility for modules that still
 * import from "server/routes" while routing is gradually modularized.
 */
export function registerRoutes(app: Express): void {
  registerAllRoutes(app);
}

export { registerAllRoutes };
