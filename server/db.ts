import { Database } from 'sqlite3';
import { open } from 'sqlite';
import * as schema from "@shared/schema";
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { drizzle } from 'drizzle-orm/sqlite';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create SQLite database file in the project directory
const dbPath = join(__dirname, '..', 'beedab.db');
console.log(`Using SQLite database at: ${dbPath}`);

// Create SQLite database connection
let sqliteDB: any = null;
let db: any = null;

// Initialize database connection
export async function initializeDatabase() {
  try {
    sqliteDB = await open({
      filename: dbPath,
      driver: Database
    });
    
    // Create drizzle database instance
    db = drizzle(sqliteDB);
    
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
    const result = await sqliteDB.get('SELECT 1 as test');
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export the database instance
export { db };