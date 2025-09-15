import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations/location",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  },
  // Only target location tables - avoid touching existing schema
  verbose: true,
  strict: true
});