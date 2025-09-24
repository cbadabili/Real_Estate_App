import {
  serviceProviders,
  serviceAds,
  serviceReviews,
  type ServiceProvider,
  type InsertServiceProvider,
  type ServiceAd,
  type InsertServiceAd,
  type ServiceReview,
  type InsertServiceReview
} from "../shared/services-schema";
import { db } from "./db";
import { eq, and, desc, asc, like, sql, gte } from "drizzle-orm";

export interface IServicesStorage {
  // Service Provider methods
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviders(filters?: ServiceProviderFilters): Promise<ServiceProvider[]>;
  getServiceProvidersByCategory(category: string): Promise<ServiceProvider[]>;
  getServiceCategories(): Promise<string[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProvider(id: number, updates: Partial<InsertServiceProvider>): Promise<ServiceProvider | undefined>;
  deleteServiceProvider(id: number): Promise<boolean>;

  // Service Ads methods
  getContextualAd(trigger: string): Promise<ServiceAd | undefined>;
  getServiceAds(providerId?: number): Promise<ServiceAd[]>;
  createServiceAd(ad: InsertServiceAd): Promise<ServiceAd>;
  updateServiceAd(id: number, updates: Partial<InsertServiceAd>): Promise<ServiceAd | undefined>;
  incrementAdMetrics(adId: number, metric: 'impressions' | 'clicks'): Promise<void>;

  // Service Reviews methods
  getServiceReviews(providerId: number): Promise<ServiceReview[]>;
  createServiceReview(review: InsertServiceReview): Promise<ServiceReview>;
  updateServiceReview(id: number, updates: Partial<InsertServiceReview>): Promise<ServiceReview | undefined>;
}

export interface ServiceProviderFilters {
  category?: string;
  city?: string;
  verified?: boolean;
  featured?: boolean;
  reacCertified?: boolean;
  minRating?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'rating' | 'reviewCount' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export class ServicesStorage implements IServicesStorage {
  // Service Provider methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider || undefined;
  }

  async getServiceProviders(filters: ServiceProviderFilters = {}): Promise<ServiceProvider[]> {
    let query = db.select().from(serviceProviders);
    const conditions = [];

    if (filters.category) {
      conditions.push(eq(serviceProviders.serviceCategory, filters.category));
    }
    if (filters.city) {
      conditions.push(like(serviceProviders.city, `%${filters.city}%`));
    }
    if (filters.verified !== undefined) {
      conditions.push(eq(serviceProviders.verified, filters.verified));
    }
    if (filters.featured !== undefined) {
      conditions.push(eq(serviceProviders.featured, filters.featured));
    }
    if (filters.reacCertified !== undefined) {
      conditions.push(eq(serviceProviders.reacCertified, filters.reacCertified));
    }
    if (filters.minRating !== undefined) {
      // Ratings are stored as numeric values so direct comparison is safe
      conditions.push(gte(serviceProviders.rating, filters.minRating));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sorting
    if (filters.sortBy) {
      const direction = filters.sortOrder === 'desc' ? desc : asc;
      switch (filters.sortBy) {
        case 'rating':
          query = query.orderBy(direction(serviceProviders.rating));
          break;
        case 'reviewCount':
          query = query.orderBy(direction(serviceProviders.reviewCount));
          break;
        case 'name':
          query = query.orderBy(direction(serviceProviders.companyName));
          break;
        case 'newest':
          query = query.orderBy(direction(serviceProviders.dateJoined));
          break;
      }
    } else {
      // Default sorting: featured first, then by rating
      query = query.orderBy(desc(serviceProviders.featured), desc(serviceProviders.rating));
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getServiceProvidersByCategory(category: string): Promise<ServiceProvider[]> {
    return await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.serviceCategory, category))
      .orderBy(desc(serviceProviders.featured), desc(serviceProviders.rating));
  }

  async getServiceCategories(): Promise<string[]> {
    const result = await db
      .select({ category: serviceProviders.serviceCategory })
      .from(serviceProviders)
      .groupBy(serviceProviders.serviceCategory);
    return result.map(r => r.category);
  }

  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const [newProvider] = await db
      .insert(serviceProviders)
      .values(provider)
      .returning();
    return newProvider;
  }

  async updateServiceProvider(id: number, updates: Partial<InsertServiceProvider>): Promise<ServiceProvider | undefined> {
    const [updatedProvider] = await db
      .update(serviceProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id))
      .returning();
    return updatedProvider || undefined;
  }

  async deleteServiceProvider(id: number): Promise<boolean> {
    const deleted = await db
      .delete(serviceProviders)
      .where(eq(serviceProviders.id, id))
      .returning({ id: serviceProviders.id });
    return deleted.length > 0;
  }

  // Service Ads methods
  async getContextualAd(trigger: string): Promise<ServiceAd | undefined> {
    const [ad] = await db
      .select()
      .from(serviceAds)
      .where(and(
        eq(serviceAds.contextTrigger, trigger),
        eq(serviceAds.active, true)
      ))
      .orderBy(desc(serviceAds.priority))
      .limit(1);

    if (ad) {
      // Increment impressions
      await this.incrementAdMetrics(ad.id, 'impressions');
    }

    return ad || undefined;
  }

  async getServiceAds(providerId?: number): Promise<ServiceAd[]> {
    let query = db.select().from(serviceAds);

    if (providerId) {
      query = query.where(eq(serviceAds.providerId, providerId));
    }

    return await query.orderBy(desc(serviceAds.priority), desc(serviceAds.createdAt));
  }

  async createServiceAd(ad: InsertServiceAd): Promise<ServiceAd> {
    const [newAd] = await db
      .insert(serviceAds)
      .values(ad)
      .returning();
    return newAd;
  }

  async updateServiceAd(id: number, updates: Partial<InsertServiceAd>): Promise<ServiceAd | undefined> {
    const [updatedAd] = await db
      .update(serviceAds)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceAds.id, id))
      .returning();
    return updatedAd || undefined;
  }

  async incrementAdMetrics(adId: number, metric: 'impressions' | 'clicks'): Promise<void> {
    if (metric === 'impressions') {
      await db
        .update(serviceAds)
        .set({ impressions: sql`${serviceAds.impressions} + 1` })
        .where(eq(serviceAds.id, adId));
    } else {
      await db
        .update(serviceAds)
        .set({ clicks: sql`${serviceAds.clicks} + 1` })
        .where(eq(serviceAds.id, adId));
    }
  }

  // Service Reviews methods
  async getServiceReviews(providerId: number): Promise<ServiceReview[]> {
    return await db
      .select()
      .from(serviceReviews)
      .where(eq(serviceReviews.providerId, providerId))
      .orderBy(desc(serviceReviews.createdAt));
  }

  async createServiceReview(review: InsertServiceReview): Promise<ServiceReview> {
    const [newReview] = await db
      .insert(serviceReviews)
      .values(review)
      .returning();

    // Update provider's review count and average rating
    const reviews = await this.getServiceReviews(review.providerId);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await db
      .update(serviceProviders)
      .set({
        reviewCount: reviews.length,
        rating: avgRating.toFixed(1)
      })
      .where(eq(serviceProviders.id, review.providerId));

    return newReview;
  }

  async updateServiceReview(id: number, updates: Partial<InsertServiceReview>): Promise<ServiceReview | undefined> {
    const [updatedReview] = await db
      .update(serviceReviews)
      .set(updates)
      .where(eq(serviceReviews.id, id))
      .returning();
    return updatedReview || undefined;
  }
}

export const servicesStorage = new ServicesStorage();