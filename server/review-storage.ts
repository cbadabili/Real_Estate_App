import { db } from "./db";
import { 
  userReviews, 
  reviewResponses, 
  reviewHelpful,
  userPermissions,
  adminAuditLog,
  users,
  type UserReview,
  type InsertUserReview,
  type ReviewResponse,
  type InsertReviewResponse,
  type ReviewHelpful,
  type InsertReviewHelpful,
  type UserPermission,
  type InsertUserPermission,
  type AdminAuditLog,
  type InsertAdminAuditLog,
  Permission
} from "@shared/schema";
import { eq, desc, asc, and, sql, count, avg } from "drizzle-orm";

export interface ReviewFilters {
  revieweeId?: number;
  reviewerId?: number;
  reviewType?: string;
  minRating?: number;
  maxRating?: number;
  status?: string;
  isPublic?: boolean;
  isVerified?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'rating' | 'date' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  verifiedReviews: number;
  helpfulVotes: number;
}

export interface IReviewStorage {
  // User Reviews
  getUserReview(id: number): Promise<UserReview | undefined>;
  getUserReviews(filters?: ReviewFilters): Promise<UserReview[]>;
  getUserReviewsWithDetails(filters?: ReviewFilters): Promise<(UserReview & { 
    reviewer: { firstName: string; lastName: string; avatar?: string | null };
    reviewee: { firstName: string; lastName: string; avatar?: string | null };
    responsesCount?: number;
    helpfulCount?: number;
    notHelpfulCount?: number;
  })[]>;
  createUserReview(review: InsertUserReview): Promise<UserReview>;
  updateUserReview(id: number, updates: Partial<InsertUserReview>): Promise<UserReview | undefined>;
  deleteUserReview(id: number): Promise<boolean>;
  getUserReviewStats(userId: number): Promise<ReviewStats>;
  
  // Review Responses
  getReviewResponse(id: number): Promise<ReviewResponse | undefined>;
  getReviewResponses(reviewId: number): Promise<ReviewResponse[]>;
  createReviewResponse(response: InsertReviewResponse): Promise<ReviewResponse>;
  updateReviewResponse(id: number, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined>;
  deleteReviewResponse(id: number): Promise<boolean>;
  
  // Review Helpful Votes
  getReviewHelpful(reviewId: number, userId: number): Promise<ReviewHelpful | undefined>;
  getReviewHelpfulStats(reviewId: number): Promise<{ helpful: number; notHelpful: number }>;
  voteReviewHelpful(vote: InsertReviewHelpful): Promise<ReviewHelpful>;
  updateReviewHelpful(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpful | undefined>;
  deleteReviewHelpful(reviewId: number, userId: number): Promise<boolean>;
  
  // User Permissions
  getUserPermission(id: number): Promise<UserPermission | undefined>;
  getUserPermissions(userId: number): Promise<UserPermission[]>;
  createUserPermission(permission: InsertUserPermission): Promise<UserPermission>;
  revokeUserPermission(userId: number, permission: string): Promise<boolean>;
  hasUserPermission(userId: number, permission: Permission): Promise<boolean>;
  
  // Admin Audit Log
  getAuditLog(filters?: { adminId?: number; action?: string; targetType?: string; limit?: number; offset?: number }): Promise<AdminAuditLog[]>;
  createAuditLogEntry(entry: InsertAdminAuditLog): Promise<AdminAuditLog>;
  
  // Moderation
  flagReview(reviewId: number, reason?: string): Promise<boolean>;
  moderateReview(reviewId: number, status: string, moderatorNotes?: string): Promise<UserReview | undefined>;
  getReviewsForModeration(limit?: number): Promise<UserReview[]>;
}

export class ReviewStorage implements IReviewStorage {
  // User Reviews
  async getUserReview(id: number): Promise<UserReview | undefined> {
    const [review] = await db.select().from(userReviews).where(eq(userReviews.id, id));
    return review;
  }

  async getUserReviews(filters: ReviewFilters = {}): Promise<UserReview[]> {
    let query = db.select().from(userReviews);
    
    const conditions = [];
    
    if (filters.revieweeId) {
      conditions.push(eq(userReviews.revieweeId, filters.revieweeId));
    }
    
    if (filters.reviewerId) {
      conditions.push(eq(userReviews.reviewerId, filters.reviewerId));
    }
    
    if (filters.reviewType) {
      conditions.push(eq(userReviews.reviewType, filters.reviewType));
    }
    
    if (filters.minRating) {
      conditions.push(sql`${userReviews.rating} >= ${filters.minRating}`);
    }
    
    if (filters.maxRating) {
      conditions.push(sql`${userReviews.rating} <= ${filters.maxRating}`);
    }
    
    if (filters.status) {
      conditions.push(eq(userReviews.status, filters.status));
    }
    
    if (filters.isPublic !== undefined) {
      conditions.push(eq(userReviews.isPublic, filters.isPublic));
    }
    
    if (filters.isVerified !== undefined) {
      conditions.push(eq(userReviews.isVerified, filters.isVerified));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Sorting
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    if (sortBy === 'rating') {
      query = sortOrder === 'asc' ? query.orderBy(asc(userReviews.rating)) : query.orderBy(desc(userReviews.rating));
    } else if (sortBy === 'date') {
      query = sortOrder === 'asc' ? query.orderBy(asc(userReviews.createdAt)) : query.orderBy(desc(userReviews.createdAt));
    }
    
    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getUserReviewsWithDetails(filters: ReviewFilters = {}): Promise<(UserReview & { 
    reviewer: { firstName: string; lastName: string; avatar?: string | null };
    reviewee: { firstName: string; lastName: string; avatar?: string | null };
    responsesCount?: number;
    helpfulCount?: number;
    notHelpfulCount?: number;
  })[]> {
    const reviews = await this.getUserReviews(filters);
    
    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        // Get reviewer details
        const [reviewer] = await db
          .select({ firstName: users.firstName, lastName: users.lastName, avatar: users.avatar })
          .from(users)
          .where(eq(users.id, review.reviewerId));
        
        // Get reviewee details
        const [reviewee] = await db
          .select({ firstName: users.firstName, lastName: users.lastName, avatar: users.avatar })
          .from(users)
          .where(eq(users.id, review.revieweeId));
        
        // Get response count
        const [responsesCount] = await db
          .select({ count: count() })
          .from(reviewResponses)
          .where(eq(reviewResponses.reviewId, review.id));
        
        // Get helpful votes
        const helpfulStats = await this.getReviewHelpfulStats(review.id);
        
        return {
          ...review,
          reviewer: reviewer || { firstName: 'Unknown', lastName: 'User', avatar: null },
          reviewee: reviewee || { firstName: 'Unknown', lastName: 'User', avatar: null },
          responsesCount: responsesCount?.count || 0,
          helpfulCount: helpfulStats.helpful,
          notHelpfulCount: helpfulStats.notHelpful,
        };
      })
    );
    
    return reviewsWithDetails;
  }

  async createUserReview(review: InsertUserReview): Promise<UserReview> {
    const [newReview] = await db.insert(userReviews).values(review).returning();
    return newReview;
  }

  async updateUserReview(id: number, updates: Partial<InsertUserReview>): Promise<UserReview | undefined> {
    const [updatedReview] = await db
      .update(userReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userReviews.id, id))
      .returning();
    
    return updatedReview;
  }

