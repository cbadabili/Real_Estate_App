import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import { seedServices } from "./services-seed";
import { createPropertiesTable, createUsersTable } from './seed';
import { createRentalTables } from './rental-migration';
import rentalRoutes from "./rental-routes";
import { aiSearchRoutes } from './ai-search';
import propertyManagementRoutes from './property-management-routes';
import tenantSupportRoutes from './tenant-support-routes';
import { servicesRoutes } from "./services-routes";
import { seedMarketplace } from "./marketplace-seed";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Test database connection before starting server
  console.log('Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

  const server = await registerRoutes(app);

  app.use('/api', rentalRoutes);
  app.use('/api', aiSearchRoutes);
  app.use('/api', propertyManagementRoutes);
  app.use('/api', tenantSupportRoutes);
  app.use('/api', servicesRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Express error:', err);
    res.status(status).json({ message });
    // Don't re-throw to prevent crash
  });

  // Set environment to development if not specified
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Initialize database
  await createUsersTable();
  await createPropertiesTable();

  // Create rental tables
  console.log('Creating rental tables...');
  await createRentalTables();
  console.log('✅ Rental tables created successfully');

  // Initialize marketplace tables
  console.log('Creating marketplace tables...');
  await initializeMarketplaceTables();
  console.log('✅ Marketplace tables created successfully');

  // Seed services data
  console.log('Seeding services data...');
  await seedServices();

  // Seed marketplace data
  console.log('Seeding marketplace data...');
  await seedMarketplace();

  // Seed rental data

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

async function createRentalTables() {
  try {
    // Enable foreign key constraints
    console.log('Enabling foreign key constraints...');
    await db.run(sql`PRAGMA foreign_keys = ON`);
    
    // Step 1: Create rental_listings table first (no dependencies)
    console.log('Step 1: Creating rental_listings table...');
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS rental_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT,
        latitude TEXT,
        longitude TEXT,
        property_type TEXT NOT NULL,
        bedrooms INTEGER,
        bathrooms TEXT,
        square_feet INTEGER,
        rent_amount INTEGER NOT NULL,
        deposit_amount INTEGER,
        lease_term TEXT,
        pet_policy TEXT,
        utilities_included TEXT,
        parking_included INTEGER DEFAULT 0,
        furnished INTEGER DEFAULT 0,
        images TEXT,
        features TEXT,
        status TEXT DEFAULT 'available',
        landlord_id INTEGER,
        agent_id INTEGER,
        views INTEGER DEFAULT 0,
        available_date INTEGER,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);
    console.log('✅ rental_listings table created successfully');

    // Step 2: Verify rental_listings table exists
    console.log('Step 2: Verifying rental_listings table exists...');
    const tableCheck = await db.all(sql`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='rental_listings'
    `);
    console.log('Table check result:', tableCheck);
    
    if (tableCheck.length === 0) {
      throw new Error('rental_listings table was not created successfully');
    }

    // Step 3: Create rental_applications table (depends on rental_listings and users)
    console.log('Step 3: Creating rental_applications table...');
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS rental_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER,
        tenant_id INTEGER,
        application_date INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        status TEXT DEFAULT 'pending',
        personal_info TEXT,
        employment_info TEXT,
        references TEXT,
        documents TEXT,
        screening_status TEXT,
        background_check TEXT,
        credit_score INTEGER,
        income_verification TEXT,
        notes TEXT,
        reviewed_by INTEGER,
        reviewed_at INTEGER,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);
    console.log('✅ rental_applications table created successfully');

    // Step 4: Create lease_agreements table (depends on rental_listings and users)
    console.log('Step 4: Creating lease_agreements table...');
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS lease_agreements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER,
        landlord_id INTEGER,
        tenant_id INTEGER,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        rent_amount INTEGER NOT NULL,
        deposit_amount INTEGER,
        lease_terms TEXT,
        special_conditions TEXT,
        pet_addendum TEXT,
        utilities_responsibility TEXT,
        maintenance_responsibility TEXT,
        renewal_terms TEXT,
        termination_conditions TEXT,
        status TEXT DEFAULT 'draft',
        signed_by_landlord INTEGER DEFAULT 0,
        signed_by_tenant INTEGER DEFAULT 0,
        landlord_signature_date INTEGER,
        tenant_signature_date INTEGER,
        lease_document_url TEXT,
        created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
        updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      )
    `);
    console.log('✅ lease_agreements table created successfully');
    
    console.log('✅ All rental tables created successfully');
  } catch (error) {
    console.error('❌ Error creating rental tables:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      cause: error.cause
    });
    throw error;
  }
}

async function initializeMarketplaceTables() {
  try {
    console.log('Creating service_categories table...');
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS service_categories (
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
      CREATE TABLE IF NOT EXISTS marketplace_providers (
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
      CREATE TABLE IF NOT EXISTS artisan_skills (
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
      CREATE TABLE IF NOT EXISTS training_programs (
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
      CREATE TABLE IF NOT EXISTS building_materials (
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
      CREATE TABLE IF NOT EXISTS project_requests (
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
  } catch (error) {
    console.error('Error creating marketplace tables:', error);
    throw error;
  }
}