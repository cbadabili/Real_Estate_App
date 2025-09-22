import { type User, type InsertUser } from "../../shared/schema";
export interface IUserRepository {
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
    getUsers(filters?: {
        userType?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<User[]>;
}
export declare class UserRepository implements IUserRepository {
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(insertUser: InsertUser): Promise<User>;
    updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
    getUsers(filters?: {
        userType?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<User[]>;
}
export declare const userRepository: UserRepository;
