
import { migrationManager } from './migration-manager';
import { seedManager } from './seed-manager';

async function resetDatabase() {
  try {
    console.log('🗑️ Resetting database...');
    const manager = migrationManager.getInstance();
    await manager.resetDatabase();

    console.log('🔄 Running migrations...');
    await manager.runAllPendingMigrations();

    console.log('🌱 Seeding database...');
    await seedManager.seedAll();
    
    console.log('✅ Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase();
}
