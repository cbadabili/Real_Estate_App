// @ts-nocheck
import { pgTable, text, integer, real, boolean, timestamp, serial, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const serviceProviders = pgTable("service_providers", {
    id: serial("id").primaryKey(),
    companyName: text("company_name").notNull(),
    serviceCategory: text("service_category").notNull(), // 'Photography', 'Legal', 'Moving', 'Finance', 'Insurance', 'Cleaning', 'Construction'
    contactPerson: text("contact_person"),
    phoneNumber: text("phone_number"),
    email: text("email").unique(),
    websiteUrl: text("website_url"),
    logoUrl: text("logo_url"),
    description: text("description"),
    reacCertified: boolean("reac_certified").default(false), // Real Estate Advisory Council certification
    address: text("address"),
    city: text("city"),
    rating: real("rating").default(4.5), // Average rating out of 5
    verified: boolean("verified").default(false),
    featured: boolean("featured").default(false),
    dateJoined: timestamp("date_joined").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const serviceAds = pgTable("service_ads", {
    id: serial("id").primaryKey(),
    providerId: integer("provider_id").references(() => serviceProviders.id),
    adTitle: text("ad_title").notNull(),
    adCopy: text("ad_copy"), // e.g., "Make your listing shine. Book a pro photoshoot."
    adImageUrl: text("ad_image_url"),
    targetAudience: text("target_audience").notNull(), // 'Seller', 'Buyer', 'Renter', 'New_Homeowner'
    contextTrigger: text("context_trigger").notNull(), // The specific event that shows this ad
    ctaText: text("cta_text").default("Learn More"),
    ctaUrl: text("cta_url"),
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
    reviewerName: text("reviewer_name"),
    reviewerAvatar: text("reviewer_avatar"),
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
}).extend({
    description: z.string().min(1, "Description is required"),
    serviceCategory: z.enum([
        "Legal Services",
        "Photography",
        "Property Inspection",
        "Finance & Loans",
        "Insurance",
        "Construction",
        "Moving",
        "Cleaning",
        "Maintenance",
        "Architectural Services",
        "Quantity Surveying",
        "Structural Engineering"
    ])
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
