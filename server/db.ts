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
const localHosts = new Set(['localhost', '127.0.0.1', '::1', 'host.docker.internal']);

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
const sslModes = [urlSslMode, envSslMode].filter(
  (mode): mode is string => typeof mode === 'string' && mode.length > 0,
);
const isLocalHost = parsedHost ? localHosts.has(parsedHost) : false;

const explicitlyDisable = sslModes.includes('disable');
const prioritizedMode = sslModes.find((mode) =>
  mode ? !['disable', 'prefer', 'allow'].includes(mode) : false,
) as 'require' | 'verify-ca' | 'verify-full' | undefined;

let ssl: PoolConfig['ssl'];
if (explicitlyDisable) {
  ssl = false;
} else if (prioritizedMode === 'verify-ca' || prioritizedMode === 'verify-full') {
  ssl = { rejectUnauthorized: true };
} else if (prioritizedMode === 'require') {
  ssl = { rejectUnauthorized: false };
} else if (isLocalHost) {
  ssl = false;
} else if (parsedHost) {
  ssl = { rejectUnauthorized: true };
} else {
  ssl = false;
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl,
  connectionTimeoutMillis: 5000,
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

export type DatabaseHealth = {
  ok: true;
} | {
  ok: false;
  error: unknown;
};

// Test database connection on startup
export async function testDatabaseConnection(): Promise<DatabaseHealth> {
  try {
    // Test a simple query with timeout
    const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string) => {
      let timer: NodeJS.Timeout | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      });
      try {
        return await Promise.race([promise, timeout]);
      } finally {
        if (timer) {
          clearTimeout(timer);
        }
      }
    };

    await withTimeout(pool.query('SELECT 1'), 5000, 'Database connection timeout');
    console.log('✅ Database connection successful');
    return { ok: true };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { ok: false, error };
  }
}

export async function initializeDatabase() {
  console.log('Testing PostgreSQL database connection...');
  const result = await testDatabaseConnection();
  if (!result.ok) {
    if (result.error) {
      throw result.error;
    }

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
