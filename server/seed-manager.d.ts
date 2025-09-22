export declare class SeedManager {
    seedUsers(): Promise<void>;
    seedServiceCategories(): Promise<void>;
    seedMarketplaceProviders(): Promise<void>;
    seedAll(): Promise<void>;
}
export declare const seedManager: SeedManager;
