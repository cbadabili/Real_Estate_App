import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// Removed framer-motion for better compatibility
import { Filter, Search, Grid, List as ListIcon, SlidersHorizontal, AlertCircle, MapPin, Map, BarChart3 } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilters } from '../components/properties/PropertyFilters';
import { PropertyGrid } from '../components/properties/PropertyGrid';
import PropertyMap from '../components/properties/PropertyMap';
import { PropertyComparison } from '../components/properties/PropertyComparison';
import { SavedSearches } from '../components/properties/SavedSearches';
import { SmartSearchBar } from '../components/search/SmartSearchBar';
import { SearchResultsHeader } from '../components/search/SearchResultsHeader';
import { PageHeader } from '../components/layout/PageHeader';
import { QuickActions } from '../components/ui/QuickActions';
import { useProperties } from '../hooks/useProperties';
import { EnhancedLoadingSpinner, SearchResultsSkeleton } from '../components/ui/EnhancedLoadingSpinner';
import { useToastHelpers } from '../components/ui/Toast';
import { useUserPreferences } from '../hooks/useLocalStorage';
import { useSearch } from '../hooks/useSearch';

const PropertiesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { data: properties = [], isLoading, error, refetch } = useProperties();
  const { success } = useToastHelpers();
  const { preferences, updatePreference } = useUserPreferences();
  const { performSearch, isSearching, searchResult: aiSearchResult, clearSearchResult } = useSearch();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(() => {
    const typeFromUrl = searchParams.get('type');
    return {
      priceRange: [0, 5000000] as [number, number],
      propertyType: typeFromUrl || 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      listingType: 'all'
    };
  });
  const [sortBy, setSortBy] = useState(preferences.searchFilters?.defaultSortBy || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>(preferences.searchFilters?.defaultViewMode as 'grid' | 'list' | 'map' || 'grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

    // Update filters when URL parameters change
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && typeFromUrl !== filters.propertyType) {
      setFilters(prev => ({
        ...prev,
        propertyType: typeFromUrl
      }));
    }
  }, [searchParams]);

  // Search functionality
  const handleSmartSearch = async (query: string) => {
    if (!query.trim()) return;

    const result = await performSearch(query);
    if (result && result.filters) {
      // Apply AI-interpreted filters
      const newFilters = {
        priceRange: [
          result.filters.minPrice || filters.priceRange[0],
          result.filters.maxPrice || filters.priceRange[1]
        ] as [number, number],
        propertyType: result.filters.propertyType || filters.propertyType,
        bedrooms: result.filters.minBedrooms ? result.filters.minBedrooms.toString() : filters.bedrooms,
        bathrooms: result.filters.minBathrooms ? result.filters.minBathrooms.toString() : filters.bathrooms,
        listingType: result.filters.listingType || filters.listingType
      };
      setFilters(newFilters);
      setSearchTerm(query);
    }
  };

  // View mode and sorting handlers
  const handleViewModeChange = (mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode);
    updatePreference('searchFilters', 'defaultViewMode', mode);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    updatePreference('searchFilters', 'defaultSortBy', newSortBy);
  };

  // Property comparison functionality
  const addToComparison = (property: any) => {
    if (comparisonProperties.length >= 4) {
      success('Maximum 4 properties can be compared at once');
      return;
    }
    if (comparisonProperties.some(p => p.id === property.id)) {
      return;
    }
    setComparisonProperties(prev => [...prev, property]);
    success(`Added ${property.title} to comparison`);
  };

  const removeFromComparison = (propertyId: number) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    success('Property removed from comparison');
  };

  // Saved searches functionality
  const handleLoadSavedSearch = (savedSearch: any) => {
    setSearchTerm(savedSearch.query || '');
    setFilters(savedSearch.filters || filters);
    setShowSavedSearches(false);
    success(`Loaded search: ${savedSearch.name}`);
  };

  // Property filtering and sorting
  const filteredProperties = properties.filter((property: any) => {
    if (searchTerm && !property.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.location?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }

    if (filters.listingType !== 'all' && property.listingType !== filters.listingType) {
      return false;
    }

    const price = typeof property.price === 'number' ? property.price : parseFloat(property.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
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
    const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price);
    const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price);

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
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
      <PageHeader
        title="Properties"
        subtitle="Find your perfect property in Botswana"
        actions={
          <button
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="flex items-center space-x-2 px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Saved Searches</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Smart Search Bar */}
          <div className="relative z-50">
            <SmartSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSmartSearch}
              placeholder="Search properties in Botswana..."
              showFilters={true}
              onFilterClick={() => setShowFilters(!showFilters)}
            />

            {isSearching && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <EnhancedLoadingSpinner size="sm" type="search" />
                <span className="ml-2">Processing your search...</span>
              </div>
            )}
          </div>

          {/* View Mode Switcher - Prominent */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">View as:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-beedab-blue text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-beedab-blue text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('map')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'map' 
                      ? 'bg-beedab-blue text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  <span>Map</span>
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {sortedProperties.length} properties found
            </div>
          </div>

          {/* Search Results Header */}
          <SearchResultsHeader
            propertyCount={sortedProperties.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            comparisonCount={comparisonProperties.length}
            onShowComparison={() => setShowComparison(true)}
            aiSearchResult={aiSearchResult}
            onClearAiSearch={clearSearchResult}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - only show when there's content */}
          {(showFilters || showSavedSearches) && (
            <div className="w-80 flex-shrink-0">
              <div className="space-y-6">
                {/* Saved Searches */}
                {showSavedSearches && (
                  <div className="animate-in slide-in-from-left-8 fade-in duration-300">
                    <SavedSearches
                      onLoadSearch={handleLoadSavedSearch}
                      currentFilters={filters}
                      currentQuery={searchTerm}
                    />
                  </div>
                )}

                {/* Filters */}
                {showFilters && (
                  <div className="animate-in slide-in-from-left-8 fade-in duration-300">
                    <PropertyFilters 
                      filters={filters} 
                      onFiltersChange={setFilters}
                      propertyCount={sortedProperties.length}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Properties Grid/List */}
          <div className="flex-1 min-w-0">
            {error ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Properties</h3>
                <p className="text-gray-600 mb-6">
                  {error.message || 'There was a problem loading the properties. Please try again.'}
                </p>
                <div className="space-x-3">
                  <button 
                    onClick={() => refetch && refetch()}
                    className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => {
                      setFilters({
                        priceRange: [0, 5000000] as [number, number],
                        propertyType: 'all',
                        bedrooms: 'any',
                        bathrooms: 'any',
                        listingType: 'all'
                      });
                      setSearchTerm('');
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <SearchResultsSkeleton viewMode={viewMode === 'map' ? 'grid' : viewMode} />
            ) : sortedProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to see more results.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 5000000] as [number, number],
                      propertyType: 'all',
                      bedrooms: 'any',
                      bathrooms: 'any',
                      listingType: 'all'
                    });
                    setSearchTerm('');
                  }}
                  className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-[800px] bg-gray-100 rounded-lg">
                <PropertyMap 
                  properties={properties.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    price: p.price,
                    propertyType: p.propertyType,
                    location: p.location || p.address || `${p.city}, ${p.district}`
                  }))}
                  height="800px"
                  className="w-full"
                />
              </div>
            ) : (
              <PropertyGrid
                properties={sortedProperties}
                viewMode={viewMode !== 'map' ? viewMode as 'grid' | 'list' : 'grid'}
                isLoading={isLoading}
                onAddToComparison={addToComparison}
                comparisonProperties={comparisonProperties}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Property Comparison Modal */}
      {showComparison && comparisonProperties.length > 0 && (
        <PropertyComparison
          properties={comparisonProperties}
          onClose={() => setShowComparison(false)}
          onRemoveProperty={removeFromComparison}
        />
      )}
    </div>
  );
};

export default PropertiesPage;