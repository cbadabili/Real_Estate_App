import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { servicesStorage } from "./services-storage";
import { reviewStorage } from "./review-storage";
import marketplaceRoutes from "./marketplace-routes";
import { createRentalRoutes } from "./rental-routes";
import { db } from "./db";
import { parseNaturalLanguageSearch } from './ai-search';
import { 
  authenticate, 
  optionalAuthenticate, 
  authorize, 
  requireAdmin, 
  requireModerator,
  requireOwnerOrAdmin,
  AuthService
} from "./auth-middleware";
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertInquirySchema, 
  insertAppointmentSchema,
  insertServiceProviderSchema,
  insertUserReviewSchema,
  insertReviewResponseSchema,
  insertReviewHelpfulSchema,
  insertUserPermissionSchema,
  insertAdminAuditLogSchema,
  Permission,
  UserRole,
  UserType
} from "../shared/schema.js";
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

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      try {
        const loginTimestamp = Math.floor(Date.now() / 1000);
        console.log('Updating user with timestamp:', loginTimestamp, typeof loginTimestamp);
        await storage.updateUser(user.id, { lastLoginAt: loginTimestamp });
      } catch (error) {
        console.error('Error updating last login:', error);
        // Don't fail the login if we can't update the timestamp
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

      console.log('Fetching properties...');
      const properties = await storage.getProperties(filters);
      console.log('Properties fetched:', properties.length);
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

  // Services API endpoints
  app.get("/api/services/providers", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        city: req.query.city as string,
        verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
        featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
        reacCertified: req.query.reacCertified === 'true' ? true : req.query.reacCertified === 'false' ? false : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as 'rating' | 'reviewCount' | 'name' | 'newest',
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const providers = await servicesStorage.getServiceProviders(filters);
      res.json(providers);
    } catch (error) {
      console.error("Get service providers error:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  app.get("/api/services/categories", async (req, res) => {
    try {
      const categories = await servicesStorage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get service categories error:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  app.get("/api/services/providers/:id", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const provider = await servicesStorage.getServiceProvider(providerId);

      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      res.json(provider);
    } catch (error) {
      console.error("Get service provider error:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  app.get("/api/services/providers/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const providers = await servicesStorage.getServiceProvidersByCategory(category);
      res.json(providers);
    } catch (error) {
      console.error("Get providers by category error:", error);
      res.status(500).json({ message: "Failed to fetch providers by category" });
    }
  });

  app.post("/api/services/providers", async (req, res) => {
    try {
      const providerData = insertServiceProviderSchema.parse(req.body);
      const provider = await servicesStorage.createServiceProvider(providerData);
      res.status(201).json(provider);
    } catch (error) {
      console.error("Create service provider error:", error);
      res.status(400).json({ message: "Invalid service provider data" });
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

  // ==================== REVIEW & RATINGS SYSTEM ====================

  // User Reviews
  app.get("/api/reviews", optionalAuthenticate, async (req, res) => {
    try {
      const filters = {
        revieweeId: req.query.reviewee_id ? parseInt(req.query.reviewee_id as string) : undefined,
        reviewerId: req.query.reviewer_id ? parseInt(req.query.reviewer_id as string) : undefined,
        reviewType: req.query.review_type as string,
        minRating: req.query.min_rating ? parseInt(req.query.min_rating as string) : undefined,
        maxRating: req.query.max_rating ? parseInt(req.query.max_rating as string) : undefined,
        status: req.query.status as string || 'active',
        isPublic: req.query.is_public !== undefined ? req.query.is_public === 'true' : true,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sortBy: req.query.sort_by as 'rating' | 'date' | 'helpful' || 'date',
        sortOrder: req.query.sort_order as 'asc' | 'desc' || 'desc'
      };

      const reviews = await reviewStorage.getUserReviewsWithDetails(filters);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await reviewStorage.getUserReview(reviewId);

      if (!review || (review.status !== 'active' && !review.isPublic)) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json(review);
    } catch (error) {
      console.error("Get review error:", error);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  });

  app.post("/api/reviews", authenticate, authorize(Permission.CREATE_REVIEW), async (req, res) => {
    try {
      const reviewData = insertUserReviewSchema.parse({
        ...req.body,
        reviewerId: req.user!.id
      });

      // Prevent self-reviews
      if (reviewData.reviewerId === reviewData.revieweeId) {
        return res.status(400).json({ message: "Cannot review yourself" });
      }

      // Check if user already reviewed this person for this transaction
      const existingReviews = await reviewStorage.getUserReviews({
        reviewerId: reviewData.reviewerId,
        revieweeId: reviewData.revieweeId,
        reviewType: reviewData.reviewType
      });

      if (reviewData.transactionId) {
        const duplicateReview = existingReviews.find(r => r.transactionId === reviewData.transactionId);
        if (duplicateReview) {
          return res.status(400).json({ message: "You have already reviewed this transaction" });
        }
      }

      const review = await reviewStorage.createUserReview(reviewData);

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'review_created',
        targetType: 'review',
        targetId: review.id,
        details: { revieweeId: reviewData.revieweeId, rating: reviewData.rating },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  app.put("/api/reviews/:id", authenticate, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const existingReview = await reviewStorage.getUserReview(reviewId);

      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check ownership or admin permissions
      const isOwner = existingReview.reviewerId === req.user!.id;
      const canModerate = AuthService.hasPermission(req.user!, Permission.MODERATE_REVIEW);

      if (!isOwner && !canModerate) {
        return res.status(403).json({ message: "Not authorized to edit this review" });
      }

      const updates = insertUserReviewSchema.partial().parse(req.body);
      const updatedReview = await reviewStorage.updateUserReview(reviewId, updates);

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: isOwner ? 'review_updated' : 'review_moderated',
        targetType: 'review',
        targetId: reviewId,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json(updatedReview);
    } catch (error) {
      console.error("Update review error:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", authenticate, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const existingReview = await reviewStorage.getUserReview(reviewId);

      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check ownership or admin permissions
      const isOwner = existingReview.reviewerId === req.user!.id;
      const canDelete = AuthService.hasPermission(req.user!, Permission.DELETE_REVIEW);

      if (!isOwner && !canDelete) {
        return res.status(403).json({ message: "Not authorized to delete this review" });
      }

      const deleted = await reviewStorage.deleteUserReview(reviewId);

      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'review_deleted',
        targetType: 'review',
        targetId: reviewId,
        details: { revieweeId: existingReview.revieweeId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Delete review error:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Review Statistics
  app.get("/api/users/:id/review-stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await reviewStorage.getUserReviewStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Get review stats error:", error);
      res.status(500).json({ message: "Failed to fetch review statistics" });
    }
  });

  // Review Responses
  app.get("/api/reviews/:id/responses", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const responses = await reviewStorage.getReviewResponses(reviewId);
      res.json(responses);
    } catch (error) {
      console.error("Get review responses error:", error);
      res.status(500).json({ message: "Failed to fetch review responses" });
    }
  });

  app.post("/api/reviews/:id/responses", authenticate, authorize(Permission.RESPOND_TO_REVIEW), async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await reviewStorage.getUserReview(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const responseData = insertReviewResponseSchema.parse({
        ...req.body,
        reviewId,
        responderId: req.user!.id
      });

      const response = await reviewStorage.createReviewResponse(responseData);
      res.status(201).json(response);
    } catch (error) {
      console.error("Create review response error:", error);
      res.status(400).json({ message: "Invalid response data" });
    }
  });

  // Review Helpful Votes
  app.post("/api/reviews/:id/helpful", authenticate, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { isHelpful } = req.body;

      if (typeof isHelpful !== 'boolean') {
        return res.status(400).json({ message: "isHelpful must be a boolean" });
      }

      const vote = await reviewStorage.voteReviewHelpful({
        reviewId,
        userId: req.user!.id,
        isHelpful
      });

      const stats = await reviewStorage.getReviewHelpfulStats(reviewId);
      res.json({ vote, stats });
    } catch (error) {
      console.error("Vote review helpful error:", error);
      res.status(500).json({ message: "Failed to vote on review" });
    }
  });

  app.get("/api/reviews/:id/helpful-stats", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const stats = await reviewStorage.getReviewHelpfulStats(reviewId);
      res.json(stats);
    } catch (error) {
      console.error("Get helpful stats error:", error);
      res.status(500).json({ message: "Failed to fetch helpful statistics" });
    }
  });

  // ==================== ADMIN & MODERATION ====================

  // Admin Panel Access
  app.get("/api/admin/dashboard", authenticate, requireAdmin, async (req, res) => {
    try {
      const [
        flaggedReviews,
        recentAuditLogs,
        userStats
      ] = await Promise.all([
        reviewStorage.getReviewsForModeration(10),
        reviewStorage.getAuditLog({ limit: 20 }),
        storage.getUsers({ limit: 1 }) // Just to test connection
      ]);

      res.json({
        flaggedReviews: flaggedReviews.length,
        recentActivity: recentAuditLogs.length,
        systemStatus: 'operational'
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch admin dashboard data" });
    }
  });

  // Moderation
  app.get("/api/admin/reviews/flagged", authenticate, requireModerator, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const reviews = await reviewStorage.getReviewsForModeration(limit);
      res.json(reviews);
    } catch (error) {
      console.error("Get flagged reviews error:", error);
      res.status(500).json({ message: "Failed to fetch flagged reviews" });
    }
  });

  app.post("/api/reviews/:id/flag", authenticate, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { reason } = req.body;

      const success = await reviewStorage.flagReview(reviewId, reason);

      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'review_flagged',
        targetType: 'review',
        targetId: reviewId,
        details: { reason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json({ message: "Review flagged successfully" });
    } catch (error) {
      console.error("Flag review error:", error);
      res.status(500).json({ message: "Failed to flag review" });
    }
  });

  app.post("/api/admin/reviews/:id/moderate", authenticate, requireModerator, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { status, moderatorNotes } = req.body;

      const moderatedReview = await reviewStorage.moderateReview(reviewId, status, moderatorNotes);

      if (!moderatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'review_moderated',
        targetType: 'review',
        targetId: reviewId,
        details: { status, moderatorNotes },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json(moderatedReview);
    } catch (error) {
      console.error("Moderate review error:", error);
      res.status(500).json({ message: "Failed to moderate review" });
    }
  });

  // User Management
  app.get("/api/admin/users", authenticate, requireAdmin, async (req, res) => {
    try {
      const search = req.query.search as string;
      const filters = {
        userType: req.query.user_type as string,
        isActive: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      let users = await storage.getUsers(filters);

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
        );
      }

      // Remove sensitive data
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });

      res.json(safeUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/reviews", authenticate, requireModerator, async (req, res) => {
    try {
      const status = req.query.status as string;
      const filters = {
        status: status || 'pending',
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sortBy: 'date' as const,
        sortOrder: 'desc' as const
      };

      const reviews = await reviewStorage.getUserReviewsWithDetails(filters);
      res.json(reviews);
    } catch (error) {
      console.error("Get admin reviews error:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.patch("/api/admin/users/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      const updatedUser = await storage.updateUser(userId, updates);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'user_updated',
        targetType: 'user',
        targetId: userId,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.patch("/api/admin/reviews/:id/moderate", authenticate, requireModerator, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { status, moderatorNotes } = req.body;

      const moderatedReview = await reviewStorage.moderateReview(reviewId, status, moderatorNotes);

      if (!moderatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'review_moderated',
        targetType: 'review',
        targetId: reviewId,
        details: { status, moderatorNotes },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json(moderatedReview);
    } catch (error) {
      console.error("Moderate review error:", error);
      res.status(500).json({ message: "Failed to moderate review" });
    }
  });

  app.get("/api/admin/audit-log", authenticate, requireAdmin, async (req, res) => {
    try {
      const filters = {
        adminId: req.query.admin_id ? parseInt(req.query.admin_id as string) : undefined,
        action: req.query.action as string,
        targetType: req.query.target_type as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const logs = await reviewStorage.getAuditLog(filters);
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.put("/api/admin/users/:id/status", authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive, reason } = req.body;

      const updatedUser = await storage.updateUser(userId, { isActive });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: isActive ? 'user_activated' : 'user_deactivated',
        targetType: 'user',
        targetId: userId,
        details: { reason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Audit Logs
  app.get("/api/admin/audit-logs", authenticate, requireAdmin, async (req, res) => {
    try {
      const filters = {
        adminId: req.query.admin_id ? parseInt(req.query.admin_id as string) : undefined,
        action: req.query.action as string,
        targetType: req.query.target_type as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const logs = await reviewStorage.getAuditLog(filters);
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // User Permissions
  app.get("/api/admin/users/:id/permissions", authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const permissions = await reviewStorage.getUserPermissions(userId);
      res.json(permissions);
    } catch (error) {
      console.error("Get user permissions error:", error);
      res.status(500).json({ message: "Failed to fetch user permissions" });
    }
  });

  app.post("/api/admin/users/:id/permissions", authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const permissionData = insertUserPermissionSchema.parse({
        ...req.body,
        userId,
        grantedBy: req.user!.id
      });

      const permission = await reviewStorage.createUserPermission(permissionData);

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'permission_granted',
        targetType: 'user',
        targetId: userId,
        details: { permission: permissionData.permission },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.status(201).json(permission);
    } catch (error) {
      console.error("Grant permission error:", error);
      res.status(400).json({ message: "Invalid permission data" });
    }
  });

  app.delete("/api/admin/users/:id/permissions/:permission", authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const permissionName = req.params.permission;

      const revoked = await reviewStorage.revokeUserPermission(userId, permissionName);

      if (!revoked) {
        return res.status(404).json({ message: "Permission not found" });
      }

      // Log audit entry
      await reviewStorage.createAuditLogEntry({
        adminId: req.user!.id,
        action: 'permission_revoked',
        targetType: 'user',
        targetId: userId,
        details: { permission: permissionName },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });

      res.json({ message: "Permission revoked successfully" });
    } catch (error) {
      console.error("Revoke permission error:", error);
      res.status(500).json({ message: "Failed to revoke permission" });
    }
  });

  // Placeholder image endpoint to prevent infinite loops
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const w = parseInt(width) || 64;
    const h = parseInt(height) || 64;

    // Generate a simple SVG placeholder
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">${w}×${h}</text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(svg);
  });

  // Marketplace routes
  app.use("/api/marketplace", marketplaceRoutes);

  // Rental routes
  const rentalRouter = createRentalRoutes(db._.session);
  app.use("/api/rentals", rentalRouter);

  // Services routes
  // Assuming servicesRoutes is defined elsewhere
  // app.use("/api", servicesRoutes);

  // Add marketplace registration route
  // Assuming 'path' is a module that needs to be imported
  // const path = require('path'); // Add this line at the beginning of the file
  // app.get("/marketplace/register", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  // });

  const httpServer = createServer(app);
  return httpServer;
}