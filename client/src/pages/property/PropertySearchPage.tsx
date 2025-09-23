import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Map } from 'lucide-react';
import SmartSearchBar from '../../components/search/SmartSearchBar';
import PropertyGrid from '../../components/domain/property/PropertyGrid';
import { PropertyFilters } from '../../components/properties/PropertyFilters';
import PropertyMap from '../../components/properties/PropertyMap';
import { PropertyComparison } from '../../components/properties/PropertyComparison';
import { SavedSearches } from '../../components/properties/SavedSearches';
import { SearchResultsHeader } from '../../components/search/SearchResultsHeader';
import { PageHeader } from '../../components/layout/PageHeader';

// Mock analytics object for demonstration purposes
const analytics = {
  searchPerformed: (query: string, params: any, count: number) => {
    console.log('Analytics: Search Performed', { query, params, count });
  },
  errorOccurred: (code: string, message: string, context: string) => {
    console.error('Analytics: Error Occurred', { code, message, context });
  }
};

const PropertySearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
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
  const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [resultCount, setResultCount] = useState(0); // Added state for resultCount

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

      // Try unified search first for natural language queries
      let response;
      let data;
      
      if (searchQuery && searchQuery.trim().length > 0) {
        // Use unified search for natural language queries
        const searchParams = new URLSearchParams();
        searchParams.set('q', searchQuery);
        if (filters.propertyType !== 'all') {
          searchParams.set('type', filters.propertyType);
        }
        
        response = await fetch(`/api/search?${searchParams}`);
        if (response.ok) {
          data = await response.json();
          const results = data.results || [];
          setProperties(results);
          setResultCount(results.length);
        } else {
          throw new Error(`Search failed: ${response.status}`);
        }
      } else {
        // Fall back to regular property endpoint for filter-only searches
        response = await fetch(`/api/properties?${queryParams}`);
        if (response.ok) {
          data = await response.json();
          console.log('Received properties:', data.length);
          setProperties(Array.isArray(data) ? data : []);
          setResultCount(Array.isArray(data) ? data.length : 0);
        } else {
          throw new Error(`Properties fetch failed: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Failed to search properties:', error);
      setProperties([]);
      setResultCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sortBy]);

  // Load properties on mount and when dependencies change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle search from SmartSearchBar
  const handleSearch = async (searchQueryParam: string, searchFiltersParam?: object) => {
    setIsLoading(true);
    setSearchQuery(searchQueryParam); // Update the search query state
    
    try {
      const queryParams = new URLSearchParams();

      // Use the combined search query and filters from SmartSearchBar
      if (searchQueryParam) {
        queryParams.set('location', searchQueryParam);
        // Also search in city and address fields
        queryParams.set('city', searchQueryParam);
      }

      // Apply filters from searchFiltersParam or use current filters
      const currentFilters = { ...filters, ...searchFiltersParam };
      setFilters(currentFilters); // Update local state with new filters

      if (currentFilters.propertyType !== 'all') {
        queryParams.set('propertyType', currentFilters.propertyType);
      }
      if (currentFilters.bedrooms !== 'any') {
        queryParams.set('minBedrooms', currentFilters.bedrooms === '5+' ? '5' : currentFilters.bedrooms);
      }
      if (currentFilters.bathrooms !== 'any') {
        queryParams.set('minBathrooms', currentFilters.bathrooms === '4+' ? '4' : currentFilters.bathrooms);
      }
      if (currentFilters.listingType !== 'all') {
        queryParams.set('listingType', currentFilters.listingType);
      }

      queryParams.set('minPrice', currentFilters.priceRange[0].toString());
      queryParams.set('maxPrice', currentFilters.priceRange[1].toString());

      queryParams.set('sortBy', sortBy);
      queryParams.set('status', 'active');

      console.log('Searching with params:', queryParams.toString());

      const response = await fetch(`/api/properties?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        const results = Array.isArray(data) ? data : [];
        setProperties(results);
        setResultCount(results.length);

        // Update URL with search query
        if (searchQueryParam) {
          setSearchParams({ q: searchQueryParam });
        }

        // Track search analytics
        analytics.searchPerformed(
          searchQueryParam || '',
          { ...currentFilters, query: searchQueryParam },
          results.length
        );
      } else {
        console.error('Search failed:', response.status, response.statusText);
        setProperties([]);
        setResultCount(0);
        // Track search error
        analytics.errorOccurred('search_failed', `HTTP ${response.status}`, 'property_search');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setProperties([]);
      setResultCount(0);

      // Track search error
      analytics.errorOccurred('search_failed', error.message, 'property_search');
    } finally {
      setIsLoading(false);
    }
  };


  // Handle filter changes
  const handleFiltersChange = (newFilters: typeof filters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
    // Trigger fetch when filters change, preserving current search query
    fetchProperties();
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Trigger fetch when sort changes, preserving current search query and filters
    fetchProperties();
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
      // Fetch properties with the loaded search query and filters
      fetchProperties();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Property Search"
        subtitle={`${resultCount} properties found`} // Using resultCount for subtitle
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SmartSearchBar 
            onSearch={(query) => handleSearch(query)}
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
              propertyCount={resultCount} // Pass resultCount to PropertyFilters
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
              propertyCount={resultCount} // Using resultCount here
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