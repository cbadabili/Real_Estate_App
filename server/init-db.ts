
import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'beedab.db');
const sqlite = new Database(dbPath);

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Run migrations
    await migrate(db, { migrationsFolder: join(__dirname, '..', 'migrations') });
    
    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
