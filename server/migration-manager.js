import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class MigrationManager {
    constructor() {
        this.migrationsPath = path.join(__dirname, 'migrations');
    }
    async initializeMigrationsTable() {
        await db.execute(sql `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async getAppliedMigrations() {
        try {
            const result = await db.execute(sql `SELECT * FROM schema_migrations ORDER BY filename`);
            return result.rows;
        }
        catch (error) {
            return [];
        }
    }
    async getPendingMigrations() {
        const appliedMigrations = await this.getAppliedMigrations();
        const appliedFilenames = new Set(appliedMigrations.map(m => m.filename));
        const allMigrationFiles = fs.readdirSync(this.migrationsPath)
            .filter(file => file.endsWith('.sql'))
            .sort();
        return allMigrationFiles.filter(file => !appliedFilenames.has(file));
    }
    async runMigration(filename) {
        const filePath = path.join(this.migrationsPath, filename);
        const migrationSQL = fs.readFileSync(filePath, 'utf8');
        // Split by semicolon and execute each statement
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
        console.log(`Running migration: ${filename}`);
        for (const statement of statements) {
            try {
                await db.execute(sql.raw(statement));
            }
            catch (error) {
                console.error(`Error in migration ${filename}:`, error);
                throw error;
            }
        }
        // Mark migration as applied
        await db.execute(sql `
      INSERT INTO schema_migrations (filename) VALUES (${filename})
    `);
        console.log(`✅ Migration ${filename} completed`);
    }
    async runAllPendingMigrations() {
        await this.initializeMigrationsTable();
        const pendingMigrations = await this.getPendingMigrations();
        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations');
            return;
        }
        console.log(`Running ${pendingMigrations.length} pending migrations...`);
        for (const migration of pendingMigrations) {
            await this.runMigration(migration);
        }
        console.log('✅ All migrations completed');
    }
    async resetDatabase() {
        console.log('🗑️ Resetting database...');
        // Get all tables
        const result = await db.execute(sql `
      SELECT table_name as name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
        const tables = result.rows;
        // Drop all tables
        for (const table of tables) {
            await db.execute(sql.raw(`DROP TABLE IF EXISTS ${table.name} CASCADE`));
        }
        console.log('✅ Database reset completed');
    }
}
let _migrationManager = null;
export const migrationManager = {
    getInstance() {
        if (!_migrationManager) {
            _migrationManager = new MigrationManager();
        }
        return _migrationManager;
    }
};
// For backward compatibility, also export the methods directly
export const getMigrationManager = () => migrationManager.getInstance();
