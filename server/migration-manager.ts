
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

  async initializeMigrationsTable() {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getAppliedMigrations() {
    try {
      const result = await db.execute(sql`SELECT * FROM schema_migrations ORDER BY filename`);
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  async getPendingMigrations() {
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedFilenames = new Set(appliedMigrations.map((m: any) => m.filename));
    
    const allMigrationFiles = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    return allMigrationFiles.filter(file => !appliedFilenames.has(file));
  }

  async runMigration(filename: string) {
    const filePath = path.join(this.migrationsPath, filename);
    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Running migration: ${filename}`);
    
    // Check if the migration contains dollar-quoted strings or procedural blocks
    if (migrationSQL.includes('$$') || migrationSQL.includes('DO ') || migrationSQL.includes('BEGIN')) {
      // Execute the entire file as one statement for complex migrations
      await db.execute(sql.raw(migrationSQL));
    } else {
      // Split by semicolon and execute each statement for simple migrations
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        await db.execute(sql.raw(statement));
      }
    }
    
    // Record migration as applied
    await db.execute(sql`
      INSERT INTO schema_migrations (filename) VALUES (${filename})
    `);
    
    console.log(`✅ Migration ${filename} completed`);
  }

  async runAllPendingMigrations() {
    await this.initializeMigrationsTable();
    const pendingMigrations = await this.getPendingMigrations();
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations found');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    for (const migration of pendingMigrations) {
      await this.runMigration(migration);
    }
    
    console.log('All migrations completed');
  }

  async resetDatabase() {
    console.log('⚠️ Resetting database...');
    
    // Drop all tables
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);
    
    console.log('Database reset completed');
  }

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
          
          -- Update geom if coordinates changed
          IF (NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL) THEN
            NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
          END IF;
          
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

// Singleton pattern for migration manager
let _migrationManager: MigrationManager | null = null;

export const getMigrationManager = (): MigrationManager => {
  if (!_migrationManager) {
    _migrationManager = new MigrationManager();
  }
  return _migrationManager;
};
