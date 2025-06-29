import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Mic, MapPin, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
  className?: string;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search properties...",
  showFilters = false,
  onFilterClick,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const botswanaLocations = [
    'Gaborone', 'Francistown', 'Molepolole', 'Kanye', 'Serowe',
    'Mahalapye', 'Mogoditshane', 'Mochudi', 'Maun', 'Lobatse',
    'Block 8', 'Block 9', 'Block 10', 'G-West', 'Phakalane'
  ];

  const searchSuggestions = [
    'Houses under P2M in Gaborone',
    'Apartments for rent in Francistown',
    '3 bedroom houses with garden',
    'Plot for sale in G-West',
    'Commercial property in CBD',
    'Luxury homes in Phakalane'
  ];

  const recentSearches = [
    'Houses in Mogoditshane',
    'Apartments under P500K',
    'Commercial plots'
  ];

  const filteredLocations = botswanaLocations.filter(location =>
    location.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white border-2 rounded-lg transition-all duration-200
          ${isFocused ? 'border-beedab-blue shadow-lg' : 'border-gray-300 shadow-sm'}
        `}>
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(value.length > 0);
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-500"
          />

          {/* AI Indicator */}
          {value.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2"
            >
              <div className="flex items-center space-x-1 text-purple-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            </motion.div>
          )}

          {/* Filter Button */}
          {showFilters && onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (isFocused || value.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {/* Locations */}
            {filteredLocations.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Locations in Botswana
                </h4>
                <div className="space-y-1">
                  {filteredLocations.slice(0, 5).map((location) => (
                    <button
                      key={location}
                      onClick={() => handleSuggestionClick(`Properties in ${location}`)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart Suggestions
                </h4>
                <div className="space-y-1">
                  {filteredSuggestions.slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {value.length === 0 && recentSearches.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {value.length > 0 && filteredLocations.length === 0 && filteredSuggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No suggestions found</p>
                <p className="text-xs text-gray-400">Try searching for locations or property types</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};