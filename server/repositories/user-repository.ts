
import { 
  users,
  type User, 
  type InsertUser
} from "../../shared/schema";
import { db } from "../db";
import { eq, and, type SQL } from "drizzle-orm";

export interface IUserRepository {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsers(filters?: { userType?: string; isActive?: boolean; limit?: number; offset?: number }): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log('Repository: Looking up user by email:', email);
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      console.log('Repository: User lookup result:', user ? `Found user ${user.id}` : 'No user found');
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Normalize email before storing
    const normalizedUser = {
      ...insertUser,
      email: insertUser.email?.toLowerCase()
    };
    
    const [user] = await db
      .insert(users)
      .values(normalizedUser)
      .returning();
    if (!user) {
      throw new Error('Failed to persist user record');
    }
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const processedUpdates: Partial<InsertUser> = { ...updates };

      // Normalize email if being updated
      if (processedUpdates.email) {
        processedUpdates.email = processedUpdates.email.toLowerCase();
      }

      const timestampFields: (keyof Pick<InsertUser, 'lastLoginAt'>)[] = ['lastLoginAt'];

      for (const field of timestampFields) {
        const value = processedUpdates[field];
        if (value === undefined || value === null) {
          continue;
        }

        if (value instanceof Date) {
          continue;
        }

        if (typeof value === 'number') {
          processedUpdates[field] = new Date(value) as Partial<InsertUser>[typeof field];
          continue;
        }

        if (typeof value === 'string') {
          const parsed = new Date(value);
          if (!Number.isNaN(parsed.getTime())) {
            processedUpdates[field] = parsed as Partial<InsertUser>[typeof field];
          } else {
            delete processedUpdates[field];
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
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getUsers(filters: { userType?: string; isActive?: boolean; limit?: number; offset?: number } = {}): Promise<User[]> {
    const conditions: SQL[] = [];
    if (filters.userType) {
      conditions.push(eq(users.userType, filters.userType));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const baseQuery = whereClause
      ? db.select().from(users).where(whereClause)
      : db.select().from(users);

    const limitedQuery = typeof filters.limit === 'number' ? baseQuery.limit(filters.limit) : baseQuery;
    const finalQuery = typeof filters.offset === 'number' ? limitedQuery.offset(filters.offset) : limitedQuery;

    return await finalQuery;
  }
}

export const userRepository = new UserRepository();
