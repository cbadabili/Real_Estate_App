import type { Express } from "express";
import { storage } from "../storage";
import { authenticate, optionalAuthenticate, AuthService } from "../auth-middleware";
import jwt from 'jsonwebtoken';

// Assuming JWT_SECRET is defined elsewhere, e.g., in an environment variables file
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret'; // Replace with your actual secret or env variable

export function registerUserRoutes(app: Express) {
  // Get user by ID - requires authentication
  app.get("/api/users/:id", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ message: "User id is required" });
      }
      const userId = Number.parseInt(userIdParam, 10);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "User id must be a number" });
      }

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

  // Auth verification endpoint removed - handled by auth-routes.ts

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
      } catch (error: any) {
        console.warn('Error fetching saved properties:', error?.message || error);
      }

      try {
        // Try to fetch user inquiries
        const userInquiries = await storage.getUserInquiries(userId);
        stats.inquiriesSent = userInquiries ? userInquiries.length : 0;
      } catch (error: any) {
        console.warn('Error fetching user inquiries:', error?.message || error);
      }

      try {
        // Try to fetch user appointments
        const userAppointments = await storage.getUserAppointments(userId);
        stats.viewingsScheduled = userAppointments ? userAppointments.length : 0;
      } catch (error: any) {
        console.warn('Error fetching user appointments:', error?.message || error);
      }

      // For agents/FSBOs, try to get listing stats
      if (req.user.userType === 'agent' || req.user.userType === 'fsbo' || req.user.userType === 'seller') {
        try {
          // Note: getUserListings method needs to be implemented in storage
          // For now, we'll skip this to avoid runtime errors
          // const userListings = await storage.getUserListings(userId);
          // stats.activeListings = userListings ? userListings.length : 0;
          stats.activeListings = 0; // Temporary placeholder
        } catch (error: any) {
          console.warn('Error fetching user listings:', error?.message || error);
        }
      }

      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get user's favorites/saved properties
  app.get("/api/users/:id/saved-properties", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ message: "User id is required" });
      }
      const userId = Number.parseInt(userIdParam, 10);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "User id must be a number" });
      }

      // Only allow users to view their own saved properties, or admins to view any
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const savedProperties = await storage.getSavedProperties(userId);

      if (!savedProperties) {
        return res.json([]);
      }

      res.json(savedProperties);
    } catch (error) {
      console.error("Get saved properties error:", error);
      res.status(500).json({ message: "Failed to fetch saved properties" });
    }
  });

  // Get user's property inquiries
  app.get("/api/users/:id/inquiries", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ message: "User id is required" });
      }
      const userId = Number.parseInt(userIdParam, 10);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "User id must be a number" });
      }

      // Only allow users to view their own inquiries, or admins to view any
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const inquiries = await storage.getUserInquiries(userId);

      if (!inquiries) {
        return res.json([]);
      }

      res.json(inquiries);
    } catch (error) {
      console.error("Get user inquiries error:", error);
      res.status(500).json({ message: "Failed to fetch user inquiries" });
    }
  });

  // Get user's property listings
  app.get("/api/users/:id/listings", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ message: "User id is required" });
      }
      const userId = Number.parseInt(userIdParam, 10);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "User id must be a number" });
      }

      // Only allow users to view their own listings, or admins to view any
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Note: getUserListings method needs to be implemented in storage
      // For now, return empty array to avoid runtime errors
      const listings: any[] = []; // Temporary placeholder
      res.json(listings);
    } catch (error) {
      console.error("Get user listings error:", error);
      res.status(500).json({ message: "Failed to fetch user listings" });
    }
  });

  // Get user's appointments
  app.get("/api/users/:id/appointments", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ message: "User id is required" });
      }
      const userId = Number.parseInt(userIdParam, 10);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "User id must be a number" });
      }

      // Only allow users to view their own appointments, or admins to view any
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const appointments = await storage.getUserAppointments(userId);

      if (!appointments) {
        return res.json([]);
      }

      res.json(appointments);
    } catch (error) {
      console.error("Get user appointments error:", error);
      res.status(500).json({ message: "Failed to fetch user appointments" });
    }
  });

  // Save a property for a user
  app.post("/api/users/:userId/saved-properties/:propertyId", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.userId;
      const propertyIdParam = req.params.propertyId;

      if (!userIdParam || !propertyIdParam) {
        return res.status(400).json({ message: "User id and property id are required" });
      }

      const userId = Number.parseInt(userIdParam, 10);
      const propertyId = Number.parseInt(propertyIdParam, 10);

      if (Number.isNaN(userId) || Number.isNaN(propertyId)) {
        return res.status(400).json({ message: "User id and property id must be numbers" });
      }

      // Only allow users to save to their own list or admins
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if property exists
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.saveProperty(userId, propertyId);
      res.json({ message: "Property saved successfully" });
    } catch (error) {
      console.error("Save property error:", error);
      res.status(500).json({ message: "Failed to save property" });
    }
  });

  // Unsave a property for a user
  app.delete("/api/users/:userId/saved-properties/:propertyId", authenticate, async (req, res) => {
    try {
      const userIdParam = req.params.userId;
      const propertyIdParam = req.params.propertyId;

      if (!userIdParam || !propertyIdParam) {
        return res.status(400).json({ message: "User id and property id are required" });
      }

      const userId = Number.parseInt(userIdParam, 10);
      const propertyId = Number.parseInt(propertyIdParam, 10);

      if (Number.isNaN(userId) || Number.isNaN(propertyId)) {
        return res.status(400).json({ message: "User id and property id must be numbers" });
      }

      // Only allow users to unsave from their own list or admins
      if (req.user!.id !== userId && !AuthService.isAdmin(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const success = await storage.unsaveProperty(userId, propertyId);
      if (!success) {
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
      const userIdParam = req.params.userId;
      const propertyIdParam = req.params.propertyId;

      if (!userIdParam || !propertyIdParam) {
        return res.status(400).json({ message: "User id and property id are required" });
      }

      const userId = Number.parseInt(userIdParam, 10);
      const propertyId = Number.parseInt(propertyIdParam, 10);

      if (Number.isNaN(userId) || Number.isNaN(propertyId)) {
        return res.status(400).json({ message: "User id and property id must be numbers" });
      }

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
