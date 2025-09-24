import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Map as MapIcon } from 'lucide-react';
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

const VIEW_MODE_META = {
  grid: { label: 'Grid view', icon: Grid },
  list: { label: 'List view', icon: List },
  map: { label: 'Map view', icon: MapIcon }
} as const;

const defaultFilters = {
  priceRange: [0, 5000000] as [number, number],
  propertyType: 'all',
  bedrooms: 'any',
  bathrooms: 'any',
  listingType: 'all'
};

type PropertyFiltersState = typeof defaultFilters;

type NormalizedProperty = {
  id: number;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  imageUrl?: string;
  features?: string[];
  latitude: number;
  longitude: number;
};

type RawProperty = Record<string, unknown>;

type SavedSearch = {
  query?: string;
  filters?: PropertyFiltersState;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const toStringValue = (value: unknown, fallback = ''): string => (
  typeof value === 'string' && value.trim().length > 0 ? value : fallback
);

const normalizeProperty = (property: RawProperty, fallbackIndex: number): NormalizedProperty => {
  const fallbackTitle = `Property ${fallbackIndex + 1}`;
  return {
    id: toNumber(property.id, fallbackIndex + 1),
    title: toStringValue(property.title ?? property.name, fallbackTitle),
    price: toNumber(property.price),
    location: toStringValue(property.location ?? property.address, 'Location not specified'),
    propertyType: toStringValue(property.propertyType ?? property.type, 'Unknown'),
    bedrooms: toNumber(property.bedrooms),
    bathrooms: toNumber(property.bathrooms),
    squareFeet: property.squareFeet !== undefined ? toNumber(property.squareFeet) : undefined,
    imageUrl: typeof property.imageUrl === 'string' ? property.imageUrl : undefined,
    features: Array.isArray(property.features) ? property.features.map((feature) => String(feature)) : undefined,
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude)
  };
};

const PropertySearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<NormalizedProperty[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<PropertyFiltersState>(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<NormalizedProperty[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [resultCount, setResultCount] = useState(0); // Added state for resultCount
  const pendingAnalyticsRef = useRef<{ query: string; filters: PropertyFiltersState } | null>(null);

  const trackSearchAnalytics = (results: NormalizedProperty[]) => {
    const pending = pendingAnalyticsRef.current;
    if (pending && pending.query === searchQuery) {
      analytics.searchPerformed(pending.query || '', { ...pending.filters, query: pending.query }, results.length);
      pendingAnalyticsRef.current = null;
    }
  };

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
          const rawResults = Array.isArray(data.results) ? data.results : [];
          const normalizedResults = rawResults.map((item, index) =>
            normalizeProperty(item as RawProperty, index)
          );
          setProperties(normalizedResults);
          setResultCount(normalizedResults.length);
          trackSearchAnalytics(normalizedResults);
        } else {
          throw new Error(`Search failed: ${response.status}`);
        }
      } else {
        // Fall back to regular property endpoint for filter-only searches
        response = await fetch(`/api/properties?${queryParams}`);
        if (response.ok) {
          data = await response.json();
          console.log('Received properties:', data.length);
          const rawResults = Array.isArray(data) ? data : [];
          const normalizedResults = rawResults.map((item, index) =>
            normalizeProperty(item as RawProperty, index)
          );
          setProperties(normalizedResults);
          setResultCount(normalizedResults.length);
          trackSearchAnalytics(normalizedResults);
        } else {
          throw new Error(`Properties fetch failed: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Failed to search properties:', error);
      setProperties([]);
      setResultCount(0);
      pendingAnalyticsRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sortBy]);

  // Load properties on mount and when dependencies change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle search from SmartSearchBar
  const handleSearch = (searchQueryParam: string, searchFiltersParam?: Partial<PropertyFiltersState>) => {
    const mergedFilters = { ...filters, ...searchFiltersParam };
    setFilters(mergedFilters);
    setSearchQuery(searchQueryParam);
    setSearchParams(searchQueryParam ? { q: searchQueryParam } : {});
    pendingAnalyticsRef.current = { query: searchQueryParam, filters: mergedFilters };
  };


  // Handle filter changes
  const handleFiltersChange = (newFilters: PropertyFiltersState) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Handle comparison
  const handleAddToComparison = (property: NormalizedProperty) => {
    if (comparisonProperties.length < 4 && !comparisonProperties.find(p => p.id === property.id)) {
      setComparisonProperties([...comparisonProperties, property]);
    }
  };

  const handleRemoveFromComparison = (propertyId: number) => {
    setComparisonProperties(comparisonProperties.filter(p => p.id !== propertyId));
  };

  // Handle saved search loading
  const handleLoadSearch = (savedSearch: SavedSearch) => {
    const nextFilters = savedSearch.filters ? savedSearch.filters : filters;
    if (savedSearch.filters) {
      setFilters(savedSearch.filters);
    }
    const nextQuery = savedSearch.query ?? '';
    setSearchQuery(nextQuery);
    setSearchParams(nextQuery ? { q: nextQuery } : {});
    pendingAnalyticsRef.current = { query: nextQuery, filters: nextFilters };
  };

  const ActiveViewIcon = VIEW_MODE_META[viewMode].icon;
  const activeViewLabel = VIEW_MODE_META[viewMode].label;

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

            <div className="flex items-center text-sm text-gray-500 gap-2">
              <ActiveViewIcon className="h-4 w-4" />
              <span>{activeViewLabel}</span>
            </div>

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