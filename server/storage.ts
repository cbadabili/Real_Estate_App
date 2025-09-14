import { 
  users, 
  properties, 
  inquiries, 
  appointments, 
  savedProperties,
  type User, 
  type InsertUser,
  type Property,
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type Appointment,
  type InsertAppointment,
  type SavedProperty,
  type InsertSavedProperty
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, like, or, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsers(filters?: { userType?: string; isActive?: boolean; limit?: number; offset?: number }): Promise<User[]>;

  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getUserProperties(userId: number): Promise<Property[]>;
  incrementPropertyViews(id: number): Promise<void>;

  // Inquiry methods
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getPropertyInquiries(propertyId: number): Promise<Inquiry[]>;
  getUserInquiries(userId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined>;

  // Appointment methods
  getAppointment(id: number): Promise<Appointment | undefined>;
  getPropertyAppointments(propertyId: number): Promise<Appointment[]>;
  getUserAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;

  // Saved properties methods
  getSavedProperties(userId: number): Promise<Property[]>;
  saveProperty(userId: number, propertyId: number): Promise<SavedProperty>;
  unsaveProperty(userId: number, propertyId: number): Promise<boolean>;
  isPropertySaved(userId: number, propertyId: number): Promise<boolean>;
}

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
  listingType?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'date' | 'size' | 'bedrooms';
  sortOrder?: 'asc' | 'desc';
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      // Handle timestamp conversion for any timestamp fields
      const processedUpdates = { ...updates };

      // Handle all timestamp fields properly
      const timestampFields = ['lastLoginAt', 'createdAt', 'updatedAt'];

      for (const field of timestampFields) {
        if (processedUpdates[field] !== undefined) {
          const value = processedUpdates[field];
          if (value instanceof Date) {
            processedUpdates[field] = Math.floor(value.getTime() / 1000);
          } else if (typeof value === 'number') {
            // If it's already a number, ensure it's in seconds, not milliseconds
            if (value > 1000000000000) {
              processedUpdates[field] = Math.floor(value / 1000);
            }
            // If it's already a reasonable timestamp in seconds, leave it as is
          }
        }
      }

      const [user] = await db
        .update(users)
        .set({ 
          ...processedUpdates, 
          updatedAt: Math.floor(Date.now() / 1000) 
        })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getUsers(filters: { userType?: string; isActive?: boolean; limit?: number; offset?: number } = {}): Promise<User[]> {
    let query = db.select().from(users);

    const conditions = [];
    if (filters.userType) {
      conditions.push(eq(users.userType, filters.userType));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
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
    if (filters.city) {
      conditions.push(
        or(
          like(properties.city, `%${filters.city}%`),
          like(properties.address, `%${filters.city}%`)
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

    // Parse JSON strings back to arrays and add debug logging
    const processedResults = results.map(prop => {
      const processed = {
        ...prop,
        images: prop.images ? JSON.parse(prop.images) : [],
        features: prop.features ? (
          Array.isArray(JSON.parse(prop.features)) ? JSON.parse(prop.features) : 
          typeof JSON.parse(prop.features) === 'string' ? [JSON.parse(prop.features)] : []
        ) : [],
      };

      // Debug coordinate data
      console.log(`Property ${processed.id}: lat=${processed.latitude}, lng=${processed.longitude}, type=${processed.propertyType}`);

      return processed;
    });

    console.log(`Retrieved ${processedResults.length} properties from database`);
    return processedResults;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    // Convert arrays to JSON strings for SQLite
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

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    // Convert arrays to JSON strings for SQLite
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

    if (!property) return undefined;

    // Parse JSON strings back to arrays
    return {
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      features: property.features ? JSON.parse(property.features) : [],
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

    // Parse JSON strings back to arrays
    return userProps.map(prop => ({
      ...prop,
      images: prop.images ? JSON.parse(prop.images) : [],
      features: prop.features ? JSON.parse(prop.features) : [],
    }));
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db
      .update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }

  // Inquiry methods
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async getPropertyInquiries(propertyId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId))
      .orderBy(desc(inquiries.createdAt));
  }

  async getUserInquiries(userId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.buyerId, userId))
      .orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry || undefined;
  }

  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getPropertyAppointments(propertyId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.propertyId, propertyId))
      .orderBy(asc(appointments.appointmentDate));
  }

  async getUserAppointments(userId: number): Promise<Appointment[]>{
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.buyerId, userId))
      .orderBy(asc(appointments.appointmentDate));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  // Saved properties methods
  async getSavedProperties(userId: number): Promise<Property[]> {
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

  async saveProperty(userId: number, propertyId: number): Promise<SavedProperty> {
    const [saved] = await db
      .insert(savedProperties)
      .values({ userId, propertyId })
      .returning();
    return saved;
  }

  async unsaveProperty(userId: number, propertyId: number): Promise<boolean> {
    const result = await db
      .delete(savedProperties)
      .where(and(
        eq(savedProperties.userId, userId),
        eq(savedProperties.propertyId, propertyId)
      ))
      .returning({ id: savedProperties.id });
    return result.length > 0;
  }

  async isPropertySaved(userId: number, propertyId: number): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedProperties)
      .where(and(
        eq(savedProperties.userId, userId),
        eq(savedProperties.propertyId, propertyId)
      ))
      .limit(1);
    return !!saved;
  }
}

export const storage = new DatabaseStorage();