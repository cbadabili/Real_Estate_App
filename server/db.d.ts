import { Pool } from 'pg';
import * as schema from "../shared/schema";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export declare function testDatabaseConnection(): Promise<boolean>;
export declare function initializeDatabase(): Promise<import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
}>;
