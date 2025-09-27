import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { PoolConfig } from 'pg';
import pgTypes from 'pg-types';
import * as schema from "../shared/schema";

// ---------------------------------------------------------------------------
// PostgreSQL connection setup
// ---------------------------------------------------------------------------
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Optional SSL support for serverless providers (e.g. Vercel, Render)
// We disable SSL automatically for local/CI databases (localhost) unless explicitly enabled.
const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

const normalizeSslMode = (value?: string | null) => value?.trim().toLowerCase();

let parsedHost: string | undefined;
let urlSslMode: string | undefined;

try {
  const parsed = new URL(databaseUrl);
  parsedHost = parsed.hostname;
  urlSslMode = normalizeSslMode(parsed.searchParams.get('sslmode')) ?? undefined;
} catch (error) {
  console.warn('⚠️ Unable to parse DATABASE_URL for SSL detection. Falling back to environment configuration.', error);
}

const envSslMode = normalizeSslMode(process.env.PGSSLMODE);

const explicitlyDisableSsl =
  urlSslMode === 'disable' ||
  envSslMode === 'disable' ||
  (parsedHost ? localHosts.has(parsedHost) : false);

const explicitlyEnableSsl =
  !explicitlyDisableSsl &&
  Boolean(
    (urlSslMode && urlSslMode !== 'prefer' && urlSslMode !== 'allow') ||
    (envSslMode && envSslMode !== 'prefer' && envSslMode !== 'allow')
  );

const ssl: PoolConfig['ssl'] = explicitlyDisableSsl
  ? false
  : explicitlyEnableSsl || (parsedHost ? !localHosts.has(parsedHost) : false)
    ? { rejectUnauthorized: false }
    : false;

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
// Ensure NUMERIC columns are parsed as JavaScript numbers
pgTypes.setTypeParser(1700, (value: string | null) => {
  if (value === null) return null;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
});
