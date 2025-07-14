
import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

interface Migration {
  id: number;
  filename: string;
  applied_at: string;
}

export class MigrationManager {
  private migrationsPath = path.join(__dirname, 'migrations');

  async initializeMigrationsTable() {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        applied_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  async getAppliedMigrations(): Promise<Migration[]> {
    try {
      return await db.all(sql`SELECT * FROM schema_migrations ORDER BY filename`);
    } catch (error) {
      return [];
    }
  }

  async getPendingMigrations(): Promise<string[]> {
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedFilenames = new Set(appliedMigrations.map(m => m.filename));

    const allMigrationFiles = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return allMigrationFiles.filter(file => !appliedFilenames.has(file));
  }

  async runMigration(filename: string): Promise<void> {
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
        await db.run(sql.raw(statement));
      } catch (error) {
        console.error(`Error in migration ${filename}:`, error);
        throw error;
      }
    }

    // Mark migration as applied
    await db.run(sql`
      INSERT INTO schema_migrations (filename) VALUES (${filename})
    `);

    console.log(`✅ Migration ${filename} completed`);
  }

  async runAllPendingMigrations(): Promise<void> {
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

  async resetDatabase(): Promise<void> {
    console.log('🗑️ Resetting database...');
    
    // Get all tables
    const tables = await db.all(sql`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    // Drop all tables
    for (const table of tables) {
      await db.run(sql.raw(`DROP TABLE IF EXISTS ${table.name}`));
    }

    console.log('✅ Database reset completed');
  }
}

export const migrationManager = new MigrationManager();
