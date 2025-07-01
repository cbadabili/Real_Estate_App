import { 
  users, 
  properties,
  type User, 
  type InsertUser,
  type Property,
  type InsertProperty
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
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getUsers(filters: { userType?: string; isActive?: boolean; limit?: number; offset?: number } = {}): Promise<User[]> {
    if (!db) return [];
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
    if (!db) return undefined;
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    if (!db) return [];
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

    const result = await query;
    
    // Parse JSON strings back to arrays
    return result.map(prop => ({
      ...prop,
      images: prop.images ? JSON.parse(prop.images) : [],
      features: prop.features ? JSON.parse(prop.features) : [],
    }));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    if (!db) throw new Error("Database not initialized");
    
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
    if (!db) return undefined;
    
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
      .set({ ...updateData, updatedAt: new Date() })
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
    if (!db) return false;
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.changes > 0;
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    if (!db) return [];
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
    if (!db) return;
    await db
      .update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }
}

export const storage = new DatabaseStorage();