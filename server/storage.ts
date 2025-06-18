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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, like, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

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
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
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
    if (filters.propertyType) {
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
      conditions.push(like(properties.city, `%${filters.city}%`));
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
      query = query.where(and(...conditions)) as any;
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
        query = query.orderBy(filters.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)) as any;
      }
    } else {
      query = query.orderBy(desc(properties.createdAt)) as any;
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        price: property.price.toString(),
        bathrooms: property.bathrooms?.toString(),
        latitude: property.latitude?.toString(),
        longitude: property.longitude?.toString(),
        lotSize: property.lotSize?.toString(),
        propertyTaxes: property.propertyTaxes?.toString(),
        hoaFees: property.hoaFees?.toString(),
      } as any)
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const updateData = { ...updates } as any;
    if (updates.price !== undefined) updateData.price = updates.price.toString();
    if (updates.bathrooms !== undefined) updateData.bathrooms = updates.bathrooms?.toString();
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude?.toString();
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude?.toString();
    if (updates.lotSize !== undefined) updateData.lotSize = updates.lotSize?.toString();
    if (updates.propertyTaxes !== undefined) updateData.propertyTaxes = updates.propertyTaxes?.toString();
    if (updates.hoaFees !== undefined) updateData.hoaFees = updates.hoaFees?.toString();
    
    const [property] = await db
      .update(properties)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, userId))
      .orderBy(desc(properties.createdAt));
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

  async getUserAppointments(userId: number): Promise<Appointment[]> {
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
    return await db
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
      ));
    return (result.rowCount || 0) > 0;
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
