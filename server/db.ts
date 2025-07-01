import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "../shared/schema";
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
let sqliteDB = null;
let db = null;

// Initialize database connection
export async function initializeDatabase() {
  try {
    // Create SQLite database connection
    sqliteDB = new Database(dbPath);
    
    // Create drizzle database instance
    db = drizzle(sqliteDB, { schema });
    
    console.log('Database connection initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    if (!sqliteDB) {
      await initializeDatabase();
    }
    
    // Simple query to test connection
    const result = sqliteDB.prepare('SELECT 1 as test').get();
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export the database instance
export { db };