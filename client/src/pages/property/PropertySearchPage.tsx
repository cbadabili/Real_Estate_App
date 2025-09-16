
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Map, Filter } from 'lucide-react';
import SmartSearchBar from '../../components/search/SmartSearchBar';
import PropertyGrid from '../../components/domain/property/PropertyGrid';
import PropertyFilters from '../../components/domain/property/PropertyFilters';
import PropertyMap from '../../components/properties/PropertyMap';
import { PropertyComparison } from '../../components/properties/PropertyComparison';
import { SavedSearches } from '../../components/properties/SavedSearches';
import { SearchResultsHeader } from '../../components/search/SearchResultsHeader';
import { PageHeader } from '../../components/layout/PageHeader';

const PropertySearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000] as [number, number],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Fetch properties with current filters
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add search query
      if (searchQuery) {
        queryParams.set('location', searchQuery);
      }
      
      // Add filters
      if (filters.propertyType !== 'all') {
        queryParams.set('propertyType', filters.propertyType);
      }
      if (filters.bedrooms !== 'any') {
        queryParams.set('minBedrooms', filters.bedrooms === '5+' ? '5' : filters.bedrooms);
      }
      if (filters.bathrooms !== 'any') {
        queryParams.set('minBathrooms', filters.bathrooms === '4+' ? '4' : filters.bathrooms);
      }
      if (filters.listingType !== 'all') {
        queryParams.set('listingType', filters.listingType);
      }
      
      // Add price range
      queryParams.set('minPrice', filters.priceRange[0].toString());
      queryParams.set('maxPrice', filters.priceRange[1].toString());
      
      // Add sorting
      queryParams.set('sortBy', sortBy);
      queryParams.set('status', 'active');

      console.log('Fetching with params:', queryParams.toString());

      const response = await fetch(`/api/properties?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Received properties:', data.length);
        setProperties(Array.isArray(data) ? data : []);
      } else {
        console.error('Search request failed:', response.status, response.statusText);
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to search properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sortBy]);

  // Load properties on mount and when dependencies change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle search from SmartSearchBar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams(query ? { q: query } : {});
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: typeof filters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Handle comparison
  const handleAddToComparison = (property: any) => {
    if (comparisonProperties.length < 4 && !comparisonProperties.find(p => p.id === property.id)) {
      setComparisonProperties([...comparisonProperties, property]);
    }
  };

  const handleRemoveFromComparison = (propertyId: number) => {
    setComparisonProperties(comparisonProperties.filter(p => p.id !== propertyId));
  };

  // Handle saved search loading
  const handleLoadSearch = (savedSearch: any) => {
    if (savedSearch.filters) {
      setFilters(savedSearch.filters);
    }
    if (savedSearch.query) {
      setSearchQuery(savedSearch.query);
      setSearchParams({ q: savedSearch.query });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Property Search"
        subtitle={`${properties.length} properties found`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SmartSearchBar 
            onSearch={handleSearch}
            initial={searchQuery}
          />
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Always show on desktop */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Filters */}
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              propertyCount={properties.length}
            />

            {/* Saved Searches */}
            <SavedSearches
              onLoadSearch={handleLoadSearch}
              currentFilters={filters}
              currentQuery={searchQuery}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <SearchResultsHeader
              propertyCount={properties.length}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              comparisonCount={comparisonProperties.length}
              onShowComparison={() => setShowComparison(true)}
            />

            {/* Results Content */}
            {viewMode === 'map' ? (
              <PropertyMap 
                properties={properties}
                height="600px"
                className="rounded-lg border border-gray-200"
              />
            ) : (
              <PropertyGrid
                properties={properties}
                viewMode={viewMode}
                isLoading={isLoading}
                onAddToComparison={handleAddToComparison}
                comparisonProperties={comparisonProperties}
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
          onRemoveProperty={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};

export default PropertySearchPage;
