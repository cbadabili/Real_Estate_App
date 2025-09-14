
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '../../server/db';
import { storage } from '../../server/storage';
import { users, properties } from '../../shared/schema';
import { eq } from 'drizzle-orm';

describe('Database Integration', () => {
  beforeAll(async () => {
    // Ensure database is initialized
    // In a real test environment, you'd use a test database
  });

  afterAll(async () => {
    // Cleanup test data
  });

  beforeEach(async () => {
    // Clean up test data before each test
    try {
      await db.delete(properties);
      await db.delete(users);
    } catch (error) {
      // Ignore errors for non-existent tables in test setup
    }
  });

  describe('User Operations', () => {
    it('should create and retrieve user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'user' as const,
        userType: 'buyer' as const
      };

      const createdUser = await storage.createUser(userData);
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.name).toBe(userData.name);

      const retrievedUser = await storage.getUserById(createdUser.id);
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.email).toBe(userData.email);
    });

    it('should handle duplicate email registration', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'user' as const,
        userType: 'buyer' as const
      };

      await storage.createUser(userData);

      // Attempt to create user with same email should fail
      await expect(storage.createUser(userData)).rejects.toThrow();
    });
  });

  describe('Property Operations', () => {
    it('should create and retrieve property', async () => {
      const propertyData = {
        title: 'Test Property',
        price: '500000',
        address: '123 Test Street',
        city: 'Gaborone',
        state: 'South East',
        propertyType: 'house' as const,
        listingType: 'sale' as const,
        bedrooms: 3,
        bathrooms: '2',
        status: 'active' as const,
        ownerId: 1
      };

      const createdProperty = await storage.createProperty(propertyData);
      expect(createdProperty.title).toBe(propertyData.title);
      expect(createdProperty.propertyType).toBe(propertyData.propertyType);

      const retrievedProperty = await storage.getPropertyById(createdProperty.id);
      expect(retrievedProperty).toBeDefined();
      expect(retrievedProperty?.title).toBe(propertyData.title);
    });

    it('should filter properties by criteria', async () => {
      // Create test properties
      const properties = [
        {
          title: 'House 1',
          price: '400000',
          propertyType: 'house' as const,
          city: 'Gaborone',
          bedrooms: 2
        },
        {
          title: 'House 2',
          price: '600000',
          propertyType: 'house' as const,
          city: 'Gaborone',
          bedrooms: 4
        },
        {
          title: 'Apartment 1',
          price: '300000',
          propertyType: 'apartment' as const,
          city: 'Francistown',
          bedrooms: 1
        }
      ];

      for (const prop of properties) {
        await storage.createProperty({
          ...prop,
          address: '123 Test St',
          state: 'Test State',
          listingType: 'sale' as const,
          bathrooms: '1',
          status: 'active' as const,
          ownerId: 1
        });
      }

      // Test filtering
      const houseResults = await storage.getProperties({ propertyType: 'house' });
      expect(houseResults.length).toBe(2);

      const gaboroneResults = await storage.getProperties({ city: 'Gaborone' });
      expect(gaboroneResults.length).toBe(2);

      const minBedroomResults = await storage.getProperties({ minBedrooms: 3 });
      expect(minBedroomResults.length).toBe(1);
    });
  });

  describe('Schema Validation', () => {
    it('should enforce required fields', async () => {
      const incompleteProperty = {
        title: 'Incomplete Property'
        // Missing required fields
      };

      await expect(
        storage.createProperty(incompleteProperty as any)
      ).rejects.toThrow();
    });

    it('should validate enum values', async () => {
      const invalidProperty = {
        title: 'Invalid Property',
        price: '500000',
        address: '123 Test St',
        city: 'Gaborone',
        state: 'Test State',
        propertyType: 'invalid-type' as any,
        listingType: 'sale' as const,
        bathrooms: '1',
        status: 'active' as const,
        ownerId: 1
      };

      await expect(
        storage.createProperty(invalidProperty)
      ).rejects.toThrow();
    });
  });
});
