
import type { Express } from "express";
import { storage } from "../storage";
import { authenticate, optionalAuthenticate, AuthService } from "../auth-middleware";

export function registerUserRoutes(app: Express) {
  // Get user by ID
  app.get("/api/users/:id", optionalAuthenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (req.user && (req.user.id !== userId && !AuthService.isAdmin(req.user))) {
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
      const userId = req.user!.id;
      
      const savedProperties = await storage.getSavedProperties(userId);
      const savedPropertiesCount = savedProperties.length;
      
      const userInquiries = await storage.getUserInquiries(userId);
      const inquiriesSentCount = userInquiries.length;
      
      const userAppointments = await storage.getUserAppointments(userId);
      const viewingsScheduledCount = userAppointments.length;
      
      const userProperties = await storage.getUserProperties(userId);
      const activeListingsCount = userProperties.filter(p => p.status === 'active').length;
      
      const totalViews = userProperties.reduce((sum, property) => sum + (property.views || 0), 0);
      
      const totalInquiries = userProperties.length > 0 ? 
        (await Promise.all(userProperties.map(p => storage.getPropertyInquiries(p.id)))).flat().length : 0;
      
      const propertiesViewedCount = Math.min(savedPropertiesCount * 3 + inquiriesSentCount, 50);
      
      const stats = {
        savedProperties: savedPropertiesCount,
        propertiesViewed: propertiesViewedCount,
        inquiriesSent: inquiriesSentCount,
        viewingsScheduled: viewingsScheduledCount,
        activeListings: activeListingsCount,
        totalViews: totalViews,
        totalInquiries: totalInquiries
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      const user = await storage.updateUser(userId, updates);
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

  app.post("/api/users/:userId/saved-properties/:propertyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

      const saved = await storage.saveProperty(userId, propertyId);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Save property error:", error);
      res.status(400).json({ message: "Failed to save property" });
    }
  });

  app.delete("/api/users/:userId/saved-properties/:propertyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

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

  app.get("/api/users/:userId/saved-properties/:propertyId/check", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);

      const isSaved = await storage.isPropertySaved(userId, propertyId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Check saved property error:", error);
      res.status(500).json({ message: "Failed to check saved property" });
    }
  });
}
