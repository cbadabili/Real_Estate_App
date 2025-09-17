
import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  city?: string;
  listingType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PropertyFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  variant?: 'horizontal' | 'vertical' | 'modal';
  showAdvanced?: boolean;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  variant = 'horizontal',
  showAdvanced = false
}) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'farm', label: 'Farm' },
    { value: 'land', label: 'Land' }
  ];

  const cities = [
    { value: '', label: 'All Cities' },
    { value: 'Gaborone', label: 'Gaborone' },
    { value: 'Francistown', label: 'Francistown' },
    { value: 'Maun', label: 'Maun' },
    { value: 'Kasane', label: 'Kasane' },
    { value: 'Serowe', label: 'Serowe' }
  ];

  const containerClass = variant === 'vertical' 
    ? 'space-y-4'
    : variant === 'modal'
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
    : 'flex flex-wrap gap-4 items-center';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className={containerClass}>
        {/* Property Type */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          >
            {cities.map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range (BWP)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Bedrooms
          </label>
          <select
            value={filters.minBedrooms || ''}
            onChange={(e) => updateFilter('minBedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
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
        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Bathrooms
          </label>
          <select
            value={filters.minBathrooms || ''}
            onChange={(e) => updateFilter('minBathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {showAdvanced && (
          <>
            {/* Listing Type */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type
              </label>
              <select
                value={filters.listingType || ''}
                onChange={(e) => updateFilter('listingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">Most Recent</option>
                <option value="price">Price</option>
                <option value="size">Size</option>
                <option value="bedrooms">Bedrooms</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
