// @ts-nocheck
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
  varchar,
  customType,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";



// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  userType: text("user_type").notNull(), // 'buyer', 'seller', 'agent', 'fsbo', 'admin'
  role: text("role").default('user').notNull(), // 'user', 'moderator', 'admin', 'super_admin'
  permissions: text("permissions").array().default(sql`'{}'::text[]`), // JSON array of permissions
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  reacNumber: varchar("reac_number", { length: 20 }), // For certified agents
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Refresh tokens table for JWT security
export const refreshTokens = pgTable('refresh_tokens', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID as primary key
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull(), // The actual refresh token
  expiresAt: timestamp('expires_at').notNull(), // Expiration timestamp
  createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
});



// Properties table
export const geometryPoint = customType<{ data: unknown; driverData: unknown }>({
  dataType() {
    return 'geometry(Point,4326)';
  },
});

export const tsvector = customType<{ data: unknown; driverData: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id),
  agentId: integer("agent_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).$type<number>().notNull(),
  currency: text("currency").default('BWP').notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  geom: geometryPoint("geom"),
  areaText: text("area_text"),
  placeName: text("place_name"),
  placeId: text("place_id"),
  locationSource: text("location_source"),
  propertyType: text("property_type").notNull(),
  listingType: text("listing_type").notNull(),
  status: text("status").default('active').notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: numeric("bathrooms", { precision: 3, scale: 1 }).$type<number | null>(),
  squareFeet: integer("square_feet"),
  areaBuild: integer("area_build"),
  lotSize: text("lot_size"),
  yearBuilt: integer("year_built"),
  images: jsonb("images").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  features: jsonb("features").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  virtualTourUrl: text("virtual_tour_url"),
  videoUrl: text("video_url"),
  propertyTaxes: text("property_taxes"),
  hoaFees: text("hoa_fees"),
  views: integer("views").default(0),
  daysOnMarket: integer("days_on_market").default(0),
  forMap: boolean("for_map").default(true),
  auctionDate: integer("auction_date"),
  auctionTime: text("auction_time"),
  startingBid: text("starting_bid"),
  currentBid: text("current_bid"),
  reservePrice: text("reserve_price"),
  auctionHouse: text("auction_house"),
  auctioneerName: text("auctioneer_name"),
  auctioneerContact: text("auctioneer_contact"),
  bidIncrement: text("bid_increment"),
  depositRequired: text("deposit_required"),
  auctionTerms: text("auction_terms"),
  lotNumber: text("lot_number"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  fts: tsvector("fts").generatedAlwaysAs(() =>
    sql`to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(address, ''))`
  , { stored: true }),
});
// Property inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default('unread'), // 'unread', 'read', 'replied'
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments for property viewings
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  agentId: integer("agent_id").references(() => users.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  type: text("type").notNull(), // 'in-person', 'virtual'
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved properties (favorites)
export const savedProperties = pgTable("saved_properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
});

// Property reviews and ratings
export const propertyReviews = pgTable("property_reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
});

// Agent reviews and ratings
export const agentReviews = pgTable("agent_reviews", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").references(() => users.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  transactionType: text("transaction_type"), // 'buy', 'sell', 'rent'
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
});