  async deleteUserReview(id: number): Promise<boolean> {
    const result = await db.delete(userReviews).where(eq(userReviews.id, id));
    return result.rowCount! > 0;
  }

  async getUserReviewStats(userId: number): Promise<ReviewStats> {
    // Get total reviews and average rating
    const [stats] = await db
      .select({
        totalReviews: count(),
        averageRating: avg(userReviews.rating),
      })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.status, 'active'),
        eq(userReviews.isPublic, true)
      ));
    
    // Get rating distribution
    const ratingDistribution = await db
      .select({
        rating: userReviews.rating,
        count: count(),
      })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.status, 'active'),
        eq(userReviews.isPublic, true)
      ))
      .groupBy(userReviews.rating);
    
    // Get verified reviews count
    const [verifiedStats] = await db
      .select({ count: count() })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.isVerified, true),
        eq(userReviews.status, 'active')
      ));
    
    // Get total helpful votes
    const [helpfulStats] = await db
      .select({ count: count() })
      .from(reviewHelpful)
      .innerJoin(userReviews, eq(reviewHelpful.reviewId, userReviews.id))
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(reviewHelpful.isHelpful, true)
      ));
    
    const distribution: Record<number, number> = {};
    ratingDistribution.forEach(item => {
      distribution[item.rating] = item.count;
    });
    
    return {
      totalReviews: stats?.totalReviews || 0,
      averageRating: parseFloat(stats?.averageRating?.toString() || '0'),
      ratingDistribution: distribution,
      verifiedReviews: verifiedStats?.count || 0,
      helpfulVotes: helpfulStats?.count || 0,
    };
  }

  // Review Responses
  async getReviewResponse(id: number): Promise<ReviewResponse | undefined> {
    const [response] = await db.select().from(reviewResponses).where(eq(reviewResponses.id, id));
    return response;
  }

  async getReviewResponses(reviewId: number): Promise<ReviewResponse[]> {
    return await db
      .select()
      .from(reviewResponses)
      .where(eq(reviewResponses.reviewId, reviewId))
      .orderBy(desc(reviewResponses.createdAt));
  }

  async createReviewResponse(response: InsertReviewResponse): Promise<ReviewResponse> {
    const [newResponse] = await db.insert(reviewResponses).values(response).returning();
    return newResponse;
  }

  async updateReviewResponse(id: number, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined> {
    const [updatedResponse] = await db
      .update(reviewResponses)
      .set(updates)
      .where(eq(reviewResponses.id, id))
      .returning();
    
    return updatedResponse;
  }

  async deleteReviewResponse(id: number): Promise<boolean> {
    const result = await db.delete(reviewResponses).where(eq(reviewResponses.id, id));
    return result.rowCount! > 0;
  }

  // Review Helpful Votes
  async getReviewHelpful(reviewId: number, userId: number): Promise<ReviewHelpful | undefined> {
    const [vote] = await db
      .select()
      .from(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.userId, userId)
      ));
    
    return vote;
  }

  async getReviewHelpfulStats(reviewId: number): Promise<{ helpful: number; notHelpful: number }> {
    const [helpfulCount] = await db
      .select({ count: count() })
      .from(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.isHelpful, true)
      ));
    
    const [notHelpfulCount] = await db
      .select({ count: count() })
      .from(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.isHelpful, false)
      ));
    
    return {
      helpful: helpfulCount?.count || 0,
      notHelpful: notHelpfulCount?.count || 0,
    };
  }

  async voteReviewHelpful(vote: InsertReviewHelpful): Promise<ReviewHelpful> {
    // Use upsert to handle existing votes
    const [newVote] = await db
      .insert(reviewHelpful)
      .values(vote)
      .onConflictDoUpdate({
        target: [reviewHelpful.reviewId, reviewHelpful.userId],
        set: { isHelpful: vote.isHelpful, createdAt: new Date() }
      })
      .returning();
    
    return newVote;
  }

  async updateReviewHelpful(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpful | undefined> {
    const [updatedVote] = await db
      .update(reviewHelpful)
      .set({ isHelpful, createdAt: new Date() })
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.userId, userId)
      ))
      .returning();
    
    return updatedVote;
  }

  async deleteReviewHelpful(reviewId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.userId, userId)
      ));
    
    return result.rowCount! > 0;
  }

  // User Permissions
  async getUserPermission(id: number): Promise<UserPermission | undefined> {
    const [permission] = await db.select().from(userPermissions).where(eq(userPermissions.id, id));
    return permission;
  }

  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    return await db
      .select()
      .from(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        sql`(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > NOW())`
      ));
  }

  async createUserPermission(permission: InsertUserPermission): Promise<UserPermission> {
    const [newPermission] = await db.insert(userPermissions).values(permission).returning();
    return newPermission;
  }

  async revokeUserPermission(userId: number, permission: string): Promise<boolean> {
    const result = await db
      .delete(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permission, permission)
      ));
    
    return result.rowCount! > 0;
  }

  async hasUserPermission(userId: number, permission: Permission): Promise<boolean> {
    const [result] = await db
      .select({ count: count() })
      .from(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permission, permission),
        sql`(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > NOW())`
      ));
    
    return (result?.count || 0) > 0;
  }

  // Admin Audit Log
  async getAuditLog(filters: { adminId?: number; action?: string; targetType?: string; limit?: number; offset?: number } = {}): Promise<AdminAuditLog[]> {
    let query = db.select().from(adminAuditLog);
    
    const conditions = [];
    
    if (filters.adminId) {
      conditions.push(eq(adminAuditLog.adminId, filters.adminId));
    }
    
    if (filters.action) {
      conditions.push(eq(adminAuditLog.action, filters.action));
    }
    
    if (filters.targetType) {
      conditions.push(eq(adminAuditLog.targetType, filters.targetType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(adminAuditLog.createdAt));
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async createAuditLogEntry(entry: InsertAdminAuditLog): Promise<AdminAuditLog> {
    const [newEntry] = await db.insert(adminAuditLog).values(entry).returning();
    return newEntry;
  }

  // Moderation
  async flagReview(reviewId: number, reason?: string): Promise<boolean> {
    const result = await db
      .update(userReviews)
      .set({ 
        status: 'flagged',
        moderatorNotes: reason,
        updatedAt: new Date()
      })
      .where(eq(userReviews.id, reviewId));
    
    return result.rowCount! > 0;
  }

  async moderateReview(reviewId: number, status: string, moderatorNotes?: string): Promise<UserReview | undefined> {
    const [moderatedReview] = await db
      .update(userReviews)
      .set({ 
        status,
        moderatorNotes,
        updatedAt: new Date()
      })
      .where(eq(userReviews.id, reviewId))
      .returning();
    
    return moderatedReview;
  }

  async getReviewsForModeration(limit: number = 50): Promise<UserReview[]> {
    return await db
      .select()
      .from(userReviews)
      .where(eq(userReviews.status, 'flagged'))
      .orderBy(desc(userReviews.updatedAt))
      .limit(limit);
  }
}

export const reviewStorage = new ReviewStorage();