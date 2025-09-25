import {
  inquiries,
  appointments,
  savedProperties,
  properties,
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type Appointment,
  type InsertAppointment,
  type SavedProperty
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import { userRepository, type IUserRepository } from "./repositories/user-repository";
import { propertyRepository, type IPropertyRepository } from "./repositories/property-repository";

type PropertyFilters = Parameters<IPropertyRepository["getProperties"]>[0];

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

const normalizePrice = (value: unknown): number => {
  let normalized: number | undefined;

  if (typeof value === "number" && Number.isFinite(value)) {
    normalized = value;
  } else if (typeof value === "string") {
    const cleaned = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(cleaned)) {
      normalized = cleaned;
    }
  }

  if (!Number.isFinite(normalized)) {
    return 0;
  }

  const clamped = Math.max(0, normalized as number);
  return Math.round(clamped * 100) / 100;
};

/**
 * Contract for the storage layer that fronts repositories and raw Drizzle operations.
 */
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
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

/**
 * Database-backed storage implementation delegating to domain repositories where possible.
 */
export class DatabaseStorage implements IStorage {
  private userRepo: IUserRepository;
  private propertyRepo: IPropertyRepository;

  constructor() {
    this.userRepo = userRepository;
    this.propertyRepo = propertyRepository;
  }

  // User methods - delegate to user repository
  async getUser(id: number): Promise<User | undefined> {
    return this.userRepo.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepo.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.getUserByEmail(email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepo.getUserById(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.userRepo.createUser(insertUser);
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.userRepo.updateUser(id, updates);
  }

  async getUsers(filters: { userType?: string; isActive?: boolean; limit?: number; offset?: number } = {}): Promise<User[]> {
    return this.userRepo.getUsers(filters);
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.propertyRepo.getProperty(id);
  }

  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    return this.propertyRepo.getProperties(filters);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return this.propertyRepo.createProperty(property);
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    return this.propertyRepo.updateProperty(id, updates);
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.propertyRepo.deleteProperty(id);
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    return this.propertyRepo.getUserProperties(userId);
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await this.propertyRepo.incrementPropertyViews(id);
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

  async getPropertyAppointments(propertyId: number): Promise<Appointment[]>{
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
        currency: properties.currency,
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
      price: normalizePrice(prop.price),
      images: Array.isArray(prop.images) ? prop.images : normalizeStringArray(prop.images),
      features: Array.isArray(prop.features) ? prop.features : normalizeStringArray(prop.features),
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

/**
 * Singleton storage adapter used by the application.
 */
export const storage = new DatabaseStorage();