// User reviews and ratings (for all user types)
export const userReviews = pgTable("user_reviews", {
  id: serial("id").primaryKey(),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(), // User being reviewed
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(), // User writing review
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  reviewType: text("review_type").notNull(), // 'buyer', 'seller', 'agent', 'service_provider'
  transactionId: integer("transaction_id"), // Reference to property transaction if applicable
  isVerified: integer("is_verified").default(0), // Verified by transaction
  isPublic: integer("is_public").default(1),
  status: text("status").notNull().default("active"), // 'active', 'hidden', 'flagged', 'removed'
  moderatorNotes: text("moderator_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Review responses (for business replies)
export const reviewResponses = pgTable("review_responses", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  responderId: integer("responder_id").references(() => users.id).notNull(),
  response: text("response").notNull(),
  isOfficial: boolean("is_official").default(false), // Official business response
  createdAt: timestamp("created_at").defaultNow(),
});

// Review helpful votes
export const reviewHelpful = pgTable("review_helpful", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isHelpful: boolean("is_helpful").notNull(), // true for helpful, false for not helpful
  createdAt: timestamp("created_at").defaultNow(),
});

// User permissions and roles
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  permission: text("permission").notNull(),
  grantedBy: integer("granted_by").references(() => users.id),
  expiresAt: integer("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin audit log
export const adminAuditLog = pgTable("admin_audit_log", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // 'user_ban', 'review_moderate', 'property_approve', etc.
  targetType: text("target_type").notNull(), // 'user', 'property', 'review', etc.
  targetId: integer("target_id").notNull(),
  details: text("details"), // JSON string of details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const saved_searches = pgTable('saved_searches', {
  id: serial("id").primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  search_criteria: jsonb('search_criteria'),
  name: text('name'),
  email_alerts: boolean('email_alerts').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

export const rental_listings = pgTable('rental_listings', {
  id: serial('id').primaryKey(),
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
  furnished: boolean('furnished').default(false),
  pets_allowed: boolean('pets_allowed').default(false),
  parking_spaces: integer('parking_spaces').default(0),
  photos: jsonb('photos').default(sql`'[]'::jsonb`),
  amenities: jsonb('amenities').default(sql`'[]'::jsonb`),
  utilities_included: jsonb('utilities_included').default(sql`'[]'::jsonb`),
  status: text('status').default('active'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const rental_applications = pgTable('rental_applications', {
  id: serial('id').primaryKey(),
  rental_id: integer('rental_id').references(() => rental_listings.id, { onDelete: 'cascade' }),
  renter_id: integer('renter_id').references(() => users.id, { onDelete: 'cascade' }),
  application_data: jsonb('application_data').notNull(),
  status: text('status').default('pending'),
  background_check_status: text('background_check_status').default('pending'),
  credit_report_status: text('credit_report_status').default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const lease_agreements = pgTable('lease_agreements', {
  id: serial('id').primaryKey(),
  application_id: integer('application_id').references(() => rental_applications.id, { onDelete: 'cascade' }),
  rental_id: integer('rental_id').references(() => rental_listings.id, { onDelete: 'cascade' }),
  landlord_id: integer('landlord_id').references(() => users.id, { onDelete: 'cascade' }),
  renter_id: integer('renter_id').references(() => users.id, { onDelete: 'cascade' }),
  lease_start_date: text('lease_start_date').notNull(),
  lease_end_date: text('lease_end_date').notNull(),
  monthly_rent: integer('monthly_rent').notNull(),
  deposit_amount: integer('deposit_amount').notNull(),
  lease_terms: jsonb('lease_terms'),
  landlord_signature_status: text('landlord_signature_status').default('pending'),
  renter_signature_status: text('renter_signature_status').default('pending'),
  e_signature_status: text('e_signature_status').default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
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
  fts: true,
  geom: true,
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
export type RefreshToken = typeof refreshTokens.$inferSelect; // Type for refresh token

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
  // Property management
  CREATE_PROPERTY = "create_property",
  UPDATE_PROPERTY = "update_property",
  DELETE_PROPERTY = "delete_property",
  VIEW_PROPERTY = "view_property",
  FEATURE_PROPERTY = "feature_property",
  APPROVE_PROPERTY = "approve_property",

  // Review management
  CREATE_REVIEW = "create_review",
  UPDATE_REVIEW = "update_review",
  DELETE_REVIEW = "delete_review",
  VIEW_REVIEW = "view_review",
  MODERATE_REVIEW = "moderate_review",
  RESPOND_TO_REVIEW = "respond_to_review",

  // User management
  VERIFY_USER = "verify_user",
  BAN_USER = "ban_user",
  DELETE_USER = "delete_user",

  // Admin operations
  VIEW_ADMIN_PANEL = "view_admin_panel",
  MANAGE_PERMISSIONS = "manage_permissions",
  VIEW_AUDIT_LOG = "view_audit_log",
  SYSTEM_SETTINGS = "system_settings",

  // Services
  MANAGE_SERVICES = "manage_services",
  APPROVE_SERVICE_PROVIDER = "approve_service_provider",

  // Billing
  MANAGE_BILLING = "manage_billing",
  VIEW_PAYMENTS = "view_payments",
  APPROVE_PAYMENTS = "approve_payments",
}

// Marketplace tables for comprehensive property ecosystem

// Professional service categories
export const service_categories = pgTable('service_categories', {
  id: serial("id").primaryKey(),
  name: text('name').notNull(),
  journey_type: text('journey_type').notNull(), // 'transaction', 'development', 'ownership', 'skills'
  icon: text('icon'),
  description: text('description'),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Expanded service providers for all marketplace segments
export const marketplace_providers = pgTable('marketplace_providers', {
  id: serial("id").primaryKey(),
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
  isVerified: boolean('is_verified').default(false),
  isFeatured: boolean('is_featured').default(false),
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
export const artisan_skills = pgTable('artisan_skills', {
  id: serial("id").primaryKey(),
  provider_id: integer('provider_id').references(() => marketplace_providers.id),
  skill_name: text('skill_name').notNull(),
  proficiency_level: text('proficiency_level').notNull(), // 'beginner', 'intermediate', 'advanced', 'expert'
  certification_body: text('certification_body'),
  certification_number: text('certification_number'),
  issue_date: text('issue_date'),
  expiry_date: text('expiry_date'),
  document_url: text('document_url'),
  is_verified: boolean('is_verified').default(false),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Training programs and courses
export const training_programs = pgTable('training_programs', {
  id: serial("id").primaryKey(),
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
  provides_certificate: boolean('provides_certificate').default(false),
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
export const project_requests = pgTable('project_requests', {
  id: serial("id").primaryKey(),
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
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),});

// Proposals from service providers
export const project_proposals = pgTable('project_proposals', {
  id: serial("id").primaryKey(),
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
  materials_included: boolean('materials_included').default(false),

  // Status
  status: text('status').default('pending'), // 'pending', 'accepted', 'rejected', 'withdrawn'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Marketplace reviews and ratings
export const marketplace_reviews = pgTable('marketplace_reviews', {
  id: serial("id").primaryKey(),
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
  is_verified: boolean('is_verified').default(false),
  verification_method: text('verification_method'),

  // Images
  review_images: text('review_images'), // JSON array

  // Status
  status: text('status').default('active'), // 'active', 'hidden', 'flagged'

  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Building materials and supplies
export const building_materials = pgTable('building_materials', {
  id: serial("id").primaryKey(),
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
export const material_orders = pgTable('material_orders', {
  id: serial("id").primaryKey(),
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
export const job_opportunities = pgTable('job_opportunities', {
  id: serial("id").primaryKey(),
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
  remote_work: boolean('remote_work').default(false),

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

// Billing and subscription tables
export const plans = pgTable('plans', {
  id: serial("id").primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price_bwp: integer('price_bwp').notNull().default(0),
  interval: text('interval').notNull().default('monthly'), // monthly, yearly, one_time
  features: jsonb('features').notNull().default('{}'), // JSON object with features
  is_active: boolean('is_active').default(true),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial("id").primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  plan_id: integer('plan_id').notNull().references(() => plans.id),
  status: text('status').notNull().default('pending'), // pending, active, past_due, canceled, expired
  starts_at: integer('starts_at').notNull(),
  ends_at: integer('ends_at'),
  next_billing_date: integer('next_billing_date'),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const entitlements = pgTable('entitlements', {
  id: serial("id").primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  subscription_id: integer('subscription_id').notNull().references(() => subscriptions.id),
  feature_key: text('feature_key').notNull(), // e.g., 'listingLimit', 'heroSlots', 'analytics'
  feature_value: integer('feature_value').notNull(), // numeric value or boolean (0/1)
  used_count: integer('used_count').notNull().default(0),
  expires_at: integer('expires_at'),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const payments = pgTable('payments', {
  id: serial("id").primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  subscription_id: integer('subscription_id').references(() => subscriptions.id),
  plan_id: integer('plan_id').notNull().references(() => plans.id),
  amount_bwp: integer('amount_bwp').notNull(),
  payment_method: text('payment_method').notNull().default('bank_transfer'), // bank_transfer, mobile_money, card
  payment_reference: text('payment_reference'),
  status: text('status').notNull().default('pending'), // pending, succeeded, failed, refunded
  notes: text('notes'),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updated_at: integer('updated_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const hero_slots = pgTable('hero_slots', {
  id: serial("id").primaryKey(),
  property_id: integer('property_id').notNull().references(() => properties.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  starts_at: integer('starts_at').notNull(),
  ends_at: integer('ends_at').notNull(),
  position: integer('position').default(0), // carousel position priority
  is_active: boolean('is_active').default(true),
  created_at: integer('created_at').default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Relations for billing tables
export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.user_id],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.plan_id],
    references: [plans.id],
  }),
  entitlements: many(entitlements),
  payments: many(payments),
}));

export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  user: one(users, {
    fields: [entitlements.user_id],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [entitlements.subscription_id],
    references: [subscriptions.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.user_id],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscription_id],
    references: [subscriptions.id],
  }),
  plan: one(plans, {
    fields: [payments.plan_id],
    references: [plans.id],
  }),
}));

export const heroSlotsRelations = relations(hero_slots, ({ one }) => ({
  property: one(properties, {
    fields: [hero_slots.property_id],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [hero_slots.user_id],
    references: [users.id],
  }),
}));

// ==========================================
// COMPREHENSIVE BOTSWANA LOCATION SYSTEM
// Based on 2022 Population and Housing Census
// Hierarchy: District → Settlement (City/Town/Village) → Ward → Plot
// ==========================================

// Districts table - 28 Census Districts
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Census district codes like "01", "02", etc.
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // 'city', 'town', 'rural_district'
  region: text("region"), // Northern, Central, Eastern, Southern, etc.
  population: integer("population"), // 2022 Census population
  area_km2: doublePrecision("area_km2"), // Area in square kilometers
  population_density: doublePrecision("population_density"), // People per km2
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Settlements table - Cities, Towns, Villages within Districts
export const settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  district_id: integer("district_id").references(() => districts.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'city', 'town', 'village'
  population: integer("population"), // 2022 Census population
  growth_rate: doublePrecision("growth_rate"), // Population growth rate
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  post_code: text("post_code"),
  is_major: boolean("is_major").default(false), // Major settlements (population >= 5000)
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Wards table - Administrative divisions within settlements
export const wards = pgTable("wards", {
  id: serial("id").primaryKey(),
  settlement_id: integer("settlement_id").references(() => settlements.id).notNull(),
  name: text("name").notNull(),
  ward_number: text("ward_number"), // Official ward number if available
  constituency: text("constituency"), // Parliamentary constituency
  population: integer("population"),
  area_description: text("area_description"), // Description of ward boundaries
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Plots table - Specific addresses/plots within wards
export const plots = pgTable("plots", {
  id: serial("id").primaryKey(),
  ward_id: integer("ward_id").references(() => wards.id),
  settlement_id: integer("settlement_id").references(() => settlements.id), // Allow direct settlement reference for areas without defined wards
  plot_number: text("plot_number"),
  street_name: text("street_name"),
  street_number: text("street_number"),
  block_name: text("block_name"), // For areas like "Mogoditshane Block 5"
  full_address: text("full_address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Location Relations
export const districtsRelations = relations(districts, ({ many }) => ({
  settlements: many(settlements),
}));

export const settlementsRelations = relations(settlements, ({ one, many }) => ({
  district: one(districts, {
    fields: [settlements.district_id],
    references: [districts.id],
  }),
  wards: many(wards),
  plots: many(plots), // Direct plots for areas without defined wards
}));

export const wardsRelations = relations(wards, ({ one, many }) => ({
  settlement: one(settlements, {
    fields: [wards.settlement_id],
    references: [settlements.id],
  }),
  plots: many(plots),
}));

export const plotsRelations = relations(plots, ({ one }) => ({
  ward: one(wards, {
    fields: [plots.ward_id],
    references: [wards.id],
  }),
  settlement: one(settlements, {
    fields: [plots.settlement_id],
    references: [settlements.id],
  }),
}));

// Location search indexes for performance
// These will be created via database migrations
export const locationIndexes = [
  // District lookups
  "CREATE INDEX IF NOT EXISTS idx_districts_code ON districts(code)",
  "CREATE INDEX IF NOT EXISTS idx_districts_name ON districts(name)",

  // Settlement lookups
  "CREATE INDEX IF NOT EXISTS idx_settlements_district ON settlements(district_id)",
  "CREATE INDEX IF NOT EXISTS idx_settlements_name ON settlements(name)",
  "CREATE INDEX IF NOT EXISTS idx_settlements_type ON settlements(type)",
  "CREATE INDEX IF NOT EXISTS idx_settlements_population ON settlements(population DESC)",

  // Ward lookups
  "CREATE INDEX IF NOT EXISTS idx_wards_settlement ON wards(settlement_id)",
  "CREATE INDEX IF NOT EXISTS idx_wards_name ON wards(name)",

  // Plot lookups
  "CREATE INDEX IF NOT EXISTS idx_plots_ward ON plots(ward_id)",
  "CREATE INDEX IF NOT EXISTS idx_plots_settlement ON plots(settlement_id)",
  "CREATE INDEX IF NOT EXISTS idx_plots_address ON plots(full_address)",
  "CREATE INDEX IF NOT EXISTS idx_plots_location ON plots(latitude, longitude)",
];