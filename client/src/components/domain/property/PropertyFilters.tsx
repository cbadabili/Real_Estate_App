
import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X, MapPin, Loader2 } from 'lucide-react';
import { useDistricts, useLocationSearch } from '../../../hooks/useLocations';

interface PropertyFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // API hooks for location data
  const { data: districtsData, isLoading: loadingDistricts } = useDistricts();
  const { data: locationSearchData } = useLocationSearch(
    locationSearch.length >= 2 ? locationSearch : '', 
    'all', 
    10
  );

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center text-gray-900">
            <Filter className="h-5 w-5 mr-2 text-beedab-blue" />
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

      {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type
          </label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range (BWP)
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Min price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Max price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Location
          </label>
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          />
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
                onClick={() => handleFilterChange('bedrooms', bedroom === 'any' ? '' : bedroom)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  (filters.bedrooms || 'any') === bedroom
                    ? 'border-beedab-blue bg-beedab-blue text-white'
                    : 'border-gray-300 text-gray-700 hover:border-beedab-blue hover:text-beedab-blue'
                }`}
              >
                {bedroom === 'any' ? 'Any' : bedroom}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select
            value={filters.priceRange || ''}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="">Any Price</option>
            <option value="0-500000">Under BWP 500K</option>
            <option value="500000-1000000">BWP 500K - 1M</option>
            <option value="1000000-2000000">BWP 1M - 2M</option>
            <option value="2000000+">BWP 2M+</option>
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={locationSearch || filters.city || ''}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setShowLocationSuggestions(true);
                if (e.target.value === '') {
                  handleFilterChange('city', '');
                  handleFilterChange('state', '');
                }
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowLocationSuggestions(false), 200);
              }}
              placeholder="Search districts, cities, towns..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
            {loadingDistricts && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Location Suggestions Dropdown */}
          {showLocationSuggestions && locationSearchData && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {/* Districts */}
              {locationSearchData.data.districts.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Districts
                  </div>
                  {locationSearchData.data.districts.map((district) => (
                    <button
                      key={`district-${district.id}`}
                      onClick={() => {
                        handleFilterChange('city', district.name);
                        handleFilterChange('state', district.name);
                        setLocationSearch(district.name);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{district.name}</span>
                        <span className="text-sm text-gray-500">
                          {district.type} • {district.region}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Settlements */}
              {locationSearchData.data.settlements.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Cities & Towns
                  </div>
                  {locationSearchData.data.settlements.map((item) => (
                    <button
                      key={`settlement-${item.settlement.id}`}
                      onClick={() => {
                        handleFilterChange('city', item.settlement.name);
                        handleFilterChange('state', item.district.name);
                        setLocationSearch(item.settlement.name);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.settlement.name}</span>
                        <span className="text-sm text-gray-500">
                          {item.settlement.type} • {item.district.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Wards */}
              {locationSearchData.data.wards.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Wards & Areas
                  </div>
                  {locationSearchData.data.wards.map((item) => (
                    <button
                      key={`ward-${item.ward.id}`}
                      onClick={() => {
                        handleFilterChange('city', item.settlement.name);
                        handleFilterChange('state', item.district.name);
                        handleFilterChange('ward', item.ward.name);
                        setLocationSearch(`${item.ward.name}, ${item.settlement.name}`);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.ward.name}</span>
                        <span className="text-sm text-gray-500">
                          {item.settlement.name} • {item.district.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results */}
              {locationSearchData.data.districts.length === 0 && 
               locationSearchData.data.settlements.length === 0 && 
               locationSearchData.data.wards.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No locations found for "{locationSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-4 flex items-center text-sm text-beedab-blue hover:text-beedab-darkblue"
      >
        <SlidersHorizontal className="h-4 w-4 mr-1" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
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
                onClick={() => handleFilterChange('bathrooms', bathroom === 'any' ? '' : bathroom)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  (filters.bathrooms || 'any') === bathroom
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
          <div className="space-y-2">
            {[
              { value: '', label: 'All Listings' },
              { value: 'sale', label: 'For Sale' },
              { value: 'rent', label: 'For Rent' },
              { value: 'auction', label: 'Auction' }
            ].map((type) => (
              <label key={type.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="listingType"
                  value={type.value}
                  checked={(filters.listingType || '') === type.value}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="h-4 w-4 text-beedab-blue focus:ring-beedab-blue border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-beedab-blue hover:text-beedab-darkblue flex items-center"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {['Pool', 'Garage', 'Garden', 'Security', 'Furnished'].map((feature) => (
                  <label key={feature} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.features?.includes(feature) || false}
                      onChange={(e) => {
                        const currentFeatures = filters.features || [];
                        const newFeatures = e.target.checked
                          ? [...currentFeatures, feature]
                          : currentFeatures.filter(f => f !== feature);
                        handleFilterChange('features', newFeatures);
                      }}
                      className="h-4 w-4 text-beedab-blue focus:ring-beedab-blue border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;lters;
