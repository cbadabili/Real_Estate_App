import { Request, Response, NextFunction } from 'express';
import { User, UserRole, UserType, Permission } from '../shared/schema';
interface AuthenticatedRequest extends Request {
    user?: User;
}
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare class AuthService {
    static hasPermission(user: User, permission: Permission | string): boolean;
    static hasAnyPermission(user: User, permissions: Permission[]): boolean;
    static hasAllPermissions(user: User, permissions: Permission[]): boolean;
    static isAdmin(user: User): boolean;
    static isModerator(user: User): boolean;
    static canModerate(user: User): boolean;
    static getUserPermissions(user: User): Permission[];
}
export interface JWTPayload {
    userId: number;
    email: string;
    userType: string;
    role: string;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (user: User) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const optionalAuthenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...permissions: Permission[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRole: (...roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireUserType: (...userTypes: UserType[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireModerator: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireOwnerOrAdmin: (getResourceOwnerId: (req: Request) => Promise<number>) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare function requirePermission(permission: Permission): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
