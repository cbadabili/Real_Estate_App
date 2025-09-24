import {
  properties,
  type Property,
  type InsertProperty
} from "../../shared/schema";
import { db } from "../db";
import { eq, and, desc, asc, gte, lte, like, or, sql } from "drizzle-orm";
import { cacheService, CacheService } from "../cache-service";

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
      if (parsed === null || parsed === undefined || parsed === "") {
        return [];
      }
      return [String(parsed)];
    } catch {
      return [trimmed];
    }
  }

  return [String(value)];
};

const normalizeNumeric = (value: unknown): number => {
  const direct = Number(value);
  if (Number.isFinite(direct)) {
    return direct;
  }

  if (typeof value === "string") {
    const cleaned = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(cleaned)) {
      return cleaned;
    }
  }

  return 0;
};

const parseCoordinate = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const buildGeomValue = (latitude: number | null, longitude: number | null) => {
  if (latitude === null || longitude === null) {
    return null;
  }

  return sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
};

const buildGeomUpdateValue = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
) => {
  const latitudeExpression = latitude === undefined
    ? sql`${properties.latitude}`
    : latitude === null
      ? sql`NULL`
      : sql`${latitude}`;

  const longitudeExpression = longitude === undefined
    ? sql`${properties.longitude}`
    : longitude === null
      ? sql`NULL`
      : sql`${longitude}`;

  return sql`CASE
    WHEN ${latitudeExpression} IS NULL OR ${longitudeExpression} IS NULL THEN NULL
    ELSE ST_SetSRID(ST_MakePoint(${longitudeExpression}, ${latitudeExpression}), 4326)
  END`;
};

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
  location?: string; // General location search parameter
  listingType?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'date' | 'size' | 'bedrooms';
  sortOrder?: 'asc' | 'desc';
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

export class PropertyRepository implements IPropertyRepository {
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    // Create cache key based on filters
    const cacheKey = CacheService.createKey('properties', filters);
    
    // Try to get from cache first
    const cached = cacheService.get<Property[]>(cacheKey);
    if (cached) {
      console.log('Properties served from cache');
      return cached;
    }

    let query = db.select().from(properties);
    const conditions = [];

    if (filters.minPrice !== undefined) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (filters.minBedrooms) {
      conditions.push(gte(properties.bedrooms, filters.minBedrooms));
    }
    if (filters.minBathrooms !== undefined) {
      conditions.push(gte(properties.bathrooms, filters.minBathrooms));
    }
    if (filters.minSquareFeet) {
      conditions.push(gte(properties.squareFeet, filters.minSquareFeet));
    }
    if (filters.maxSquareFeet) {
      conditions.push(lte(properties.squareFeet, filters.maxSquareFeet));
    }
    if (filters.city || filters.location) {
      const searchTerm = filters.location || filters.city;
      conditions.push(
        or(
          like(properties.city, `%${searchTerm}%`),
          like(properties.address, `%${searchTerm}%`),
          like(properties.title, `%${searchTerm}%`),
          like(properties.description, `%${searchTerm}%`)
        )
      );
    }
    if (filters.state) {
      conditions.push(eq(properties.state, filters.state));
    }
    if (filters.zipCode) {
      conditions.push(eq(properties.zipCode, filters.zipCode));
    }
    if (filters.listingType) {
      conditions.push(eq(properties.listingType, filters.listingType));
    }
    if (filters.status) {
      conditions.push(eq(properties.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sorting
    if (filters.sortBy) {
      const sortColumn = {
        'price': properties.price,
        'date': properties.createdAt,
        'size': properties.squareFeet,
        'bedrooms': properties.bedrooms
      }[filters.sortBy];

      if (sortColumn) {
        query = filters.sortOrder === 'asc' ? query.orderBy(asc(sortColumn)) : query.orderBy(desc(sortColumn));
      }
    } else {
      query = query.orderBy(desc(properties.createdAt));
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query;

    // Filter out properties with invalid coordinates
    const validResults = results.filter(prop => {
      const lat = typeof prop.latitude === "number" ? prop.latitude : prop.latitude === null ? null : Number(prop.latitude);
      const lng = typeof prop.longitude === "number" ? prop.longitude : prop.longitude === null ? null : Number(prop.longitude);
      const hasValidCoords = typeof lat === "number" && !Number.isNaN(lat) &&
        typeof lng === "number" && !Number.isNaN(lng);

      if (!hasValidCoords) {
        console.log(`Filtering out property ${prop.id} "${prop.title}" - invalid coordinates: lat=${prop.latitude}, lng=${prop.longitude}`);
      }

      return hasValidCoords;
    });

    const processedResults = validResults.map(prop => {
      const lat = typeof prop.latitude === "number" ? prop.latitude : Number(prop.latitude);
      const lng = typeof prop.longitude === "number" ? prop.longitude : Number(prop.longitude);
    const processed = {
      ...prop,
      price: normalizeNumeric(prop.price),
        latitude: Number.isFinite(lat) ? lat : null,
        longitude: Number.isFinite(lng) ? lng : null,
        images: normalizeStringArray(prop.images),
        features: normalizeStringArray(prop.features),
      };

      console.log(`Property ${processed.id}: lat=${processed.latitude}, lng=${processed.longitude}, type=${processed.propertyType}`);

      return processed;
    });

    console.log(`Retrieved ${processedResults.length} valid properties from database (filtered from ${results.length} total)`);
    
    // Cache the results for 5 minutes
    cacheService.set(cacheKey, processedResults, 5 * 60 * 1000);
    
    return processedResults;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const latitude = parseCoordinate(property.latitude);
    const longitude = parseCoordinate(property.longitude);
    const geomValue = buildGeomValue(latitude, longitude);

    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        latitude,
        longitude,
        geom: geomValue,
      })
      .returning();

    return {
      ...newProperty,
      price: normalizeNumeric(newProperty.price),
      images: normalizeStringArray(newProperty.images),
      features: normalizeStringArray(newProperty.features),
    };
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const updatePayload: Record<string, unknown> = { ...updates };

    let latitude: number | null | undefined;
    if (Object.prototype.hasOwnProperty.call(updates, "latitude")) {
      latitude = parseCoordinate(updates.latitude);
      updatePayload.latitude = latitude;
    }

    let longitude: number | null | undefined;
    if (Object.prototype.hasOwnProperty.call(updates, "longitude")) {
      longitude = parseCoordinate(updates.longitude);
      updatePayload.longitude = longitude;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "latitude") ||
        Object.prototype.hasOwnProperty.call(updates, "longitude")) {
      updatePayload.geom = buildGeomUpdateValue(latitude, longitude);
    }

    const [property] = await db
      .update(properties)
      .set(updatePayload)
      .where(eq(properties.id, id))
      .returning();

    if (!property) return undefined;

    return {
      ...property,
      price: normalizeNumeric(property.price),
      images: normalizeStringArray(property.images),
      features: normalizeStringArray(property.features),
    };
  }

  async deleteProperty(id: number): Promise<boolean> {
    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning({ id: properties.id });
    return deleted.length > 0;
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    const userProps = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, userId))
      .orderBy(desc(properties.createdAt));

    return userProps.map(prop => ({
      ...prop,
      price: normalizeNumeric(prop.price),
      images: normalizeStringArray(prop.images),
      features: normalizeStringArray(prop.features),
    }));
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db
      .update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }
}

export const propertyRepository = new PropertyRepository();