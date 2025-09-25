const reportStorageError = (error: unknown) => {
  if (typeof console !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn('Local storage access failed', error);
  }
};

export const getToken = (): string | null => {
  try { return localStorage.getItem('token'); } catch (error) { reportStorageError(error); return null; }
};
export const setToken = (token: string): void => {
  try { localStorage.setItem('token', token); } catch (error) { reportStorageError(error); }
};
export const removeToken = (): void => {
  try { localStorage.removeItem('token'); } catch (error) { reportStorageError(error); }
};
export const hasToken = (): boolean => getToken() !== null;

export const SafeStorage = {
  get(key: string): string | null {
    try { return localStorage.getItem(key); } catch (error) { reportStorageError(error); return null; }
  },
  set(key: string, value: string): void {
    try { localStorage.setItem(key, value); } catch (error) { reportStorageError(error); }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch (error) { reportStorageError(error); }
  },
  getWithMigration(newKey: string, legacyKey?: string): string | null {
    const v = this.get(newKey);
    if (v != null) return v;
    return legacyKey ? this.get(legacyKey) : null;
  },
};

// Back-compat class for existing imports
export class TokenStorage {
  static getToken(): string | null { return getToken(); }
  static setToken(token: string): void { setToken(token); }
  static removeToken(): void { removeToken(); }
  static hasToken(): boolean { return hasToken(); }
}
