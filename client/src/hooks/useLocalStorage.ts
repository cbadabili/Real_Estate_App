import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    theme: 'light',
    language: 'en',
    currency: 'BWP',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    searchFilters: {
      savedSearches: [],
      defaultSortBy: 'newest',
      defaultViewMode: 'grid'
    },
    privacy: {
      showProfile: true,
      showActivity: false,
      allowContact: true
    }
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedPreference = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'light',
      language: 'en',
      currency: 'BWP',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false
      },
      searchFilters: {
        savedSearches: [],
        defaultSortBy: 'newest',
        defaultViewMode: 'grid'
      },
      privacy: {
        showProfile: true,
        showActivity: false,
        allowContact: true
      }
    });
  };

  return {
    preferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences
  };
}

// Hook for managing recent searches
export function useRecentSearches(maxItems: number = 10) {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);

  const addSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, maxItems);
    });
  };

  const removeSearch = (searchQuery: string) => {
    setRecentSearches(prev => prev.filter(item => item !== searchQuery));
  };

  const clearSearches = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches
  };
}