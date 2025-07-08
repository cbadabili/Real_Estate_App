import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const botswanaLocations = [
  'Gaborone', 'Francistown', 'Maun', 'Kasane', 'Serowe', 'Molepolole',
  'Kanye', 'Mahalapye', 'Palapye', 'Lobatse', 'Jwaneng', 'Orapa',
  'Phakalane', 'Broadhurst', 'Extension 15', 'Mogoditshane', 'Tlokweng',
  'Gabane', 'Mochudi', 'Ramotswa', 'Block 8', 'Block 9', 'Block 10'
];

interface AISearchBarProps {
  onSearch?: (query: string, filters?: any) => void;
  className?: string;
}

export const AISearchBar = ({ onSearch, className = '' }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('AI Search Result:', result);

        if (onSearch) {
          onSearch(query, result.parsedFilters);
        }
      } else {
        console.error('AI search failed:', response.statusText);
        if (onSearch) {
          onSearch(query);
        }
      }
    } catch (error) {
      console.error('AI search error:', error);
      if (onSearch) {
        onSearch(query);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setShowSuggestions(true);

      // Filter locations
      const filteredLocations = botswanaLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filteredLocations);

      // Generate suggestions based on input
      const commonQueries = [
        '3 bedroom house in Gaborone',
        'Apartment for rent in Francistown',
        'Plot for sale in Maun',
        'Commercial property in CBD',
        'House with pool under P2M',
        'Modern townhouse with garage',
        'Farm property with borehole'
      ];

      const filtered = commonQueries.filter(q => 
        q.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setShowSuggestions(false);
      setLocationSuggestions([]);
    }
  };

  const exampleQueries = [
    "3-bedroom house under P1.2M in Block 8 near schools and shopping malls",
    "Modern apartment in G-West with 24/7 security and covered parking",
    "Serviced plot in Tlokweng with title deed and paved road access",
    "Investment house in Mogoditshane with steady rental income"
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center"
      >
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-beedab-blue/20 overflow-hidden">
          <div className="flex items-center p-2">
            <div className="flex items-center pl-4 pr-3">
              <Sparkles className="h-6 w-6 text-beedab-blue mr-2" />
              <span className="text-sm font-medium text-beedab-black">AI Search</span>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Describe your dream property... (e.g., '3-bedroom house under P1.2M in Block 8')"
              className="flex-1 px-4 py-4 text-lg placeholder-neutral-400 focus:outline-none"
              disabled={isLoading}
              ref={inputRef}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="mr-2 bg-gradient-to-r from-beedab-blue to-beedab-lightblue text-white px-8 py-4 rounded-xl font-semibold hover:from-beedab-lightblue hover:to-beedab-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showSuggestions && (
          <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10">
            {locationSuggestions.length > 0 && (
              <div>
                <p className="px-4 py-2 text-gray-500 text-sm">Locations:</p>
                {locationSuggestions.map((location, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setQuery(location);
                      setLocationSuggestions([]);
                      setSuggestions([]);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {location}
                  </div>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <p className="px-4 py-2 text-gray-500 text-sm">Suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                      setLocationSuggestions([]);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {locationSuggestions.length === 0 && suggestions.length === 0 && (
              <div className="px-4 py-2 text-gray-500">No suggestions found.</div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-4xl">
          <p className="w-full text-center text-white/80 text-sm mb-2">Try these examples:</p>
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(example);
                setSuggestions([]);
                setLocationSuggestions([]);
                setShowSuggestions(false);
              }}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm text-sm text-beedab-black rounded-full border border-white/50 hover:bg-white hover:border-beedab-blue transition-all shadow-lg"
            >
              {example}
            </button>
          ))}
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-beedab-blue/30">
              <Sparkles className="h-4 w-4 text-beedab-blue animate-pulse" />
              <span className="text-beedab-black font-medium">AI is analyzing your search...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};