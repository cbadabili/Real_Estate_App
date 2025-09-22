
interface CacheItem<T> {
  data: T;
  expiry: number;
  hits: number;
}

export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data,
      expiry,
      hits: 0
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    item.hits++;
    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    for (const [key, item] of entries) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove least recently used (by hits)
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.hits - b.hits);
      
      const toRemove = sortedEntries.slice(0, Math.floor(this.maxSize * 0.1));
      for (const [key] of toRemove) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const validEntries = entries.filter(([, item]) => now <= item.expiry);
    
    return {
      size: this.cache.size,
      validEntries: validEntries.length,
      totalHits: validEntries.reduce((sum, [, item]) => sum + item.hits, 0),
      hitRate: validEntries.length > 0 
        ? (validEntries.reduce((sum, [, item]) => sum + item.hits, 0) / validEntries.length).toFixed(2)
        : 0
    };
  }

  // Helper method to create cache keys
  static createKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }
}

export const cacheService = new CacheService();
