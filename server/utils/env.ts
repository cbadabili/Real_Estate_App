import 'dotenv/config';

type EnvOptions = {
  /**
   * Optional default that is only applied while running in development mode.
   * This helps local contributors bootstrap quickly without weakening
   * production safety checks.
   */
  devDefault?: string;
};

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isDevelopment = NODE_ENV === 'development';

function requireEnv(name: string, { devDefault }: EnvOptions = {}) {
  const candidate = process.env[name] ?? (isDevelopment ? devDefault : undefined);
  const trimmed = typeof candidate === 'string' ? candidate.trim() : candidate;

  if (trimmed === undefined || trimmed === null || trimmed === '') {
    throw new Error(`Missing required env var: ${name}`);
  }

  return trimmed;
}

const SESSION_SECRET = requireEnv('SESSION_SECRET', { devDefault: 'dev-only-insecure-secret' });
if (isDevelopment && SESSION_SECRET === 'dev-only-insecure-secret') {
  console.warn('⚠️ Using the built-in development SESSION_SECRET. Set SESSION_SECRET to a unique value for any shared environment.');
}

export const env = {
  NODE_ENV,
  PORT: Number(process.env.PORT ?? 5001),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  SESSION_SECRET,
  JWT_SECRET: requireEnv('JWT_SECRET'),
  CORS_ORIGIN: requireEnv('CORS_ORIGIN', { devDefault: 'http://localhost:5000' }),
  USE_INTEL: (process.env.USE_INTEL ?? 'false').toLowerCase() === 'true',
  REALESTATEINTEL_URL: process.env.REALESTATEINTEL_URL ?? '',
  REALESTATEINTEL_SUGGEST_URL: process.env.REALESTATEINTEL_SUGGEST_URL ?? '',
  REALESTATEINTEL_API_KEY: process.env.REALESTATEINTEL_API_KEY ?? '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  dbPath: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  rankingV2: process.env.RANKING_V2 === 'true'
};