import { inquiries, appointments, savedProperties, properties } from "../shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, lte, and, or, ilike, sql } from "drizzle-orm";
import { userRepository } from "./repositories/user-repository";
import { propertyRepository } from "./repositories/property-repository";
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
            conditions.push(sql `CAST(${properties.price} AS REAL) >= ${filters.minPrice}`);
        }
        if (filters.maxPrice !== undefined) {
            conditions.push(sql `CAST(${properties.price} AS REAL) <= ${filters.maxPrice}`);
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
            query = query.orderBy(sql `CAST(${properties.price} AS REAL) ASC`);
        }
        else if (filters.sortBy === 'price_high') {
            query = query.orderBy(sql `CAST(${properties.price} AS REAL) DESC`);
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
        // Filter out properties with invalid coordinates before processing
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
        // Parse JSON strings back to arrays and add debug logging
        const processedResults = validResults.map(prop => {
            const processed = {
                ...prop,
                images: prop.images ? JSON.parse(prop.images) : [],
                features: prop.features ? (Array.isArray(JSON.parse(prop.features)) ? JSON.parse(prop.features) :
                    typeof JSON.parse(prop.features) === 'string' ? [JSON.parse(prop.features)] : []) : [],
            };
            // Debug coordinate data
            console.log(`Property ${processed.id}: lat=${processed.latitude}, lng=${processed.longitude}, type=${processed.propertyType}`);
            return processed;
        });
        console.log(`Retrieved ${processedResults.length} valid properties from database (filtered from ${results.length} total)`);
        return processedResults;
    }
    async createProperty(property) {
        // Normalize array fields before persisting
        const propertyData = {
            ...property,
            images: property.images ? JSON.stringify(property.images) : null,
            features: property.features ? JSON.stringify(property.features) : null,
        };
        const [newProperty] = await db
            .insert(properties)
            .values(propertyData)
            .returning();
        // Parse JSON strings back to arrays
        return {
            ...newProperty,
            images: newProperty.images ? JSON.parse(newProperty.images) : [],
            features: newProperty.features ? JSON.parse(newProperty.features) : [],
        };
    }
    async updateProperty(id, updates) {
        // Normalize array fields before persisting
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
        // Parse JSON strings back to arrays
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
        // Parse JSON strings back to arrays
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
            .where(eq(appointment.id, id))
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
        // Parse JSON strings back to arrays
        return savedProps.map(prop => ({
            ...prop,
            images: prop.images ? JSON.parse(prop.images) : [],
            features: prop.features ? JSON.parse(prop.features) : [],
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
