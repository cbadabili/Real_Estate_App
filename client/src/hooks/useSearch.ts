import { useState, useCallback } from 'react';
import { useToastHelpers } from '../components/ui/Toast';

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  city?: string;
  features?: string[];
  listingType?: string;
}

interface SearchResult {
  filters: SearchFilters;
  explanation: string;
  confidence: number;
}

export const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const { error: showError, success } = useToastHelpers();

  const performSearch = useCallback(async (query: string): Promise<SearchResult | null> => {
    if (!query.trim()) {
      showError('Please enter a search query');
      return null;
    }

    if (query.trim().length < 2) {
      showError('Search query must be at least 2 characters long');
      return null;
    }

    setIsSearching(true);

    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Search failed' 
        }));
        throw new Error(errorData.message || `Search failed (${response.status})`);
      }

      const result = await response.json();
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid search response');
      }

      setSearchResult(result);
      success(`Search interpreted: ${result.explanation}`);
      
      return result;
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      showError('Search Error', errorMessage);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [showError, success]);

  const clearSearchResult = useCallback(() => {
    setSearchResult(null);
  }, []);

  return {
    isSearching,
    searchResult,
    performSearch,
    clearSearchResult
  };
};