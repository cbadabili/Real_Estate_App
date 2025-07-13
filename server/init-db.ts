import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'beedab.db');
const sqlite = new Database(dbPath);

async function initializeTables() {
  try {
    // Drop existing tables to ensure clean slate
    console.log('Dropping existing tables...');
    await db.run(sql`DROP TABLE IF EXISTS saved_properties`);
    await db.run(sql`DROP TABLE IF EXISTS appointments`);
    await db.run(sql`DROP TABLE IF EXISTS inquiries`);
    await db.run(sql`DROP TABLE IF EXISTS properties`);
    await db.run(sql`DROP TABLE IF EXISTS users`);

    console.log('Creating users table...');
    await db.run(sql`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        user_type TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        permissions TEXT,
        avatar TEXT,
        bio TEXT,
        is_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        reac_number TEXT,
        last_login_at INTEGER,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);
    console.log('✅ Users table ready');

    console.log('Creating properties table...');
    await db.run(sql`
      CREATE TABLE properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        latitude TEXT,
        longitude TEXT,
        property_type TEXT NOT NULL,
        listing_type TEXT NOT NULL,
        bedrooms INTEGER,
        bathrooms TEXT,
        square_feet INTEGER,
        area_build INTEGER,
        lot_size TEXT,
        year_built INTEGER,
        status TEXT NOT NULL DEFAULT 'active',
        images TEXT,
        features TEXT,
        virtual_tour_url TEXT,
        video_url TEXT,
        property_taxes TEXT,
        hoa_fees TEXT,
        owner_id INTEGER REFERENCES users(id),
        agent_id INTEGER REFERENCES users(id),
        views INTEGER DEFAULT 0,
        days_on_market INTEGER DEFAULT 0,
        auction_date INTEGER,
        auction_time TEXT,
        starting_bid TEXT,
        current_bid TEXT,
        reserve_price TEXT,
        auction_house TEXT,
        auctioneer_name TEXT,
        auctioneer_contact TEXT,
        bid_increment TEXT,
        deposit_required TEXT,
        auction_terms TEXT,
        lot_number TEXT,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);
    console.log('✅ Properties table ready');

    console.log('Creating inquiries table...');
    await db.run(sql`
      CREATE TABLE inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        buyer_id INTEGER REFERENCES users(id) NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating appointments table...');
    await db.run(sql`
      CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        buyer_id INTEGER REFERENCES users(id) NOT NULL,
        agent_id INTEGER REFERENCES users(id),
        appointment_date INTEGER NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        notes TEXT,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating saved_properties table...');
    await db.run(sql`
      CREATE TABLE saved_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Initialize tables with the corrected schema
    await initializeTables();

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