/* eslint-disable @typescript-eslint/ban-ts-comment */
// Temporary staged migration helper:
// 1. We switch to pg-core import.
// 2. We re-export a pgTable alias that points to the old sqliteTable so the
//    remainder of the file compiles until each table is migrated.
// 3. Incrementally convert tables from sqliteTable → pgTable with proper
//    column types.

import {
  pgTable,
  text,
  integer,
  boolean,
  real,
  doublePrecision,
  numeric,
  timestamp,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// Until every table is migrated we alias pgTable to sqliteTable for unchanged
// definitions.  Replace usages in follow-up patches.
// Compatibility shim while we finish migrating every table definition.
// Provides the same call-signature using pgTable so no sqlite-core import is required.
// Remove after all tables are updated.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sqliteTable = pgTable as any;
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";



// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // 'buyer', 'seller', 'agent', 'fsbo', 'admin'
  role: text("role").notNull().default("user"), // 'user', 'moderator', 'admin', 'super_admin'
  permissions: text("permissions").array().default([]), // JSON string of permission array
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  reacNumber: text("reac_number"), // For certified agents
  lastLoginAt: integer("last_login_at"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  propertyType: text("property_type").notNull(), // 'house', 'apartment', 'condo', 'townhouse', 'land', 'mmatseta', 'commercial', 'farm'
  listingType: text("listing_type").notNull(), // 'owner', 'agent', 'rental', 'auction'
  bedrooms: integer("bedrooms"),
  bathrooms: text("bathrooms"),
  squareFeet: integer("square_feet"),
  areaBuild: integer("area_build"),
  lotSize: text("lot_size"),
  yearBuilt: integer("year_built"),
  status: text("status").notNull().default('active'), // 'active', 'pending', 'sold', 'withdrawn'
  images: text("images"), // JSON string of image URLs
  features: text("features"), // JSON string of features
  virtualTourUrl: text("virtual_tour_url"),
  videoUrl: text("video_url"),
  propertyTaxes: text("property_taxes"),
  hoaFees: text("hoa_fees"),
  ownerId: integer("owner_id").references(() => users.id),
  agentId: integer("agent_id").references(() => users.id),
  views: integer("views").default(0),
  daysOnMarket: integer("days_on_market").default(0),
  // Auction-specific fields
  auctionDate: integer("auction_date"),
  auctionTime: text("auction_time"),
  startingBid: text("starting_bid"),
  currentBid: text("current_bid"),
  reservePrice: text("reserve_price"),
  auctionHouse: text("auction_house"), // e.g., "First National Bank of Botswana"
  auctioneerName: text("auctioneer_name"),
  auctioneerContact: text("auctioneer_contact"),
  bidIncrement: text("bid_increment"),
  depositRequired: text("deposit_required"),
  auctionTerms: text("auction_terms"),
  lotNumber: text("lot_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property inquiries
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default('unread'), // 'unread', 'read', 'replied'
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Appointments for property viewings
export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  agentId: integer("agent_id").references(() => users.id),
  appointmentDate: integer("appointment_date").notNull(),
  type: text("type").notNull(), // 'in-person', 'virtual'
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes: text("notes"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Saved properties (favorites)
export const savedProperties = sqliteTable("saved_properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Property reviews and ratings
export const propertyReviews = sqliteTable("property_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Agent reviews and ratings
export const agentReviews = sqliteTable("agent_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: integer("agent_id").references(() => users.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  transactionType: text("transaction_type"), // 'buy', 'sell', 'rent'
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// User reviews and ratings (for all user types)
export const userReviews = sqliteTable("user_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(), // User being reviewed
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(), // User writing review
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  reviewType: text("review_type").notNull(), // 'buyer', 'seller', 'agent', 'service_provider'
  transactionId: integer("transaction_id"), // Reference to property transaction if applicable
  isVerified: integer("is_verified", { mode: "boolean" }).default(false), // Verified by transaction
  isPublic: integer("is_public", { mode: "boolean" }).default(true),
  status: text("status").notNull().default("active"), // 'active', 'hidden', 'flagged', 'removed'
  moderatorNotes: text("moderator_notes"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Review responses (for business replies)
export const reviewResponses = sqliteTable("review_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  responderId: integer("responder_id").references(() => users.id).notNull(),
  response: text("response").notNull(),
  isOfficial: integer("is_official", { mode: "boolean" }).default(false), // Official business response
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Review helpful votes
export const reviewHelpful = sqliteTable("review_helpful", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isHelpful: integer("is_helpful", { mode: "boolean" }).notNull(), // true for helpful, false for not helpful
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// User permissions and roles
export const userPermissions = sqliteTable("user_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  permission: text("permission").notNull(),
  grantedBy: integer("granted_by").references(() => users.id),
  expiresAt: integer("expires_at"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Admin audit log
export const adminAuditLog = sqliteTable("admin_audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // 'user_ban', 'review_moderate', 'property_approve', etc.
  targetType: text("target_type").notNull(), // 'user', 'property', 'review', etc.
  targetId: integer("target_id").notNull(),
  details: text("details"), // JSON string of details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const saved_searches = sqliteTable('saved_searches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  search_criteria: text('search_criteria', { mode: 'json' }),
  name: text('name'),
  email_alerts: integer('email_alerts', { mode: 'boolean' }).default(false),
  created_at: text('created_at').default(sql`(datetime('now'))`),
});

export const rental_listings = sqliteTable('rental_listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  landlord_id: integer('landlord_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  ward: text('ward'),
  property_type: text('property_type').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  square_meters: integer('square_meters').notNull(),
  monthly_rent: integer('monthly_rent').notNull(),
  deposit_amount: integer('deposit_amount').notNull(),
  lease_duration: integer('lease_duration').notNull(),
  available_from: text('available_from').notNull(),
  furnished: integer('furnished', { mode: 'boolean' }).default(false),
  pets_allowed: integer('pets_allowed', { mode: 'boolean' }).default(false),
  parking_spaces: integer('parking_spaces').default(0),
  photos: text('photos', { mode: 'json' }).default('[]'),
  amenities: text('amenities', { mode: 'json' }).default('[]'),
  utilities_included: text('utilities_included', { mode: 'json' }).default('[]'),
  status: text('status').default('active'),
  created_at: text('created_at').default(sql`(datetime('now'))`),
  updated_at: text('updated_at').default(sql`(datetime('now'))`),
});

export const rental_applications = sqliteTable('rental_applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rental_id: integer('rental_id').references(() => rental_listings.id, { onDelete: 'cascade' }),
  renter_id: integer('renter_id').references(() => users.id, { onDelete: 'cascade' }),
  application_data: text('application_data', { mode: 'json' }).notNull(),
  status: text('status').default('pending'),
  background_check_status: text('background_check_status').default('pending'),
  credit_report_status: text('credit_report_status').default('pending'),
  created_at: text('created_at').default(sql`(datetime('now'))`),
  updated_at: text('updated_at').default(sql`(datetime('now'))`),
});

export const lease_agreements = sqliteTable('lease_agreements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  application_id: integer('application_id').references(() => rental_applications.id, { onDelete: 'cascade' }),
  rental_id: integer('rental_id').references(() => rental_listings.id, { onDelete: 'cascade' }),
  landlord_id: integer('landlord_id').references(() => users.id, { onDelete: 'cascade' }),
  renter_id: integer('renter_id').references(() => users.id, { onDelete: 'cascade' }),
  lease_start_date: text('lease_start_date').notNull(),
  lease_end_date: text('lease_end_date').notNull(),
  monthly_rent: integer('monthly_rent').notNull(),
  deposit_amount: integer('deposit_amount').notNull(),
  lease_terms: text('lease_terms', { mode: 'json' }),
  landlord_signature_status: text('landlord_signature_status').default('pending'),
  renter_signature_status: text('renter_signature_status').default('pending'),
  e_signature_status: text('e_signature_status').default('pending'),
  created_at: text('created_at').default(sql`(datetime('now'))`),
  updated_at: text('updated_at').default(sql`(datetime('now'))`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(properties, { relationName: "propertyOwner" }),
  agentProperties: many(properties, { relationName: "propertyAgent" }),
  inquiries: many(inquiries),
  appointments: many(appointments),
  savedProperties: many(savedProperties),
  propertyReviews: many(propertyReviews),
  agentReviews: many(agentReviews),
  writtenUserReviews: many(userReviews, { relationName: "reviewer" }),
  receivedUserReviews: many(userReviews, { relationName: "reviewee" }),
  reviewResponses: many(reviewResponses),
  reviewHelpfulVotes: many(reviewHelpful),
  permissions: many(userPermissions),
  auditActions: many(adminAuditLog),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
    relationName: "propertyOwner"
  }),
  agent: one(users, {
    fields: [properties.agentId],
    references: [users.id],
    relationName: "propertyAgent"
  }),
  inquiries: many(inquiries),
  appointments: many(appointments),
  savedByUsers: many(savedProperties),
  reviews: many(propertyReviews),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  property: one(properties, {
    fields: [inquiries.propertyId],
    references: [properties.id],
  }),
  buyer: one(users, {
    fields: [inquiries.buyerId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  property: one(properties, {
    fields: [appointments.propertyId],
    references: [properties.id],
  }),
  buyer: one(users, {
    fields: [appointments.buyerId],
    references: [users.id],
  }),
  agent: one(users, {
    fields: [appointments.agentId],
    references: [users.id],
  }),
}));

export const savedPropertiesRelations = relations(savedProperties, ({ one }) => ({
  user: one(users, {
    fields: [savedProperties.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [savedProperties.propertyId],
    references: [properties.id],
  }),
}));

// User review relations
export const userReviewsRelations = relations(userReviews, ({ one, many }) => ({
  reviewee: one(users, {
    fields: [userReviews.revieweeId],
    references: [users.id],
    relationName: "reviewee"
  }),
  reviewer: one(users, {
    fields: [userReviews.reviewerId],
    references: [users.id],
    relationName: "reviewer"
  }),
  responses: many(reviewResponses),
  helpfulVotes: many(reviewHelpful),
}));

export const reviewResponsesRelations = relations(reviewResponses, ({ one }) => ({
  review: one(userReviews, {
    fields: [reviewResponses.reviewId],
    references: [userReviews.id],
  }),
  responder: one(users, {
    fields: [reviewResponses.responderId],
    references: [users.id],
  }),
}));

export const reviewHelpfulRelations = relations(reviewHelpful, ({ one }) => ({
  review: one(userReviews, {
    fields: [reviewHelpful.reviewId],
    references: [userReviews.id],
  }),
  user: one(users, {
    fields: [reviewHelpful.userId],
    references: [users.id],
  }),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userPermissions.userId],
    references: [users.id],
  }),
  grantedByUser: one(users, {
    fields: [userPermissions.grantedBy],
    references: [users.id],
  }),
}));

export const adminAuditLogRelations = relations(adminAuditLog, ({ one }) => ({
  admin: one(users, {
    fields: [adminAuditLog.adminId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  views: true,
  daysOnMarket: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type SavedProperty = typeof savedProperties.$inferSelect;
export type InsertSavedProperty = z.infer<typeof insertSavedPropertySchema>;

// Review system insert schemas
export const insertUserReviewSchema = createInsertSchema(userReviews).omit({
  id: true,
  isVerified: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewResponseSchema = createInsertSchema(reviewResponses).omit({
  id: true,
  createdAt: true,
});

export const insertReviewHelpfulSchema = createInsertSchema(reviewHelpful).omit({
  id: true,
  createdAt: true,
});

export const insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
  id: true,
  createdAt: true,
});

export const insertAdminAuditLogSchema = createInsertSchema(adminAuditLog).omit({
  id: true,
  createdAt: true,
});

// Review system types
export type UserReview = typeof userReviews.$inferSelect;
export type InsertUserReview = z.infer<typeof insertUserReviewSchema>;
export type ReviewResponse = typeof reviewResponses.$inferSelect;
export type InsertReviewResponse = z.infer<typeof insertReviewResponseSchema>;
export type ReviewHelpful = typeof reviewHelpful.$inferSelect;
export type InsertReviewHelpful = z.infer<typeof insertReviewHelpfulSchema>;
export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = z.infer<typeof insertUserPermissionSchema>;
export type AdminAuditLog = typeof adminAuditLog.$inferSelect;
export type InsertAdminAuditLog = z.infer<typeof insertAdminAuditLogSchema>;

// User roles and permissions
export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin"
}

export enum UserType {
  BUYER = "buyer",
  SELLER = "seller",
  AGENT = "agent",
  FSBO = "fsbo",
  ADMIN = "admin"
}

export enum Permission {
  // User management
  CREATE_USER = "create_user",
  UPDATE_USER = "update_user",
  DELETE_USER = "delete_user",
  VIEW_USER = "view_user",
  BAN_USER = "ban_user",
  VERIFY_USER = "verify_user",

  // Property management
  CREATE_PROPERTY = "create_property",
  UPDATE_PROPERTY = "update_property",
  DELETE_PROPERTY = "delete_property",
  VIEW_PROPERTY = "view_property",
  APPROVE_PROPERTY = "approve_property",
  FEATURE_PROPERTY = "feature_property",

  // Review management
  CREATE_REVIEW = "create_review",
  UPDATE_REVIEW = "update_review",
  DELETE_REVIEW = "delete_review",
  VIEW_REVIEW = "view_review",
  MODERATE_REVIEW = "moderate_review",
  RESPOND_TO_REVIEW = "respond_to_REVIEW",

  // Admin operations
  VIEW_ADMIN_PANEL = "view_admin_panel",
  MANAGE_PERMISSIONS = "manage_permissions",
  VIEW_AUDIT_LOG = "view_audit_log",
  SYSTEM_SETTINGS = "system_settings",

  // Services
  MANAGE_SERVICES = "manage_services",
  APPROVE_SERVICE_PROVIDER = "approve_service_provider",
}

// Marketplace tables for comprehensive property ecosystem

// Professional service categories
export const service_categories = sqliteTable('service_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  journey_type: text('journey_type').notNull(), // 'transaction', 'development', 'ownership', 'skills'
  icon: text('icon'),
  description: text('description'),
  sort_order: integer('sort_order').default(0),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Expanded service providers for all marketplace segments
export const marketplace_providers = sqliteTable('marketplace_providers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id),
  provider_type: text('provider_type').notNull(), // 'professional', 'supplier', 'artisan', 'training_provider'
  business_name: text('business_name').notNull(),
  category_id: integer('category_id').references(() => service_categories.id),
  specializations: text('specializations'), // JSON array
  service_areas: text('service_areas'), // JSON array of cities/districts
  contact_person: text('contact_person'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp'),
  website: text('website'),
  logo_url: text('logo_url'),
  banner_url: text('banner_url'),
  description: text('description'),
  years_experience: integer('years_experience'),

  // Verification & Certifications
  verified: boolean('verified').default(false),
  featured: boolean('featured').default(false),
  reac_certified: boolean('reac_certified').default(false),
  company_registration: text('company_registration'),
  tax_clearance: text('tax_clearance'),
  insurance_details: text('insurance_details'),

  // Business Details
  business_address: text('business_address'),
  operating_hours: text('operating_hours'), // JSON
  service_radius: integer('service_radius'), // km

  // Performance Metrics
  rating: real('rating').default(0),
  review_count: integer('review_count').default(0),
  projects_completed: integer('projects_completed').default(0),
  response_time: integer('response_time'), // hours

  // Status & Availability
  status: text('status').default('active'), // 'active', 'inactive', 'suspended'
  availability_status: text('availability_status').default('available'), // 'available', 'busy', 'booked'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Skills and certifications for artisans
export const artisan_skills = sqliteTable('artisan_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  provider_id: integer('provider_id').references(() => marketplace_providers.id),
  skill_name: text('skill_name').notNull(),
  proficiency_level: text('proficiency_level').notNull(), // 'beginner', 'intermediate', 'advanced', 'expert'
  certification_body: text('certification_body'),
  certification_number: text('certification_number'),
  issue_date: text('issue_date'),
  expiry_date: text('expiry_date'),
  document_url: text('document_url'),
  is_verified: integer('is_verified', { mode: 'boolean' }).default(false),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Training programs and courses
export const training_programs = sqliteTable('training_programs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  provider_id: integer('provider_id').references(() => marketplace_providers.id),
  program_name: text('program_name').notNull(),
  description: text('description'),
  category: text('category'), // 'construction', 'plumbing', 'electrical', 'real_estate'
  duration_hours: integer('duration_hours'),
  duration_weeks: integer('duration_weeks'),
  price: integer('price'), // in thebe
  max_participants: integer('max_participants'),

  // Course Details
  prerequisites: text('prerequisites'),
  learning_outcomes: text('learning_outcomes'), // JSON array
  course_outline: text('course_outline'), // JSON
  materials_included: text('materials_included'), // JSON array

  // Certification
  provides_certificate: integer('provides_certificate', { mode: 'boolean' }).default(false),
  certificate_type: text('certificate_type'),
  accreditation_body: text('accreditation_body'),

  // Scheduling
  schedule_type: text('schedule_type'), // 'fixed', 'flexible', 'on_demand'
  start_date: text('start_date'),
  end_date: text('end_date'),
  class_times: text('class_times'), // JSON
  location: text('location'),
  delivery_method: text('delivery_method'), // 'in_person', 'online', 'hybrid'

  // Status
  status: text('status').default('active'), // 'active', 'full', 'cancelled', 'completed'
  enrollment_count: integer('enrollment_count').default(0),

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Project requests from property owners
export const project_requests = sqliteTable('project_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  client_id: integer('client_id').references(() => users.id),
  property_id: integer('property_id').references(() => properties.id),

  // Project Details
  project_title: text('project_title').notNull(),
  project_description: text('project_description'),
  project_type: text('project_type').notNull(), // 'construction', 'renovation', 'maintenance', 'landscaping'
  category_id: integer('category_id').references(() => service_categories.id),

  // Requirements
  budget_min: integer('budget_min'),
  budget_max: integer('budget_max'),
  timeline_weeks: integer('timeline_weeks'),
  preferred_start_date: text('preferred_start_date'),

  // Location
  project_address: text('project_address'),
  project_city: text('project_city'),
  project_district: text('project_district'),

  // Attachments
  images: text('images'), // JSON array
  documents: text('documents'), // JSON array

  // Status
  status: text('status').default('open'), // 'open', 'in_progress', 'completed', 'cancelled'
  proposals_count: integer('proposals_count').default(0),

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*864000 as integer))`),});

// Proposals from service providers
export const project_proposals = sqliteTable('project_proposals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  project_id: integer('project_id').references(() => project_requests.id),
  provider_id: integer('provider_id').references(() => marketplace_providers.id),

  // Proposal Details
  proposal_title: text('proposal_title'),
  proposal_description: text('proposal_description'),
  quoted_price: integer('quoted_price'),
  estimated_timeline: integer('estimated_timeline'), // weeks

  // Terms
  payment_terms: text('payment_terms'),
  warranty_period: text('warranty_period'),
  materials_included: integer('materials_included', { mode: 'boolean' }).default(false),

  // Status
  status: text('status').default('pending'), // 'pending', 'accepted', 'rejected', 'withdrawn'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Marketplace reviews and ratings
export const marketplace_reviews = sqliteTable('marketplace_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  provider_id: integer('provider_id').references(() => marketplace_providers.id),
  client_id: integer('client_id').references(() => users.id),
  project_id: integer('project_id').references(() => project_requests.id),

  // Review Details
  rating: integer('rating').notNull(), // 1-5 stars
  review_text: text('review_text'),
  review_type: text('review_type'), // 'service', 'product', 'training'

  // Detailed Ratings
  quality_rating: integer('quality_rating'), // 1-5
  timeliness_rating: integer('timeliness_rating'), // 1-5
  communication_rating: integer('communication_rating'), // 1-5
  value_rating: integer('value_rating'), // 1-5

  // Verification
  is_verified: integer('is_verified', { mode: 'boolean' }).default(false),
  verification_method: text('verification_method'),

  // Images
  review_images: text('review_images'), // JSON array

  // Status
  status: text('status').default('active'), // 'active', 'hidden', 'flagged'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Building materials and supplies
export const building_materials = sqliteTable('building_materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplier_id: integer('supplier_id').references(() => marketplace_providers.id),

  // Product Details
  product_name: text('product_name').notNull(),
  product_description: text('product_description'),
  category: text('category'), // 'cement', 'bricks', 'roofing', 'plumbing', 'electrical'
  subcategory: text('subcategory'),
  brand: text('brand'),
  model: text('model'),

  // Specifications
  specifications: text('specifications'), // JSON
  dimensions: text('dimensions'),
  weight: text('weight'),
  color: text('color'),
  material: text('material'),

  // Pricing
  unit_price: integer('unit_price'), // in thebe
  unit_type: text('unit_type'), // 'piece', 'bag', 'meter', 'square_meter'
  bulk_pricing: text('bulk_pricing'), // JSON for tiered pricing

  // Availability
  stock_quantity: integer('stock_quantity'),
  minimum_order: integer('minimum_order'),
  lead_time_days: integer('lead_time_days'),

  // Images
  product_images: text('product_images'), // JSON array

  // Status
  status: text('status').default('available'), // 'available', 'out_of_stock', 'discontinued'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Material orders
export const material_orders = sqliteTable('material_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer_id: integer('customer_id').references(() => users.id),
  supplier_id: integer('supplier_id').references(() => marketplace_providers.id),

  // Order Details
  order_number: text('order_number').notNull(),
  order_items: text('order_items'), // JSON array
  total_amount: integer('total_amount'),

  // Delivery
  delivery_address: text('delivery_address'),
  delivery_date: text('delivery_date'),
  delivery_method: text('delivery_method'), // 'pickup', 'delivery', 'courier'
  delivery_cost: integer('delivery_cost'),

  // Status
  status: text('status').default('pending'), // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_status: text('payment_status').default('pending'), // 'pending', 'paid', 'partial', 'failed'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Job opportunities for skilled workers
export const job_opportunities = sqliteTable('job_opportunities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employer_id: integer('employer_id').references(() => users.id),

  // Job Details
  job_title: text('job_title').notNull(),
  job_description: text('job_description'),
  job_type: text('job_type'), // 'full_time', 'part_time', 'contract', 'temporary'
  category: text('category'), // 'construction', 'plumbing', 'electrical', 'real_estate'

  // Requirements
  required_skills: text('required_skills'), // JSON array
  experience_years: integer('experience_years'),
  education_level: text('education_level'),
  certifications_required: text('certifications_required'), // JSON array

  // Compensation
  salary_min: integer('salary_min'),
  salary_max: integer('salary_max'),
  salary_type: text('salary_type'), // 'monthly', 'daily', 'hourly', 'project'
  benefits: text('benefits'), // JSON array

  // Location
  job_location: text('job_location'),
  remote_work: integer('remote_work', { mode: 'boolean' }).default(false),

  // Status
  status: text('status').default('active'), // 'active', 'filled', 'cancelled', 'expired'
  applications_count: integer('applications_count').default(0),

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Re-export services schema types for convenience
export * from "./services-schema";

// Standardized property types
export const PROPERTY_TYPES = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  LAND_PLOT: 'land_plot',
  COMMERCIAL: 'commercial',
  FARM: 'farm'
} as const;

export const LAND_PLOT_SUBTYPES = {
  RAW_LAND: 'raw_land',
  RESIDENTIAL_PLOT: 'residential_plot',
  COMMERCIAL_PLOT: 'commercial_plot',
  AGRICULTURAL_LAND: 'agricultural_land',
  INDUSTRIAL_PLOT: 'industrial_plot'
} as const;

export const PROPERTY_TYPE_LABELS = {
  [PROPERTY_TYPES.HOUSE]: 'House',
  [PROPERTY_TYPES.APARTMENT]: 'Apartment',
  [PROPERTY_TYPES.TOWNHOUSE]: 'Townhouse',
  [PROPERTY_TYPES.LAND_PLOT]: 'Land/Plot',
  [PROPERTY_TYPES.COMMERCIAL]: 'Commercial Property',
  [PROPERTY_TYPES.FARM]: 'Farm'
} as const;

// Legacy support - keep for backward compatibility
export const PropertyType = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
  LAND: 'land_plot', // Updated to use new standard
  COMMERCIAL: 'commercial',
  OFFICE: 'office',
  RETAIL: 'retail',
  WAREHOUSE: 'warehouse',
  FARM: 'farm',
  OTHER: 'other'
} as const;