import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { properties, users } from "./schema";

// Auction bids table
export const auctionBids = sqliteTable("auction_bids", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  bidderId: integer("bidder_id").references(() => users.id).notNull(),
  bidAmount: real("bid_amount").notNull(),
  bidTime: integer("bid_time", { mode: "timestamp" }).defaultNow(),
  isWinningBid: integer("is_winning_bid", { mode: "boolean" }).default(false),
  bidStatus: text("bid_status").notNull().default("active"), // 'active', 'outbid', 'winning', 'withdrawn'
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Auction registrations
export const auctionRegistrations = sqliteTable("auction_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  bidderId: integer("bidder_id").references(() => users.id).notNull(),
  registrationNumber: text("registration_number").notNull(),
  depositPaid: real("deposit_paid"),
  registrationDate: integer("registration_date", { mode: "timestamp" }).defaultNow(),
  status: text("status").notNull().default("registered"), // 'registered', 'approved', 'rejected'
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Auction results
export const auctionResults = sqliteTable("auction_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  winningBidderId: integer("winning_bidder_id").references(() => users.id),
  finalBidAmount: real("final_bid_amount"),
  auctionStatus: text("auction_status").notNull(), // 'sold', 'unsold', 'withdrawn', 'postponed'
  auctionEndTime: integer("auction_end_time", { mode: "timestamp" }),
  totalBids: integer("total_bids").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});