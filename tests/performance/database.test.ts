
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../server/db';
import { storage } from '../../server/storage';
import { properties, users } from '../../shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

describe('Database Performance Tests', () => {
  beforeAll(async () => {
    // Ensure we have test data for performance tests
    try {
      const testUser = await storage.createUser({
        email: 'perf-test@example.com',
        password: 'hashed-password',
        name: 'Performance Test User',
        role: 'user',
        userType: 'buyer'
      });

      // Create multiple test properties for performance testing
      const propertyPromises = Array.from({ length: 100 }, (_, i) => 
        storage.createProperty({
          title: `Performance Test Property ${i}`,
          price: `${500000 + (i * 10000)}`,
          address: `${i} Test Street`,
          city: i % 2 === 0 ? 'Gaborone' : 'Francistown',
          state: 'Test State',
          propertyType: i % 3 === 0 ? 'house' : i % 3 === 1 ? 'apartment' : 'land',
          listingType: 'sale',
          bathrooms: '2',
          bedrooms: 2 + (i % 4),
          status: 'active',
          ownerId: testUser.id
        })
      );

      await Promise.all(propertyPromises);
    } catch (error) {
      console.log('Test data creation failed, using existing data');
    }
  });

  afterAll(async () => {
    // Cleanup test data
    try {
      await db.delete(properties).where(
        properties.title.like('Performance Test Property%')
      );
      await db.delete(users).where(
        eq(users.email, 'perf-test@example.com')
      );
    } catch (error) {
      console.log('Cleanup failed:', error);
    }
  });

  it('should execute property search queries efficiently', async () => {
    const startTime = Date.now();

    const results = await storage.getProperties({
      city: 'Gaborone',
      propertyType: 'house',
      minPrice: '400000',
      maxPrice: '800000'
    });

    const endTime = Date.now();
    const queryTime = endTime - startTime;

    expect(queryTime).toBeLessThan(500); // 500ms max
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  it('should handle pagination efficiently for large datasets', async () => {
    const pageSize = 20;
    const startTime = Date.now();

    const page1 = await storage.getProperties({ limit: pageSize, offset: 0 });
    const page2 = await storage.getProperties({ limit: pageSize, offset: pageSize });
    const page3 = await storage.getProperties({ limit: pageSize, offset: pageSize * 2 });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(1000); // 1 second for 3 pages
    expect(page1.length).toBeLessThanOrEqual(pageSize);
    expect(page2.length).toBeLessThanOrEqual(pageSize);
    expect(page3.length).toBeLessThanOrEqual(pageSize);
  });

  it('should execute complex filtered searches efficiently', async () => {
    const startTime = Date.now();

    const results = await db.select()
      .from(properties)
      .where(
        and(
          eq(properties.city, 'Gaborone'),
          gte(properties.bedrooms, 2),
          lte(properties.bedrooms, 4),
          eq(properties.status, 'active')
        )
      )
      .limit(50);

    const endTime = Date.now();
    const queryTime = endTime - startTime;

    expect(queryTime).toBeLessThan(300); // 300ms max
    expect(results).toBeDefined();
    expect(results.length).toBeLessThanOrEqual(50);
  });

  it('should handle concurrent database operations efficiently', async () => {
    const concurrentQueries = Array.from({ length: 10 }, (_, i) =>
      storage.getProperties({
        city: i % 2 === 0 ? 'Gaborone' : 'Francistown',
        limit: 10,
        offset: i * 10
      })
    );

    const startTime = Date.now();
    const results = await Promise.all(concurrentQueries);
    const endTime = Date.now();

    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(2000); // 2 seconds for 10 concurrent queries
    expect(results.every(result => Array.isArray(result))).toBe(true);
  });

  it('should efficiently count large datasets', async () => {
    const startTime = Date.now();

    const totalCount = await db.select({ count: properties.id })
      .from(properties)
      .where(eq(properties.status, 'active'));

    const endTime = Date.now();
    const queryTime = endTime - startTime;

    expect(queryTime).toBeLessThan(200); // 200ms max for count query
    expect(totalCount).toBeDefined();
  });
});
