
import { db } from '../server/db';
import { properties } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function migrateToPostgres() {
  console.log('🔄 Migrating data to PostgreSQL format...');
  
  try {
    // Update geom field from latitude/longitude
    console.log('📍 Updating geographic coordinates...');
    await db.execute(sql`
      UPDATE properties 
      SET geom = ST_SetSRID(ST_MakePoint(longitude::numeric, latitude::numeric), 4326)
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL 
        AND latitude != '' 
        AND longitude != ''
        AND geom IS NULL
    `);
    
    // Update completeness scores
    console.log('📊 Calculating completeness scores...');
    await db.execute(sql`
      UPDATE properties 
      SET completeness_score = (
        CASE WHEN title IS NOT NULL AND title != '' THEN 20 ELSE 0 END +
        CASE WHEN description IS NOT NULL AND description != '' THEN 20 ELSE 0 END +
        CASE WHEN images IS NOT NULL AND images != '[]' THEN 20 ELSE 0 END +
        CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 20 ELSE 0 END +
        CASE WHEN bedrooms > 0 OR property_type = 'land' THEN 20 ELSE 0 END
      )
      WHERE completeness_score = 0 OR completeness_score IS NULL
    `);
    
    // Ensure all properties are active by default
    console.log('✅ Setting default active status...');
    await db.execute(sql`
      UPDATE properties 
      SET is_active = true 
      WHERE is_active IS NULL
    `);
    
    // Update FTS for existing records
    console.log('🔍 Updating full-text search...');
    await db.execute(sql`
      UPDATE properties 
      SET fts = setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
               setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
               setweight(to_tsvector('english', COALESCE(address, '')), 'C') ||
               setweight(to_tsvector('english', COALESCE(city, '')), 'D')
      WHERE fts IS NULL
    `);
    
    console.log('✅ PostgreSQL migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToPostgres()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateToPostgres };
