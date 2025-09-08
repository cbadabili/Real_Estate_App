import React from 'react';
import { Grid, List as ListIcon, Map, Filter, BarChart3, Search } from 'lucide-react';

interface SearchResultsHeaderProps {
  propertyCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: 'grid' | 'list' | 'map';
  onViewModeChange: (viewMode: 'grid' | 'list' | 'map') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  comparisonCount: number;
  onShowComparison?: () => void;
  aiSearchResult?: any;
  onClearAiSearch?: () => void;
  className?: string;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  propertyCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  comparisonCount,
  onShowComparison,
  aiSearchResult,
  onClearAiSearch,
  className = ''
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'sqft-large', label: 'Largest First' },
    { value: 'bedrooms', label: 'Most Bedrooms' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* AI Search Result */}
      {aiSearchResult && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-sm text-blue-800">
            <Search className="h-4 w-4 mr-2" />
            <span className="font-medium">Search interpreted:</span>
            <span className="ml-1">{aiSearchResult.explanation || 'Processing search query...'}</span>
            {aiSearchResult.confidence && (
              <span className="ml-2 text-xs bg-blue-200 px-2 py-1 rounded">
                {Math.round(aiSearchResult.confidence * 100)}% confidence
              </span>
            )}
          </div>
          {onClearAiSearch && (
            <button
              onClick={onClearAiSearch}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear search interpretation
            </button>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-neutral-600 text-sm">
            {propertyCount.toLocaleString()} properties found
          </span>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* Comparison Button */}
          {comparisonCount > 0 && onShowComparison && (
            <button
              onClick={onShowComparison}
              className="flex items-center space-x-2 px-3 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Compare ({comparisonCount})</span>
            </button>
          )}

          {/* View Mode Toggle - Compact */}
          <div className="flex bg-neutral-100 rounded-md p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 transition-colors rounded ${
                viewMode === 'grid' 
                  ? 'bg-beedab-blue text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 transition-colors rounded ${
                viewMode === 'list' 
                  ? 'bg-beedab-blue text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-1.5 transition-colors rounded ${
                viewMode === 'map' 
                  ? 'bg-beedab-blue text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Map View"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={onToggleFilters}
            className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'border-beedab-blue bg-beedab-blue text-white'
                : 'border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};