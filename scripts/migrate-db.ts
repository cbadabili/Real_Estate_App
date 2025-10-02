#!/usr/bin/env tsx

import { initializeDatabase } from '../server/db.ts';
import { getMigrationManager } from '../server/migration-manager.ts';

const describeDatabaseTarget = (): string | undefined => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return undefined;
  }

  try {
    const url = new URL(connectionString);
    const host = url.hostname ?? 'localhost';
    const port = url.port || '5432';
    const database = url.pathname?.replace(/^\//, '') || undefined;

    if (database) {
      return `${host}:${port}/${database}`;
    }

    return `${host}:${port}`;
  } catch (parseError) {
    console.warn('⚠️ Unable to parse DATABASE_URL for diagnostics:', parseError);
    return connectionString;
  }
};

const isConnectionRefusedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as { code?: string; errors?: unknown[] };

  if (candidate.code === 'ECONNREFUSED') {
    return true;
  }

  if (Array.isArray(candidate.errors)) {
    return candidate.errors.some((inner) => {
      if (!inner || typeof inner !== 'object') {
        return false;
      }
      return (inner as { code?: string }).code === 'ECONNREFUSED';
    });
  }

  return false;
};

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await initializeDatabase();

    const manager = getMigrationManager();
    await manager.runAllPendingMigrations();

    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (isConnectionRefusedError(error)) {
      const target = describeDatabaseTarget();
      if (target) {
        console.error(
          `💡 Unable to reach PostgreSQL at ${target}. Ensure the service is running and that DATABASE_URL points to an accessible instance.`,
        );
      } else {
        console.error(
          '💡 Unable to reach PostgreSQL. Ensure the database service is running and DATABASE_URL points to an accessible instance.',
        );
      }
      if (!process.env.CI) {
        console.error("📘 Hint: For local development, run 'npm run db:reset' or 'docker-compose up db' to start PostgreSQL.");
      } else {
        console.error(
          '📘 Hint: In CI, verify that the postgres service is declared and that DATABASE_URL/PG* environment variables reference it correctly.',
        );
      }
    }
    process.exit(1);
  }
}

runMigrations();
