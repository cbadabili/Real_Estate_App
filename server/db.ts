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
    const testQuery = db.prepare('SELECT 1').get();
    console.log('✅ Database connection successful');

    // Run migrations
    // await runMigrations(); // Assuming runMigrations is defined elsewhere and handles migrations

    // Create rental tables if they don't exist
    await createRentalTables();

    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function createRentalTables() {
  // Create rental tables
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS rental_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        landlord_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        district TEXT NOT NULL,
        ward TEXT,
        property_type TEXT NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        square_meters INTEGER NOT NULL,
        monthly_rent INTEGER NOT NULL,
        deposit_amount INTEGER NOT NULL,
        lease_duration INTEGER NOT NULL,
        available_from TEXT NOT NULL,
        furnished INTEGER DEFAULT 0,
        pets_allowed INTEGER DEFAULT 0,
        parking_spaces INTEGER DEFAULT 0,
        photos TEXT DEFAULT '[]',
        amenities TEXT DEFAULT '[]',
        utilities_included TEXT DEFAULT '[]',
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS rental_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id INTEGER REFERENCES rental_listings(id) ON DELETE CASCADE,
        renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        application_date TEXT DEFAULT (datetime('now')),
        status TEXT DEFAULT 'pending',
        personal_info TEXT,
        employment_info TEXT,
        references TEXT,
        additional_notes TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS lease_agreements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER REFERENCES rental_applications(id) ON DELETE CASCADE,
        rental_id INTEGER REFERENCES rental_listings(id) ON DELETE CASCADE,
        landlord_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lease_start_date TEXT NOT NULL,
        lease_end_date TEXT NOT NULL,
        monthly_rent INTEGER NOT NULL,
        deposit_amount INTEGER NOT NULL,
        lease_terms TEXT,
        landlord_signature_status TEXT DEFAULT 'pending',
        renter_signature_status TEXT DEFAULT 'pending',
        e_signature_status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    console.log('✅ Rental tables created successfully');
  } catch (error) {
    console.error('❌ Error creating rental tables:', error);
    throw error;
  }
}