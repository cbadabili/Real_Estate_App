import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
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
  permissions: text("permissions"), // JSON string of permission array
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  reacNumber: text("reac_number"), // For certified agents
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

// Properties table
export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  propertyType: text("property_type").notNull(), // 'house', 'apartment', 'townhouse', 'commercial', 'farm', 'land'
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
  auctionDate: integer("auction_date", { mode: "timestamp" }),
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
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

// Property inquiries
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default('unread'), // 'unread', 'read', 'replied'
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Appointments for property viewings
export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  agentId: integer("agent_id").references(() => users.id),
  appointmentDate: integer("appointment_date", { mode: "timestamp" }).notNull(),
  type: text("type").notNull(), // 'in-person', 'virtual'
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Saved properties (favorites)
export const savedProperties = sqliteTable("saved_properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Property reviews and ratings
export const propertyReviews = sqliteTable("property_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Agent reviews and ratings
export const agentReviews = sqliteTable("agent_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: integer("agent_id").references(() => users.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  transactionType: text("transaction_type"), // 'buy', 'sell', 'rent'
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

// Review responses (for business replies)
export const reviewResponses = sqliteTable("review_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  responderId: integer("responder_id").references(() => users.id).notNull(),
  response: text("response").notNull(),
  isOfficial: integer("is_official", { mode: "boolean" }).default(false), // Official business response
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Review helpful votes
export const reviewHelpful = sqliteTable("review_helpful", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").references(() => userReviews.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isHelpful: integer("is_helpful", { mode: "boolean" }).notNull(), // true for helpful, false for not helpful
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// User permissions and roles
export const userPermissions = sqliteTable("user_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  permission: text("permission").notNull(),
  grantedBy: integer("granted_by").references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
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
  RESPOND_TO_REVIEW = "respond_to_review",

  // Admin operations
  VIEW_ADMIN_PANEL = "view_admin_panel",
  MANAGE_PERMISSIONS = "manage_permissions",
  VIEW_AUDIT_LOG = "view_audit_log",
  SYSTEM_SETTINGS = "system_settings",

  // Services
  MANAGE_SERVICES = "manage_services",
  APPROVE_SERVICE_PROVIDER = "approve_service_provider",
}

// Re-export services schema types for convenience
export * from "./services-schema";