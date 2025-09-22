interface Migration {
    id: number;
    filename: string;
    applied_at: string;
}
export declare class MigrationManager {
    private migrationsPath;
    initializeMigrationsTable(): Promise<void>;
    getAppliedMigrations(): Promise<Migration[]>;
    getPendingMigrations(): Promise<string[]>;
    runMigration(filename: string): Promise<void>;
    runAllPendingMigrations(): Promise<void>;
    resetDatabase(): Promise<void>;
}
export declare const migrationManager: {
    getInstance(): MigrationManager;
};
export declare const getMigrationManager: () => MigrationManager;
export {};
