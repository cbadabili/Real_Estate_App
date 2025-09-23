import { defineConfig } from "drizzle-kit";
import { join } from 'path';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  // Switch to Postgres for production deployments
  // NOTE: DATABASE_URL **must** be set when running drizzle-kit commands
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  },
});