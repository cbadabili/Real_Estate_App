import { Request, Response, NextFunction } from 'express';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { User, UserRole, UserType, Permission } from '../shared/schema';
import { storage } from './storage';

// Define AuthenticatedRequest to include the user property
interface AuthenticatedRequest extends Request {
  user?: User;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Base permissions for each role
const USER_PERMISSIONS = [
  Permission.CREATE_PROPERTY,
  Permission.UPDATE_PROPERTY,
  Permission.VIEW_PROPERTY,
  Permission.CREATE_REVIEW,
  Permission.UPDATE_REVIEW,
  Permission.VIEW_REVIEW,
  Permission.RESPOND_TO_REVIEW,
];

const MODERATOR_PERMISSIONS = [
  ...USER_PERMISSIONS,
  Permission.MODERATE_REVIEW,
  Permission.DELETE_REVIEW,
  Permission.APPROVE_PROPERTY,
  Permission.VERIFY_USER,
];

const ADMIN_PERMISSIONS = [
  ...MODERATOR_PERMISSIONS,
  Permission.VIEW_ADMIN_PANEL,
  Permission.MANAGE_PERMISSIONS,
  Permission.VIEW_AUDIT_LOG,
  Permission.BAN_USER,
  Permission.DELETE_USER,
  Permission.FEATURE_PROPERTY,
  Permission.MANAGE_SERVICES,
  Permission.APPROVE_SERVICE_PROVIDER,
];

const SUPER_ADMIN_PERMISSIONS = [
  ...ADMIN_PERMISSIONS,
  Permission.SYSTEM_SETTINGS,
  Permission.DELETE_PROPERTY,
];

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  [UserRole.MODERATOR]: MODERATOR_PERMISSIONS,
  [UserRole.ADMIN]: ADMIN_PERMISSIONS,
  [UserRole.SUPER_ADMIN]: SUPER_ADMIN_PERMISSIONS,
};

// User type specific permissions
const USER_TYPE_PERMISSIONS: Record<UserType, Permission[]> = {
  [UserType.BUYER]: [Permission.VIEW_PROPERTY, Permission.CREATE_REVIEW],
  [UserType.SELLER]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.RESPOND_TO_REVIEW
  ],
  [UserType.AGENT]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.RESPOND_TO_REVIEW,
    Permission.VERIFY_USER,
  ],
  [UserType.FSBO]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.RESPOND_TO_REVIEW,
  ],
  [UserType.ADMIN]: [
    ...Object.values(Permission)
  ],
};

export class AuthService {
  // Check if user has specific permission
  static hasPermission(user: User, permission: Permission | string): boolean {
    if (!user.isActive) return false;

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    if (rolePermissions.includes(permission as Permission)) return true;

    // Check user type permissions
    const userTypePermissions = USER_TYPE_PERMISSIONS[user.userType as UserType] || [];
    if (userTypePermissions.includes(permission as Permission)) return true;

    // Check custom user permissions
    const customPermissions = user.permissions || [];
    return customPermissions.includes(permission);
  }

  // Check if user has any of the specified permissions
  static hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission));
  }

  // Check if user has all specified permissions
  static hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission));
  }

  // Check if user is admin (any admin role)
  static isAdmin(user: User): boolean {
    return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role as UserRole) ||
           user.userType === UserType.ADMIN;
  }

  // Check if user is moderator or higher
  static isModerator(user: User): boolean {
    return [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role as UserRole) ||
           user.userType === UserType.ADMIN;
  }

  // Check if user can moderate content
  static canModerate(user: User): boolean {
    return this.hasPermission(user, Permission.MODERATE_REVIEW) || this.isAdmin(user);
  }

  // Get all permissions for a user
  static getUserPermissions(user: User): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    const userTypePermissions = USER_TYPE_PERMISSIONS[user.userType as UserType] || [];
    const customPermissions = user.permissions || [];

    return Array.from(new Set([
      ...rolePermissions,
      ...userTypePermissions,
      ...customPermissions as Permission[]
    ]));
  }
}

// JWT utilities
import { env } from './utils/env';

const resolvedSecret = process.env.JWT_SECRET ?? env.JWT_SECRET;

if (!resolvedSecret) {
  throw new Error("JWT_SECRET environment variable is not configured");
}

const JWT_SECRET: Secret = resolvedSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: number;
  email: string;
  userType: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    userType: user.userType,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: 'beedab-api',
    audience: 'beedab-client'
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'beedab-api',
    audience: 'beedab-client'
  }) as JWTPayload;
};

// Authentication middleware
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid token provided' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // Verify JWT token
      const decoded = verifyToken(token);
      const user = await storage.getUser(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'User account is inactive' });
      }

      req.user = user;
      return next();
    } catch (jwtError: any) {
      // Reduce console noise for common JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else if (jwtError.name === 'JsonWebTokenError') {
        // Don't log malformed token errors - they're common and not actionable
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        console.error('JWT verification failed:', jwtError.message);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuthenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      return next();
    }

    try {
      // ONLY accept valid JWT tokens - no numeric ID fallback
      const decoded = verifyToken(token);
      const user = await storage.getUser(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (jwtError) {
      // Invalid JWT, continue without authentication
      console.debug('Optional auth: Invalid JWT provided');
    }

    return next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    return next();
  }
};

// Authorization middleware factory
export const authorize = (...permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasPermission = permissions.length === 0 ||
                         AuthService.hasAnyPermission(req.user, permissions);

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permissions,
        user_permissions: AuthService.getUserPermissions(req.user)
      });
    }

    next();
  };
};

// Role-based authorization
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasRole = roles.includes(req.user.role as UserRole);
    if (!hasRole) {
      return res.status(403).json({
        error: 'Insufficient role',
        required: roles,
        user_role: req.user.role
      });
    }

    next();
  };
};

// User type authorization
export const requireUserType = (...userTypes: UserType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasUserType = userTypes.includes(req.user.userType as UserType);
    if (!hasUserType) {
      return res.status(403).json({
        error: 'Insufficient user type',
        required: userTypes,
        user_type: req.user.userType
      });
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN);

// Moderator or admin middleware
export const requireModerator = requireRole(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN);

// Owner or admin middleware (for resource ownership)
export const requireOwnerOrAdmin = (getResourceOwnerId: (req: Request) => Promise<number>) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const resourceOwnerId = await getResourceOwnerId(req);
      const isOwner = req.user.id === resourceOwnerId;
      const isAdmin = AuthService.isAdmin(req.user);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Access denied: not owner or admin' });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};

export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(permission as string)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}