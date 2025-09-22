import 'dotenv/config';
export declare const env: {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    USE_INTEL: boolean;
    REALESTATEINTEL_URL: string;
    REALESTATEINTEL_SUGGEST_URL: string;
    REALESTATEINTEL_API_KEY: string;
    OPENAI_API_KEY: string;
};
export declare const config: {
    port: string | number;
    nodeEnv: string;
    dbPath: string;
    jwtSecret: string;
    openaiApiKey: string | undefined;
    mapboxToken: string | undefined;
    rankingV2: boolean;
};
