import type { Express } from "express";
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { storage } from "../storage";
import { insertPropertySchema, type InsertProperty, UserType } from "../../shared/schema";
import { authenticate, optionalAuthenticate, requireUserType, AuthService } from "../auth-middleware";

export function registerPropertyRoutes(app: Express) {
  // Get all properties
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
        location: req.query.location as string, // Add location search parameter
        listingType: req.query.listingType as string,
        status: req.query.status as string || 'active',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as 'price' | 'date' | 'size' | 'bedrooms',
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      console.log('Fetching properties with filters:', JSON.stringify(filters, null, 2));
      const properties = await storage.getProperties(filters);
      console.log('Properties fetched:', properties.length);

      properties.forEach(prop => {
        console.log(`Property ${prop.id}: lat=${prop.latitude}, lng=${prop.longitude}`);
      });

      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Search suggestions endpoint
  app.get("/api/suggest", async (req, res) => {
    try {
      const query = (req.query.q as string)?.toLowerCase().trim();

      if (!query || query.length < 2) {
        return res.json([]);
      }

      // Generate suggestions based on common Botswana locations and property types
      const locationSuggestions = [
        'Gaborone', 'Francistown', 'Molepolole', 'Kanye', 'Serowe',
        'Mahalapye', 'Mogoditshane', 'Mochudi', 'Maun', 'Lobatse',
        'Block 8', 'Block 9', 'Block 10', 'G-West', 'Phakalane',
        'Riverwalk', 'Airport Junction', 'Phase 4', 'Extension 2'
      ];

      const propertyTypeSuggestions = [
        'house in Gaborone', 'apartment in Francistown', 'townhouse in Phakalane',
        'land in Mogoditshane', 'commercial property', '3 bedroom house',
        '2 bedroom apartment', 'plot for sale', 'residential property'
      ];

      // Filter suggestions based on query
      const filteredLocations = locationSuggestions
        .filter(loc => loc.toLowerCase().includes(query))
        .map(loc => `Properties in ${loc}`);

      const filteredTypes = propertyTypeSuggestions
        .filter(type => type.toLowerCase().includes(query));

      // Combine and limit suggestions
      const suggestions = [...filteredLocations, ...filteredTypes].slice(0, 8);

      res.json(suggestions);
    } catch (error) {
      console.error("Suggestions error:", error);
      res.json([]);
    }
  });


  // Get single property
  app.get("/api/properties/:id", optionalAuthenticate, async (req, res) => { // Changed to optionalAuthenticate for public view
    try {
      const propertyId = parseInt(req.params.id);

      // Validate that propertyId is a valid number
      if (isNaN(propertyId) || propertyId <= 0) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(propertyId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.incrementPropertyViews(propertyId);
      res.json(property);
    } catch (error) {
      console.error("Get property error:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Image validation helper
  const validateImages = (images: any[]): boolean => {
    if (!Array.isArray(images)) return false;

    const MAX_IMAGES = 20;
    const MAX_SIZE_MB = 10;

    if (images.length > MAX_IMAGES) {
      throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
    }

    for (const image of images) {
      if (typeof image !== 'string') {
        throw new Error('Invalid image format');
      }

      // Check if it's a data URL
      if (image.startsWith('data:')) {
        const sizeInBytes = (image.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > MAX_SIZE_MB) {
          throw new Error(`Image size exceeds ${MAX_SIZE_MB}MB limit`);
        }

        // Validate MIME type
        const mimeMatch = image.match(/^data:([^;]+);/);
        if (!mimeMatch || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeMatch[1])) {
          throw new Error('Invalid image type. Only JPEG, PNG, and WebP are allowed');
        }
      }
    }

    return true;
  };

  // Create property - only sellers, agents, fsbo, and admin users can create properties
  app.post("/api/properties", authenticate, async (req, res) => {
    try {
      console.log("Create property request body:", req.body);

      const {
        areaText, placeName, placeId,
        latitude, longitude, locationSource,
        features, images,
        ...rest
      } = req.body;

      // Validate coordinates are within Botswana bounds
      const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);
      const inBW = (lng: number, lat: number) => lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

      if (isNum(latitude) && isNum(longitude) && !inBW(longitude, latitude)) {
        return res.status(400).json({ error: "Coordinates must be within Botswana bounds." });
      }

      // Validate images if provided
      if (images) {
        try {
          const imageArray = Array.isArray(images) ? images : JSON.parse(images);
          validateImages(imageArray);
        } catch (imageError) {
          const message = imageError instanceof Error ? imageError.message : 'Invalid image payload';
          return res.status(400).json({ error: message });
        }
      }

      // Prepare property data with location fields and owner ID
      const propertyData = {
        ...rest,
        ownerId: req.user!.id, // Set the authenticated user as the owner
        areaText: areaText || null,
        placeName: placeName || null,
        placeId: placeId || null,
        latitude: isNum(latitude) ? latitude : null,
        longitude: isNum(longitude) ? longitude : null,
        locationSource: locationSource || 'geocode',
        features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null,
        images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null
      };

      console.log("Processed property data:", propertyData);

      const validatedData = insertPropertySchema.parse(propertyData) as InsertProperty;
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      console.error("Create property error:", error);
      if (error instanceof ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({
          message: "Invalid property data",
          details: error.errors
        });
      }

      const message = error instanceof Error ? error.message : 'Invalid property data';
      res.status(400).json({ message: "Invalid property data", error: message });
    }
  });

  // Update property - requires authentication and ownership or admin
  app.put("/api/properties/:id", authenticate, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);

      // Validate that propertyId is a valid number
      if (isNaN(propertyId) || propertyId <= 0) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const updates = req.body;

      // Check if user owns the property or is admin
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }

      const isOwner = existingProperty.ownerId === req.user!.id;
      const isAdmin = AuthService.isAdmin(req.user!);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }

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

  // Delete property - requires authentication and ownership or admin
  app.delete("/api/properties/:id", authenticate, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);

      // Check if user owns the property or is admin
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }

      const isOwner = existingProperty.ownerId === req.user!.id;
      const isAdmin = AuthService.isAdmin(req.user!);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to delete this property" });
      }

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

  // Create appointment for property viewing
  app.post("/api/appointments", authenticate, async (req, res) => { // Added authenticate
    try {
      const appointmentData = req.body;

      // Basic validation
      if (!appointmentData.propertyId || !appointmentData.buyerId || !appointmentData.appointmentDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // For now, we'll just return a success response
      // In a real implementation, you'd save to database
      const appointment = {
        id: Date.now(), // Mock ID
        ...appointmentData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      res.status(201).json(appointment);
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });
}