#!/usr/bin/env tsx

import { initializeDatabase } from '../server/db.ts';
import { getMigrationManager } from '../server/migration-manager.ts';

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
      console.error(
        '💡 Unable to reach PostgreSQL. Ensure the database service is running and DATABASE_URL points to an accessible instance.',
      );
    }
    process.exit(1);
  }
}

runMigrations();
