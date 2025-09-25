#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "attached_assets",
  "build",
  "dist",
  ".next",
  "coverage",
  ".turbo",
  ".cache",
  "out",
  ".vercel",
]);

const ALLOWED_PATHS = new Set([path.join("scripts", "check-postgres-only.ts")]);
const ALLOWED_BASENAMES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
]);

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB safety cap for scanning

const rootDir = process.cwd();
const hits: string[] = [];

/**
 * Recursively traverse the repository and record files that reference SQLite usage.
 *
 * @param currentPath - Directory currently being scanned.
 */
function walk(currentPath: string) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {

    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    try {
      const stats = fs.statSync(fullPath);
      if (!stats.isFile()) continue;
      const base = path.basename(fullPath);
      if (/\.(sqlite|sqlite3|db|db3)$/i.test(base)) {
        const rel = path.relative(rootDir, fullPath);
        hits.push(`${rel}:1`);
        continue;
      }
      if (stats.size > MAX_FILE_SIZE_BYTES) continue;

      const relativePath = path.relative(rootDir, fullPath);
      if (ALLOWED_PATHS.has(relativePath) || ALLOWED_BASENAMES.has(path.basename(relativePath))) {
        continue;
      }

      const contents = fs.readFileSync(fullPath, "utf8");
      const lines = contents.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (/\b(sqlite|sqlite3|better-sqlite3|sql\.js)\b/i.test(lines[i])) {
          hits.push(`${relativePath}:${i + 1}`);
          break;
        }
      }
    } catch (error) {
      console.warn(`Skipping ${fullPath}: ${(error as Error).message}`);
    }
  }
}

walk(rootDir);

if (hits.length > 0) {
  console.error("❌ SQLite references detected in the repository:");
  for (const hit of hits) {
    console.error(` - ${hit}`);
  }
  console.error("\nRemove or update these references to keep the codebase PostgreSQL-only.");
  process.exit(1);
}

console.log("✅ No SQLite references detected. Repository is PostgreSQL-only.");
