#!/usr/bin/env tsx

import { initializeDatabase } from '../server/db';
import { getMigrationManager } from '../server/migration-manager';

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
    process.exit(1);
  }
}

runMigrations();
