import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// Removed framer-motion for better compatibility
import { Filter, Search, Grid, List as ListIcon, SlidersHorizontal, AlertCircle, MapPin, Map, BarChart3 } from 'lucide-react';
import { PropertyCard, PropertyFilters } from '../components/shared';
import { PropertyGrid } from '../components/properties/PropertyGrid';
import PropertyMap from '../components/properties/PropertyMap';
import { PropertyComparison } from '../components/properties/PropertyComparison';
import { SavedSearches } from '../components/properties/SavedSearches';
import SmartSearchBar from '../components/search/SmartSearchBar';
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
  const { performSearch, isSearching: aiIsSearching, searchResult: aiSearchResult, clearSearchResult } = useSearch(); // Renamed to avoid conflict

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

  // State for manual search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // AI suggestions function
  const fetchSuggestions = async (q: string): Promise<string[]> => {
    try {
      const response = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.suggestions ?? []);
    } catch (error) {
      console.warn('Failed to fetch suggestions:', error);
      return [];
    }
  };

  // Search handler for the SmartSearchBar
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&sort=${sortBy}&limit=20`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();

      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [sortBy]);


  // Handle AI search query and apply filters
  const handleSmartSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchTerm(query);
    setIsSearching(true);

    try {
      // First try the regular search endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&sort=${sortBy}&limit=20`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        // Fall back to filtering existing properties
        const filteredProperties = properties.filter(property =>
          property.title?.toLowerCase().includes(query.toLowerCase()) ||
          property.description?.toLowerCase().includes(query.toLowerCase()) ||
          property.city?.toLowerCase().includes(query.toLowerCase()) ||
          property.neighborhood?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProperties);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fall back to filtering existing properties
      const filteredProperties = properties.filter((property: any) =>
        property.title?.toLowerCase().includes(query.toLowerCase()) ||
        property.description?.toLowerCase().includes(query.toLowerCase()) ||
        property.city?.toLowerCase().includes(query.toLowerCase()) ||
        property.address?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredProperties);
    } finally {
      setIsSearching(false);
    }

    // Also try AI-driven search
    try {
      const aiResult = await performSearch(query);

      if (aiResult && aiResult.filters) {
      // Apply AI-interpreted filters
      const newFilters = {
        priceRange: [
          aiResult.filters.minPrice || filters.priceRange[0],
          aiResult.filters.maxPrice || filters.priceRange[1]
        ] as [number, number],
        propertyType: aiResult.filters.propertyType || filters.propertyType,
        bedrooms: aiResult.filters.minBedrooms ? aiResult.filters.minBedrooms.toString() : filters.bedrooms,
        bathrooms: aiResult.filters.minBathrooms ? aiResult.filters.minBathrooms.toString() : filters.bathrooms,
        listingType: aiResult.filters.listingType || filters.listingType
      };
      setFilters(newFilters);
      setSearchTerm(query); // Update the general searchTerm
      // If AI search provides results, use them, otherwise fall back to general search
      if (aiResult.results && aiResult.results.length > 0) {
        setSearchResults(aiResult.results);
      } else {
        handleSearch(query); // Fallback to regular search if no properties returned by AI
      }
    } else {
      // If no AI filters or results, perform a standard search
      handleSearch(query);
    }
    } catch (error) {
      console.error('AI search failed:', error);
      // Fall back to regular search
      handleSearch(query);
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

  // Determine which properties to display: AI search results or regular search results
  const propertiesToDisplay = searchResults.length > 0 ? searchResults : sortedProperties;

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
              initial={searchTerm}
              onSearch={handleSmartSearch}
              suggest={fetchSuggestions}
            />

            {(aiIsSearching || isSearching) && ( // Show loading if either AI or regular search is active
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
              {propertiesToDisplay.length} properties found
            </div>
          </div>

          {/* Search Results Header */}
          <SearchResultsHeader
            propertyCount={propertiesToDisplay.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            comparisonCount={comparisonProperties.length}
            onShowComparison={() => setShowComparison(true)}
            aiSearchResult={aiSearchResult} // Pass the AI search result
            onClearAiSearch={clearSearchResult} // Pass the clear function for AI search
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
                      propertyCount={propertiesToDisplay.length} // Use propertiesToDisplay for count
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
                      setSearchQuery(''); // Clear manual search query
                      setSearchResults([]); // Clear manual search results
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (isLoading && properties.length === 0) ? ( // Only show skeleton if initial load is happening and no properties yet
              <SearchResultsSkeleton viewMode={viewMode === 'map' ? 'grid' : viewMode} />
            ) : propertiesToDisplay.length === 0 ? (
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
                    setSearchQuery(''); // Clear manual search query
                    setSearchResults([]); // Clear manual search results
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
                properties={propertiesToDisplay} // Display AI or regular search results
                viewMode={viewMode !== 'map' ? viewMode as 'grid' | 'list' : 'grid'}
                isLoading={isLoading} // Keep isLoading for initial load indicator
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