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

    console.log('Creating enhanced ecosystem tables...');
    
    console.log('Creating service_categories table...');
    await db.run(sql`
      CREATE TABLE service_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        journey_type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        parent_category_id INTEGER REFERENCES service_categories(id),
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating certifications table...');
    await db.run(sql`
      CREATE TABLE certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        certification_type TEXT NOT NULL,
        certification_name TEXT NOT NULL,
        issuing_authority TEXT NOT NULL,
        certification_number TEXT,
        issue_date INTEGER NOT NULL,
        expiry_date INTEGER,
        document_url TEXT,
        verification_status TEXT DEFAULT 'pending',
        verified_by INTEGER REFERENCES users(id),
        verification_date INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating training_programs table...');
    await db.run(sql`
      CREATE TABLE training_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER REFERENCES service_providers(id) NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        duration TEXT,
        format TEXT NOT NULL,
        price TEXT,
        currency TEXT DEFAULT 'BWP',
        max_participants INTEGER,
        current_enrollment INTEGER DEFAULT 0,
        start_date INTEGER,
        end_date INTEGER,
        enrollment_deadline INTEGER,
        location TEXT,
        prerequisites TEXT,
        learning_outcomes TEXT,
        materials TEXT,
        certificate_offered INTEGER DEFAULT 0,
        certification_body TEXT,
        is_active INTEGER DEFAULT 1,
        featured INTEGER DEFAULT 0,
        rating TEXT DEFAULT '0',
        review_count INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating project_requests table...');
    await db.run(sql`
      CREATE TABLE project_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requester_id INTEGER REFERENCES users(id) NOT NULL,
        project_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        budget TEXT,
        currency TEXT DEFAULT 'BWP',
        timeline TEXT,
        location TEXT NOT NULL,
        requirements TEXT,
        attachments TEXT,
        skills_required TEXT,
        status TEXT DEFAULT 'open',
        urgency TEXT DEFAULT 'medium',
        contact_preference TEXT DEFAULT 'platform',
        proposal_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        assigned_provider_id INTEGER REFERENCES service_providers(id),
        assigned_date INTEGER,
        completed_date INTEGER,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating project_proposals table...');
    await db.run(sql`
      CREATE TABLE project_proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER REFERENCES project_requests(id) NOT NULL,
        provider_id INTEGER REFERENCES service_providers(id) NOT NULL,
        proposal_text TEXT NOT NULL,
        estimated_cost TEXT,
        estimated_duration TEXT,
        methodology TEXT,
        portfolio TEXT,
        availability TEXT,
        terms TEXT,
        status TEXT DEFAULT 'pending',
        submitted_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating user_profiles table...');
    await db.run(sql`
      CREATE TABLE user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        profile_type TEXT NOT NULL,
        business_name TEXT,
        registration_number TEXT,
        tax_number TEXT,
        skills TEXT,
        specializations TEXT,
        experience TEXT,
        education TEXT,
        languages TEXT,
        working_areas TEXT,
        availability_schedule TEXT,
        hourly_rate TEXT,
        minimum_project TEXT,
        tools TEXT,
        equipment TEXT,
        insurance TEXT,
        emergency_contact TEXT,
        portfolio_urls TEXT,
        social_media TEXT,
        achievements TEXT,
        membership_associations TEXT,
        background_check_status TEXT DEFAULT 'pending',
        profile_completeness INTEGER DEFAULT 0,
        last_active_at INTEGER,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);

    console.log('Creating enhanced_reviews table...');
    await db.run(sql`
      CREATE TABLE enhanced_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer_id INTEGER REFERENCES users(id) NOT NULL,
        reviewee_id INTEGER REFERENCES users(id),
        service_provider_id INTEGER REFERENCES service_providers(id),
        project_id INTEGER REFERENCES project_requests(id),
        training_program_id INTEGER REFERENCES training_programs(id),
        review_type TEXT NOT NULL,
        overall_rating INTEGER NOT NULL,
        quality_rating INTEGER,
        timeliness_rating INTEGER,
        communication_rating INTEGER,
        professionalism_rating INTEGER,
        value_rating INTEGER,
        review_title TEXT,
        review_text TEXT,
        pros TEXT,
        cons TEXT,
        would_recommend INTEGER,
        photo_urls TEXT,
        response_from_provider TEXT,
        response_date INTEGER,
        verified_purchase INTEGER DEFAULT 0,
        helpful_votes INTEGER DEFAULT 0,
        report_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
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