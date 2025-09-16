import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserType, Permission } from '../shared/schema';
import { storage } from './storage';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name?: string;
      role?: string;
      userType?: string;
      permissions?: string[];
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
  static hasPermission(user: User, permission: string): boolean {
    if (!user.isActive) return false;

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    if (rolePermissions.includes(permission)) return true;

    // Check user type permissions
    const userTypePermissions = USER_TYPE_PERMISSIONS[user.userType as UserType] || [];
    if (userTypePermissions.includes(permission)) return true;

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
const JWT_SECRET = process.env.JWT_SECRET || 'beedab-secret-key-change-in-production';
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
    expiresIn: JWT_EXPIRES_IN,
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
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);

    // Try JWT first, then fall back to legacy simple token
    let userId: number;
    try {
      // Verify JWT token
      const payload = verifyToken(token);
      userId = payload.userId;
    } catch (jwtError) {
      // Fall back to legacy token format for backwards compatibility
      if (token.startsWith('user_')) {
        userId = parseInt(token.split('_')[1]);
      } else {
        userId = parseInt(token);
      }

      if (isNaN(userId)) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Update last login time (Unix timestamp)
    await storage.updateUser(user.id, { lastLoginAt: Math.floor(Date.now() / 1000) });

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = parseInt(token);

      if (!isNaN(userId)) {
        const user = await storage.getUser(userId);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without authentication
  }
};

// Authorization middleware factory
export const authorize = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
  return (req: Request, res: Response, next: NextFunction) => {
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
  return (req: Request, res: Response, next: NextFunction) => {
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
  return async (req: Request, res: Response, next: NextFunction) => {
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
  return (req: Request, res: Response, next: NextFunction) => {
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