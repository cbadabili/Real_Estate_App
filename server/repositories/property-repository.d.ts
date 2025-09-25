import { type Property, type InsertProperty } from "../../shared/schema";
export interface PropertyFilters {
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    minBedrooms?: number;
    minBathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;
    city?: string;
    state?: string;
    zipCode?: string;
    address?: string;
    title?: string;
    location?: string;
    listingType?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'price' | 'date' | 'size' | 'bedrooms' | 'price_low' | 'price_high' | 'newest';
    sortOrder?: 'asc' | 'desc';
    requireValidCoordinates?: boolean;
    searchTerm?: string;
}
export interface IPropertyRepository {
    getProperty(id: number): Promise<Property | undefined>;
    getProperties(filters?: PropertyFilters): Promise<Property[]>;
    createProperty(property: InsertProperty): Promise<Property>;
    updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
    deleteProperty(id: number): Promise<boolean>;
    getUserProperties(userId: number): Promise<Property[]>;
    incrementPropertyViews(id: number): Promise<void>;
}
export declare class PropertyRepository implements IPropertyRepository {
    getProperty(id: number): Promise<Property | undefined>;
    getProperties(filters?: PropertyFilters): Promise<Property[]>;
    createProperty(property: InsertProperty): Promise<Property>;
    updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
    deleteProperty(id: number): Promise<boolean>;
    getUserProperties(userId: number): Promise<Property[]>;
    incrementPropertyViews(id: number): Promise<void>;
}
export declare const propertyRepository: PropertyRepository;
