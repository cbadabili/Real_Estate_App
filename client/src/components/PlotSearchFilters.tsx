import React, { useState } from 'react';
import { Search, MapPin, Ruler, Zap, Droplets, Loader2 } from 'lucide-react';
import { useDistricts, useLocationSearch } from '../hooks/useLocations';

interface PlotSearchFiltersProps {
  onFiltersChange: (filters: PlotFilters) => void;
  className?: string;
}

export interface PlotFilters {
  location: string;
  minSize: number | null;
  maxSize: number | null;
  sizeUnit: 'm²' | 'hectares';
  minPrice: number | null;
  maxPrice: number | null;
  plotType: 'residential' | 'farm' | 'commercial' | 'all';
  hasWater: boolean | null;
  hasElectricity: boolean | null;
  serviced: boolean | null;
}

/**
 * Advanced Search & Filter Component for Botswana Plots
 * Based on Facebook group analysis: Users search by location, size, price, and amenities
 * Popular locations: Mogoditshane Block 5, Manyana Plateau, Mahalapye, Pitsane
 * Common sizes: 900-1000m² residential, 4+ hectares farming
 */
export const PlotSearchFilters: React.FC<PlotSearchFiltersProps> = ({ 
  onFiltersChange, 
  className = "" 
}) => {
  const [filters, setFilters] = useState<PlotFilters>({
    location: '',
    minSize: null,
    maxSize: null,
    sizeUnit: 'm²',
    minPrice: null,
    maxPrice: null,
    plotType: 'all',
    hasWater: null,
    hasElectricity: null,
    serviced: null
  });

  // State for location search
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // API hooks for location data
  const { data: districtsData, isLoading: loadingDistricts } = useDistricts();
  const { data: locationSearchData } = useLocationSearch(
    locationSearch.length >= 2 ? locationSearch : '', 
    'all', 
    15
  );

  const updateFilters = (newFilters: Partial<PlotFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-beedab-blue" />
        <h3 className="text-lg font-semibold text-gray-900">Search Plots</h3>
      </div>

      {/* Location Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            value={locationSearch || filters.location}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              setShowLocationSuggestions(true);
              if (e.target.value === '') {
                updateFilters({ location: '' });
              }
            }}
            onFocus={() => setShowLocationSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowLocationSuggestions(false), 200);
            }}
            placeholder="Search districts, cities, towns, wards..."
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
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
                      updateFilters({ location: district.name });
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
                      updateFilters({ location: item.settlement.name });
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
              <div className="border-b border-gray-100">
                <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Wards & Areas
                </div>
                {locationSearchData.data.wards.map((item) => (
                  <button
                    key={`ward-${item.ward.id}`}
                    onClick={() => {
                      updateFilters({ location: `${item.ward.name}, ${item.settlement.name}` });
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
            
            {/* Plots with specific addresses */}
            {locationSearchData.data.plots.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Specific Areas
                </div>
                {locationSearchData.data.plots.slice(0, 5).map((item) => (
                  <button
                    key={`plot-${item.plot.id}`}
                    onClick={() => {
                      updateFilters({ location: item.plot.full_address });
                      setLocationSearch(item.plot.full_address);
                      setShowLocationSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.plot.full_address}</span>
                      <span className="text-xs text-gray-500">
                        {item.ward.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* No results */}
            {locationSearchData.data.districts.length === 0 && 
             locationSearchData.data.settlements.length === 0 && 
             locationSearchData.data.wards.length === 0 && 
             locationSearchData.data.plots.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No locations found for "{locationSearch}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plot Size Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Ruler className="inline h-4 w-4 mr-1" />
          Plot Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minSize || ''}
            onChange={(e) => updateFilters({ minSize: e.target.value ? Number(e.target.value) : null })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxSize || ''}
            onChange={(e) => updateFilters({ maxSize: e.target.value ? Number(e.target.value) : null })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
          />
          <select
            value={filters.sizeUnit}
            onChange={(e) => updateFilters({ sizeUnit: e.target.value as 'm²' | 'hectares' })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
          >
            <option value="m²">m²</option>
            <option value="hectares">hectares</option>
          </select>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (BWP)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
          />
        </div>
      </div>

      {/* Plot Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plot Type
        </label>
        <select
          value={filters.plotType}
          onChange={(e) => updateFilters({ plotType: e.target.value as PlotFilters['plotType'] })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
        >
          <option value="all">All Types</option>
          <option value="residential_plot">Residential Plot</option>
          <option value="agricultural_land">Agricultural Land</option>
          <option value="commercial_plot">Commercial Plot</option>
        </select>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities Available
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasWater === true}
              onChange={(e) => updateFilters({ hasWater: e.target.checked ? true : null })}
              className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
            />
            <Droplets className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm">Water Available</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasElectricity === true}
              onChange={(e) => updateFilters({ hasElectricity: e.target.checked ? true : null })}
              className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
            />
            <Zap className="h-4 w-4 mr-1 text-yellow-500" />
            <span className="text-sm">Electricity Available</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.serviced === true}
              onChange={(e) => updateFilters({ serviced: e.target.checked ? true : null })}
              className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
            />
            <span className="text-sm">Fully Serviced Plot</span>
          </label>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilters({ 
              minSize: 900, maxSize: 1000, sizeUnit: 'm²', plotType: 'residential' 
            })}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            Residential 900-1000m²
          </button>
          <button
            onClick={() => updateFilters({ 
              minSize: 4, sizeUnit: 'hectares', plotType: 'farm' 
            })}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            Farm Land 4+ hectares
          </button>
          <button
            onClick={() => updateFilters({ 
              hasWater: true, hasElectricity: true, serviced: true 
            })}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            Fully Serviced
          </button>
        </div>
      </div>
    </div>
  );
};