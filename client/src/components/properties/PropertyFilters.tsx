import React from 'react';
import { motion } from 'framer-motion';
import { X, Home, Bed, Bath } from 'lucide-react';

interface PropertyFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  propertyCount: number;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  propertyCount 
}) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 10000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      listingType: 'all'
    });
  };

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'farm', label: 'Farm' },
    { value: 'land', label: 'Land' }
  ];

  const bedroomOptions = [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const bathroomOptions = [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  const listingTypes = [
    { value: 'all', label: 'All Listings' },
    { value: 'agent', label: 'Agent Listings' },
    { value: 'owner', label: 'Owner Seller' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-beedab-darkblue hover:text-beedab-blue font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
            <span className="font-bold text-sm mr-2">P</span>
            Price Range (Pula)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0] || ''}
                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent text-sm"
              />
              <span className="text-neutral-400">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1] === 10000000 ? '' : filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000000])}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'P0-500K', range: [0, 500000] },
                { label: 'P500K-1M', range: [500000, 1000000] },
                { label: 'P1M-2M', range: [1000000, 2000000] },
                { label: 'P2M-5M', range: [2000000, 5000000] },
                { label: 'P5M+', range: [5000000, 10000000] }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => updateFilter('priceRange', preset.range)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.priceRange[0] === preset.range[0] && filters.priceRange[1] === preset.range[1]
                      ? 'bg-beedab-lightblue border-beedab-blue text-beedab-darkblue'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
            <Home className="h-4 w-4 mr-2" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('propertyType', type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.propertyType === type.value
                    ? 'bg-beedab-lightblue border-beedab-blue text-beedab-darkblue'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
            <Bed className="h-4 w-4 mr-2" />
            Bedrooms
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bedroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('bedrooms', option.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.bedrooms === option.value
                    ? 'bg-beedab-lightblue border-beedab-blue text-beedab-darkblue'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
            <Bath className="h-4 w-4 mr-2" />
            Bathrooms
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bathroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('bathrooms', option.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.bathrooms === option.value
                    ? 'bg-beedab-lightblue border-beedab-blue text-beedab-darkblue'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div>
          <label className="text-sm font-medium text-neutral-700 mb-3 block">
            Listing Type
          </label>
          <div className="space-y-2">
            {listingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('listingType', type.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                  filters.listingType === type.value
                    ? 'bg-beedab-lightblue border-beedab-blue text-beedab-darkblue'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="bg-neutral-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-beedab-darkblue">{propertyCount}</div>
            <div className="text-sm text-neutral-600">Properties Found</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyFilters;