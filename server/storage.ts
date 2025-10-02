import {
  inquiries,
  appointments,
  savedProperties,
  properties,
  users,
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
import { eq, desc, asc, and, count } from "drizzle-orm";
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
  countUsers(): Promise<number>;

  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getUserProperties(userId: number): Promise<Property[]>;
  incrementPropertyViews(id: number): Promise<void>;
  countProperties(): Promise<number>;
  getSellerStats(userId: number): Promise<{ listed: number; sold: number; pending: number; totalValue: number }>;
  getAgentStats(userId: number): Promise<{ managed: number; clients: number; appointments: number; commission: number }>;

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
  /**
   * Fetch a user by their primary key.
   *
   * @param id - Unique identifier of the user.
   * @returns The matching user or undefined when not found.
   */
  async getUser(id: number): Promise<User | undefined> {
    return this.userRepo.getUser(id);
  }

  /**
   * Look up a user record by username.
   *
   * @param username - Username credential.
   * @returns The matching user or undefined when unavailable.
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepo.getUserByUsername(username);
  }

  /**
   * Retrieve a user using their email address.
   *
   * @param email - Email value supplied by the caller.
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.getUserByEmail(email);
  }

  /**
   * Alias for getUser to preserve historical API usage.
   */
  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepo.getUser(id);
  }

  /**
   * Persist a new user row.
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    return this.userRepo.createUser(insertUser);
  }

  /**
   * Apply partial updates to a user record.
   */
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.userRepo.updateUser(id, updates);
  }

  /**
   * Retrieve users filtered by optional criteria.
   */
  async getUsers(filters: { userType?: string; isActive?: boolean; limit?: number; offset?: number } = {}): Promise<User[]> {
    return this.userRepo.getUsers(filters);
  }

  async countUsers(): Promise<number> {
    const [result] = await db.select({ value: count() }).from(users);
    return Number(result?.value ?? 0);
  }

  // Property methods
  /**
   * Fetch a single property by ID.
   */
  async getProperty(id: number): Promise<Property | undefined> {
    return this.propertyRepo.getProperty(id);
  }

  /**
   * Return a list of properties matching filter constraints.
   */
  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    return this.propertyRepo.getProperties(filters);
  }

  /**
   * Create a property via the domain repository.
   */
  async createProperty(property: InsertProperty): Promise<Property> {
    return this.propertyRepo.createProperty(property);
  }

  /**
   * Update an existing property record.
   */
  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    return this.propertyRepo.updateProperty(id, updates);
  }

  /**
   * Remove a property record.
   */
  async deleteProperty(id: number): Promise<boolean> {
    return this.propertyRepo.deleteProperty(id);
  }

  /**
   * Fetch properties owned by a specific user.
   */
  async getUserProperties(userId: number): Promise<Property[]> {
    return this.propertyRepo.getUserProperties(userId);
  }

  /**
   * Increment view counters for engagement tracking.
   */
  async incrementPropertyViews(id: number): Promise<void> {
    await this.propertyRepo.incrementPropertyViews(id);
  }

  async countProperties(): Promise<number> {
    const [result] = await db.select({ value: count() }).from(properties);
    return Number(result?.value ?? 0);
  }

  async getSellerStats(userId: number): Promise<{ listed: number; sold: number; pending: number; totalValue: number }> {
    const sellerProperties = await this.propertyRepo.getUserProperties(userId);

    let sold = 0;
    let pending = 0;
    let totalValue = 0;

    for (const property of sellerProperties) {
      const price = Number(property.price ?? 0);
      if (Number.isFinite(price)) {
        totalValue += price;
      }

      const status = typeof property.status === 'string' ? property.status.toLowerCase() : '';
      if (status === 'sold') {
        sold += 1;
      } else if (status === 'pending') {
        pending += 1;
      }
    }

    return {
      listed: sellerProperties.length,
      sold,
      pending,
      totalValue,
    };
  }

  async getAgentStats(userId: number): Promise<{ managed: number; clients: number; appointments: number; commission: number }> {
    const agentProperties = await db
      .select({ id: properties.id, price: properties.price })
      .from(properties)
      .where(eq(properties.agentId, userId));

    const appointmentsForAgent = await db
      .select({ buyerId: appointments.buyerId })
      .from(appointments)
      .where(eq(appointments.agentId, userId));

    const clientIds = new Set<number>();
    for (const appointment of appointmentsForAgent) {
      if (appointment.buyerId != null) {
        clientIds.add(appointment.buyerId);
      }
    }

    const totalCommission = agentProperties.reduce((sum, property) => {
      const price = Number(property.price ?? 0);
      if (!Number.isFinite(price)) {
        return sum;
      }
      return sum + price * 0.03;
    }, 0);

    return {
      managed: agentProperties.length,
      clients: clientIds.size,
      appointments: appointmentsForAgent.length,
      commission: Number(totalCommission.toFixed(2)),
    };
  }

  // Inquiry methods
  /**
   * Retrieve a single inquiry.
   */
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  /**
   * List all inquiries for a property ordered by recency.
   */
  async getPropertyInquiries(propertyId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId))
      .orderBy(desc(inquiries.createdAt));
  }

  /**
   * List all inquiries for a specific buyer.
   */
  async getUserInquiries(userId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.buyerId, userId))
      .orderBy(desc(inquiries.createdAt));
  }

  /**
   * Create a new inquiry row.
   */
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  /**
   * Update the status of an inquiry.
   */
  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry || undefined;
  }

  // Appointment methods
  /**
   * Fetch a single appointment.
   */
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  /**
   * Retrieve appointments for a property sorted chronologically.
   */
  async getPropertyAppointments(propertyId: number): Promise<Appointment[]>{
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.propertyId, propertyId))
      .orderBy(asc(appointments.appointmentDate));
  }

  /**
   * List appointments belonging to a user.
   */
  async getUserAppointments(userId: number): Promise<Appointment[]>{
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.buyerId, userId))
      .orderBy(asc(appointments.appointmentDate));
  }

  /**
   * Schedule a new appointment.
   */
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  /**
   * Update appointment workflow status.
   */
  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  // Saved properties methods
  /**
   * Retrieve properties saved by a user including normalized price/media.
   */
  async getSavedProperties(userId: number): Promise<Property[]> {
    const savedProps = await db
      .select({ p: properties })
      .from(savedProperties)
      .innerJoin(properties, eq(savedProperties.propertyId, properties.id))
      .where(eq(savedProperties.userId, userId))
      .orderBy(desc(savedProperties.createdAt));

    return savedProps.map(({ p }) => ({
      ...p,
      price: normalizePrice(p.price),
      images: Array.isArray(p.images) ? p.images : normalizeStringArray(p.images),
      features: Array.isArray(p.features) ? p.features : normalizeStringArray(p.features),
    }));
  }

  /**
   * Persist a saved-property relationship.
   */
  async saveProperty(userId: number, propertyId: number): Promise<SavedProperty> {
    const [saved] = await db
      .insert(savedProperties)
      .values({ userId, propertyId })
      .returning();
    return saved;
  }

  /**
   * Remove a saved-property relationship.
   */
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

  /**
   * Determine whether a property has been saved by a user.
   */
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