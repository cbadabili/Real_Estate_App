
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/index'; // Assuming app is exported

describe('End-to-End User Flows', () => {
  let authToken: string;
  let userId: number;
  let propertyId: number;

  describe('User Registration and Authentication Flow', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'e2e-test@example.com',
        password: 'testpassword123',
        name: 'E2E Test User',
        userType: 'buyer',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
      
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should login with registered user', async () => {
      const loginData = {
        email: 'e2e-test@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should access protected profile endpoint', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('e2e-test@example.com');
    });
  });

  describe('Property Management Flow', () => {
    it('should create a new property', async () => {
      const propertyData = {
        title: 'E2E Test Property',
        description: 'A test property for E2E testing',
        price: '750000',
        address: '456 E2E Test Avenue',
        city: 'Gaborone',
        state: 'South East District',
        zipCode: '00000',
        propertyType: 'house',
        listingType: 'sale',
        bedrooms: 3,
        bathrooms: '2',
        squareFeet: 1500,
        status: 'active'
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(propertyData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(propertyData.title);
      expect(response.body.ownerId).toBe(userId);
      
      propertyId = response.body.id;
    });

    it('should retrieve the created property', async () => {
      const response = await request(app)
        .get(`/api/properties/${propertyId}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('E2E Test Property');
      expect(response.body.propertyType).toBe('house');
    });

    it('should update the property', async () => {
      const updateData = {
        title: 'Updated E2E Test Property',
        price: '800000'
      };

      const response = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.price).toBe(updateData.price);
    });

    it('should search for properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({
          propertyType: 'house',
          city: 'Gaborone',
          minPrice: '500000',
          maxPrice: '1000000'
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const foundProperty = response.body.find((p: any) => p.id === propertyId);
      expect(foundProperty).toBeDefined();
    });
  });

  describe('AI Search Flow', () => {
    it('should perform AI-powered search', async () => {
      const searchQuery = {
        query: 'house in Gaborone with 3 bedrooms under P900000'
      };

      const response = await request(app)
        .post('/api/search/ai')
        .send(searchQuery);

      expect(response.status).toBe(200);
      expect(response.body.query).toBe(searchQuery.query);
      expect(response.body.filters).toBeDefined();
      expect(response.body.explanation).toBeDefined();
      expect(response.body.confidence).toBeGreaterThan(0);
    });

    it('should handle enhanced search with external results', async () => {
      const response = await request(app)
        .get('/api/search/enhanced')
        .query({
          location: 'Gaborone',
          property_type: 'house',
          beds: 3,
          max_price: 900000,
          currency: 'BWP'
        });

      expect(response.status).toBe(200);
      expect(response.body.results).toBeDefined();
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('Role-Based Access Control', () => {
    it('should deny access to admin endpoints for regular user', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });

    it('should allow property owner to modify their property', async () => {
      const updateData = { price: '850000' };

      const response = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid property ID gracefully', async () => {
      const response = await request(app)
        .get('/api/properties/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    it('should handle unauthorized requests', async () => {
      const response = await request(app)
        .post('/api/properties')
        .send({ title: 'Unauthorized Property' });

      expect(response.status).toBe(401);
    });
  });

  describe('Cleanup', () => {
    it('should delete the test property', async () => {
      const response = await request(app)
        .delete(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });
});
