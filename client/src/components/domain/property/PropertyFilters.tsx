import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Bath, Car, Sliders, ChevronDown } from 'lucide-react';

interface LocationData {
  districts: { [key: string]: { towns: { [key: string]: string[] } } };
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  onFiltersChange,
  className = ""
}) => {
  const [filters, setFilters] = useState({
    district: '',
    town: '',
    ward: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    hasParking: false,
    hasPool: false,
    isNew: false
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [availableWards, setAvailableWards] = useState<string[]>([]);

  // Botswana administrative divisions data
  const locationData: LocationData = {
    districts: {
      'South-East': {
        towns: {
          'Gaborone': ['Block 6', 'Block 7', 'Block 8', 'Block 9', 'Block 10', 'Extension 2', 'Extension 9', 'Extension 12', 'Phakalane', 'Mogoditshane'],
          'Lobatse': ['Central', 'Industrial', 'Peleng'],
          'Ramotswa': ['Central', 'New Stands']
        }
      },
      'North-East': {
        towns: {
          'Francistown': ['Monarch', 'Riverside', 'Gerald Estate', 'Donga', 'Area M', 'Tati Siding'],
          'Tonota': ['Central', 'Extension'],
          'Selebi-Phikwe': ['Old Town', 'New Town', 'Botshabelo']
        }
      },
      'North-West': {
        towns: {
          'Maun': ['Boseja', 'Sedie', 'Industrial', 'Matshwane'],
          'Kasane': ['Central', 'Kazungula'],
          'Gumare': ['Central']
        }
      },
      'Central': {
        towns: {
          'Serowe': ['Central', 'New Stands'],
          'Palapye': ['Central', 'Extension'],
          'Mahalapye': ['Central', 'Extension']
        }
      },
      'Southern': {
        towns: {
          'Kanye': ['Central', 'Extension'],
          'Molepolole': ['Central', 'Extension'],
          'Goodhope': ['Central']
        }
      },
      'Kgatleng': {
        towns: {
          'Mochudi': ['Central', 'Extension'],
          'Oodi': ['Central']
        }
      }
    }
  };

  useEffect(() => {
    if (filters.district) {
      const towns = Object.keys(locationData.districts[filters.district]?.towns || {});
      setAvailableTowns(towns);
      setAvailableWards([]);

      // Clear dependent selections
      handleFilterChange('town', '');
      handleFilterChange('ward', '');
    } else {
      setAvailableTowns([]);
      setAvailableWards([]);
    }
  }, [filters.district]);

  useEffect(() => {
    if (filters.district && filters.town) {
      const wards = locationData.districts[filters.district]?.towns[filters.town] || [];
      setAvailableWards(wards);

      // Clear ward selection if changing town
      handleFilterChange('ward', '');
    } else {
      setAvailableWards([]);
    }
  }, [filters.district, filters.town]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      district: '',
      town: '',
      ward: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      hasParking: false,
      hasPool: false,
      isNew: false
    };
    setFilters(clearedFilters);
    setAvailableTowns([]);
    setAvailableWards([]);
    onFiltersChange(clearedFilters);
  };

  const priceRanges = [
    { label: 'Under BWP 500k', value: '0-500000' },
    { label: 'BWP 500k - 1M', value: '500000-1000000' },
    { label: 'BWP 1M - 2M', value: '1000000-2000000' },
    { label: 'BWP 2M - 5M', value: '2000000-5000000' },
    { label: 'BWP 5M+', value: '5000000-' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sliders className="h-5 w-5 mr-2 text-beedab-blue" />
          Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-beedab-blue hover:text-beedab-darkblue flex items-center"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Hierarchical Location */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 inline mr-1" />
            Location
          </label>

          {/* District */}
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="">Select District</option>
            {Object.keys(locationData.districts).map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          {/* Town */}
          {availableTowns.length > 0 && (
            <select
              value={filters.town}
              onChange={(e) => handleFilterChange('town', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Select Town</option>
              {availableTowns.map(town => (
                <option key={town} value={town}>{town}</option>
              ))}
            </select>
          )}

          {/* Ward */}
          {availableWards.length > 0 && (
            <select
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Select Ward/Area</option>
              {availableWards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Home className="h-4 w-4 inline mr-1" />
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="commercial">Commercial</option>
            <option value="farm">Farm</option>
            <option value="land_plot">Land/Plot</option>
          </select>
        </div>

        {/* Quick Price Ranges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Price Range
          </label>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-');
                    handleFilterChange('minPrice', min);
                    handleFilterChange('maxPrice', max || '');
                  }}
                  className="rounded border-gray-300 text-beedab-blue focus:ring-beedab-blue"
                />
                <span className="text-sm text-gray-700 ml-2">{range.label}</span>
              </label>
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Min BWP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent text-sm"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Max BWP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Bed className="h-4 w-4 inline mr-1" />
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Bath className="h-4 w-4 inline mr-1" />
              Bathrooms
            </label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasParking}
                  onChange={(e) => handleFilterChange('hasParking', e.target.checked)}
                  className="rounded border-gray-300 text-beedab-blue focus:ring-beedab-blue"
                />
                <Car className="h-4 w-4 ml-2 mr-1" />
                <span className="text-sm text-gray-700">Has Parking</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasPool}
                  onChange={(e) => handleFilterChange('hasPool', e.target.checked)}
                  className="rounded border-gray-300 text-beedab-blue focus:ring-beedab-blue"
                />
                <span className="text-sm text-gray-700 ml-2">Has Pool</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isNew}
                  onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                  className="rounded border-gray-300 text-beedab-blue focus:ring-beedab-blue"
                />
                <span className="text-sm text-gray-700 ml-2">New Development</span>
              </label>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;