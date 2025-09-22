import { users } from "../../shared/schema";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
export class UserRepository {
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }
    async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
    }
    async getUserByEmail(email) {
        try {
            console.log('Repository: Looking up user by email:', email);
            const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
            console.log('Repository: User lookup result:', user ? `Found user ${user.id}` : 'No user found');
            return user || undefined;
        }
        catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    }
    async createUser(insertUser) {
        // Normalize email before storing
        const normalizedUser = {
            ...insertUser,
            email: insertUser.email?.toLowerCase()
        };
        const [user] = await db
            .insert(users)
            .values(normalizedUser)
            .returning();
        return user;
    }
    async updateUser(id, updates) {
        try {
            const processedUpdates = { ...updates };
            // Normalize email if being updated
            if (processedUpdates.email) {
                processedUpdates.email = processedUpdates.email.toLowerCase();
            }
            const timestampFields = ['lastLoginAt', 'createdAt', 'updatedAt'];
            for (const field of timestampFields) {
                if (processedUpdates[field] !== undefined) {
                    const value = processedUpdates[field];
                    if (value instanceof Date) {
                        // Convert Date to Unix timestamp for bigint storage
                        processedUpdates[field] = Math.floor(value.getTime() / 1000);
                    }
                    else if (typeof value === 'number') {
                        // Keep Unix timestamp as-is for bigint storage
                        processedUpdates[field] = Math.floor(value);
                    }
                    else if (typeof value === 'string') {
                        // Convert ISO string dates to Unix timestamp
                        processedUpdates[field] = Math.floor(new Date(value).getTime() / 1000);
                    }
                }
            }
            // Handle bio field specifically
            if (processedUpdates.bio !== undefined) {
                processedUpdates.bio = processedUpdates.bio || null;
            }
            const [user] = await db
                .update(users)
                .set({
                ...processedUpdates,
                updatedAt: Math.floor(Date.now() / 1000) // Unix timestamp for bigint storage
            })
                .where(eq(users.id, id))
                .returning();
            return user || undefined;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    async getUsers(filters = {}) {
        let query = db.select().from(users);
        const conditions = [];
        if (filters.userType) {
            conditions.push(eq(users.userType, filters.userType));
        }
        if (filters.isActive !== undefined) {
            conditions.push(eq(users.isActive, filters.isActive));
        }
        if (conditions.length > 0) {
            query = query.where(and(...conditions));
        }
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        if (filters.offset) {
            query = query.offset(filters.offset);
        }
        return await query;
    }
}
export const userRepository = new UserRepository();
