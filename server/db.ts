import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// ---------------------------------------------------------------------------
// PostgreSQL connection setup
// ---------------------------------------------------------------------------
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Optional SSL support for serverless providers (e.g. Vercel, Render)
// Disable by setting PGSSLMODE=disable
const ssl =
  process.env.PGSSLMODE === 'disable'
    ? false
    : { rejectUnauthorized: false } as const;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl,
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Test database connection on startup
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Test a simple query with timeout
    const result = await Promise.race([
      pool.query('SELECT 1'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export async function initializeDatabase() {
  console.log('Testing PostgreSQL database connection...');
  const ok = await testDatabaseConnection();
  if (!ok) {
    throw new Error('Database connection failed');
  }
  return db;
}