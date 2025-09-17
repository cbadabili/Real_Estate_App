
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../../shared/PropertyCard';
import { SearchResultsSkeleton } from '../../ui/EnhancedLoadingSpinner';

interface Property {
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
}

interface PropertyGridProps {
  properties: Property[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onAddToComparison?: (property: Property) => void;
  comparisonProperties: Property[];
  className?: string;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  viewMode,
  isLoading,
  onAddToComparison,
  comparisonProperties,
  className = ''
}) => {
  if (isLoading) {
    return <SearchResultsSkeleton viewMode={viewMode} />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏠</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence>
        <div className={
          viewMode === 'grid' || viewMode === 'map'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3
              }}
              layout
            >
              <PropertyCard 
                property={property} 
                viewMode={viewMode}
                onAddToComparison={onAddToComparison ? () => onAddToComparison(property) : undefined}
                isInComparison={comparisonProperties.some(p => p.id === property.id)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyGrid;
