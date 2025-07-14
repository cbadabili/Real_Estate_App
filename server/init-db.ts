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

    console.log('Creating services tables...');
    
    console.log('Creating service_providers table...');
    await db.run(sql`
      CREATE TABLE service_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        service_category TEXT NOT NULL,
        contact_person TEXT,
        phone_number TEXT,
        email TEXT,
        website_url TEXT,
        logo_url TEXT,
        description TEXT,
        reac_certified INTEGER DEFAULT 0,
        address TEXT,
        city TEXT,
        rating TEXT DEFAULT '4.5',
        review_count INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        date_joined INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    await db.run(sql`CREATE UNIQUE INDEX service_providers_email_unique ON service_providers (email)`);

    console.log('Creating service_ads table...');
    await db.run(sql`
      CREATE TABLE service_ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER REFERENCES service_providers(id),
        ad_title TEXT NOT NULL,
        ad_copy TEXT,
        ad_image_url TEXT,
        target_audience TEXT NOT NULL,
        context_trigger TEXT NOT NULL,
        cta_text TEXT DEFAULT 'Learn More',
        cta_url TEXT,
        active INTEGER DEFAULT 1,
        priority INTEGER DEFAULT 1,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating service_reviews table...');
    await db.run(sql`
      CREATE TABLE service_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER REFERENCES service_providers(id),
        user_id INTEGER,
        rating INTEGER NOT NULL,
        review TEXT,
        reviewer_name TEXT,
        reviewer_avatar TEXT,
        verified INTEGER DEFAULT 0,
        helpful INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating marketplace tables...');
    
    console.log('Creating service_categories table...');
    await db.run(sql`
      CREATE TABLE service_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        journey_type TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating marketplace_providers table...');
    await db.run(sql`
      CREATE TABLE marketplace_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        provider_type TEXT NOT NULL,
        business_name TEXT NOT NULL,
        category_id INTEGER REFERENCES service_categories(id),
        specializations TEXT,
        service_areas TEXT,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        whatsapp TEXT,
        website TEXT,
        description TEXT,
        years_experience INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        reac_certified INTEGER DEFAULT 0,
        business_address TEXT,
        operating_hours TEXT,
        service_radius INTEGER DEFAULT 0,
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 0,
        projects_completed INTEGER DEFAULT 0,
        response_time INTEGER DEFAULT 24,
        availability_status TEXT DEFAULT 'available',
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating artisan_skills table...');
    await db.run(sql`
      CREATE TABLE artisan_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER REFERENCES marketplace_providers(id),
        skill_name TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        years_experience INTEGER DEFAULT 0,
        certification_url TEXT,
        is_primary INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating training_programs table...');
    await db.run(sql`
      CREATE TABLE training_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER REFERENCES marketplace_providers(id),
        program_name TEXT NOT NULL,
        program_type TEXT NOT NULL,
        duration_weeks INTEGER,
        price_pula INTEGER,
        description TEXT,
        prerequisites TEXT,
        certification_offered TEXT,
        schedule TEXT,
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        start_date INTEGER,
        end_date INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating building_materials table...');
    await db.run(sql`
      CREATE TABLE building_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER REFERENCES marketplace_providers(id),
        material_name TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        description TEXT,
        unit_type TEXT NOT NULL,
        price_per_unit INTEGER,
        minimum_order INTEGER DEFAULT 1,
        stock_quantity INTEGER DEFAULT 0,
        lead_time_days INTEGER DEFAULT 0,
        specifications TEXT,
        certifications TEXT,
        images TEXT,
        status TEXT DEFAULT 'available',
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating project_requests table...');
    await db.run(sql`
      CREATE TABLE project_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        project_title TEXT NOT NULL,
        project_type TEXT NOT NULL,
        description TEXT,
        budget_min INTEGER,
        budget_max INTEGER,
        timeline_weeks INTEGER,
        location TEXT,
        requirements TEXT,
        attachments TEXT,
        status TEXT DEFAULT 'open',
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
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