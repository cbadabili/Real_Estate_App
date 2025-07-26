import React, { useState } from 'react';
import { Search, MapPin, Ruler, Zap, Droplets } from 'lucide-react';

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

  const popularLocations = [
    'Mogoditshane Block 5',
    'Manyana Plateau', 
    'Mahalapye',
    'Pitsane',
    'Gaborone',
    'Francistown',
    'Lobatse',
    'Kanye',
    'Serowe',
    'Maun'
  ];

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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
        >
          <option value="">All Locations</option>
          {popularLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
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