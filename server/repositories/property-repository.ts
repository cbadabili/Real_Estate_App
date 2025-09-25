import {
  properties,
  type Property,
  type InsertProperty
} from "../../shared/schema";
import { db } from "../db";
import { eq, and, desc, asc, gte, lte, ilike, or, sql, type SQL } from "drizzle-orm";
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

const toCoord = (v: unknown): number | null => {
  if (v == null) {
    return null;
  }
  if (typeof v === "number") {
    return Number.isFinite(v) ? v : null;
  }
  if (typeof v === "string" && v.trim() !== "") {
    const parsed = Number(v);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseCoordinate = (value: unknown): number | null | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return toCoord(value);
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

const toFiniteNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const normalizePropertyRecord = (prop: Property): Property => {
  return {
    ...prop,
    price: normalizeNumeric(prop.price),
    images: normalizeStringArray(prop.images),
    features: normalizeStringArray(prop.features),
    latitude: toCoord(prop.latitude),
    longitude: toCoord(prop.longitude),
  };
};

/**
 * Filters that can be applied when querying for properties.
 */
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
  location?: string; // General location search parameter
  listingType?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'date' | 'size' | 'bedrooms' | 'price_low' | 'price_high' | 'newest';
  sortOrder?: 'asc' | 'desc';
  requireValidCoordinates?: boolean;
  searchTerm?: string;
}

/**
 * Public contract for interacting with persisted property records.
 */
export interface IPropertyRepository {
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getUserProperties(userId: number): Promise<Property[]>;
  incrementPropertyViews(id: number): Promise<void>;
}

/**
 * Drizzle-backed implementation of the property repository. Handles
 * normalization, caching, search, and spatial updates.
 */
export class PropertyRepository implements IPropertyRepository {
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    if (!property) {
      return undefined;
    }
    return normalizePropertyRecord(property);
  }

  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    const minPrice = toFiniteNumber(filters.minPrice);
    const maxPrice = toFiniteNumber(filters.maxPrice);
    const minBedrooms = toFiniteNumber(filters.minBedrooms);
    const minBathrooms = toFiniteNumber(filters.minBathrooms);
    const minSquareFeet = toFiniteNumber(filters.minSquareFeet);
    const maxSquareFeet = toFiniteNumber(filters.maxSquareFeet);
    const limit = toFiniteNumber(filters.limit);
    const offset = toFiniteNumber(filters.offset);

    const cacheKey = CacheService.createKey('properties', {
      ...filters,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      minSquareFeet,
      maxSquareFeet,
      limit,
      offset,
    });
    
    // Try to get from cache first
    const cached = cacheService.get<Property[]>(cacheKey);
    if (cached) {
      console.log('Properties served from cache');
      return cached;
    }

    let query = db.select().from(properties);
    const conditions: SQL[] = [];
    const orderings: SQL[] = [];

    if (minPrice !== undefined) {
      conditions.push(gte(properties.price, minPrice));
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(properties.price, maxPrice));
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (minBedrooms !== undefined) {
      conditions.push(gte(properties.bedrooms, minBedrooms));
    }
    if (minBathrooms !== undefined) {
      conditions.push(gte(properties.bathrooms, minBathrooms));
    }
    if (minSquareFeet !== undefined) {
      conditions.push(gte(properties.squareFeet, minSquareFeet));
    }
    if (maxSquareFeet !== undefined) {
      conditions.push(lte(properties.squareFeet, maxSquareFeet));
    }
    const searchTerm = filters.searchTerm ?? filters.location ?? filters.city ?? filters.address ?? filters.title;
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      if (term.length >= 2) {
        const tsQuery = sql`plainto_tsquery('simple', ${term})`;
        conditions.push(sql`${properties.fts} @@ ${tsQuery}`);
        orderings.push(sql`ts_rank_cd(${properties.fts}, ${tsQuery}) DESC`);
      } else {
        conditions.push(
          or(
            ilike(properties.title, `%${term}%`),
            ilike(properties.description, `%${term}%`),
            ilike(properties.address, `%${term}%`),
            ilike(properties.city, `%${term}%`)
          )
        );
      }
    } else if (filters.city || filters.location) {
      const locationTerm = (filters.location ?? filters.city ?? "").trim();
      if (locationTerm) {
        conditions.push(
          or(
            ilike(properties.city, `%${locationTerm}%`),
            ilike(properties.address, `%${locationTerm}%`),
            ilike(properties.title, `%${locationTerm}%`),
            ilike(properties.description, `%${locationTerm}%`)
          )
        );
      }
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
    if (orderings.length > 0) {
      query = query.orderBy(...orderings, desc(properties.createdAt));
    } else if (filters.sortBy) {
      const legacySortOptions = {
        price_low: { column: properties.price, direction: 'asc' as const },
        price_high: { column: properties.price, direction: 'desc' as const },
        newest: { column: properties.createdAt, direction: 'desc' as const },
      } as const;

      if (filters.sortBy in legacySortOptions) {
        const legacySort = legacySortOptions[filters.sortBy as keyof typeof legacySortOptions];
        query = legacySort.direction === 'asc'
          ? query.orderBy(asc(legacySort.column))
          : query.orderBy(desc(legacySort.column));
      } else {
        const sortColumn = {
          price: properties.price,
          date: properties.createdAt,
          size: properties.squareFeet,
          bedrooms: properties.bedrooms,
        }[filters.sortBy];

        if (sortColumn) {
          query = filters.sortOrder === 'asc' ? query.orderBy(asc(sortColumn)) : query.orderBy(desc(sortColumn));
        }
      }
    } else {
      query = query.orderBy(desc(properties.createdAt));
    }

    // Pagination
    if (limit !== undefined) {
      const boundedLimit = Math.min(100, Math.max(0, Math.trunc(limit)));
      query = query.limit(boundedLimit);
    }
    if (offset !== undefined) {
      const boundedOffset = Math.max(0, Math.trunc(offset));
      query = query.offset(boundedOffset);
    }

    const results = await query;

    const normalizedResults = results.map(normalizePropertyRecord);
    const finalResults = filters.requireValidCoordinates
      ? normalizedResults.filter(prop => {
          const hasValidCoords = typeof prop.latitude === "number" && typeof prop.longitude === "number";
          if (!hasValidCoords) {
            console.log(`Filtering out property ${prop.id} "${prop.title}" - invalid coordinates: lat=${prop.latitude}, lng=${prop.longitude}`);
          }
          return hasValidCoords;
        })
      : normalizedResults;

    if (filters.requireValidCoordinates) {
      console.log(`Retrieved ${finalResults.length} valid properties from database (filtered from ${results.length} total)`);
    } else {
      console.log(`Retrieved ${finalResults.length} properties from database`);
    }

    cacheService.set(cacheKey, finalResults, 5 * 60 * 1000);

    return finalResults;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const latitude = parseCoordinate(property.latitude);
    const longitude = parseCoordinate(property.longitude);
    const normalizedLatitude = latitude ?? null;
    const normalizedLongitude = longitude ?? null;
    const geomValue = buildGeomValue(normalizedLatitude, normalizedLongitude);

    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        latitude: normalizedLatitude,
        longitude: normalizedLongitude,
        geom: geomValue,
      })
      .returning();

    cacheService.invalidatePrefix('properties');

    return normalizePropertyRecord(newProperty);
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const updatePayload: Partial<InsertProperty> & { geom?: SQL } = { ...updates };

    let latitude: number | null | undefined;
    if (Object.prototype.hasOwnProperty.call(updates, "latitude")) {
      latitude = parseCoordinate(updates.latitude);
      if (latitude !== undefined) {
        updatePayload.latitude = latitude;
      } else {
        delete updatePayload.latitude;
      }
    }

    let longitude: number | null | undefined;
    if (Object.prototype.hasOwnProperty.call(updates, "longitude")) {
      longitude = parseCoordinate(updates.longitude);
      if (longitude !== undefined) {
        updatePayload.longitude = longitude;
      } else {
        delete updatePayload.longitude;
      }
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

    cacheService.invalidatePrefix('properties');

    return normalizePropertyRecord(property);
  }

  async deleteProperty(id: number): Promise<boolean> {
    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning({ id: properties.id });
    if (deleted.length > 0) {
      cacheService.invalidatePrefix('properties');
      return true;
    }
    return false;
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    const userProps = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, userId))
      .orderBy(desc(properties.createdAt));

    return userProps.map(normalizePropertyRecord);
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db
      .update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }
}

/**
 * Shared singleton instance used throughout the application.
 */
export const propertyRepository = new PropertyRepository();