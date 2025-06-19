import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseNaturalLanguageSearch } from './ai-search';
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertInquirySchema, 
  insertAppointmentSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication & User Management
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Register error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
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

  // Property Management
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        propertyType: req.query.propertyType as string,
        minBedrooms: req.query.minBedrooms ? parseInt(req.query.minBedrooms as string) : undefined,
        minBathrooms: req.query.minBathrooms ? parseFloat(req.query.minBathrooms as string) : undefined,
        minSquareFeet: req.query.minSquareFeet ? parseInt(req.query.minSquareFeet as string) : undefined,
        maxSquareFeet: req.query.maxSquareFeet ? parseInt(req.query.maxSquareFeet as string) : undefined,
        city: req.query.city as string,
        state: req.query.state as string,
        zipCode: req.query.zipCode as string,
        listingType: req.query.listingType as string,
        status: req.query.status as string || 'active',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as 'price' | 'date' | 'size' | 'bedrooms',
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Increment view count
      await storage.incrementPropertyViews(propertyId);
      
      res.json(property);
    } catch (error) {
      console.error("Get property error:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      console.error("Create property error:", error);
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const updates = req.body;
      
      const property = await storage.updateProperty(propertyId, updates);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Update property error:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const deleted = await storage.deleteProperty(propertyId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Delete property error:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

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

  // Property Inquiries
  app.get("/api/properties/:id/inquiries", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const inquiries = await storage.getPropertyInquiries(propertyId);
      res.json(inquiries);
    } catch (error) {
      console.error("Get property inquiries error:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

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

  app.put("/api/inquiries/:id/status", async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const { status } = req.body;
      
      const inquiry = await storage.updateInquiryStatus(inquiryId, status);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      res.json(inquiry);
    } catch (error) {
      console.error("Update inquiry status error:", error);
      res.status(500).json({ message: "Failed to update inquiry status" });
    }
  });

  // Appointments
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(400).json({ message: "Invalid appointment data" });
    }
  });

  app.get("/api/properties/:id/appointments", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const appointments = await storage.getPropertyAppointments(propertyId);
      res.json(appointments);
    } catch (error) {
      console.error("Get property appointments error:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

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

  app.put("/api/appointments/:id/status", async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { status } = req.body;
      
      const appointment = await storage.updateAppointmentStatus(appointmentId, status);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("Update appointment status error:", error);
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  // Saved Properties (Favorites)
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

  // Neighborhood and Search APIs would integrate with external services
  app.get("/api/neighborhoods/:zipCode", async (req, res) => {
    try {
      const zipCode = req.params.zipCode;
      
      // This would typically integrate with external APIs like:
      // - ATTOM Data API for demographics, crime data, school ratings
      // - Google Places API for nearby amenities
      // - Walk Score API for walkability
      
      // For now, return mock neighborhood data structure
      const neighborhoodData = {
        zipCode,
        demographics: {
          medianIncome: 75000,
          populationDensity: 2500,
          averageAge: 38
        },
        schools: [
          { name: "Elementary School", rating: 4.2, distance: 0.5 },
          { name: "High School", rating: 4.0, distance: 1.2 }
        ],
        amenities: [
          { name: "Grocery Store", type: "shopping", distance: 0.3 },
          { name: "Park", type: "recreation", distance: 0.8 }
        ],
        walkScore: 78,
        crimeIndex: 3.2
      };
      
      res.json(neighborhoodData);
    } catch (error) {
      console.error("Get neighborhood data error:", error);
      res.status(500).json({ message: "Failed to fetch neighborhood data" });
    }
  });

  // Mortgage calculator API
  app.post("/api/mortgage/calculate", async (req, res) => {
    try {
      const { loanAmount, interestRate, loanTermYears, downPayment } = req.body;
      
      const principal = loanAmount - (downPayment || 0);
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      
      const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalInterest = (monthlyPayment * numberOfPayments) - principal;
      const totalPayment = principal + totalInterest;
      
      res.json({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        principal
      });
    } catch (error) {
      console.error("Mortgage calculation error:", error);
      res.status(400).json({ message: "Invalid mortgage calculation data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
