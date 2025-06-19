import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface AISearchBarProps {
  onSearch?: (query: string, filters?: any) => void;
  className?: string;
}

export const AISearchBar = ({ onSearch, className = '' }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
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
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleQueries = [
    "3 bedroom house under P2M in Gaborone near good schools",
    "Modern apartment in CBD with city views",
    "Family home with large yard in quiet area of Francistown",
    "Investment property in Maun with rental potential"
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
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your dream property... (e.g., '3 bedroom house near schools under P2M')"
              className="flex-1 px-4 py-4 text-lg placeholder-neutral-400 focus:outline-none"
              disabled={isProcessing}
            />
            <button
              onClick={handleSearch}
              disabled={isProcessing || !query.trim()}
              className="mr-2 bg-gradient-to-r from-beedab-blue to-beedab-lightblue text-white px-8 py-4 rounded-xl font-semibold hover:from-beedab-lightblue hover:to-beedab-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isProcessing ? (
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

        <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-4xl">
          <p className="w-full text-center text-white/80 text-sm mb-2">Try these examples:</p>
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm text-sm text-beedab-black rounded-full border border-white/50 hover:bg-white hover:border-beedab-blue transition-all shadow-lg"
            >
              {example}
            </button>
          ))}
        </div>

        {isProcessing && (
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