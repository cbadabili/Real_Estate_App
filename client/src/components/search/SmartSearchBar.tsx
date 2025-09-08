import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, Sparkles, X, TrendingUp, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  label: string;
  type: 'location' | 'suggestion' | 'recent';
}

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
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  const filteredLocations = botswanaLocations.filter(location =>
    location.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  ).map(location => ({ label: location, type: 'location' as const }));

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  ).map(suggestion => ({ label: suggestion, type: 'suggestion' as const }));

  const filteredRecentSearches = recentSearches.filter(search =>
    search.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  ).map(search => ({ label: search, type: 'recent' as const }));

  const combinedFilteredSuggestions = [
    ...filteredLocations,
    ...filteredSuggestions,
    ...filteredRecentSearches
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      const newRecentSearches = [value, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.label);
    onSearch(suggestion.label);
    if (suggestion.type !== 'recent') {
      const newRecentSearches = [suggestion.label, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 || aiRecommendations.length > 0 || trendingSearches.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, combinedFilteredSuggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex !== -1) {
        e.preventDefault();
        handleSuggestionClick(combinedFilteredSuggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    // Load AI recommendations and trending searches
    const loadRecommendations = () => {
      setAiRecommendations([
        "3 bedroom house in Gaborone under P2M",
        "Apartments near University of Botswana",
        "Investment properties in CBD",
        "Family homes with pools in Phakalane"
      ]);

      setTrendingSearches([
        "Gaborone West properties",
        "Francistown commercial spaces",
        "Plots in Tlokweng",
        "Luxury homes Phakalane"
      ]);

      // Load recent searches from localStorage
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(recent.slice(0, 5));
    };

    loadRecommendations();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative z-[10000] ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white border-2 rounded-lg transition-all duration-200
          ${isFocused ? 'border-beedab-blue shadow-lg' : 'border-gray-300 shadow-sm'}
        `}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-500"
          />

          {value.length > 0 && (
            <button
              type="button"
              onClick={() => { onChange(''); setShowSuggestions(false); }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {value.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <div className="flex items-center space-x-1 text-purple-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            </motion.div>
          )}

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

        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </form>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] max-h-96 overflow-y-auto"
          >
            {value.length === 0 && trendingSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending Searches
                </h4>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick({ label: search, type: 'suggestion' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedIndex === index ? 'bg-gray-100' : ''} hover:bg-gray-50`}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {combinedFilteredSuggestions.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  {combinedFilteredSuggestions[0]?.type === 'location' && <MapPin className="h-3 w-3 mr-1" />}
                  {combinedFilteredSuggestions[0]?.type === 'suggestion' && <Sparkles className="h-3 w-3 mr-1" />}
                  {combinedFilteredSuggestions[0]?.type === 'recent' && <Clock className="h-3 w-3 mr-1" />}
                  {combinedFilteredSuggestions[0]?.type === 'location' ? 'Locations' :
                   combinedFilteredSuggestions[0]?.type === 'suggestion' ? 'Suggestions' : 'Recent Searches'}
                </h4>
                <div className="space-y-1">
                  {combinedFilteredSuggestions.slice(0, 7).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedIndex === index ? 'bg-gray-100' : ''} hover:bg-gray-50`}
                    >
                      {suggestion.type === 'location' && <MapPin className="h-4 w-4 inline-block mr-2 text-gray-400" />}
                      {suggestion.type === 'suggestion' && <Star className="h-4 w-4 inline-block mr-2 text-yellow-500" />}
                      {suggestion.type === 'recent' && <Clock className="h-4 w-4 inline-block mr-2 text-gray-400" />}
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {value.length > 0 && combinedFilteredSuggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results found</p>
                <p className="text-xs text-gray-400">Try a different search term</p>
              </div>
            )}

            {value.length === 0 && aiRecommendations.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Recommendations
                </h4>
                <div className="space-y-1">
                  {aiRecommendations.map((recommendation, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick({ label: recommendation, type: 'suggestion' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedIndex === index ? 'bg-gray-100' : ''} hover:bg-gray-50`}
                    >
                      {recommendation}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};