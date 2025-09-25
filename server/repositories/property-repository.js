import { properties } from "../../shared/schema";
import { db } from "../db";
import { eq, and, desc, asc, gte, lte, like, or, sql } from "drizzle-orm";
import { cacheService, CacheService } from "../cache-service";
const normalizeStringArray = (value) => {
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
        }
        catch {
            return [trimmed];
        }
    }
    return [String(value)];
};
const normalizeNumeric = (value) => {
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
const parseCoordinate = (value) => {
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
const buildGeomValue = (latitude, longitude) => {
    if (latitude === null || longitude === null) {
        return null;
    }
    return sql `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
};
const buildGeomUpdateValue = (latitude, longitude) => {
    const latitudeExpression = latitude === undefined
        ? sql `${properties.latitude}`
        : latitude === null
            ? sql `NULL`
            : sql `${latitude}`;
    const longitudeExpression = longitude === undefined
        ? sql `${properties.longitude}`
        : longitude === null
            ? sql `NULL`
            : sql `${longitude}`;
    return sql `CASE
    WHEN ${latitudeExpression} IS NULL OR ${longitudeExpression} IS NULL THEN NULL
    ELSE ST_SetSRID(ST_MakePoint(${longitudeExpression}, ${latitudeExpression}), 4326)
  END`;
};
const toFiniteNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};
const normalizePropertyRecord = (prop) => {
    const lat = typeof prop.latitude === "number" ? prop.latitude : Number(prop.latitude);
    const lng = typeof prop.longitude === "number" ? prop.longitude : Number(prop.longitude);
    return {
        ...prop,
        price: normalizeNumeric(prop.price),
        images: normalizeStringArray(prop.images),
        features: normalizeStringArray(prop.features),
        latitude: Number.isFinite(lat) ? lat : null,
        longitude: Number.isFinite(lng) ? lng : null,
    };
};
export class PropertyRepository {
    async getProperty(id) {
        const [property] = await db.select().from(properties).where(eq(properties.id, id));
        if (!property) {
            return undefined;
        }
        return normalizePropertyRecord(property);
    }
    async getProperties(filters = {}) {
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
        const cached = cacheService.get(cacheKey);
        if (cached) {
            console.log('Properties served from cache');
            return cached;
        }
        let query = db.select().from(properties);
        const conditions = [];
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
        if (filters.city || filters.location) {
            const searchTerm = filters.location || filters.city;
            conditions.push(or(like(properties.city, `%${searchTerm}%`), like(properties.address, `%${searchTerm}%`), like(properties.title, `%${searchTerm}%`), like(properties.description, `%${searchTerm}%`)));
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
        }
        else {
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
        }
        else {
            console.log(`Retrieved ${finalResults.length} properties from database`);
        }
        cacheService.set(cacheKey, finalResults, 5 * 60 * 1000);
        return finalResults;
    }
    async createProperty(property) {
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
        cacheService.invalidatePrefix('properties');
        return normalizePropertyRecord(newProperty);
    }
    async updateProperty(id, updates) {
        const updatePayload = { ...updates };
        let latitude;
        if (Object.prototype.hasOwnProperty.call(updates, "latitude")) {
            latitude = parseCoordinate(updates.latitude);
            updatePayload.latitude = latitude;
        }
        let longitude;
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
        if (!property)
            return undefined;
        cacheService.invalidatePrefix('properties');
        return normalizePropertyRecord(property);
    }
    async deleteProperty(id) {
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
    async getUserProperties(userId) {
        const userProps = await db
            .select()
            .from(properties)
            .where(eq(properties.ownerId, userId))
            .orderBy(desc(properties.createdAt));
        return userProps.map(normalizePropertyRecord);
    }
    async incrementPropertyViews(id) {
        await db
            .update(properties)
            .set({ views: sql `${properties.views} + 1` })
            .where(eq(properties.id, id));
    }
}
export const propertyRepository = new PropertyRepository();
