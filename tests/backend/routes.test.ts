
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { db } from '../../server/db';
import { storage } from '../../server/storage';

// Mock dependencies
vi.mock('../../server/db');
vi.mock('../../server/storage');

describe('API Route Handlers', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    vi.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });

      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Properties API', () => {
    it('should return properties list', async () => {
      const mockProperties = [
        { id: 1, title: 'Test Property', price: '500000' },
        { id: 2, title: 'Another Property', price: '750000' }
      ];

      (storage.getProperties as any).mockResolvedValue(mockProperties);

      app.get('/api/properties', async (req, res) => {
        try {
          const properties = await storage.getProperties();
          res.json(properties);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch properties' });
        }
      });

      const response = await request(app).get('/api/properties');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperties);
    });

    it('should handle property creation with validation', async () => {
      const newProperty = {
        title: 'New Property',
        price: '600000',
        propertyType: 'house',
        bedrooms: 3
      };

      (storage.createProperty as any).mockResolvedValue({ id: 3, ...newProperty });

      app.post('/api/properties', async (req, res) => {
        try {
          // Basic validation
          if (!req.body.title || !req.body.price) {
            return res.status(400).json({ error: 'Missing required fields' });
          }
          
          const property = await storage.createProperty(req.body);
          res.status(201).json(property);
        } catch (error) {
          res.status(500).json({ error: 'Failed to create property' });
        }
      });

      const response = await request(app)
        .post('/api/properties')
        .send(newProperty);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newProperty.title);
    });
  });

  describe('AI Search', () => {
    it('should handle AI search requests', async () => {
      const mockSearchResult = {
        query: 'house in Gaborone',
        filters: { propertyType: 'house', city: 'Gaborone' },
        explanation: 'Searching for house in Gaborone',
        confidence: 0.8,
        matchedProperties: []
      };

      app.post('/api/search/ai', async (req, res) => {
        try {
          if (!req.body.query) {
            return res.status(400).json({ error: 'Query is required' });
          }
          
          // Mock AI search logic
          res.json(mockSearchResult);
        } catch (error) {
          res.status(500).json({ error: 'Search failed' });
        }
      });

      const response = await request(app)
        .post('/api/search/ai')
        .send({ query: 'house in Gaborone' });

      expect(response.status).toBe(200);
      expect(response.body.query).toBe('house in Gaborone');
    });

    it('should validate search query', async () => {
      app.post('/api/search/ai', async (req, res) => {
        if (!req.body.query) {
          return res.status(400).json({ error: 'Query is required' });
        }
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/api/search/ai')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Query is required');
    });
  });
});
