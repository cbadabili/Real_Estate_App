import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { join } from 'path';
import { mkdir, existsSync } from 'fs';

// Ensure the data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdir(dataDir, { recursive: true }, (err) => {
    if (err) console.error('Error creating data directory:', err);
  });
}

// Create SQLite database connection
const sqlite = new Database(join(dataDir, 'beedab.db'));

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Test database connection on startup
export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    const result = sqlite.prepare('SELECT 1 as test').get();
    if (result && result.test === 1) {
      console.log('Database connection successful');
      return true;
    } else {
      console.error('Database connection test failed');
      return false;
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}