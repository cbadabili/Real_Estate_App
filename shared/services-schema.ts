import { pgTable, serial, text, boolean, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  serviceCategory: varchar("service_category", { length: 100 }).notNull(), // 'Photography', 'Legal', 'Moving', 'Finance', 'Insurance', 'Cleaning'
  contactPerson: varchar("contact_person", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  email: varchar("email", { length: 255 }).unique(),
  websiteUrl: varchar("website_url", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  description: text("description"),
  reacCertified: boolean("reac_certified").default(false), // Real Estate Advisory Council certification
  address: text("address"),
  city: varchar("city", { length: 100 }),
  rating: varchar("rating", { length: 3 }).default("4.5"), // Average rating out of 5
  reviewCount: integer("review_count").default(0),
  verified: boolean("verified").default(false),
  featured: boolean("featured").default(false),
  dateJoined: timestamp("date_joined").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const serviceAds = pgTable("service_ads", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  adTitle: varchar("ad_title", { length: 255 }).notNull(),
  adCopy: text("ad_copy"), // e.g., "Make your listing shine. Book a pro photoshoot."
  adImageUrl: varchar("ad_image_url", { length: 255 }),
  targetAudience: varchar("target_audience", { length: 50 }).notNull(), // 'Seller', 'Buyer', 'Renter', 'New_Homeowner'
  contextTrigger: varchar("context_trigger", { length: 100 }).unique().notNull(), // The specific event that shows this ad
  ctaText: varchar("cta_text", { length: 100 }).default("Learn More"),
  ctaUrl: varchar("cta_url", { length: 255 }),
  active: boolean("active").default(true),
  priority: integer("priority").default(1), // Higher numbers = higher priority
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const serviceReviews = pgTable("service_reviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  userId: integer("user_id"), // Reference to users table
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  reviewerAvatar: varchar("reviewer_avatar", { length: 255 }),
  verified: boolean("verified").default(false), // Verified purchase/service
  helpful: integer("helpful").default(0), // How many found this helpful
  createdAt: timestamp("created_at").defaultNow()
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