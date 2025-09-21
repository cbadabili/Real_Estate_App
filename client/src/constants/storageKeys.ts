
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  USER_PREFERENCES: 'userPreferences',
  SAVED_SEARCHES: 'savedSearches',
  THEME: 'theme'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Legacy keys for migration
export const LEGACY_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken'
} as const;
