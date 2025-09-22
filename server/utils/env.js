import 'dotenv/config';
function get(name, fallback) {
    const v = process.env[name] ?? fallback;
    if (v === undefined) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return v;
}
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number(process.env.PORT ?? 5000),
    DATABASE_URL: get('DATABASE_URL'),
    SESSION_SECRET: get('SESSION_SECRET', 'dev-secret-change-in-production'),
    CORS_ORIGIN: get('CORS_ORIGIN', 'http://localhost:5173'),
    USE_INTEL: (process.env.USE_INTEL ?? 'false').toLowerCase() === 'true',
    REALESTATEINTEL_URL: process.env.REALESTATEINTEL_URL ?? '',
    REALESTATEINTEL_SUGGEST_URL: process.env.REALESTATEINTEL_SUGGEST_URL ?? '',
    REALESTATEINTEL_API_KEY: process.env.REALESTATEINTEL_API_KEY ?? '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};
export const config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbPath: process.env.DATABASE_URL || './beedab.db',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    openaiApiKey: process.env.OPENAI_API_KEY,
    mapboxToken: process.env.MAPBOX_TOKEN,
    rankingV2: process.env.RANKING_V2 === 'true'
};
