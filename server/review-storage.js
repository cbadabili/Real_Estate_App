import { db } from "./db";
import { userReviews, reviewResponses, reviewHelpful, userPermissions, adminAuditLog, users } from "../shared/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
export class ReviewStorage {
    // User Reviews
    async getUserReview(id) {
        const [review] = await db.select().from(userReviews).where(eq(userReviews.id, id));
        return review;
    }
    async getUserReviews(filters = {}) {
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
            conditions.push(sql `${userReviews.rating} >= ${filters.minRating}`);
        }
        if (filters.maxRating) {
            conditions.push(sql `${userReviews.rating} <= ${filters.maxRating}`);
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
        }
        else if (sortBy === 'date') {
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
    async getUserReviewsWithDetails(filters = {}) {
        const reviews = await this.getUserReviews(filters);
        const reviewsWithDetails = await Promise.all(reviews.map(async (review) => {
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
                .select({ count: sql `count(*)` })
                .from(reviewResponses)
                .where(eq(reviewResponses.reviewId, review.id));
            // Get helpful votes
            const helpfulStats = await this.getReviewHelpfulStats(review.id);
            return {
                ...review,
                reviewer: reviewer || { firstName: 'Unknown', lastName: 'User', avatar: null },
                reviewee: reviewee || { firstName: 'Unknown', lastName: 'User', avatar: null },
                responsesCount: responsesResult?.count || 0,
                helpfulCount: helpfulStats.helpful,
                notHelpfulCount: helpfulStats.notHelpful,
            };
        }));
        return reviewsWithDetails;
    }
    async createUserReview(review) {
        const [newReview] = await db.insert(userReviews).values(review).returning();
        return newReview;
    }
    async updateUserReview(id, updates) {
        const [updatedReview] = await db
            .update(userReviews)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(userReviews.id, id))
            .returning();
        return updatedReview;
    }
    async deleteUserReview(id) {
        const deleted = await db
            .delete(userReviews)
            .where(eq(userReviews.id, id))
            .returning({ id: userReviews.id });
        return deleted.length > 0;
    }
    async getUserReviewStats(userId) {
        // Get total reviews and average rating
        const [statsResult] = await db
            .select({
            totalReviews: sql `count(*)`,
            averageRating: sql `avg(${userReviews.rating})`,
        })
            .from(userReviews)
            .where(and(eq(userReviews.revieweeId, userId), eq(userReviews.status, 'active'), eq(userReviews.isPublic, true)));
        // Get rating distribution
        const ratingDistribution = await db
            .select({
            rating: userReviews.rating,
            count: sql `count(*)`,
        })
            .from(userReviews)
            .where(and(eq(userReviews.revieweeId, userId), eq(userReviews.status, 'active'), eq(userReviews.isPublic, true)))
            .groupBy(userReviews.rating);
        // Get verified reviews count
        const [verifiedStats] = await db
            .select({ count: sql `count(*)` })
            .from(userReviews)
            .where(and(eq(userReviews.revieweeId, userId), eq(userReviews.isVerified, true), eq(userReviews.status, 'active')));
        // Get total helpful votes
        const [helpfulStats] = await db
            .select({ count: sql `count(*)` })
            .from(reviewHelpful)
            .innerJoin(userReviews, eq(reviewHelpful.reviewId, userReviews.id))
            .where(and(eq(userReviews.revieweeId, userId), eq(reviewHelpful.isHelpful, true)));
        const distribution = {};
        ratingDistribution.forEach(item => {
            distribution[item.rating] = item.count;
        });
        return {
            totalReviews: statsResult?.totalReviews || 0,
            averageRating: parseFloat(statsResult?.averageRating?.toString() || '0'),
            ratingDistribution: distribution,
            verifiedReviews: verifiedStats?.count || 0,
            helpfulVotes: helpfulStats?.count || 0,
        };
    }
    // Review Responses
    async getReviewResponse(id) {
        const [response] = await db.select().from(reviewResponses).where(eq(reviewResponses.id, id));
        return response;
    }
    async getReviewResponses(reviewId) {
        return await db
            .select()
            .from(reviewResponses)
            .where(eq(reviewResponses.reviewId, reviewId))
            .orderBy(desc(reviewResponses.createdAt));
    }
    async createReviewResponse(response) {
        const [newResponse] = await db.insert(reviewResponses).values(response).returning();
        return newResponse;
    }
    async updateReviewResponse(id, updates) {
        const [updatedResponse] = await db
            .update(reviewResponses)
            .set(updates)
            .where(eq(reviewResponses.id, id))
            .returning();
        return updatedResponse;
    }
    async deleteReviewResponse(id) {
        const deleted = await db
            .delete(reviewResponses)
            .where(eq(reviewResponses.id, id))
            .returning({ id: reviewResponses.id });
        return deleted.length > 0;
    }
    // Review Helpful Votes
    async getReviewHelpful(reviewId, userId) {
        const [vote] = await db
            .select()
            .from(reviewHelpful)
            .where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.userId, userId)));
        return vote;
    }
    async getReviewHelpfulStats(reviewId) {
        const [helpfulCount] = await db
            .select({ count: sql `count(*)` })
            .from(reviewHelpful)
            .where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.isHelpful, true)));
        const [notHelpfulCount] = await db
            .select({ count: sql `count(*)` })
            .from(reviewHelpful)
            .where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.isHelpful, false)));
        return {
            helpful: helpfulCount?.count || 0,
            notHelpful: notHelpfulCount?.count || 0,
        };
    }
    async voteReviewHelpful(vote) {
        // First check if vote already exists
        const existingVote = await this.getReviewHelpful(vote.reviewId, vote.userId);
        if (existingVote) {
            // Update existing vote
            return await this.updateReviewHelpful(vote.reviewId, vote.userId, vote.isHelpful);
        }
        else {
            // Create new vote
            const [newVote] = await db.insert(reviewHelpful).values(vote).returning();
            return newVote;
        }
    }
    async updateReviewHelpful(reviewId, userId, isHelpful) {
        const [updatedVote] = await db
            .update(reviewHelpful)
            .set({ isHelpful, createdAt: new Date() })
            .where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.userId, userId)))
            .returning();
        return updatedVote;
    }
    async deleteReviewHelpful(reviewId, userId) {
        const deleted = await db
            .delete(reviewHelpful)
            .where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.userId, userId)))
            .returning({ id: reviewHelpful.id });
        return deleted.length > 0;
    }
    // User Permissions
    async getUserPermission(id) {
        const [permission] = await db.select().from(userPermissions).where(eq(userPermissions.id, id));
        return permission;
    }
    async getUserPermissions(userId) {
        return await db
            .select()
            .from(userPermissions)
            .where(and(eq(userPermissions.userId, userId), sql `(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > now())`));
    }
    async createUserPermission(permission) {
        const [newPermission] = await db.insert(userPermissions).values(permission).returning();
        return newPermission;
    }
    async revokeUserPermission(userId, permission) {
        const deleted = await db
            .delete(userPermissions)
            .where(and(eq(userPermissions.userId, userId), eq(userPermissions.permission, permission)))
            .returning({ id: userPermissions.id });
        return deleted.length > 0;
    }
    async hasUserPermission(userId, permission) {
        const [result] = await db
            .select({ count: sql `count(*)` })
            .from(userPermissions)
            .where(and(eq(userPermissions.userId, userId), eq(userPermissions.permission, permission), sql `(${userPermissions.expiresAt} IS NULL OR ${userPermissions.expiresAt} > now())`));
        return (result?.count || 0) > 0;
    }
    // Admin Audit Log
    async getAuditLog(filters = {}) {
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
        const logs = await query;
        // JSONB fields are automatically parsed by Drizzle
        return logs.map(log => ({
            ...log,
            details: log.details // No need to parse JSON.parse if it's JSONB
        }));
    }
    async createAuditLogEntry(entry) {
        // Drizzle handles JSONB serialization automatically
        const entryData = {
            ...entry,
            details: entry.details
        };
        const [newEntry] = await db.insert(adminAuditLog).values(entryData).returning();
        return newEntry;
    }
    // Moderation
    async flagReview(reviewId, reason) {
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
    async moderateReview(reviewId, status, moderatorNotes) {
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
    async getReviewsForModeration(limit = 50) {
        return await db
            .select()
            .from(userReviews)
            .where(eq(userReviews.status, 'flagged'))
            .orderBy(desc(userReviews.updatedAt))
            .limit(limit);
    }
}
export const reviewStorage = new ReviewStorage();
