
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, StorageKey } from '@/constants/storageKeys';

export class SafeStorage {
  static get(key: StorageKey): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${key}`, error);
      return null;
    }
  }

  static set(key: StorageKey, value: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to write to localStorage: ${key}`, error);
    }
  }

  static remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from localStorage: ${key}`, error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
    }
  }

  // Migration helper - reads from new key first, falls back to legacy
  static getWithMigration(newKey: StorageKey, legacyKey: string): string | null {
    const newValue = this.get(newKey);
    if (newValue) return newValue;

    // Check legacy key
    if (typeof window === 'undefined') return null;
    
    try {
      const legacyValue = localStorage.getItem(legacyKey);
      if (legacyValue) {
        // Migrate to new key
        this.set(newKey, legacyValue);
        localStorage.removeItem(legacyKey);
        return legacyValue;
      }
    } catch (error) {
      console.warn(`Failed to migrate from legacy key: ${legacyKey}`, error);
    }

    return null;
  }
}

// Token-specific utilities
export class TokenStorage {
  static getToken(): string | null {
    // Check for new token first, then migrate from legacy if needed
    return SafeStorage.getWithMigration(STORAGE_KEYS.TOKEN, LEGACY_STORAGE_KEYS.AUTH_TOKEN);
  }

  static setToken(token: string): void {
    SafeStorage.set(STORAGE_KEYS.TOKEN, token);
    // Clean up any legacy tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LEGACY_STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  static removeToken(): void {
    SafeStorage.remove(STORAGE_KEYS.TOKEN);
    // Clean up any legacy tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LEGACY_STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }
}
