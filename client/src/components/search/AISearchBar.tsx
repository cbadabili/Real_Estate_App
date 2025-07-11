import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, MapPin, Home, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AISearchBarProps {
  onSearch?: (query: string, filters: any, properties?: any[]) => void;
  placeholder?: string;
  className?: string;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for properties using natural language... (e.g., '3 bedroom house in Gaborone under P800,000')",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-search with debounce
  useEffect(() => {
    if (query.length > 3) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        handleAutoSearch();
      }, 500);
    } else {
      setAutoSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleAutoSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.autoSuggestions) {
        setAutoSuggestions(result.autoSuggestions);
        setShowSuggestions(true);
      }

      setSearchResults(result);
    } catch (error) {
      console.error('Auto search error:', error);
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      });

      const result = await response.json();

      if (result.suggestions) {
        setSuggestions(result.suggestions);
      }

      if (onSearch) {
        onSearch(searchTerm, result.filters, result.matchedProperties);
      }

      // Update query if different
      if (searchQuery && searchQuery !== query) {
        setQuery(searchQuery);
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearches = [
    { text: 'Houses in Gaborone', icon: Home },
    { text: 'Apartments under P500,000', icon: DollarSign },
    { text: 'Properties in Francistown', icon: MapPin },
    { text: '3 bedroom houses', icon: Home },
    { text: 'Land for sale', icon: MapPin }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Sparkles className="h-5 w-5 text-purple-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (autoSuggestions.length > 0 || query.length === 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="p-1 text-gray-400 hover:text-purple-500 focus:outline-none focus:text-purple-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {/* Auto-suggestions based on current query */}
              {autoSuggestions.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Based on your search</div>
                  {autoSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded flex items-center"
                      onClick={() => handleSearch(suggestion)}
                    >
                      <Search className="h-3 w-3 mr-2 text-purple-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick searches when no query */}
              {query.length === 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Quick searches</div>
                  {quickSearches.map((item, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded flex items-center"
                      onClick={() => handleSearch(item.text)}
                    >
                      <item.icon className="h-3 w-3 mr-2 text-purple-500" />
                      {item.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Results summary */}
              {searchResults && searchResults.matchedProperties && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs text-gray-500 px-2 py-1">
                    Found {searchResults.matchedProperties.length} properties
                    {searchResults.confidence && (
                      <span className="ml-2 text-purple-600">
                        ({Math.round(searchResults.confidence * 100)}% match)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Improvement suggestions */}
              {suggestions.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Improve your search</div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 text-xs text-gray-600"
                    >
                      • {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};