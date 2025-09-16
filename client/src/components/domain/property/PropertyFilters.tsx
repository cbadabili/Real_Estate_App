
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
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <select
              value={filters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
