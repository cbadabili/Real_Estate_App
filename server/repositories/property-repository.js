import { properties } from "../../shared/schema";
import { db } from "../db";
import { eq, and, desc, asc, gte, lte, like, or, sql } from "drizzle-orm";
export class PropertyRepository {
    async getProperty(id) {
        const [property] = await db.select().from(properties).where(eq(properties.id, id));
        return property || undefined;
    }
    async getProperties(filters = {}) {
        let query = db.select().from(properties);
        const conditions = [];
        if (filters.minPrice) {
            conditions.push(gte(properties.price, filters.minPrice.toString()));
        }
        if (filters.maxPrice) {
            conditions.push(lte(properties.price, filters.maxPrice.toString()));
        }
        if (filters.propertyType && filters.propertyType !== 'all') {
            conditions.push(eq(properties.propertyType, filters.propertyType));
        }
        if (filters.minBedrooms) {
            conditions.push(gte(properties.bedrooms, filters.minBedrooms));
        }
        if (filters.minBathrooms) {
            conditions.push(gte(properties.bathrooms, filters.minBathrooms.toString()));
        }
        if (filters.minSquareFeet) {
            conditions.push(gte(properties.squareFeet, filters.minSquareFeet));
        }
        if (filters.maxSquareFeet) {
            conditions.push(lte(properties.squareFeet, filters.maxSquareFeet));
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
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        if (filters.offset) {
            query = query.offset(filters.offset);
        }
        const results = await query;
        // Filter out properties with invalid coordinates
        const validResults = results.filter(prop => {
            const hasValidCoords = prop.latitude !== null &&
                prop.longitude !== null &&
                prop.latitude !== '' &&
                prop.longitude !== '' &&
                !isNaN(parseFloat(prop.latitude)) &&
                !isNaN(parseFloat(prop.longitude));
            if (!hasValidCoords) {
                console.log(`Filtering out property ${prop.id} "${prop.title}" - invalid coordinates: lat=${prop.latitude}, lng=${prop.longitude}`);
            }
            return hasValidCoords;
        });
        const processedResults = validResults.map(prop => {
            const processed = {
                ...prop,
                images: prop.images ? JSON.parse(prop.images) : [],
                features: prop.features ? (Array.isArray(JSON.parse(prop.features)) ? JSON.parse(prop.features) :
                    typeof JSON.parse(prop.features) === 'string' ? [JSON.parse(prop.features)] : []) : [],
            };
            console.log(`Property ${processed.id}: lat=${processed.latitude}, lng=${processed.longitude}, type=${processed.propertyType}`);
            return processed;
        });
        console.log(`Retrieved ${processedResults.length} valid properties from database (filtered from ${results.length} total)`);
        return processedResults;
    }
    async createProperty(property) {
        const propertyData = {
            ...property,
            images: property.images ? JSON.stringify(property.images) : null,
            features: property.features ? JSON.stringify(property.features) : null,
        };
        const [newProperty] = await db
            .insert(properties)
            .values(propertyData)
            .returning();
        return {
            ...newProperty,
            images: newProperty.images ? JSON.parse(newProperty.images) : [],
            features: newProperty.features ? JSON.parse(newProperty.features) : [],
        };
    }
    async updateProperty(id, updates) {
        const updateData = { ...updates };
        if (updates.images) {
            updateData.images = JSON.stringify(updates.images);
        }
        if (updates.features) {
            updateData.features = JSON.stringify(updates.features);
        }
        const [property] = await db
            .update(properties)
            .set({ ...updateData, updatedAt: Math.floor(Date.now() / 1000) })
            .where(eq(properties.id, id))
            .returning();
        if (!property)
            return undefined;
        return {
            ...property,
            images: property.images ? JSON.parse(property.images) : [],
            features: property.features ? JSON.parse(property.features) : [],
        };
    }
    async deleteProperty(id) {
        const deleted = await db
            .delete(properties)
            .where(eq(properties.id, id))
            .returning({ id: properties.id });
        return deleted.length > 0;
    }
    async getUserProperties(userId) {
        const userProps = await db
            .select()
            .from(properties)
            .where(eq(properties.ownerId, userId))
            .orderBy(desc(properties.createdAt));
        return userProps.map(prop => ({
            ...prop,
            images: prop.images ? JSON.parse(prop.images) : [],
            features: prop.features ? JSON.parse(prop.features) : [],
        }));
    }
    async incrementPropertyViews(id) {
        await db
            .update(properties)
            .set({ views: sql `${properties.views} + 1` })
            .where(eq(properties.id, id));
    }
}
export const propertyRepository = new PropertyRepository();
