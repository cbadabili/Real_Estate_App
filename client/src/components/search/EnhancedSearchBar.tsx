import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Loader2 } from 'lucide-react';
import type { SearchQuery, SearchResponse } from '../../types/real-estate-intel';

interface EnhancedSearchBarProps {
  onSearchResults?: (results: SearchResponse) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearchResults,
  placeholder = "Search properties across BeeDab and external sources...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchQuery>>({
    currency: 'BWP',
    area_unit: 'sqft',
    sort: 'relevance',
    page: 1,
    page_size: 10
  });

  const handleSearch = async () => {
    if (!query.trim() && !filters.location) return;
    
    setIsSearching(true);
    try {
      // Build search parameters
      const searchParams = new URLSearchParams();
      
      if (query.trim()) {
        searchParams.append('location', query);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/search/enhanced?${searchParams}`);
      if (response.ok) {
        const results: SearchResponse = await response.json();
        onSearchResults?.(results);
      } else {
        console.error('Search failed:', await response.text());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const updateFilter = (key: keyof SearchQuery, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Main Search Bar */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Advanced Filters"
        >
          <Filter className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          style={{ backgroundColor: isSearching ? undefined : '#DC143C', borderColor: '#DC143C' }}
          onMouseEnter={(e) => !isSearching && (e.currentTarget.style.backgroundColor = '#B22222')}
          onMouseLeave={(e) => !isSearching && (e.currentTarget.style.backgroundColor = '#DC143C')}
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="City, District, or Area"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (BWP)
              </label>
              <input
                type="number"
                value={filters.min_price || ''}
                onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : null)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (BWP)
              </label>
              <input
                type="number"
                value={filters.max_price || ''}
                onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : null)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bedrooms
              </label>
              <select
                value={filters.beds || ''}
                onChange={(e) => updateFilter('beds', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bathrooms
              </label>
              <select
                value={filters.baths || ''}
                onChange={(e) => updateFilter('baths', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.property_type || ''}
                onChange={(e) => updateFilter('property_type', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort || 'relevance'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="size_desc">Largest First</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
              >
                <option value="">Any Status</option>
                <option value="for_sale">For Sale</option>
                <option value="for_rent">For Rent</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};