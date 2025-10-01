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
} from "../shared/schema";
import { eq, desc, asc, and, sql, gte, lte, count, type SQL } from "drizzle-orm";

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
  countReviews(filters?: ReviewFilters): Promise<number>;
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
  private buildReviewConditions(filters: ReviewFilters = {}): SQL[] {
    const conditions: SQL[] = [];

    if (filters.revieweeId != null) {
      conditions.push(eq(userReviews.revieweeId, filters.revieweeId));
    }

    if (filters.reviewerId != null) {
      conditions.push(eq(userReviews.reviewerId, filters.reviewerId));
    }

    if (filters.reviewType) {
      conditions.push(eq(userReviews.reviewType, filters.reviewType));
    }

    if (filters.minRating != null) {
      conditions.push(gte(userReviews.rating, filters.minRating));
    }

    if (filters.maxRating != null) {
      conditions.push(lte(userReviews.rating, filters.maxRating));
    }

    if (filters.status) {
      conditions.push(eq(userReviews.status, filters.status));
    }

    if (filters.isPublic !== undefined) {
      conditions.push(eq(userReviews.isPublic, filters.isPublic ? 1 : 0));
    }

    if (filters.isVerified !== undefined) {
      conditions.push(eq(userReviews.isVerified, filters.isVerified ? 1 : 0));
    }

    return conditions;
  }

  // User Reviews
  async getUserReview(id: number): Promise<UserReview | undefined> {
    const [review] = await db.select().from(userReviews).where(eq(userReviews.id, id));
    return review;
  }

  async getUserReviews(filters: ReviewFilters = {}): Promise<UserReview[]> {
    const conditions = this.buildReviewConditions(filters);
    const sortBy = filters.sortBy ?? 'date';
    const sortOrder = filters.sortOrder ?? 'desc';

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderExpression = sortBy === 'rating'
      ? (sortOrder === 'asc' ? asc(userReviews.rating) : desc(userReviews.rating))
      : (sortOrder === 'asc' ? asc(userReviews.createdAt) : desc(userReviews.createdAt));

    const baseQuery = whereClause
      ? db.select().from(userReviews).where(whereClause)
      : db.select().from(userReviews);

    const orderedQuery = baseQuery.orderBy(orderExpression);
    const limitedQuery = typeof filters.limit === 'number' ? orderedQuery.limit(filters.limit) : orderedQuery;
    const finalQuery = typeof filters.offset === 'number' ? limitedQuery.offset(filters.offset) : limitedQuery;

    return await finalQuery;
  }

  async countReviews(filters: ReviewFilters = {}): Promise<number> {
    const conditions = this.buildReviewConditions(filters);
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const query = whereClause
      ? db.select({ value: count() }).from(userReviews).where(whereClause)
      : db.select({ value: count() }).from(userReviews);

    const [result] = await query;
    return Number(result?.value ?? 0);
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
        const [responsesResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(reviewResponses)
          .where(eq(reviewResponses.reviewId, review.id));

        // Get helpful votes
        const helpfulStats = await this.getReviewHelpfulStats(review.id);

        return {
          ...review,
          reviewer: reviewer || { firstName: 'Unknown', lastName: 'User', avatar: null },
          reviewee: reviewee || { firstName: 'Unknown', lastName: 'User', avatar: null },
          responsesCount: Number(responsesResult?.count ?? 0),
          helpfulCount: helpfulStats.helpful,
          notHelpfulCount: helpfulStats.notHelpful,
        };
      })
    );

    return reviewsWithDetails;
  }

  async createUserReview(review: InsertUserReview): Promise<UserReview> {
    const [newReview] = await db.insert(userReviews).values(review).returning();
    if (!newReview) {
      throw new Error('Failed to create review');
    }
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
    const deleted = await db
      .delete(userReviews)
      .where(eq(userReviews.id, id))
      .returning({ id: userReviews.id });
    return deleted.length > 0;
  }

  async getUserReviewStats(userId: number): Promise<ReviewStats> {
    // Get total reviews and average rating
    const [statsResult] = await db
      .select({
        totalReviews: sql<number>`count(*)`,
        averageRating: sql<number | null>`avg(${userReviews.rating})`,
      })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.status, 'active'),
        eq(userReviews.isPublic, 1)
      ));

    // Get rating distribution
    const ratingDistribution = await db
      .select({
        rating: userReviews.rating,
        count: sql`count(*)`,
      })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.status, 'active'),
        eq(userReviews.isPublic, 1)
      ))
      .groupBy(userReviews.rating);

    // Get verified reviews count
    const [verifiedStats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userReviews)
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(userReviews.isVerified, 1),
        eq(userReviews.status, 'active')
      ));

    // Get total helpful votes
    const [helpfulStats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviewHelpful)
      .innerJoin(userReviews, eq(reviewHelpful.reviewId, userReviews.id))
      .where(and(
        eq(userReviews.revieweeId, userId),
        eq(reviewHelpful.isHelpful, true)
      ));

    const distribution: Record<number, number> = {};
    ratingDistribution.forEach((item) => {
      distribution[item.rating] = Number(item.count ?? 0);
    });

    return {
      totalReviews: Number(statsResult?.totalReviews ?? 0),
      averageRating: Number(statsResult?.averageRating ?? 0),
      ratingDistribution: distribution,
      verifiedReviews: Number(verifiedStats?.count ?? 0),
      helpfulVotes: Number(helpfulStats?.count ?? 0),
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
    if (!newResponse) {
      throw new Error('Failed to create review response');
    }
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
    const deleted = await db
      .delete(reviewResponses)
      .where(eq(reviewResponses.id, id))
      .returning({ id: reviewResponses.id });
    return deleted.length > 0;
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
      .select({ count: sql<number>`count(*)` })
      .from(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.isHelpful, true)
      ));

    const [notHelpfulCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.isHelpful, false)
      ));

    return {
      helpful: Number(helpfulCount?.count ?? 0),
      notHelpful: Number(notHelpfulCount?.count ?? 0),
    };
  }

  async voteReviewHelpful(vote: InsertReviewHelpful): Promise<ReviewHelpful> {
    // First check if vote already exists
    const existingVote = await this.getReviewHelpful(vote.reviewId, vote.userId);

    if (existingVote) {
      // Update existing vote
      const updated = await this.updateReviewHelpful(vote.reviewId, vote.userId, vote.isHelpful);
      return updated ?? existingVote;
    } else {
      // Create new vote
      const [newVote] = await db.insert(reviewHelpful).values(vote).returning();
      if (!newVote) {
        throw new Error('Failed to create review vote');
      }
      return newVote;
    }
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
    const deleted = await db
      .delete(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.userId, userId)
      ))
      .returning({ id: reviewHelpful.id });

    return deleted.length > 0;
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
        sql`(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > now())`
      ));
  }

  async createUserPermission(permission: InsertUserPermission): Promise<UserPermission> {
    const [newPermission] = await db.insert(userPermissions).values(permission).returning();
    if (!newPermission) {
      throw new Error('Failed to create permission');
    }
    return newPermission;
  }

  async revokeUserPermission(userId: number, permission: string): Promise<boolean> {
    const deleted = await db
      .delete(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permission, permission)
      ))
      .returning({ id: userPermissions.id });

    return deleted.length > 0;
  }

  async hasUserPermission(userId: number, permission: Permission): Promise<boolean> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permission, permission),
        sql`(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > now())`
      ));

    return Number(result?.count ?? 0) > 0;
  }

  // Admin Audit Log
  async getAuditLog(filters: { adminId?: number; action?: string; targetType?: string; limit?: number; offset?: number } = {}): Promise<AdminAuditLog[]> {
    const conditions: SQL[] = [];

    if (filters.adminId) {
      conditions.push(eq(adminAuditLog.adminId, filters.adminId));
    }

    if (filters.action) {
      conditions.push(eq(adminAuditLog.action, filters.action));
    }

    if (filters.targetType) {
      conditions.push(eq(adminAuditLog.targetType, filters.targetType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const baseQuery = whereClause
      ? db.select().from(adminAuditLog).where(whereClause)
      : db.select().from(adminAuditLog);

    const orderedQuery = baseQuery.orderBy(desc(adminAuditLog.createdAt));
    const limitedQuery = typeof filters.limit === 'number' ? orderedQuery.limit(filters.limit) : orderedQuery;
    const finalQuery = typeof filters.offset === 'number' ? limitedQuery.offset(filters.offset) : limitedQuery;

    const logs = await finalQuery;

    // JSONB fields are automatically parsed by Drizzle
    return logs.map((log) => ({
      ...log,
      details: log.details // No need to parse JSON.parse if it's JSONB
    }));
  }

  async createAuditLogEntry(entry: InsertAdminAuditLog): Promise<AdminAuditLog> {
    // Drizzle handles JSONB serialization automatically
    const entryData = {
      ...entry,
      details: entry.details
    };

    const [newEntry] = await db.insert(adminAuditLog).values(entryData).returning();

    if (!newEntry) {
      throw new Error('Failed to create audit log entry');
    }

    return newEntry;
  }

  // Moderation
  async flagReview(reviewId: number, reason?: string): Promise<boolean> {
    const flagged = await db
      .update(userReviews)
      .set({ 
        status: 'flagged',
        moderatorNotes: reason,
        updatedAt: new Date()
      })
      .where(eq(userReviews.id, reviewId))
      .returning({ id: userReviews.id });

    return flagged.length > 0;
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