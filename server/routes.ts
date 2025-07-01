import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema } from "../shared/schema";

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

  // AI Search API
  app.post("/api/search/ai", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Mock AI search result
      const result = {
        filters: {
          minPrice: query.includes('under') ? 0 : undefined,
          maxPrice: query.includes('under') ? 1000000 : undefined,
          propertyType: query.includes('house') ? 'house' : 
                        query.includes('apartment') ? 'apartment' : 
                        query.includes('plot') ? 'land' : undefined,
          minBedrooms: query.includes('bedroom') ? parseInt(query.match(/\d+/)?.[0] || '0') : undefined,
          city: query.includes('Gaborone') ? 'Gaborone' : 
                query.includes('Francistown') ? 'Francistown' : undefined
        },
        explanation: `Searching for properties matching "${query}"`,
        confidence: 0.85
      };
      
      res.json(result);
    } catch (error) {
      console.error("AI search error:", error);
      res.status(500).json({ message: "Failed to process search query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}