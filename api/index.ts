import type { Request, Response } from "express";
import { createApp } from "../server/app";

const appPromise = createApp({
  nodeEnv: process.env.NODE_ENV ?? "production",
  isE2E: process.env.E2E === "true",
  runMigrations: false,
  seedDatabase: false,
  enableViteDevServer: false,
  serveStaticAssets: false,
  skipMigrationsMessage: "⏭️  Skipping migrations in serverless runtime",
});

export default async function handler(req: Request, res: Response) {
  const app = await appPromise;
  app(req, res);
}
