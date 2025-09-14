
import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Home, Building, MapPin } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    priceRange: [number, number];
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    listingType: string;
  };
  onFiltersChange: (filters: any) => void;
  propertyCount: number;
  className?: string;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  propertyCount,
  className = ''
}) => {
  // Ensure filters has default values
  const safeFilters = {
    priceRange: [0, 5000000] as [number, number],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all',
    ...filters
  };

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...safeFilters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 5000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      listingType: 'all'
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `P${(price / 1000).toFixed(0)}K`;
    }
    return `P${price.toLocaleString()}`;
  };

  const botswanaLocations = [
    'Gaborone', 'Francistown', 'Molepolole', 'Kanye', 'Serowe', 
    'Mahalapye', 'Mogoditshane', 'Mochudi', 'Maun', 'Lobatse',
    'Block 8', 'Block 9', 'Block 10', 'G-West', 'Phakalane'
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-beedab-blue" />
            Filters
          </h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {propertyCount} properties match your criteria
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            Price Range
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <input
                  type="number"
                  value={safeFilters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, safeFilters.priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Min price"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <input
                  type="number"
                  value={safeFilters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [safeFilters.priceRange[0], parseInt(e.target.value) || 5000000])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Max price"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatPrice(safeFilters.priceRange[0])} - {formatPrice(safeFilters.priceRange[1])}
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Home className="h-4 w-4 mr-2 text-beedab-blue" />
            Property Type
          </label>
          
          <select
            value={safeFilters.propertyType}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="house">Houses</option>
            <option value="apartment">Apartments</option>
            <option value="townhouse">Townhouses</option>
            <option value="land_plot">Land/Plot</option>
            <option value="commercial">Commercial</option>
            <option value="farm">Farm</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            {['any', '1', '2', '3', '4', '5+'].map((bedroom) => (
              <button
                key={bedroom}
                onClick={() => updateFilter('bedrooms', bedroom)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  safeFilters.bedrooms === bedroom
                    ? 'border-beedab-blue bg-beedab-blue text-white'
                    : 'border-gray-300 text-gray-700 hover:border-beedab-blue hover:text-beedab-blue'
                }`}
              >
                {bedroom === 'any' ? 'Any' : bedroom}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bathrooms
          </label>
          <div className="flex flex-wrap gap-2">
            {['any', '1', '2', '3', '4+'].map((bathroom) => (
              <button
                key={bathroom}
                onClick={() => updateFilter('bathrooms', bathroom)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  safeFilters.bathrooms === bathroom
                    ? 'border-beedab-blue bg-beedab-blue text-white'
                    : 'border-gray-300 text-gray-700 hover:border-beedab-blue hover:text-beedab-blue'
                }`}
              >
                {bathroom === 'any' ? 'Any' : bathroom}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Listing Type
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Listings' },
              { value: 'agent', label: 'Agent Listed' },
              { value: 'owner', label: 'Owner Listed' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('listingType', type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  safeFilters.listingType === type.value
                    ? 'border-beedab-blue bg-beedab-blue text-white'
                    : 'border-gray-300 text-gray-700 hover:border-beedab-blue hover:text-beedab-blue'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
