import { type ServiceProvider, type InsertServiceProvider, type ServiceAd, type InsertServiceAd, type ServiceReview, type InsertServiceReview } from "../shared/services-schema";
export interface IServicesStorage {
    getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
    getServiceProviders(filters?: ServiceProviderFilters): Promise<ServiceProvider[]>;
    getServiceProvidersByCategory(category: string): Promise<ServiceProvider[]>;
    getServiceCategories(): Promise<string[]>;
    createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
    updateServiceProvider(id: number, updates: Partial<InsertServiceProvider>): Promise<ServiceProvider | undefined>;
    deleteServiceProvider(id: number): Promise<boolean>;
    getContextualAd(trigger: string): Promise<ServiceAd | undefined>;
    getServiceAds(providerId?: number): Promise<ServiceAd[]>;
    createServiceAd(ad: InsertServiceAd): Promise<ServiceAd>;
    updateServiceAd(id: number, updates: Partial<InsertServiceAd>): Promise<ServiceAd | undefined>;
    incrementAdMetrics(adId: number, metric: 'impressions' | 'clicks'): Promise<void>;
    getServiceReviews(providerId: number): Promise<ServiceReview[]>;
    createServiceReview(review: InsertServiceReview): Promise<ServiceReview>;
    updateServiceReview(id: number, updates: Partial<InsertServiceReview>): Promise<ServiceReview | undefined>;
}
export interface ServiceProviderFilters {
    category?: string;
    city?: string;
    verified?: boolean;
    featured?: boolean;
    reacCertified?: boolean;
    minRating?: number;
    limit?: number;
    offset?: number;
    sortBy?: 'rating' | 'reviewCount' | 'name' | 'newest';
    sortOrder?: 'asc' | 'desc';
}
export declare class ServicesStorage implements IServicesStorage {
    getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
    getServiceProviders(filters?: ServiceProviderFilters): Promise<ServiceProvider[]>;
    getServiceProvidersByCategory(category: string): Promise<ServiceProvider[]>;
    getServiceCategories(): Promise<string[]>;
    createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
    updateServiceProvider(id: number, updates: Partial<InsertServiceProvider>): Promise<ServiceProvider | undefined>;
    deleteServiceProvider(id: number): Promise<boolean>;
    getContextualAd(trigger: string): Promise<ServiceAd | undefined>;
    getServiceAds(providerId?: number): Promise<ServiceAd[]>;
    createServiceAd(ad: InsertServiceAd): Promise<ServiceAd>;
    updateServiceAd(id: number, updates: Partial<InsertServiceAd>): Promise<ServiceAd | undefined>;
    incrementAdMetrics(adId: number, metric: 'impressions' | 'clicks'): Promise<void>;
    getServiceReviews(providerId: number): Promise<ServiceReview[]>;
    createServiceReview(review: InsertServiceReview): Promise<ServiceReview>;
    updateServiceReview(id: number, updates: Partial<InsertServiceReview>): Promise<ServiceReview | undefined>;
}
export declare const servicesStorage: ServicesStorage;
