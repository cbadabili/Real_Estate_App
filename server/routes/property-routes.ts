
import type { Express } from "express";
import { storage } from "../storage";
import { insertPropertySchema } from "../../shared/schema";
import { authenticate, optionalAuthenticate } from "../auth-middleware";

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
        listingType: req.query.listingType as string,
        status: req.query.status as string || 'active',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as 'price' | 'date' | 'size' | 'bedrooms',
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      console.log('Fetching properties...');
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

  // Get single property
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
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

  // Create property
  app.post("/api/properties", async (req, res) => {
    try {
      const {
        areaText, placeName, placeId,
        latitude, longitude, locationSource,
        ...rest
      } = req.body;

      const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);
      const inBW = (lng: number, lat: number) => lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

      if (isNum(latitude) && isNum(longitude) && !inBW(longitude, latitude)) {
        return res.status(400).json({ error: "Coordinates must be within Botswana bounds." });
      }

      const propertyData = {
        ...rest,
        areaText: areaText || null,
        placeName: placeName || null,
        placeId: placeId || null,
        latitude: isNum(latitude) ? latitude : null,
        longitude: isNum(longitude) ? longitude : null,
        locationSource: locationSource || 'geocode'
      };

      const validatedData = insertPropertySchema.parse(propertyData);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      console.error("Create property error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid property data", 
          details: error.errors 
        });
      }
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  // Update property
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

  // Delete property
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
}
