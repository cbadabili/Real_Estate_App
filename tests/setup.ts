
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Setup test environment
beforeAll(() => {
  // Mock console methods for cleaner test output
  global.console = {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
});

// Global test teardown
afterAll(() => {
  // Reset all mocks
  vi.clearAllMocks();
});
