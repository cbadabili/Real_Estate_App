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
  lastLoginAt: integer("last_login_at"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
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
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
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

// Additional tables for comprehensive property ecosystem

// Service categories organized by journey type
export const serviceCategories = sqliteTable("service_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  journeyType: text("journey_type").notNull(), // 'transaction', 'development', 'ownership', 'skills_training'
  category: text("category").notNull(), // 'professional', 'supplier', 'trade', 'course'
  description: text("description"),
  icon: text("icon"),
  parentCategoryId: integer("parent_category_id").references(() => serviceCategories.id),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Certifications for skilled workers
export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  certificationType: text("certification_type").notNull(), // 'license', 'certificate', 'diploma', 'accreditation'
  certificationName: text("certification_name").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  certificationNumber: text("certification_number"),
  issueDate: integer("issue_date").notNull(),
  expiryDate: integer("expiry_date"),
  documentUrl: text("document_url"),
  verificationStatus: text("verification_status").default("pending"), // 'pending', 'verified', 'rejected'
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: integer("verification_date"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Training programs and courses
export const trainingPrograms = sqliteTable("training_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'construction', 'electrical', 'plumbing', 'business', 'real_estate'
  skillLevel: text("skill_level").notNull(), // 'beginner', 'intermediate', 'advanced', 'certification'
  duration: text("duration"), // e.g., "6 weeks", "3 months"
  format: text("format").notNull(), // 'online', 'in_person', 'hybrid'
  price: text("price"),
  currency: text("currency").default("BWP"),
  maxParticipants: integer("max_participants"),
  currentEnrollment: integer("current_enrollment").default(0),
  startDate: integer("start_date"),
  endDate: integer("end_date"),
  enrollmentDeadline: integer("enrollment_deadline"),
  location: text("location"),
  prerequisites: text("prerequisites"), // JSON string
  learningOutcomes: text("learning_outcomes"), // JSON string
  materials: text("materials"), // JSON string
  certificateOffered: integer("certificate_offered", { mode: "boolean" }).default(false),
  certificationBody: text("certification_body"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  featured: integer("featured", { mode: "boolean" }).default(false),
  rating: text("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Project requests for custom work
export const projectRequests = sqliteTable("project_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  projectType: text("project_type").notNull(), // 'renovation', 'construction', 'maintenance', 'design'
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: text("budget"),
  currency: text("currency").default("BWP"),
  timeline: text("timeline"),
  location: text("location").notNull(),
  requirements: text("requirements"), // JSON string
  attachments: text("attachments"), // JSON string of file URLs
  skillsRequired: text("skills_required"), // JSON array
  status: text("status").default("open"), // 'open', 'in_progress', 'completed', 'cancelled'
  urgency: text("urgency").default("medium"), // 'low', 'medium', 'high', 'urgent'
  contactPreference: text("contact_preference").default("platform"), // 'platform', 'phone', 'email'
  proposalCount: integer("proposal_count").default(0),
  viewCount: integer("view_count").default(0),
  assignedProviderId: integer("assigned_provider_id").references(() => serviceProviders.id),
  assignedDate: integer("assigned_date"),
  completedDate: integer("completed_date"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Proposals for project requests
export const projectProposals = sqliteTable("project_proposals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projectRequests.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  proposalText: text("proposal_text").notNull(),
  estimatedCost: text("estimated_cost"),
  estimatedDuration: text("estimated_duration"),
  methodology: text("methodology"),
  portfolio: text("portfolio"), // JSON string of work examples
  availability: text("availability"),
  terms: text("terms"),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected', 'withdrawn'
  submittedAt: integer("submitted_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Extended user profiles for different user types
export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  profileType: text("profile_type").notNull(), // 'buyer', 'seller', 'agent', 'contractor', 'supplier', 'artisan', 'student'
  businessName: text("business_name"),
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  skills: text("skills"), // JSON array for artisans
  specializations: text("specializations"), // JSON array
  experience: text("experience"),
  education: text("education"), // JSON array
  languages: text("languages"), // JSON array
  workingAreas: text("working_areas"), // JSON array of cities/regions
  availabilitySchedule: text("availability_schedule"), // JSON object
  hourlyRate: text("hourly_rate"),
  minimumProject: text("minimum_project"),
  tools: text("tools"), // JSON array of tools owned
  equipment: text("equipment"), // JSON array of equipment
  insurance: text("insurance"), // JSON object with insurance details
  emergencyContact: text("emergency_contact"), // JSON object
  portfolioUrls: text("portfolio_urls"), // JSON array
  socialMedia: text("social_media"), // JSON object
  achievements: text("achievements"), // JSON array
  membershipAssociations: text("membership_associations"), // JSON array
  backgroundCheck: text("background_check_status").default("pending"),
  profileCompleteness: integer("profile_completeness").default(0), // percentage
  lastActiveAt: integer("last_active_at"),
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Enhanced reviews system
export const enhancedReviews = sqliteTable("enhanced_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  revieweeId: integer("reviewee_id").references(() => users.id),
  serviceProviderId: integer("service_provider_id").references(() => serviceProviders.id),
  projectId: integer("project_id").references(() => projectRequests.id),
  trainingProgramId: integer("training_program_id").references(() => trainingPrograms.id),
  reviewType: text("review_type").notNull(), // 'service', 'project', 'training', 'product'
  overallRating: integer("overall_rating").notNull(), // 1-5
  qualityRating: integer("quality_rating"),
  timelinessRating: integer("timeliness_rating"),
  communicationRating: integer("communication_rating"),
  professionalismRating: integer("professionalism_rating"),
  valueRating: integer("value_rating"),
  reviewTitle: text("review_title"),
  reviewText: text("review_text"),
  pros: text("pros"), // JSON array
  cons: text("cons"), // JSON array
  wouldRecommend: integer("would_recommend", { mode: "boolean" }),
  photoUrls: text("photo_urls"), // JSON array
  responseFromProvider: text("response_from_provider"),
  responseDate: integer("response_date"),
  verifiedPurchase: integer("verified_purchase", { mode: "boolean" }).default(false),
  helpfulVotes: integer("helpful_votes").default(0),
  reportCount: integer("report_count").default(0),
  status: text("status").default("active"), // 'active', 'hidden', 'flagged', 'removed'
  createdAt: integer("created_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
  updatedAt: integer("updated_at").default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

// Relations for new tables
export const serviceCategoriesRelations = relations(serviceCategories, ({ one, many }) => ({
  parentCategory: one(serviceCategories, {
    fields: [serviceCategories.parentCategoryId],
    references: [serviceCategories.id],
  }),
  subcategories: many(serviceCategories),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  user: one(users, {
    fields: [certifications.userId],
    references: [users.id],
  }),
  verifier: one(users, {
    fields: [certifications.verifiedBy],
    references: [users.id],
  }),
}));

export const trainingProgramsRelations = relations(trainingPrograms, ({ one, many }) => ({
  provider: one(serviceProviders, {
    fields: [trainingPrograms.providerId],
    references: [serviceProviders.id],
  }),
  reviews: many(enhancedReviews),
}));

export const projectRequestsRelations = relations(projectRequests, ({ one, many }) => ({
  requester: one(users, {
    fields: [projectRequests.requesterId],
    references: [users.id],
  }),
  assignedProvider: one(serviceProviders, {
    fields: [projectRequests.assignedProviderId],
    references: [serviceProviders.id],
  }),
  proposals: many(projectProposals),
  reviews: many(enhancedReviews),
}));

export const projectProposalsRelations = relations(projectProposals, ({ one }) => ({
  project: one(projectRequests, {
    fields: [projectProposals.projectId],
    references: [projectRequests.id],
  }),
  provider: one(serviceProviders, {
    fields: [projectProposals.providerId],
    references: [serviceProviders.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const enhancedReviewsRelations = relations(enhancedReviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [enhancedReviews.reviewerId],
    references: [users.id],
  }),
  reviewee: one(users, {
    fields: [enhancedReviews.revieweeId],
    references: [users.id],
  }),
  serviceProvider: one(serviceProviders, {
    fields: [enhancedReviews.serviceProviderId],
    references: [serviceProviders.id],
  }),
  project: one(projectRequests, {
    fields: [enhancedReviews.projectId],
    references: [projectRequests.id],
  }),
  trainingProgram: one(trainingPrograms, {
    fields: [enhancedReviews.trainingProgramId],
    references: [trainingPrograms.id],
  }),
}));

// Insert schemas for new tables
export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
  createdAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  verificationStatus: true,
  createdAt: true,
});

export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms).omit({
  id: true,
  currentEnrollment: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectRequestSchema = createInsertSchema(projectRequests).omit({
  id: true,
  status: true,
  proposalCount: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectProposalSchema = createInsertSchema(projectProposals).omit({
  id: true,
  status: true,
  submittedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  profileCompleteness: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnhancedReviewSchema = createInsertSchema(enhancedReviews).omit({
  id: true,
  helpfulVotes: true,
  reportCount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;
export type ProjectRequest = typeof projectRequests.$inferSelect;
export type InsertProjectRequest = z.infer<typeof insertProjectRequestSchema>;
export type ProjectProposal = typeof projectProposals.$inferSelect;
export type InsertProjectProposal = z.infer<typeof insertProjectProposalSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type EnhancedReview = typeof enhancedReviews.$inferSelect;
export type InsertEnhancedReview = z.infer<typeof insertEnhancedReviewSchema>;

// Re-export services schema types for convenience
export * from "./services-schema";