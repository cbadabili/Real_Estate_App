import React, { useState } from 'react';
import { EnhancedSearchBar } from '../components/search/EnhancedSearchBar';
import { EnhancedSearchResults } from '../components/search/EnhancedSearchResults';
import type { SearchResponse } from '../types/real-estate-intel';

const EnhancedSearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = (results: SearchResponse) => {
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleSearchStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Property Search
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Search across BeeDab properties and external sources. We prioritize local listings first, 
            then show additional properties from our partner networks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <EnhancedSearchBar
            onSearchResults={handleSearchResults}
            placeholder="Search properties in Gaborone, Francistown, or anywhere in Botswana..."
          />
        </div>

        {/* Results */}
        <EnhancedSearchResults
          searchResults={searchResults}
          loading={isLoading}
        />

        {/* Help Section */}
        {!searchResults && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">BeeDab Properties</h3>
              <p className="text-gray-600 text-sm">
                Properties listed directly on our platform with verified details and local expertise.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">External Sources</h3>
              <p className="text-gray-600 text-sm">
                Additional properties from partner networks and external real estate platforms.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Results</h3>
              <p className="text-gray-600 text-sm">
                AI-powered search that understands your preferences and finds the best matches.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearchPage;