import { db } from './db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeTables() {
  try {
    console.log('Initializing PostgreSQL tables...');

    // Drop existing tables to ensure clean slate
    console.log('Dropping existing tables...');
    await db.execute(sql`DROP TABLE IF EXISTS saved_properties CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS appointments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS inquiries CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS properties CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
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
        is_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        reac_number TEXT,
        last_login_at BIGINT,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);
    console.log('✅ Users table ready');

    console.log('Creating properties table...');
    await db.execute(sql`
      CREATE TABLE properties (
        id SERIAL PRIMARY KEY,
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
        auction_date BIGINT,
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
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);
    console.log('✅ Properties table ready');

    console.log('Creating inquiries table...');
    await db.execute(sql`
      CREATE TABLE inquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        buyer_id INTEGER REFERENCES users(id) NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating appointments table...');
    await db.execute(sql`
      CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        buyer_id INTEGER REFERENCES users(id) NOT NULL,
        agent_id INTEGER REFERENCES users(id),
        appointment_date BIGINT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        notes TEXT,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating saved_properties table...');
    await db.execute(sql`
      CREATE TABLE saved_properties (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating services tables...');

    console.log('Creating service_providers table...');
    await db.execute(sql`
      CREATE TABLE service_providers (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        service_category TEXT NOT NULL,
        contact_person TEXT,
        phone_number TEXT,
        email TEXT,
        website_url TEXT,
        logo_url TEXT,
        description TEXT,
        reac_certified BOOLEAN DEFAULT false,
        address TEXT,
        city TEXT,
        rating TEXT DEFAULT '4.5',
        review_count INTEGER DEFAULT 0,
        verified BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        date_joined BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    await db.execute(sql`CREATE UNIQUE INDEX service_providers_email_unique ON service_providers (email)`);

    console.log('Creating service_ads table...');
    await db.execute(sql`
      CREATE TABLE service_ads (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER REFERENCES service_providers(id),
        ad_title TEXT NOT NULL,
        ad_copy TEXT,
        ad_image_url TEXT,
        target_audience TEXT NOT NULL,
        context_trigger TEXT NOT NULL,
        cta_text TEXT DEFAULT 'Learn More',
        cta_url TEXT,
        active BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 1,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating service_reviews table...');
    await db.execute(sql`
      CREATE TABLE service_reviews (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER REFERENCES service_providers(id),
        user_id INTEGER,
        rating INTEGER NOT NULL,
        review TEXT,
        reviewer_name TEXT,
        reviewer_avatar TEXT,
        verified BOOLEAN DEFAULT false,
        helpful INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating marketplace tables...');

    console.log('Creating service_categories table...');
    await db.execute(sql`
      CREATE TABLE service_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        journey_type TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating marketplace_providers table...');
    await db.execute(sql`
      CREATE TABLE marketplace_providers (
        id SERIAL PRIMARY KEY,
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
        is_verified BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        reac_certified BOOLEAN DEFAULT false,
        business_address TEXT,
        operating_hours TEXT,
        service_radius INTEGER DEFAULT 0,
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 0,
        projects_completed INTEGER DEFAULT 0,
        response_time INTEGER DEFAULT 24,
        availability_status TEXT DEFAULT 'available',
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating artisan_skills table...');
    await db.execute(sql`
      CREATE TABLE artisan_skills (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER REFERENCES marketplace_providers(id),
        skill_name TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        years_experience INTEGER DEFAULT 0,
        certification_url TEXT,
        is_primary BOOLEAN DEFAULT false,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating training_programs table...');
    await db.execute(sql`
      CREATE TABLE training_programs (
        id SERIAL PRIMARY KEY,
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
        start_date BIGINT,
        end_date BIGINT,
        is_active BOOLEAN DEFAULT true,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating building_materials table...');
    await db.execute(sql`
      CREATE TABLE building_materials (
        id SERIAL PRIMARY KEY,
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
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('Creating project_requests table...');
    await db.execute(sql`
      CREATE TABLE project_requests (
        id SERIAL PRIMARY KEY,
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
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('Seeding database...');

  // Add sample users
  console.log('Adding sample users...');
  await db.execute(sql`
    INSERT INTO users (username, email, password, first_name, last_name, user_type, role, is_verified) VALUES
    ('johndoe', 'john.doe@example.com', 'hashed_password_1', 'John', 'Doe', 'buyer', 'user', true),
    ('agentjane', 'jane.doe@example.com', 'hashed_password_2', 'Jane', 'Doe', 'agent', 'agent', true),
    ('adminuser', 'admin@example.com', 'hashed_password_3', 'Admin', 'User', 'admin', 'admin', true)
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('✅ Sample users added');

  // Add sample properties
  console.log('Adding sample properties...');
  await db.execute(sql`
    INSERT INTO properties (title, description, price, address, city, state, zip_code, latitude, longitude, property_type, listing_type, bedrooms, bathrooms, square_feet, owner_id, agent_id, images, status) VALUES
    ('Beautiful Family Home', 'A spacious home perfect for families, with a large backyard and modern amenities.', '2500000', '123 Tlokweng Road', 'Gaborone', 'South East', '00267', '-24.6282', '25.9231', 'house', 'agent', 4, '3', 2200, 1, 2, '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800"]', 'active'),
    ('Modern Downtown Condo', 'Modern condo in the heart of the city, close to all attractions.', '1800000', '456 CBD Square', 'Gaborone', 'South East', '00267', '-24.6555', '25.9125', 'apartment', 'agent', 2, '2', 1100, 1, 2, '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"]', 'active'),
    ('Luxury Estate in Phakalane', 'Stunning luxury home with pool and garden in prestigious Phakalane area.', '4500000', '789 Phakalane Drive', 'Gaborone', 'South East', '00267', '-24.5892', '25.9544', 'house', 'owner', 5, '4', 3500, 1, 2, '["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800"]', 'active'),
    ('Commercial Land Plot', 'Prime commercial land for development in growing area.', '3200000', 'Plot 12345 Kgale Hill', 'Gaborone', 'South East', '00267', '-24.6892', '25.8544', 'land_plot', 'owner', 0, '0', 5000, 3, 2, '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800"]', 'active'),
    ('Farm Property in Mogoditshane', 'Working farm with livestock facilities and water access.', '8500000', 'Farm Road Mogoditshane', 'Mogoditshane', 'South East', '00267', '-24.6950', '25.8600', 'farm', 'owner', 3, '2', 8000, 3, 2, '["https://images.unsplash.com/photo-1544047727-63d1484e9ffc?auto=format&fit=crop&w=800"]', 'active')
    ON CONFLICT (title) DO NOTHING;
  `);
  console.log('✅ Sample properties added');

  console.log('✅ Database seeded successfully');
}


async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');

    // Initialize tables with the corrected schema
    await initializeTables();

    // Seed the database
    console.log('Seeding database...');
    await seedDatabase();
    console.log('✅ Database initialization completed');

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