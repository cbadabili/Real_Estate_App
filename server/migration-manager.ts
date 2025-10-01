import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Migration {
  id: number;
  filename: string;
  applied_at: string;
}

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

  async getAppliedMigrations(): Promise<Migration[]> {
    try {
      const result = await db.execute(sql`SELECT * FROM schema_migrations ORDER BY filename`);
      const rows = Array.isArray(result.rows) ? result.rows : [];

      return rows
        .map((row): Migration | null => {
          const id = Number((row as Record<string, unknown>).id);
          const filename = (row as Record<string, unknown>).filename;
          const appliedAt = (row as Record<string, unknown>).applied_at;

          if (!Number.isFinite(id) || typeof filename !== 'string') {
            return null;
          }

          return {
            id,
            filename,
            applied_at: typeof appliedAt === 'string' ? appliedAt : new Date().toISOString(),
          };
        })
        .filter((migration): migration is Migration => migration !== null);
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
        await db.execute(sql.raw(statement));
      } catch (error) {
        console.error(`Error in migration ${filename}:`, error);
        throw error;
      }
    }

    // Mark migration as applied
    await db.execute(sql`
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
    const result = await db.execute(sql`
      SELECT table_name as name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const tables = (Array.isArray(result.rows) ? result.rows : []).map((row) => ({
      name: String((row as Record<string, unknown>).name ?? ''),
    }));

    // Drop all tables
    for (const table of tables) {
      if (!table.name) {
        continue;
      }
      await db.execute(sql.raw(`DROP TABLE IF EXISTS ${table.name} CASCADE`));
    }

    console.log('✅ Database reset completed');
  }
}

let _migrationManager: MigrationManager | null = null;

export const migrationManager = {
  getInstance(): MigrationManager {
    if (!_migrationManager) {
      _migrationManager = new MigrationManager();
    }
    return _migrationManager;
  }
};

// For backward compatibility, also export the methods directly
export const getMigrationManager = () => migrationManager.getInstance();