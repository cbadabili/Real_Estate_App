import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const serviceProviders = sqliteTable("service_providers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  serviceCategory: text("service_category").notNull(), // 'Photography', 'Legal', 'Moving', 'Finance', 'Insurance', 'Cleaning', 'Construction'
  contactPerson: text("contact_person"),
  phoneNumber: text("phone_number"),
  email: text("email").unique(),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),
  description: text("description"),
  reacCertified: integer("reac_certified", { mode: "boolean" }).default(false), // Real Estate Advisory Council certification
  address: text("address"),
  city: text("city"),
  rating: text("rating").default("4.5"), // Average rating out of 5
  reviewCount: integer("review_count").default(0),
  verified: integer("verified", { mode: "boolean" }).default(false),
  featured: integer("featured", { mode: "boolean" }).default(false),
  dateJoined: integer("date_joined", { mode: "timestamp" }).defaultNow(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow()
});

export const serviceAds = sqliteTable("service_ads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  adTitle: text("ad_title").notNull(),
  adCopy: text("ad_copy"), // e.g., "Make your listing shine. Book a pro photoshoot."
  adImageUrl: text("ad_image_url"),
  targetAudience: text("target_audience").notNull(), // 'Seller', 'Buyer', 'Renter', 'New_Homeowner'
  contextTrigger: text("context_trigger").notNull(), // The specific event that shows this ad
  ctaText: text("cta_text").default("Learn More"),
  ctaUrl: text("cta_url"),
  active: integer("active", { mode: "boolean" }).default(true),
  priority: integer("priority").default(1), // Higher numbers = higher priority
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow()
});

export const serviceReviews = sqliteTable("service_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  userId: integer("user_id"), // Reference to users table
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  reviewerName: text("reviewer_name"),
  reviewerAvatar: text("reviewer_avatar"),
  verified: integer("verified", { mode: "boolean" }).default(false), // Verified purchase/service
  helpful: integer("helpful").default(0), // How many found this helpful
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow()
});

// Relations
export const serviceProvidersRelations = relations(serviceProviders, ({ many }) => ({
  ads: many(serviceAds),
  reviews: many(serviceReviews)
}));

export const serviceAdsRelations = relations(serviceAds, ({ one }) => ({
  provider: one(serviceProviders, {
    fields: [serviceAds.providerId],
    references: [serviceProviders.id]
  })
}));

export const serviceReviewsRelations = relations(serviceReviews, ({ one }) => ({
  provider: one(serviceProviders, {
    fields: [serviceReviews.providerId],
    references: [serviceProviders.id]
  })
}));

// Zod schemas
export const insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({
  id: true,
  dateJoined: true,
  createdAt: true,
  updatedAt: true
}).extend({
    description: z.string().min(1, "Description is required"),
});

export const insertServiceAdSchema = createInsertSchema(serviceAds).omit({
  id: true,
  impressions: true,
  clicks: true,
  createdAt: true,
  updatedAt: true
});

export const insertServiceReviewSchema = createInsertSchema(serviceReviews).omit({
  id: true,
  helpful: true,
  createdAt: true
});

// Types
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;
export type ServiceAd = typeof serviceAds.$inferSelect;
export type InsertServiceAd = z.infer<typeof insertServiceAdSchema>;
export type ServiceReview = typeof serviceReviews.$inferSelect;
export type InsertServiceReview = z.infer<typeof insertServiceReviewSchema>;