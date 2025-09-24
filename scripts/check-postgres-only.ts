#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "attached_assets",
  "build",
  "dist"
]);

const ALLOWED_FILES = new Set([
  path.join("scripts", "check-postgres-only.ts"),
  "package-lock.json"
]);

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB safety cap for scanning

const rootDir = process.cwd();
const hits: string[] = [];

function walk(currentPath: string) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      if (entry.name === ".env" || entry.name === ".env.example") {
        // keep scanning env files
      } else if (entry.name !== ".gitignore") {
        continue;
      }
    }

    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    try {
      const stats = fs.statSync(fullPath);
      if (!stats.isFile()) continue;
      if (stats.size > MAX_FILE_SIZE_BYTES) continue;

      const relativePath = path.relative(rootDir, fullPath);
      if (ALLOWED_FILES.has(relativePath)) continue;

      const contents = fs.readFileSync(fullPath, "utf8");
      if (/sqlite/i.test(contents)) {
        hits.push(relativePath);
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
