
import type { Express } from "express";
import { storage } from "../storage";
import { authenticate, optionalAuthenticate, AuthService } from "../auth-middleware";

export function registerUserRoutes(app: Express) {
  // Get user by ID - requires authentication
  app.get("/api/users/:id", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Only allow users to view their own profile, or admins to view any profile
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Auth verification endpoint
  app.get("/api/auth/user", authenticate, async (req, res) => {
    try {
      const { password, ...userResponse } = req.user!;
      res.json(userResponse);
    } catch (error) {
      console.error("Auth verification error:", error);
      res.status(500).json({ message: "Authentication verification failed" });
    }
  });

  // Dashboard statistics endpoint
  app.get("/api/dashboard/stats", authenticate, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = req.user.id;
      console.log('Dashboard stats request for user:', userId);
      
      // Initialize stats with default values
      let stats = {
        savedProperties: 0,
        propertiesViewed: 0,
        inquiriesSent: 0,
        viewingsScheduled: 0,
        activeListings: 0,
        totalViews: 0,
        totalInquiries: 0
      };

      try {
        // Try to fetch saved properties
        const savedProperties = await storage.getSavedProperties(userId);
        stats.savedProperties = savedProperties ? savedProperties.length : 0;
      } catch (error) {
        console.warn('Error fetching saved properties:', error.message);
      }

      try {
        // Try to fetch user inquiries
        const userInquiries = await storage.getUserInquiries(userId);
        stats.inquiriesSent = userInquiries ? userInquiries.length : 0;
      } catch (error) {
        console.warn('Error fetching user inquiries:', error.message);
      }

      try {
        // Try to fetch user appointments
        const userAppointments = await storage.getUserAppointments(userId);
        stats.viewingsScheduled = userAppointments ? userAppointments.length : 0;
      } catch (error) {
        console.warn('Error fetching user appointments:', error.message);
      }

      try {
        // Try to fetch user properties
        const userProperties = await storage.getUserProperties(userId);
        if (userProperties && userProperties.length > 0) {
          stats.activeListings = userProperties.filter(p => p.status === 'active').length;
          stats.totalViews = userProperties.reduce((sum, property) => sum + (property.views || 0), 0);
          
          try {
            const inquiriesPromises = userProperties.map(p => storage.getPropertyInquiries(p.id));
            const allInquiries = await Promise.all(inquiriesPromises);
            stats.totalInquiries = allInquiries.flat().length;
          } catch (error) {
            console.warn('Error fetching property inquiries:', error.message);
          }
        }
      } catch (error) {
        console.warn('Error fetching user properties:', error.message);
      }

      // Calculate properties viewed based on available data
      stats.propertiesViewed = Math.min(stats.savedProperties * 3 + stats.inquiriesSent, 50);

      console.log('Dashboard stats computed:', stats);
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ 
        message: "Failed to fetch dashboard statistics",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Update user
  app.put("/api/users/:id", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      // Only allow users to update their own profile, or admins to update any profile
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Restrict which fields can be updated
      const allowedFields = ['firstName', 'lastName', 'phone', 'bio'];
      const adminOnlyFields = ['role', 'userType', 'permissions', 'isActive', 'isVerified'];

      const filteredUpdates: any = {};
      
      // Allow basic fields for all users
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      // Allow admin-only fields for admins
      if (AuthService.isAdmin(req.user!)) {
        adminOnlyFields.forEach(field => {
          if (updates[field] !== undefined) {
            filteredUpdates[field] = updates[field];
          }
        });
      }

      const user = await storage.updateUser(userId, filteredUpdates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // User properties
  app.get("/api/users/:id/properties", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const properties = await storage.getUserProperties(userId);
      res.json(properties);
    } catch (error) {
      console.error("Get user properties error:", error);
      res.status(500).json({ message: "Failed to fetch user properties" });
    }
  });

  // User inquiries
  app.get("/api/users/:id/inquiries", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const inquiries = await storage.getUserInquiries(userId);
      res.json(inquiries);
    } catch (error) {
      console.error("Get user inquiries error:", error);
      res.status(500).json({ message: "Failed to fetch user inquiries" });
    }
  });

  // User appointments
  app.get("/api/users/:id/appointments", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Get user appointments error:", error);
      res.status(500).json({ message: "Failed to fetch user appointments" });
    }
  });

  // Saved properties
  app.get("/api/users/:id/saved-properties", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const savedProperties = await storage.getSavedProperties(userId);
      res.json(savedProperties);
    } catch (error) {
      console.error("Get saved properties error:", error);
      res.status(500).json({ message: "Failed to fetch saved properties" });
    }
  });

  app.post("/api/users/:userId/saved-properties/:propertyId", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

      // Only allow users to save properties to their own account or admins
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const saved = await storage.saveProperty(userId, propertyId);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Save property error:", error);
      res.status(400).json({ message: "Failed to save property" });
    }
  });

  app.delete("/api/users/:userId/saved-properties/:propertyId", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

      // Only allow users to unsave from their own account or admins
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const unsaved = await storage.unsaveProperty(userId, propertyId);
      if (!unsaved) {
        return res.status(404).json({ message: "Saved property not found" });
      }

      res.json({ message: "Property unsaved successfully" });
    } catch (error) {
      console.error("Unsave property error:", error);
      res.status(500).json({ message: "Failed to unsave property" });
    }
  });

  app.get("/api/users/:userId/saved-properties/:propertyId/check", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

      // Only allow users to check their own saved properties or admins
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const isSaved = await storage.isPropertySaved(userId, propertyId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Check saved property error:", error);
      res.status(500).json({ message: "Failed to check saved property" });
    }
  });
}
