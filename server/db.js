import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
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
const normalizeSslMode = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : undefined);
let parsedHost;
let urlSslMode;
try {
    const parsed = new URL(databaseUrl);
    parsedHost = parsed.hostname;
    urlSslMode = normalizeSslMode(parsed.searchParams.get('sslmode')) ?? undefined;
}
catch (error) {
    console.warn('⚠️ Unable to parse DATABASE_URL for SSL detection. Falling back to environment configuration.', error);
}
const envSslMode = normalizeSslMode(process.env.PGSSLMODE);
const sslMode = urlSslMode ?? envSslMode;
const isLocalHost = parsedHost ? localHosts.has(parsedHost) : false;
let ssl;
if (sslMode === 'disable') {
    ssl = false;
} else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
    ssl = { rejectUnauthorized: true };
} else if (sslMode === 'require') {
    ssl = { rejectUnauthorized: false };
} else if (isLocalHost) {
    ssl = false;
} else if (process.env.NODE_ENV === 'production' && parsedHost && !isLocalHost) {
    ssl = { rejectUnauthorized: false };
} else {
    ssl = false;
}
const pool = new Pool({
    connectionString: databaseUrl,
    ssl,
    connectionTimeoutMillis: 5000,
});
// Create drizzle database instance
export const db = drizzle(pool, { schema });
// Test database connection on startup
export async function testDatabaseConnection() {
    try {
        // Test a simple query with timeout
        const withTimeout = async (promise, ms, message) => {
            let timer;
            const timeout = new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error(message)), ms);
            });
            try {
                return await Promise.race([promise, timeout]);
            }
            finally {
                if (timer) {
                    clearTimeout(timer);
                }
            }
        };
        await withTimeout(pool.query('SELECT 1'), 5000, 'Database connection timeout');
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
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
