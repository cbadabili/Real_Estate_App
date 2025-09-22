import jwt from 'jsonwebtoken';
import { UserRole, UserType, Permission } from '../shared/schema';
import { storage } from './storage';
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
const ROLE_PERMISSIONS = {
    [UserRole.USER]: USER_PERMISSIONS,
    [UserRole.MODERATOR]: MODERATOR_PERMISSIONS,
    [UserRole.ADMIN]: ADMIN_PERMISSIONS,
    [UserRole.SUPER_ADMIN]: SUPER_ADMIN_PERMISSIONS,
};
// User type specific permissions
const USER_TYPE_PERMISSIONS = {
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
    static hasPermission(user, permission) {
        if (!user.isActive)
            return false;
        // Check role-based permissions
        const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
        if (rolePermissions.includes(permission))
            return true;
        // Check user type permissions
        const userTypePermissions = USER_TYPE_PERMISSIONS[user.userType] || [];
        if (userTypePermissions.includes(permission))
            return true;
        // Check custom user permissions
        const customPermissions = user.permissions || [];
        return customPermissions.includes(permission);
    }
    // Check if user has any of the specified permissions
    static hasAnyPermission(user, permissions) {
        return permissions.some(permission => this.hasPermission(user, permission));
    }
    // Check if user has all specified permissions
    static hasAllPermissions(user, permissions) {
        return permissions.every(permission => this.hasPermission(user, permission));
    }
    // Check if user is admin (any admin role)
    static isAdmin(user) {
        return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role) ||
            user.userType === UserType.ADMIN;
    }
    // Check if user is moderator or higher
    static isModerator(user) {
        return [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role) ||
            user.userType === UserType.ADMIN;
    }
    // Check if user can moderate content
    static canModerate(user) {
        return this.hasPermission(user, Permission.MODERATE_REVIEW) || this.isAdmin(user);
    }
    // Get all permissions for a user
    static getUserPermissions(user) {
        const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
        const userTypePermissions = USER_TYPE_PERMISSIONS[user.userType] || [];
        const customPermissions = user.permissions || [];
        return Array.from(new Set([
            ...rolePermissions,
            ...userTypePermissions,
            ...customPermissions
        ]));
    }
}
// JWT utilities
const JWT_SECRET = process.env.JWT_SECRET || 'beedab-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const generateToken = (user) => {
    const payload = {
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
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET, {
        issuer: 'beedab-api',
        audience: 'beedab-client'
    });
};
// Authentication middleware
export const authenticate = async (req, res, next) => {
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
        }
        catch (jwtError) {
            // Reduce console noise for common JWT errors
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            else if (jwtError.name === 'JsonWebTokenError') {
                // Don't log malformed token errors - they're common and not actionable
                return res.status(401).json({ message: 'Invalid token' });
            }
            else {
                console.error('JWT verification failed:', jwtError.message);
                return res.status(401).json({ message: 'Authentication failed' });
            }
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed' });
    }
};
// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuthenticate = async (req, res, next) => {
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
        }
        catch (jwtError) {
            // Invalid JWT, continue without authentication
            console.debug('Optional auth: Invalid JWT provided');
        }
        return next();
    }
    catch (error) {
        console.error('Optional authentication error:', error);
        return next();
    }
};
// Authorization middleware factory
export const authorize = (...permissions) => {
    return (req, res, next) => {
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
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const hasRole = roles.includes(req.user.role);
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
export const requireUserType = (...userTypes) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const hasUserType = userTypes.includes(req.user.userType);
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
export const requireOwnerOrAdmin = (getResourceOwnerId) => {
    return async (req, res, next) => {
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
        }
        catch (error) {
            console.error('Ownership check error:', error);
            return res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};
export function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userPermissions = req.user.permissions || [];
        if (!userPermissions.includes(permission)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}
