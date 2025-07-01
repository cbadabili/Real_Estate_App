import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

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
}