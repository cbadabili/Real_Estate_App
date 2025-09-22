
import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MigrationManager {
  private migrationsPath = path.join(__dirname, 'migrations');

  async ensurePostgresExtensions() {
    console.log('🔧 Installing PostgreSQL extensions...');
    
    try {
      // Install PostGIS for geographic queries
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
      console.log('✅ PostGIS extension installed');
      
      // Install pg_trgm for text search
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
      console.log('✅ pg_trgm extension installed');
      
      // Install btree_gin for composite indexes
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS btree_gin`);
      console.log('✅ btree_gin extension installed');
      
    } catch (error) {
      console.warn('⚠️ Some extensions may not be available:', error);
    }
  }

  async createSearchIndexes() {
    console.log('📊 Creating search and performance indexes...');
    
    try {
      // FTS index for property search
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS properties_fts_idx 
        ON properties USING gin(fts)
      `);
      
      // Geographic index for location queries  
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS properties_geom_idx 
        ON properties USING gist(geom)
      `);
      
      // Composite index for active listings
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS properties_active_price_idx 
        ON properties (is_active, price) 
        WHERE is_active = true
      `);
      
      // City and state filtering
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS properties_location_idx 
        ON properties (city, state, is_active)
      `);
      
      console.log('✅ Search indexes created');
      
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
      throw error;
    }
  }

  async createFTSTrigger() {
    console.log('🔍 Setting up full-text search triggers...');
    
    try {
      // Create FTS update function
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION update_properties_fts()
        RETURNS trigger AS $$
        BEGIN
          NEW.fts := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
                    setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'C') ||
                    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'D');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      // Create trigger
      await db.execute(sql`
        DROP TRIGGER IF EXISTS properties_fts_trigger ON properties;
        CREATE TRIGGER properties_fts_trigger
        BEFORE INSERT OR UPDATE ON properties
        FOR EACH ROW EXECUTE FUNCTION update_properties_fts();
      `);
      
      console.log('✅ FTS trigger created');
      
    } catch (error) {
      console.error('❌ Error creating FTS trigger:', error);
      throw error;
    }
  }

  async runMigrations() {
    console.log('🚀 Running PostgreSQL migrations...');
    
    await this.ensurePostgresExtensions();
    await this.createSearchIndexes();
    await this.createFTSTrigger();
    
    console.log('✅ All migrations completed successfully');
  }
}

export const migrationManager = new MigrationManager();
