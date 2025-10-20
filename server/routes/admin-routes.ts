import type { Express } from "express";
import { storage } from "../storage";
import { authenticate } from "../auth-middleware";
import { db } from "../db";
import { users, userReviews, adminAuditLog } from "../../shared/schema";
import { eq, or, ilike, desc, sql } from "drizzle-orm";

export function registerAdminRoutes(app: Express) {
  // Get all users (admin only)
  app.get("/api/admin/users", authenticate, async (req, res) => {
    try {
      if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const search = req.query.search as string || '';

      let query = db.select().from(users);

      if (search) {
        query = query.where(
          or(
            ilike(users.email, `%${search}%`),
            ilike(users.firstName, `%${search}%`),
            ilike(users.lastName, `%${search}%`),
            ilike(users.username, `%${search}%`)
          )
        );
      }

      const allUsers = await query.orderBy(desc(users.createdAt));

      // Remove password hashes from response
      const sanitizedUsers = allUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(sanitizedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  });

  // Update user (admin only)
  app.put("/api/admin/users/:userId", authenticate, async (req, res) => {
    try {
      if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const userId = parseInt(req.params.userId);
      const updates = req.body;

      // Don't allow password updates through this endpoint
      delete updates.password;

      await db.update(users)
        .set({
          ...updates,
          updatedAt: Date.now()
        })
        .where(eq(users.id, userId));

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  });

  // Get all reviews (admin only)
  app.get("/api/admin/reviews", authenticate, async (req, res) => {
    try {
      if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const status = req.query.status as string || 'all';

      let query = db.select().from(userReviews);

      if (status && status !== 'all') {
        query = query.where(eq(userReviews.status, status));
      }

      const allReviews = await query.orderBy(desc(userReviews.createdAt));

      res.json(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews'
      });
    }
  });

  // Moderate review (admin only)
  app.post("/api/admin/reviews/:reviewId/moderate", authenticate, async (req, res) => {
    try {
      if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const reviewId = parseInt(req.params.reviewId);
      const { action } = req.body;

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
      }

      await db.update(userReviews)
        .set({
          status: action === 'approve' ? 'approved' : 'rejected',
          updatedAt: Date.now()
        })
        .where(eq(userReviews.id, reviewId));

      res.json({
        success: true,
        message: `Review ${action}d successfully`
      });
    } catch (error) {
      console.error('Error moderating review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to moderate review'
      });
    }
  });

  // Get audit log (admin only)
  app.get("/api/admin/audit-log", authenticate, async (req, res) => {
    try {
      if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const limit = parseInt(req.query.limit as string) || 50;

      const logs = await db.select()
        .from(adminAuditLog)
        .orderBy(desc(adminAuditLog.createdAt))
        .limit(limit);

      res.json(logs);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audit log'
      });
    }
  });
}
