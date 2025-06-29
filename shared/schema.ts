import { pgTable, text, serial, integer, boolean, decimal, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // 'buyer', 'seller', 'agent', 'fsbo', 'admin'
  role: text("role").notNull().default("user"), // 'user', 'moderator', 'admin', 'super_admin'
  permissions: json("permissions").$type<string[]>().default([]), // array of permission strings
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  reacNumber: text("reac_number"), // For certified agents
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  propertyType: text("property_type").notNull(), // 'house', 'apartment', 'townhouse', 'commercial', 'farm', 'land'
  listingType: text("listing_type").notNull(), // 'owner', 'agent', 'rental', 'auction'
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  squareFeet: integer("square_feet"),
  areaBuild: integer("area_build"),
  lotSize: decimal("lot_size", { precision: 10, scale: 2 }),
  yearBuilt: integer("year_built"),
  status: text("status").notNull().default('active'), // 'active', 'pending', 'sold', 'withdrawn'
  images: json("images").$type<string[]>().default([]),
  features: json("features").$type<string[]>().default([]),
  virtualTourUrl: text("virtual_tour_url"),
  videoUrl: text("video_url"),
  propertyTaxes: decimal("property_taxes", { precision: 10, scale: 2 }),
  hoaFees: decimal("hoa_fees", { precision: 8, scale: 2 }),
  ownerId: integer("owner_id").references(() => users.id),
  agentId: integer("agent_id").references(() => users.id),
  views: integer("views").default(0),
  daysOnMarket: integer("days_on_market").default(0),
  // Auction-specific fields
  auctionDate: timestamp("auction_date"),
  auctionTime: text("auction_time"),
  startingBid: decimal("starting_bid", { precision: 12, scale: 2 }),
  currentBid: decimal("current_bid", { precision: 12, scale: 2 }),
  reservePrice: decimal("reserve_price", { precision: 12, scale: 2 }),
  auctionHouse: text("auction_house"), // e.g., "First National Bank of Botswana"
  auctioneerName: text("auctioneer_name"),
  auctioneerContact: text("auctioneer_contact"),
  bidIncrement: decimal("bid_increment", { precision: 8, scale: 2 }),
  depositRequired: decimal("deposit_required", { precision: 10, scale: 2 }),
  auctionTerms: text("auction_terms"),
  lotNumber: text("lot_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

// Property reviews and ratings
export const propertyReviews = pgTable("property_reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Agent reviews and ratings
export const agentReviews = pgTable("agent_reviews", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").references(() => users.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  transactionType: text("transaction_type"), // 'buy', 'sell', 'rent'
  createdAt: timestamp("created_at").defaultNow(),
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
  isVerified: boolean("is_verified").default(false), // Verified by transaction
  isPublic: boolean("is_public").default(true),
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
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin audit log
export const adminAuditLog = pgTable("admin_audit_log", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // 'user_ban', 'review_moderate', 'property_approve', etc.
  targetType: text("target_type").notNull(), // 'user', 'property', 'review', etc.
  targetId: integer("target_id").notNull(),
  details: json("details").$type<Record<string, any>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
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
