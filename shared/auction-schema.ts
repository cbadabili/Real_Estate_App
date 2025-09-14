import { pgTable, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core';
import { properties, users } from "./schema";

// Auction bids table
export const auctionBids = pgTable("auction_bids", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  bidderId: integer("bidder_id").references(() => users.id).notNull(),
  bidAmount: numeric("bid_amount").notNull(),
  bidTime: timestamp("bid_time").defaultNow(),
  isWinningBid: integer("is_winning_bid", { mode: "boolean" }).default(false),
  bidStatus: text("bid_status").notNull().default("active"), // 'active', 'outbid', 'winning', 'withdrawn'
  createdAt: timestamp("created_at").defaultNow(),
});

// Auction registrations
export const auctionRegistrations = pgTable("auction_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  bidderId: integer("bidder_id").references(() => users.id).notNull(),
  registrationNumber: text("registration_number").notNull(),
  depositPaid: numeric("deposit_paid"),
  registrationDate: timestamp("registration_date").defaultNow(),
  status: text("status").notNull().default("registered"), // 'registered', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// Auction results
export const auctionResults = pgTable("auction_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  winningBidderId: integer("winning_bidder_id").references(() => users.id),
  finalBidAmount: numeric("final_bid_amount"),
  auctionStatus: text("auction_status").notNull(), // 'sold', 'unsold', 'withdrawn', 'postponed'
  auctionEndTime: timestamp("auction_end_time"),
  totalBids: integer("total_bids").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});