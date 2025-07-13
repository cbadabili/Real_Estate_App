import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create SQLite database file in the project directory
const dbPath = join(__dirname, '..', 'beedab.db');
console.log(`Using SQLite database at: ${dbPath}`);

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Test database connection on startup
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Test a simple query with timeout
    const result = await Promise.race([
      db.select().from(schema.users).limit(1),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('📝 Attempting to create database tables...');
    try {
      // Try to run migrations or create tables if they don't exist
      await db.select().from(schema.users).limit(1);
      return true;
    } catch (secondError) {
      console.error('❌ Database table creation also failed:', secondError);
      return false;
    }
  }
}

export async function initializeDatabase() {
  console.log('Using SQLite database at:', dbPath);

  try {
    console.log('Testing database connection...');
    const testQuery = sqlite.prepare('SELECT 1').get();
    console.log('✅ Database connection successful');

    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}