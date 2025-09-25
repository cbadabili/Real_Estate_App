import { inquiries, appointments, savedProperties, properties } from "../shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
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
    } catch {
      return [trimmed];
    }
  }
  return [String(value)];
};

const normalizePrice = (value) => {
  let normalized;

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

  const clamped = Math.max(0, normalized);
  return Math.round(clamped * 100) / 100;
};

export class DatabaseStorage {
  constructor() {
    this.userRepo = userRepository;
    this.propertyRepo = propertyRepository;
  }

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

  async getProperty(id) {
    return this.propertyRepo.getProperty(id);
  }

  async getProperties(filters = {}) {
    return this.propertyRepo.getProperties(filters);
  }

  async createProperty(property) {
    return this.propertyRepo.createProperty(property);
  }

  async updateProperty(id, updates) {
    return this.propertyRepo.updateProperty(id, updates);
  }

  async deleteProperty(id) {
    return this.propertyRepo.deleteProperty(id);
  }

  async getUserProperties(userId) {
    return this.propertyRepo.getUserProperties(userId);
  }

  async incrementPropertyViews(id) {
    await this.propertyRepo.incrementPropertyViews(id);
  }

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

  async getSavedProperties(userId) {
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
      .where(and(
        eq(savedProperties.userId, userId),
        eq(savedProperties.propertyId, propertyId),
      ))
      .returning({ id: savedProperties.id });
    return result.length > 0;
  }

  async isPropertySaved(userId, propertyId) {
    const [saved] = await db
      .select()
      .from(savedProperties)
      .where(and(
        eq(savedProperties.userId, userId),
        eq(savedProperties.propertyId, propertyId),
      ))
      .limit(1);
    return !!saved;
  }
}

export const storage = new DatabaseStorage();
