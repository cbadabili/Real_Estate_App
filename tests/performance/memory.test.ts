
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('Memory and Resource Performance', () => {
  let initialMemory: NodeJS.MemoryUsage;

  beforeEach(() => {
    initialMemory = process.memoryUsage();
    if (typeof global.gc === 'function') {
      global.gc(); // Force garbage collection if available
    }
  });

  afterEach(() => {
    if (typeof global.gc === 'function') {
      global.gc();
    }
  });

  it('should not have significant memory leaks in property queries', async () => {
    const requests = 50;
    
    for (let i = 0; i < requests; i++) {
      await request(app)
        .get('/api/properties')
        .query({ limit: 20, offset: i * 20 });
    }

    const finalMemory = process.memoryUsage();
    const heapGrowth = finalMemory.heapUsed - initialMemory.heapUsed;
    const maxAcceptableGrowth = 50 * 1024 * 1024; // 50MB

    expect(heapGrowth).toBeLessThan(maxAcceptableGrowth);
  });

  it('should handle large search result sets efficiently', async () => {
    const startTime = Date.now();
    
    const response = await request(app)
      .get('/api/properties')
      .query({ limit: 100 });

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(response.status).toBe(200);
    expect(executionTime).toBeLessThan(1000); // 1 second max
    expect(response.body.length).toBeLessThanOrEqual(100);
  });

  it('should efficiently process AI search requests', async () => {
    const startTime = Date.now();
    const initialCpuUsage = process.cpuUsage();

    const response = await request(app)
      .post('/api/search/ai')
      .send({ query: 'affordable apartment in Gaborone' });

    const endTime = Date.now();
    const finalCpuUsage = process.cpuUsage(initialCpuUsage);
    const executionTime = endTime - startTime;

    expect(response.status).toBe(200);
    expect(executionTime).toBeLessThan(5000); // 5 seconds max
    expect(finalCpuUsage.user + finalCpuUsage.system).toBeLessThan(1000000); // 1 second CPU time
  });

  it('should handle database connection pooling efficiently', async () => {
    const concurrentRequests = Array.from({ length: 20 }, (_, i) =>
      request(app)
        .get('/api/properties')
        .query({ city: 'Gaborone', offset: i * 5, limit: 5 })
    );

    const startTime = Date.now();
    const responses = await Promise.all(concurrentRequests);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    const allSuccessful = responses.every(res => res.status === 200);

    expect(allSuccessful).toBe(true);
    expect(totalTime).toBeLessThan(3000); // All requests under 3 seconds
  });
});
