import { db } from './db';

export async function createRentalTables() {
  try {
    console.log('Creating rental tables...');

    // Create rental_listings table
    console.log('Creating rental_listings table...');
    await db.exec(`
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

    // Create rental_applications table
    console.log('Creating rental_applications table...');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS rental_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id INTEGER REFERENCES rental_listings(id) ON DELETE CASCADE,
        renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        application_data TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        background_check_status TEXT DEFAULT 'pending',
        credit_report_status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Create lease_agreements table
    console.log('Creating lease_agreements table...');
    await db.exec(`
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