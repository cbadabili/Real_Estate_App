
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

// Import shared schemas
import { insertUserSchema, insertPropertySchema } from '../../shared/schema';

describe('Frontend-Backend Contract Tests', () => {
  describe('Schema Validation', () => {
    it('should validate user registration data', () => {
      const validUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'user',
        userType: 'buyer'
      };

      expect(() => insertUserSchema.parse(validUserData)).not.toThrow();

      const invalidUserData = {
        email: 'invalid-email',
        password: '123', // too short
        name: '',
        role: 'invalid-role',
        userType: 'invalid-type'
      };

      expect(() => insertUserSchema.parse(invalidUserData)).toThrow();
    });

    it('should validate property creation data', () => {
      const validPropertyData = {
        title: 'Test Property',
        price: '500000',
        address: '123 Test Street',
        city: 'Gaborone',
        state: 'South East',
        propertyType: 'house',
        listingType: 'sale',
        status: 'active',
        ownerId: 1
      };

      expect(() => insertPropertySchema.parse(validPropertyData)).not.toThrow();

      const invalidPropertyData = {
        title: '', // empty title
        price: 'invalid-price',
        propertyType: 'invalid-type',
        listingType: 'invalid-listing'
      };

      expect(() => insertPropertySchema.parse(invalidPropertyData)).toThrow();
    });
  });

  describe('API Response Format', () => {
    it('should match expected user response format', () => {
      const userResponseSchema = z.object({
        id: z.number(),
        email: z.string().email(),
        name: z.string(),
        role: z.string(),
        userType: z.string(),
        createdAt: z.number().optional(),
        updatedAt: z.number().optional()
      });

      const mockUserResponse = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        userType: 'buyer',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      expect(() => userResponseSchema.parse(mockUserResponse)).not.toThrow();
    });

    it('should match expected property response format', () => {
      const propertyResponseSchema = z.object({
        id: z.number(),
        title: z.string(),
        price: z.string(),
        address: z.string(),
        city: z.string(),
        propertyType: z.string(),
        listingType: z.string(),
        bedrooms: z.number().nullable(),
        bathrooms: z.string().nullable(),
        status: z.string(),
        ownerId: z.number().nullable(),
        createdAt: z.number().nullable(),
        updatedAt: z.number().nullable()
      });

      const mockPropertyResponse = {
        id: 1,
        title: 'Test Property',
        price: '500000',
        address: '123 Test Street',
        city: 'Gaborone',
        propertyType: 'house',
        listingType: 'sale',
        bedrooms: 3,
        bathrooms: '2',
        status: 'active',
        ownerId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      expect(() => propertyResponseSchema.parse(mockPropertyResponse)).not.toThrow();
    });
  });

  describe('Error Response Format', () => {
    it('should have consistent error response structure', () => {
      const errorResponseSchema = z.object({
        error: z.string(),
        message: z.string().optional(),
        details: z.any().optional()
      });

      const mockErrorResponse = {
        error: 'Validation failed',
        message: 'Invalid input data',
        details: { field: 'email', issue: 'Invalid email format' }
      };

      expect(() => errorResponseSchema.parse(mockErrorResponse)).not.toThrow();
    });
  });
});
