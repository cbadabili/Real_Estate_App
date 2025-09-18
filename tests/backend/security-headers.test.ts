
import request from 'supertest';
import { app } from '../../server/index';

describe('Security Headers', () => {
  describe('Content Security Policy', () => {
    it('should set strict CSP headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).not.toContain('unsafe-inline');
      expect(response.headers['content-security-policy']).not.toContain('unsafe-eval');
    });
  });

  describe('Security Headers', () => {
    it('should include all required security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Check for essential security headers
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(response.headers['cross-origin-opener-policy']).toBe('same-origin');
      expect(response.headers['permissions-policy']).toBeDefined();
      expect(response.headers['x-request-id']).toBeDefined();
    });
  });

  describe('Rate Limiting Headers', () => {
    it('should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });
  });
});
