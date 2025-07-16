import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Filter, Bookmark, BarChart3, MapPin } from 'lucide-react';

interface QuickActionsProps {
  onCreateProperty?: () => void;
  onAdvancedSearch?: () => void;
  onToggleFilters?: () => void;
  onViewSavedSearches?: () => void;
  onShowComparison?: () => void;
  onViewMap?: () => void;
  comparisonCount?: number;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateProperty,
  onAdvancedSearch,
  onToggleFilters,
  onViewSavedSearches,
  onShowComparison,
  onViewMap,
  comparisonCount = 0,
  className = ''
}) => {
  const actions = [
    {
      icon: PlusCircle,
      label: 'List Property',
      onClick: onCreateProperty,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'List your property'
    },
    {
      icon: Search,
      label: 'Advanced Search',
      onClick: onAdvancedSearch,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Detailed search options'
    },
    {
      icon: Filter,
      label: 'Filters',
      onClick: onToggleFilters,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Refine your search'
    },
    {
      icon: Bookmark,
      label: 'Saved Searches',
      onClick: onViewSavedSearches,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Your saved searches'
    },
    {
      icon: BarChart3,
      label: `Compare (${comparisonCount})`,
      onClick: onShowComparison,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Property comparison',
      disabled: comparisonCount === 0
    },
    {
      icon: MapPin,
      label: 'Map View',
      onClick: onViewMap,
      color: 'bg-red-500 hover:bg-red-600',
      description: 'View on map'
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              whileHover={{ scale: action.disabled ? 1 : 1.02 }}
              whileTap={{ scale: action.disabled ? 1 : 0.98 }}
              className={`
                p-3 rounded-lg text-white transition-all duration-200 text-left
                ${action.disabled 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : action.color
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{action.label}</p>
                  <p className="text-xs opacity-90 truncate">{action.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};