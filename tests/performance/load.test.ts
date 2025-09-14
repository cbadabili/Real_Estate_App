
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import autocannon from 'autocannon';

describe('Load Testing - API Endpoints', () => {
  const baseUrl = 'http://0.0.0.0:5000';
  
  it('should handle concurrent requests to /api/properties', async () => {
    const result = await autocannon({
      url: `${baseUrl}/api/properties`,
      connections: 10,
      duration: 30,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Performance thresholds
    expect(result.latency.average).toBeLessThan(500); // 500ms average
    expect(result.latency.p95).toBeLessThan(1000); // 1s p95
    expect(result.throughput.average).toBeGreaterThan(50); // 50 req/sec
    expect(result.errors).toBe(0);
  });

  it('should handle concurrent requests to /api/rentals/search', async () => {
    const result = await autocannon({
      url: `${baseUrl}/api/rentals/search?city=Gaborone`,
      connections: 8,
      duration: 20,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(result.latency.average).toBeLessThan(750);
    expect(result.latency.p95).toBeLessThan(1500);
    expect(result.throughput.average).toBeGreaterThan(30);
    expect(result.errors).toBe(0);
  });

  it('should handle concurrent AI search requests', async () => {
    const result = await autocannon({
      url: `${baseUrl}/api/search/ai`,
      method: 'POST',
      connections: 5, // Lower for AI endpoint
      duration: 15,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'house in Gaborone with 3 bedrooms'
      })
    });

    expect(result.latency.average).toBeLessThan(2000); // AI is slower
    expect(result.latency.p95).toBeLessThan(5000);
    expect(result.throughput.average).toBeGreaterThan(5);
    expect(result.errors).toBe(0);
  });

  it('should handle user authentication load', async () => {
    const result = await autocannon({
      url: `${baseUrl}/api/users/login`,
      method: 'POST',
      connections: 15,
      duration: 25,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });

    expect(result.latency.average).toBeLessThan(400);
    expect(result.latency.p95).toBeLessThan(800);
    expect(result.throughput.average).toBeGreaterThan(40);
  });
});
