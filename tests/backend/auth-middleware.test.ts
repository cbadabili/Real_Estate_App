
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole } from '../../server/auth-middleware';

// Mock JWT
vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    vi.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should reject requests without token', async () => {
      app.get('/test', authenticateToken, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test');
      expect(response.status).toBe(401);
    });

    it('should accept valid token', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
      (jwt.verify as any).mockReturnValue(mockUser);

      app.get('/test', authenticateToken, (req, res) => {
        res.json({ user: req.user });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it('should reject invalid token', async () => {
      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      app.get('/test', authenticateToken, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
    });
  });

  describe('requireRole', () => {
    it('should allow access with correct role', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'admin' };
      (jwt.verify as any).mockReturnValue(mockUser);

      app.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/admin')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
    });

    it('should deny access with incorrect role', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
      (jwt.verify as any).mockReturnValue(mockUser);

      app.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/admin')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
    });
  });
});
