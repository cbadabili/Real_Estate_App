import { type UserReview, type InsertUserReview, type ReviewResponse, type InsertReviewResponse, type ReviewHelpful, type InsertReviewHelpful, type UserPermission, type InsertUserPermission, type AdminAuditLog, type InsertAdminAuditLog, Permission } from "../shared/schema";
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
    getUserReview(id: number): Promise<UserReview | undefined>;
    getUserReviews(filters?: ReviewFilters): Promise<UserReview[]>;
    getUserReviewsWithDetails(filters?: ReviewFilters): Promise<(UserReview & {
        reviewer: {
            firstName: string;
            lastName: string;
            avatar?: string | null;
        };
        reviewee: {
            firstName: string;
            lastName: string;
            avatar?: string | null;
        };
        responsesCount?: number;
        helpfulCount?: number;
        notHelpfulCount?: number;
    })[]>;
    createUserReview(review: InsertUserReview): Promise<UserReview>;
    updateUserReview(id: number, updates: Partial<InsertUserReview>): Promise<UserReview | undefined>;
    deleteUserReview(id: number): Promise<boolean>;
    getUserReviewStats(userId: number): Promise<ReviewStats>;
    getReviewResponse(id: number): Promise<ReviewResponse | undefined>;
    getReviewResponses(reviewId: number): Promise<ReviewResponse[]>;
    createReviewResponse(response: InsertReviewResponse): Promise<ReviewResponse>;
    updateReviewResponse(id: number, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined>;
    deleteReviewResponse(id: number): Promise<boolean>;
    getReviewHelpful(reviewId: number, userId: number): Promise<ReviewHelpful | undefined>;
    getReviewHelpfulStats(reviewId: number): Promise<{
        helpful: number;
        notHelpful: number;
    }>;
    voteReviewHelpful(vote: InsertReviewHelpful): Promise<ReviewHelpful>;
    updateReviewHelpful(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpful | undefined>;
    deleteReviewHelpful(reviewId: number, userId: number): Promise<boolean>;
    getUserPermission(id: number): Promise<UserPermission | undefined>;
    getUserPermissions(userId: number): Promise<UserPermission[]>;
    createUserPermission(permission: InsertUserPermission): Promise<UserPermission>;
    revokeUserPermission(userId: number, permission: string): Promise<boolean>;
    hasUserPermission(userId: number, permission: Permission): Promise<boolean>;
    getAuditLog(filters?: {
        adminId?: number;
        action?: string;
        targetType?: string;
        limit?: number;
        offset?: number;
    }): Promise<AdminAuditLog[]>;
    createAuditLogEntry(entry: InsertAdminAuditLog): Promise<AdminAuditLog>;
    flagReview(reviewId: number, reason?: string): Promise<boolean>;
    moderateReview(reviewId: number, status: string, moderatorNotes?: string): Promise<UserReview | undefined>;
    getReviewsForModeration(limit?: number): Promise<UserReview[]>;
}
export declare class ReviewStorage implements IReviewStorage {
    getUserReview(id: number): Promise<UserReview | undefined>;
    getUserReviews(filters?: ReviewFilters): Promise<UserReview[]>;
    getUserReviewsWithDetails(filters?: ReviewFilters): Promise<(UserReview & {
        reviewer: {
            firstName: string;
            lastName: string;
            avatar?: string | null;
        };
        reviewee: {
            firstName: string;
            lastName: string;
            avatar?: string | null;
        };
        responsesCount?: number;
        helpfulCount?: number;
        notHelpfulCount?: number;
    })[]>;
    createUserReview(review: InsertUserReview): Promise<UserReview>;
    updateUserReview(id: number, updates: Partial<InsertUserReview>): Promise<UserReview | undefined>;
    deleteUserReview(id: number): Promise<boolean>;
    getUserReviewStats(userId: number): Promise<ReviewStats>;
    getReviewResponse(id: number): Promise<ReviewResponse | undefined>;
    getReviewResponses(reviewId: number): Promise<ReviewResponse[]>;
    createReviewResponse(response: InsertReviewResponse): Promise<ReviewResponse>;
    updateReviewResponse(id: number, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined>;
    deleteReviewResponse(id: number): Promise<boolean>;
    getReviewHelpful(reviewId: number, userId: number): Promise<ReviewHelpful | undefined>;
    getReviewHelpfulStats(reviewId: number): Promise<{
        helpful: number;
        notHelpful: number;
    }>;
    voteReviewHelpful(vote: InsertReviewHelpful): Promise<ReviewHelpful>;
    updateReviewHelpful(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpful | undefined>;
    deleteReviewHelpful(reviewId: number, userId: number): Promise<boolean>;
    getUserPermission(id: number): Promise<UserPermission | undefined>;
    getUserPermissions(userId: number): Promise<UserPermission[]>;
    createUserPermission(permission: InsertUserPermission): Promise<UserPermission>;
    revokeUserPermission(userId: number, permission: string): Promise<boolean>;
    hasUserPermission(userId: number, permission: Permission): Promise<boolean>;
    getAuditLog(filters?: {
        adminId?: number;
        action?: string;
        targetType?: string;
        limit?: number;
        offset?: number;
    }): Promise<AdminAuditLog[]>;
    createAuditLogEntry(entry: InsertAdminAuditLog): Promise<AdminAuditLog>;
    flagReview(reviewId: number, reason?: string): Promise<boolean>;
    moderateReview(reviewId: number, status: string, moderatorNotes?: string): Promise<UserReview | undefined>;
    getReviewsForModeration(limit?: number): Promise<UserReview[]>;
}
export declare const reviewStorage: ReviewStorage;
