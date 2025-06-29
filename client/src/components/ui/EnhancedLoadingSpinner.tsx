import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Home, TrendingUp } from 'lucide-react';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  type?: 'default' | 'search' | 'properties' | 'calculation';
  showProgress?: boolean;
  progress?: number;
}

export const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  size = 'md',
  message,
  type = 'default',
  showProgress = false,
  progress = 0
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const getIcon = () => {
    switch (type) {
      case 'search':
        return Search;
      case 'properties':
        return Home;
      case 'calculation':
        return TrendingUp;
      default:
        return Loader2;
    }
  };

  const Icon = getIcon();

  const getLoadingMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'search':
        return 'Searching properties...';
      case 'properties':
        return 'Loading properties...';
      case 'calculation':
        return 'Calculating...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`${sizeClasses[size]} text-beedab-blue`}
      >
        <Icon className="w-full h-full" />
      </motion.div>
      
      {showProgress && (
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-beedab-blue h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-600 text-sm font-medium"
      >
        {getLoadingMessage()}
      </motion.p>
      
      {type === 'search' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-500 text-center max-w-sm"
        >
          Analyzing your search criteria and matching with available properties...
        </motion.div>
      )}
    </div>
  );
};

// Skeleton loaders for different content types
export const PropertyCardSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ 
  viewMode = 'grid' 
}) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden animate-pulse ${
    viewMode === 'list' ? 'flex' : ''
  }`}>
    <div className={`bg-gray-300 ${viewMode === 'list' ? 'w-1/3 h-32' : 'h-48'}`}></div>
    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-300 rounded w-16"></div>
      <div className="h-6 bg-gray-300 rounded w-20"></div>
    </div>
  </div>
);

export const SearchResultsSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ 
  viewMode = 'grid' 
}) => (
  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
    {[...Array(6)].map((_, i) => (
      <PropertyCardSkeleton key={i} viewMode={viewMode} />
    ))}
  </div>
);