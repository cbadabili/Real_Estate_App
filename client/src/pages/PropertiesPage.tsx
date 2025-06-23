import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Grid, List as ListIcon, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/properties/PropertyFilters';
import { useProperties } from '../hooks/useProperties';

const PropertiesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all'
  });

  const { data: properties = [], isLoading } = useProperties();

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'sqft-large', label: 'Largest First' },
    { value: 'bedrooms', label: 'Most Bedrooms' }
  ];

  const filteredProperties = properties.filter(property => {
    if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }
    
    if (filters.listingType !== 'all' && property.listingType !== filters.listingType) {
      return false;
    }
    
    if (parseFloat(property.price) < filters.priceRange[0] || parseFloat(property.price) > filters.priceRange[1]) {
      return false;
    }
    
    if (filters.bedrooms !== 'any' && property.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }
    
    if (filters.bathrooms !== 'any' && property.bathrooms < parseInt(filters.bathrooms)) {
      return false;
    }
    
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'sqft-large':
        return (b.squareFeet || 0) - (a.squareFeet || 0);
      case 'bedrooms':
        return (b.bedrooms || 0) - (a.bedrooms || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Properties</h1>
              <p className="text-neutral-600 mt-1">
                {sortedProperties.length} properties found
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-64"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                  showFilters 
                    ? 'border-primary-500 bg-primary-50 text-primary-600' 
                    : 'border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 flex-shrink-0"
            >
              <PropertyFilters 
                filters={filters} 
                onFiltersChange={setFilters}
                propertyCount={sortedProperties.length}
              />
            </motion.div>
          )}

          {/* Properties Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-neutral-500">Loading properties...</div>
              </div>
            ) : sortedProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-neutral-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No properties found
                </h3>
                <p className="text-neutral-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PropertyCard 
                      property={property} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;