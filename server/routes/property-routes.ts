import type { Express, Request } from "express";
import { ZodError } from 'zod';
import { storage } from "../storage";
import { insertPropertySchema, type InsertProperty } from "../../shared/schema";
import { authenticate, optionalAuthenticate, AuthService } from "../auth-middleware";
import { logError, logInfo, logWarn } from "../utils/logger";
import { parsePropertyFilters } from "../validation/property-filters";
import type { RequestWithId } from "../middleware/logging";

export function registerPropertyRoutes(app: Express) {
  const buildRequestContext = (req: Request) => {
    const requestWithId = req as Request & Partial<RequestWithId>;
    return {
      requestId: requestWithId.id,
      method: req.method,
      path: req.path,
    };
  };

  const parseNumericParam = (value: unknown, label: string): number => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${label} is required`);
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`${label} must be a number`);
    }

    return parsed;
  };

  const sanitizeNullableString = (value: unknown): string | null => {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized === '' ? null : normalized;
  };

  const coerceNumericField = (
    value: unknown,
    field: string,
    options: { optional?: boolean; allowNull?: boolean } = {}
  ): number | null | undefined => {
    const { optional = false, allowNull = false } = options;

    if (value === undefined) {
      if (optional) {
        return undefined;
      }
      throw new Error(`${field} is required`);
    }

    if (value === null) {
      if (allowNull) {
        return null;
      }
      if (optional) {
        return undefined;
      }
      throw new Error(`${field} must be a number`);
    }

    if (typeof value === 'number') {
      if (Number.isFinite(value)) {
        return value;
      }
      throw new Error(`${field} must be a finite number`);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        if (allowNull) {
          return null;
        }
        if (optional) {
          return undefined;
        }
        throw new Error(`${field} is required`);
      }

      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
      throw new Error(`${field} must be a number`);
    }

    throw new Error(`${field} must be a number`);
  };

  const coordinatesWithinBotswana = (lng: number, lat: number) =>
    lng >= 19.999535 && lng <= 29.368311 && lat >= -26.907379 && lat <= -17.780809;

  const coerceCoordinate = (
    value: unknown,
    field: 'latitude' | 'longitude'
  ): number | null | undefined => {
    if (value === undefined) {
      return undefined;
    }
    if (value === null || value === '') {
      return null;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const numeric = Number(trimmed);
      if (Number.isFinite(numeric)) {
        return numeric;
      }
    }
    throw new Error(`${field} must be a number`);
  };

  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = parsePropertyFilters(req.query);
      const properties = await storage.getProperties(filters);
      logInfo("property.list.success", {
        meta: {
          filters,
          resultCount: properties.length,
          request: buildRequestContext(req),
        },
      });
      res.json(properties);
    } catch (error) {
      if (error instanceof ZodError) {
        logWarn("property.list.validation_failed", {
          meta: {
            issues: error.issues,
            request: buildRequestContext(req),
          },
        });
        return res.status(400).json({
          message: "Invalid property filters",
          details: error.issues,
        });
      }
      logError("property.list.failed", {
        error,
        meta: buildRequestContext(req),
      });
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
      logError("property.suggest.failed", {
        error,
        meta: buildRequestContext(req),
      });
      res.json([]);
    }
  });


  // Get single property
  app.get("/api/properties/:id", optionalAuthenticate, async (req, res) => { // Changed to optionalAuthenticate for public view
    try {
      let propertyId: number;
      try {
        propertyId = parseNumericParam(req.params.id, 'Property id');
      } catch (validationError) {
        const message = validationError instanceof Error ? validationError.message : 'Invalid property ID';
        return res.status(400).json({ message });
      }

      const property = await storage.getProperty(propertyId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.incrementPropertyViews(propertyId);
      res.json(property);
    } catch (error) {
      logError("property.get.failed", {
        error,
        meta: buildRequestContext(req),
      });
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Image validation helper
  const validateImages = (images: unknown): boolean => {
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
        const mimeType = mimeMatch?.[1];
        if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
          throw new Error('Invalid image type. Only JPEG, PNG, and WebP are allowed');
        }
      }
    }

    return true;
  };

  const parseStringArrayField = (value: unknown, field: string): string[] | undefined => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map(item => String(item));
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }

      const splitCommaSeparated = (input: string) =>
        input
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => String(item));

      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item));
        }

        if (typeof parsed === 'string') {
          const normalized = parsed.trim();
          if (!normalized) {
            return [];
          }
          return normalized.includes(',')
            ? splitCommaSeparated(normalized)
            : [normalized];
        }

        if (trimmed.includes(',')) {
          return splitCommaSeparated(trimmed);
        }

        throw new Error(`${field} must be an array of strings`);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          if (trimmed.includes(',')) {
            return splitCommaSeparated(trimmed);
          }
          return [trimmed];
        }
        throw parseError;
      }
    }

    throw new Error(`${field} must be an array of strings`);
  };

  // Create property - only sellers, agents, fsbo, and admin users can create properties
  app.post("/api/properties", authenticate, async (req, res) => {
    try {
      const {
        areaText, placeName, placeId,
        latitude, longitude, locationSource,
        features, images,
        ...rest
      } = req.body;

      let normalizedLatitude: number | null | undefined;
      if (Object.prototype.hasOwnProperty.call(req.body ?? {}, 'latitude')) {
        try {
          normalizedLatitude = coerceCoordinate(latitude, 'latitude');
        } catch (coordinateError) {
          const message = coordinateError instanceof Error ? coordinateError.message : 'Invalid latitude';
          return res.status(400).json({ error: message });
        }
      }

      let normalizedLongitude: number | null | undefined;
      if (Object.prototype.hasOwnProperty.call(req.body ?? {}, 'longitude')) {
        try {
          normalizedLongitude = coerceCoordinate(longitude, 'longitude');
        } catch (coordinateError) {
          const message = coordinateError instanceof Error ? coordinateError.message : 'Invalid longitude';
          return res.status(400).json({ error: message });
        }
      }

      if (
        typeof normalizedLatitude === 'number' &&
        typeof normalizedLongitude === 'number' &&
        !coordinatesWithinBotswana(normalizedLongitude, normalizedLatitude)
      ) {
        return res.status(400).json({ error: "Coordinates must be within Botswana bounds." });
      }

      let imagesArray: string[] | undefined;
      let featuresArray: string[] | undefined;

      try {
        imagesArray = parseStringArrayField(images, 'images');
        if (imagesArray) {
          validateImages(imagesArray);
        }
      } catch (imageError) {
        const message = imageError instanceof Error ? imageError.message : 'Invalid image payload';
        logWarn("property.create.invalid_images", {
          ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
          meta: {
            request: buildRequestContext(req),
          },
          error: imageError,
        });
        return res.status(400).json({ error: message });
      }

      try {
        featuresArray = parseStringArrayField(features, 'features');
      } catch (featureError) {
        const message = featureError instanceof Error ? featureError.message : 'Invalid features payload';
        logWarn("property.create.invalid_features", {
          ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
          meta: {
            request: buildRequestContext(req),
          },
          error: featureError,
        });
        return res.status(400).json({ error: message });
      }

      const restPayload = rest as Record<string, unknown>;

      // Prepare property data with location fields and owner ID
      const propertyData: Record<string, unknown> = {
        ...restPayload,
        ownerId: req.user!.id, // Set the authenticated user as the owner
        areaText: sanitizeNullableString(areaText),
        placeName: sanitizeNullableString(placeName),
        placeId: sanitizeNullableString(placeId),
        latitude: normalizedLatitude ?? null,
        longitude: normalizedLongitude ?? null,
        locationSource: sanitizeNullableString(locationSource) ?? 'geocode',
        features: featuresArray ?? [],
        images: imagesArray ?? [],
      };

      try {
        const priceValue = coerceNumericField(restPayload['price'], 'price');
        propertyData.price = priceValue;
      } catch (numericError) {
        const message = numericError instanceof Error ? numericError.message : 'Invalid price value';
        return res.status(400).json({ error: message });
      }

      const optionalNumericFields: Array<{ key: Extract<keyof InsertProperty, string>; allowNull?: boolean }> = [
        { key: 'bedrooms', allowNull: true },
        { key: 'bathrooms', allowNull: true },
        { key: 'squareFeet', allowNull: true },
        { key: 'areaBuild', allowNull: true },
        { key: 'yearBuilt', allowNull: true },
      ];

      for (const { key, allowNull } of optionalNumericFields) {
        if (Object.prototype.hasOwnProperty.call(restPayload, key)) {
          try {
            const coerced = coerceNumericField(restPayload[key], key, {
              optional: true,
              allowNull: allowNull ?? false,
            });

            if (coerced === undefined) {
              delete propertyData[key];
            } else {
              propertyData[key] = coerced;
            }
          } catch (numericError) {
            const message = numericError instanceof Error ? numericError.message : `Invalid ${String(key)} value`;
            return res.status(400).json({ error: message });
          }
        }
      }

      const validatedData = insertPropertySchema.parse(propertyData) as InsertProperty;
      const property = await storage.createProperty(validatedData);
      logInfo("property.create.success", {
        ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
        meta: {
          propertyId: property.id,
          request: buildRequestContext(req),
        },
      });
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof ZodError) {
        logWarn("property.create.validation_failed", {
          ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
          meta: {
            issues: error.errors,
            request: buildRequestContext(req),
          },
        });
        return res.status(400).json({
          message: "Invalid property data",
          details: error.errors,
        });
      }

      const message = error instanceof Error ? error.message : 'Invalid property data';
      logError("property.create.failed", {
        ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
        meta: buildRequestContext(req),
        error,
      });
      res.status(400).json({ message: "Invalid property data", error: message });
    }
  });

  // Update property - requires authentication and ownership or admin
  app.put("/api/properties/:id", authenticate, async (req, res) => {
    try {
      let propertyId: number;
      try {
        propertyId = parseNumericParam(req.params.id, 'Property id');
      } catch (validationError) {
        const message = validationError instanceof Error ? validationError.message : 'Invalid property ID';
        return res.status(400).json({ message });
      }

      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }

      const isOwner = existingProperty.ownerId === req.user!.id;
      const isAdmin = AuthService.isAdmin(req.user!);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }

      const updates = (req.body ?? {}) as Record<string, unknown>;

      const {
        areaText,
        placeName,
        placeId,
        latitude,
        longitude,
        locationSource,
        features,
        images,
        ...restUpdates
      } = updates;

      const normalizedUpdates: Partial<InsertProperty> = {
        ...(restUpdates as Partial<InsertProperty>),
      };

      if (Object.prototype.hasOwnProperty.call(updates, 'areaText')) {
        normalizedUpdates.areaText = sanitizeNullableString(areaText);
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'placeName')) {
        normalizedUpdates.placeName = sanitizeNullableString(placeName);
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'placeId')) {
        normalizedUpdates.placeId = sanitizeNullableString(placeId);
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'locationSource')) {
        normalizedUpdates.locationSource = sanitizeNullableString(locationSource) ?? 'geocode';
      }

      const optionalNumericUpdateFields: Array<{ key: Extract<keyof InsertProperty, string>; allowNull?: boolean }> = [
        { key: 'price', allowNull: false },
        { key: 'bedrooms', allowNull: true },
        { key: 'bathrooms', allowNull: true },
        { key: 'squareFeet', allowNull: true },
        { key: 'areaBuild', allowNull: true },
        { key: 'yearBuilt', allowNull: true },
      ];

      for (const { key, allowNull } of optionalNumericUpdateFields) {
        if (Object.prototype.hasOwnProperty.call(restUpdates, key)) {
          try {
            const coerced = coerceNumericField(restUpdates[key], key, {
              optional: true,
              allowNull: allowNull ?? false,
            });

            if (coerced === undefined) {
              delete normalizedUpdates[key];
            } else {
              (normalizedUpdates as Record<string, unknown>)[key] = coerced;
            }
          } catch (numericError) {
            const message = numericError instanceof Error ? numericError.message : `Invalid ${String(key)} value`;
            return res.status(400).json({ error: message });
          }
        }
      }

      let normalizedLatitude: number | null | undefined;
      if (Object.prototype.hasOwnProperty.call(updates, 'latitude')) {
        try {
          normalizedLatitude = coerceCoordinate(latitude, 'latitude');
          if (normalizedLatitude !== undefined) {
            normalizedUpdates.latitude = normalizedLatitude;
          }
        } catch (coordinateError) {
          const message = coordinateError instanceof Error ? coordinateError.message : 'Invalid latitude';
          return res.status(400).json({ error: message });
        }
      }

      let normalizedLongitude: number | null | undefined;
      if (Object.prototype.hasOwnProperty.call(updates, 'longitude')) {
        try {
          normalizedLongitude = coerceCoordinate(longitude, 'longitude');
          if (normalizedLongitude !== undefined) {
            normalizedUpdates.longitude = normalizedLongitude;
          }
        } catch (coordinateError) {
          const message = coordinateError instanceof Error ? coordinateError.message : 'Invalid longitude';
          return res.status(400).json({ error: message });
        }
      }

      const finalLatitude =
        normalizedLatitude !== undefined
          ? normalizedLatitude
          : (existingProperty.latitude ?? undefined);
      const finalLongitude =
        normalizedLongitude !== undefined
          ? normalizedLongitude
          : (existingProperty.longitude ?? undefined);

      if (
        typeof finalLatitude === 'number' &&
        typeof finalLongitude === 'number' &&
        !coordinatesWithinBotswana(finalLongitude, finalLatitude)
      ) {
        return res.status(400).json({ error: "Coordinates must be within Botswana bounds." });
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'features')) {
        try {
          const parsedFeatures = parseStringArrayField(features, 'features');
          if (parsedFeatures !== undefined) {
            normalizedUpdates.features = parsedFeatures;
          }
        } catch (featureError) {
          const message = featureError instanceof Error ? featureError.message : 'Invalid features payload';
          logWarn("property.update.invalid_features", {
            ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
            meta: {
              request: buildRequestContext(req),
            },
            error: featureError,
          });
          return res.status(400).json({ error: message });
        }
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'images')) {
        try {
          const parsedImages = parseStringArrayField(images, 'images');
          if (parsedImages !== undefined) {
            validateImages(parsedImages);
            normalizedUpdates.images = parsedImages;
          }
        } catch (imageError) {
          const message = imageError instanceof Error ? imageError.message : 'Invalid image payload';
          logWarn("property.update.invalid_images", {
            ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
            meta: {
              request: buildRequestContext(req),
            },
            error: imageError,
          });
          return res.status(400).json({ error: message });
        }
      }

      const property = await storage.updateProperty(propertyId, normalizedUpdates);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      logError("property.update.failed", {
        ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
        meta: buildRequestContext(req),
        error,
      });
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Delete property - requires authentication and ownership or admin
  app.delete("/api/properties/:id", authenticate, async (req, res) => {
    try {
      let propertyId: number;
      try {
        propertyId = parseNumericParam(req.params.id, 'Property id');
      } catch (validationError) {
        const message = validationError instanceof Error ? validationError.message : 'Invalid property ID';
        return res.status(400).json({ message });
      }

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
      logError("property.delete.failed", {
        ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
        meta: buildRequestContext(req),
        error,
      });
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
      logError("property.appointment.failed", {
        meta: buildRequestContext(req),
        error,
      });
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });
}