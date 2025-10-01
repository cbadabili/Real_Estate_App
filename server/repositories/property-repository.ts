import {
  properties,
  type Property,
  type InsertProperty,
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

type PropertyInsertRecord = typeof properties.$inferInsert;

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
  if (latitude === undefined && longitude === undefined) {
    return undefined;
  }

  if (latitude === null || longitude === null) {
    return sql`NULL`;
  }

  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
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
type PropertyInsert = InsertProperty & { latitude?: unknown; longitude?: unknown };

export interface IPropertyRepository {
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: PropertyInsert): Promise<Property>;
  updateProperty(id: number, updates: Partial<PropertyInsert>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getUserProperties(userId: number): Promise<Property[]>;
  incrementPropertyViews(id: number): Promise<void>;
}

/**
 * Drizzle-backed implementation of the property repository. Handles
 * normalization, caching, search, and spatial updates.
 */
export class PropertyRepository implements IPropertyRepository {
  /**
   * Look up a single property by its identifier.
   *
   * @param id - Unique identifier of the property to retrieve.
   * @returns The normalized property or `undefined` when no match exists.
   */
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    if (!property) {
      return undefined;
    }
    return normalizePropertyRecord(property);
  }

  /**
   * Fetch a page of properties matching the provided filters. Results are cached
   * briefly to reduce load on popular queries.
   *
   * @param filters - Optional constraints for price, beds/baths, sort order, etc.
   * @returns An array of normalized properties ready for API consumption.
   */
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

    const baseQuery = db.select().from(properties);
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
    const searchTerm = filters.searchTerm ?? filters.location ?? filters.address ?? filters.title;
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      if (term.length >= 2) {
        const tsQuery = sql`plainto_tsquery('english', ${term})`;
        conditions.push(sql`${properties.fts} @@ ${tsQuery}`);
        orderings.push(sql`ts_rank_cd(${properties.fts}, ${tsQuery}) DESC`);
      } else {
        const fallbackSearch = or(
          ilike(properties.title, `%${term}%`),
          ilike(properties.description, `%${term}%`),
          ilike(properties.address, `%${term}%`),
          ilike(properties.city, `%${term}%`)
        );

        if (fallbackSearch) {
          conditions.push(fallbackSearch);
        }
      }
    } else if (filters.location) {
      const locationTerm = filters.location.trim();
      if (locationTerm) {
        const locationSearch = or(
          ilike(properties.city, `%${locationTerm}%`),
          ilike(properties.address, `%${locationTerm}%`),
          ilike(properties.title, `%${locationTerm}%`),
          ilike(properties.description, `%${locationTerm}%`)
        );

        if (locationSearch) {
          conditions.push(locationSearch);
        }
      }
    }

    const cityTerm = filters.city?.trim();
    if (cityTerm) {
      conditions.push(eq(properties.city, cityTerm));
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

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const queryWithWhere = whereClause ? baseQuery.where(whereClause) : baseQuery;

    let sortOrderings: SQL[] = [];

    if (orderings.length > 0) {
      sortOrderings = [...orderings, desc(properties.createdAt)];
    } else if (filters.sortBy) {
      const legacySortOptions = {
        price_low: { column: properties.price, direction: "asc" as const },
        price_high: { column: properties.price, direction: "desc" as const },
        newest: { column: properties.createdAt, direction: "desc" as const },
      } as const;

      if (filters.sortBy in legacySortOptions) {
        const legacySort = legacySortOptions[filters.sortBy as keyof typeof legacySortOptions];
        sortOrderings = [
          legacySort.direction === "asc" ? asc(legacySort.column) : desc(legacySort.column),
        ];
      } else {
        const sortKeyMap = {
          price: properties.price,
          date: properties.createdAt,
          size: properties.squareFeet,
          bedrooms: properties.bedrooms,
        } as const;

        const sortKey = filters.sortBy as keyof typeof sortKeyMap;

        if (sortKey && sortKey in sortKeyMap) {
          const column = sortKeyMap[sortKey];
          sortOrderings = [
            filters.sortOrder === "asc" ? asc(column) : desc(column),
          ];
        }
      }
    }

    if (sortOrderings.length === 0) {
      sortOrderings = [desc(properties.createdAt)];
    }

    const queryWithOrder = queryWithWhere.orderBy(...sortOrderings);

    const queryWithLimit = limit !== undefined
      ? queryWithOrder.limit(Math.min(100, Math.max(0, Math.trunc(limit))))
      : queryWithOrder;

    const finalQuery = offset !== undefined
      ? queryWithLimit.offset(Math.max(0, Math.trunc(offset)))
      : queryWithLimit;

    const results = await finalQuery;

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

  /**
   * Persist a new property and compute its spatial geometry when coordinates are provided.
   *
   * @param property - Property attributes supplied by the caller.
   * @returns The inserted property with normalization applied.
   */
  async createProperty(property: PropertyInsert): Promise<Property> {
    const latitude = parseCoordinate(property.latitude);
    const longitude = parseCoordinate(property.longitude);
    const normalizedLatitude = latitude ?? null;
    const normalizedLongitude = longitude ?? null;
    const geomValue = buildGeomValue(normalizedLatitude, normalizedLongitude);

    const insertPayload: PropertyInsertRecord = {
      ...property,
      latitude: normalizedLatitude ?? undefined,
      longitude: normalizedLongitude ?? undefined,
      geom: geomValue === null ? null : geomValue ?? undefined,
    };

    const [newProperty] = await db
      .insert(properties)
      .values(insertPayload)
      .returning();

    cacheService.invalidatePrefix('properties');

    return normalizePropertyRecord(newProperty);
  }

  /**
   * Apply partial updates to an existing property, recalculating geometry when
   * coordinates change.
   *
   * @param id - Unique identifier of the property to update.
   * @param updates - Subset of property fields to change.
   * @returns The updated property or `undefined` when no record matches.
   */
  async updateProperty(id: number, updates: Partial<PropertyInsert>): Promise<Property | undefined> {
    const updatePayload: Partial<PropertyInsertRecord> = { ...updates };

    // Always recompute geometry from the provided coordinates rather than trusting caller input
    if ("geom" in updatePayload) {
      delete (updatePayload as { geom?: unknown }).geom;
    }

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

    const geomUpdate = buildGeomUpdateValue(latitude, longitude);
    if (geomUpdate !== undefined) {
      (updatePayload as { geom?: SQL<unknown> | null }).geom = geomUpdate;
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

  /**
   * Remove a property record.
   *
   * @param id - Identifier of the property to delete.
   * @returns True when a record was deleted, otherwise false.
   */
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

  /**
   * Retrieve all properties owned by a specific user ordered by recency.
   *
   * @param userId - Identifier for the owning user.
   * @returns The normalized property list.
   */
  async getUserProperties(userId: number): Promise<Property[]> {
    const userProps = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, userId))
      .orderBy(desc(properties.createdAt));

    return userProps.map(normalizePropertyRecord);
  }

  /**
   * Increment the view counter for a property atomically.
   *
   * @param id - Identifier of the property that was viewed.
   */
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