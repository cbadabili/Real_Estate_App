import { inquiries, appointments, savedProperties, properties } from "../shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, lte, and, or, ilike, sql } from "drizzle-orm";
import { userRepository } from "./repositories/user-repository";
import { propertyRepository } from "./repositories/property-repository";
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
export class DatabaseStorage {
    constructor() {
        this.userRepo = userRepository;
        this.propertyRepo = propertyRepository;
    }
    // User methods - delegate to user repository
    async getUser(id) {
        return this.userRepo.getUser(id);
    }
    async getUserByUsername(username) {
        return this.userRepo.getUserByUsername(username);
    }
    async getUserByEmail(email) {
        return this.userRepo.getUserByEmail(email);
    }
    async getUserById(id) {
        return this.userRepo.getUserById(id);
    }
    async createUser(insertUser) {
        return this.userRepo.createUser(insertUser);
    }
    async updateUser(id, updates) {
        return this.userRepo.updateUser(id, updates);
    }
    async getUsers(filters = {}) {
        return this.userRepo.getUsers(filters);
    }
    // Property methods
    async getProperty(id) {
        const [property] = await db.select().from(properties).where(eq(properties.id, id));
        return property || undefined;
    }
    async getProperties(filters = {}) {
        let query = db.select().from(properties);
        const conditions = [];
        // Apply filters with numeric price comparison
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
        // Apply filters
        if (filters.location) {
            // Search across multiple location fields for better matching
            conditions.push(or(ilike(properties.title, `%${filters.location}%`), ilike(properties.description, `%${filters.location}%`), ilike(properties.address, `%${filters.location}%`), ilike(properties.city, `%${filters.location}%`), ilike(properties.state, `%${filters.location}%`), ilike(properties.areaText, `%${filters.location}%`), ilike(properties.placeName, `%${filters.location}%`)));
        }
        else {
            // Only apply specific location filters if no general location search
            if (filters.city) {
                conditions.push(ilike(properties.city, `%${filters.city}%`));
            }
            if (filters.state) {
                conditions.push(ilike(properties.state, `%${filters.state}%`));
            }
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
        // Apply sorting with numeric price ordering
        if (filters.sortBy === 'price_low') {
            query = query.orderBy(asc(properties.price));
        }
        else if (filters.sortBy === 'price_high') {
            query = query.orderBy(desc(properties.price));
        }
        else if (filters.sortBy === 'newest') {
            query = query.orderBy(desc(properties.createdAt));
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
        return processedResults;
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
    return {
        ...newProperty,
        price: normalizeNumeric(newProperty.price),
        images: normalizeStringArray(newProperty.images),
        features: normalizeStringArray(newProperty.features),
        };
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
        return {
            ...property,
            price: normalizeNumeric(property.price),
            images: normalizeStringArray(property.images),
            features: normalizeStringArray(property.features),
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
            price: normalizeNumeric(prop.price),
            images: normalizeStringArray(prop.images),
            features: normalizeStringArray(prop.features),
        }));
    }
    async incrementPropertyViews(id) {
        await db
            .update(properties)
            .set({ views: sql `${properties.views} + 1` })
            .where(eq(properties.id, id));
    }
    // Inquiry methods
    async getInquiry(id) {
        const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
        return inquiry || undefined;
    }
    async getPropertyInquiries(propertyId) {
        return await db
            .select()
            .from(inquiries)
            .where(eq(inquiries.propertyId, propertyId))
            .orderBy(desc(inquiries.createdAt));
    }
    async getUserInquiries(userId) {
        return await db
            .select()
            .from(inquiries)
            .where(eq(inquiries.buyerId, userId))
            .orderBy(desc(inquiries.createdAt));
    }
    async createInquiry(inquiry) {
        const [newInquiry] = await db
            .insert(inquiries)
            .values(inquiry)
            .returning();
        return newInquiry;
    }
    async updateInquiryStatus(id, status) {
        const [inquiry] = await db
            .update(inquiries)
            .set({ status })
            .where(eq(inquiries.id, id))
            .returning();
        return inquiry || undefined;
    }
    // Appointment methods
    async getAppointment(id) {
        const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
        return appointment || undefined;
    }
    async getPropertyAppointments(propertyId) {
        return await db
            .select()
            .from(appointments)
            .where(eq(appointments.propertyId, propertyId))
            .orderBy(asc(appointments.appointmentDate));
    }
    async getUserAppointments(userId) {
        return await db
            .select()
            .from(appointments)
            .where(eq(appointments.buyerId, userId))
            .orderBy(asc(appointments.appointmentDate));
    }
    async createAppointment(appointment) {
        const [newAppointment] = await db
            .insert(appointments)
            .values(appointment)
            .returning();
        return newAppointment;
    }
    async updateAppointmentStatus(id, status) {
        const [appointment] = await db
            .update(appointments)
            .set({ status })
            .where(eq(appointments.id, id))
            .returning();
        return appointment || undefined;
    }
    // Saved properties methods
    async getSavedProperties(userId) {
        const savedProps = await db
            .select({
            id: properties.id,
            title: properties.title,
            description: properties.description,
            price: properties.price,
            address: properties.address,
            city: properties.city,
            state: properties.state,
            zipCode: properties.zipCode,
            latitude: properties.latitude,
            longitude: properties.longitude,
            propertyType: properties.propertyType,
            listingType: properties.listingType,
            bedrooms: properties.bedrooms,
            bathrooms: properties.bathrooms,
            squareFeet: properties.squareFeet,
            lotSize: properties.lotSize,
            yearBuilt: properties.yearBuilt,
            status: properties.status,
            images: properties.images,
            features: properties.features,
            virtualTourUrl: properties.virtualTourUrl,
            videoUrl: properties.videoUrl,
            propertyTaxes: properties.propertyTaxes,
            hoaFees: properties.hoaFees,
            ownerId: properties.ownerId,
            agentId: properties.agentId,
            views: properties.views,
            daysOnMarket: properties.daysOnMarket,
            createdAt: properties.createdAt,
            updatedAt: properties.updatedAt,
        })
            .from(savedProperties)
            .innerJoin(properties, eq(savedProperties.propertyId, properties.id))
            .where(eq(savedProperties.userId, userId))
            .orderBy(desc(savedProperties.createdAt));
        return savedProps.map(prop => ({
            ...prop,
            price: normalizeNumeric(prop.price),
            images: normalizeStringArray(prop.images),
            features: normalizeStringArray(prop.features),
        }));
    }
    async saveProperty(userId, propertyId) {
        const [saved] = await db
            .insert(savedProperties)
            .values({ userId, propertyId })
            .returning();
        return saved;
    }
    async unsaveProperty(userId, propertyId) {
        const result = await db
            .delete(savedProperties)
            .where(and(eq(savedProperties.userId, userId), eq(savedProperties.propertyId, propertyId)))
            .returning({ id: savedProperties.id });
        return result.length > 0;
    }
    async isPropertySaved(userId, propertyId) {
        const [saved] = await db
            .select()
            .from(savedProperties)
            .where(and(eq(savedProperties.userId, userId), eq(savedProperties.propertyId, propertyId)))
            .limit(1);
        return !!saved;
    }
}
export const storage = new DatabaseStorage();
