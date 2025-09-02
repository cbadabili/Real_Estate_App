import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Heart,
  MessageSquare,
  Calculator,
  TrendingUp,
  Camera,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  Star,
  MapPin,
  Calendar,
  Users,
  BarChart3,
  Zap,
  PlusCircle,
  Filter
} from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('main');

  const actionCategories = {
    main: [
      {
        icon: Plus,
        label: 'List Property',
        href: '/create-listing',
        color: 'bg-beedab-blue hover:bg-beedab-darkblue'
      },
      {
        icon: Search,
        label: 'Find Properties',
        href: '/properties',
        color: 'bg-green-500 hover:bg-green-600'
      },
      {
        icon: Heart,
        label: 'Saved Properties',
        href: '/dashboard?tab=saved',
        color: 'bg-red-500 hover:bg-red-600'
      },
      {
        icon: Calculator,
        label: 'Mortgage Calculator',
        href: '/tools/mortgage-calculator',
        color: 'bg-purple-500 hover:bg-purple-600'
      }
    ],
    communication: [
      {
        icon: MessageSquare,
        label: 'Messages',
        href: '/dashboard?tab=messages',
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        icon: Bell,
        label: 'Notifications',
        href: '/dashboard?tab=notifications',
        color: 'bg-orange-500 hover:bg-orange-600'
      },
      {
        icon: Calendar,
        label: 'Appointments',
        href: '/dashboard?tab=appointments',
        color: 'bg-cyan-500 hover:bg-cyan-600'
      },
      {
        icon: Users,
        label: 'Agent Network',
        href: '/agent-network',
        color: 'bg-teal-500 hover:bg-teal-600'
      }
    ],
    analytics: [
      {
        icon: TrendingUp,
        label: 'Market Insights',
        href: '/market-intelligence',
        color: 'bg-indigo-500 hover:bg-indigo-600'
      },
      {
        icon: BarChart3,
        label: 'Property Analytics',
        href: '/property-analytics',
        color: 'bg-emerald-500 hover:bg-emerald-600'
      },
      {
        icon: MapPin,
        label: 'Neighborhood Data',
        href: '/neighborhood-analytics',
        color: 'bg-rose-500 hover:bg-rose-600'
      },
      {
        icon: Star,
        label: 'Investment Analysis',
        href: '/investment-analytics',
        color: 'bg-amber-500 hover:bg-amber-600'
      }
    ],
    services: [
      {
        icon: Camera,
        label: 'Photo Services',
        href: '/services?category=photography',
        color: 'bg-pink-500 hover:bg-pink-600'
      },
      {
        icon: FileText,
        label: 'Legal Documents',
        href: '/services/legal-documents',
        color: 'bg-yellow-500 hover:bg-yellow-600'
      },
      {
        icon: Settings,
        label: 'Property Management',
        href: '/services/property-management',
        color: 'bg-slate-500 hover:bg-slate-600'
      },
      {
        icon: Zap,
        label: 'Quick Services',
        href: '/marketplace',
        color: 'bg-violet-500 hover:bg-violet-600'
      }
    ]
  };

  const categories = [
    { key: 'main', label: 'Main', icon: Plus },
    { key: 'communication', label: 'Chat', icon: MessageSquare },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'services', label: 'Services', icon: Settings }
  ];

  const allActions = Object.values(actionCategories).flat();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isExpanded ? <Filter className="h-5 w-5 text-gray-700" /> : <PlusCircle className="h-5 w-5 text-gray-700" />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 transition-all duration-200
                    ${activeCategory === cat.key
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <cat.icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {actionCategories[activeCategory as keyof typeof actionCategories].map((action) => {
                const Icon = action.icon;
                return (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-3 rounded-lg text-white transition-all duration-200 text-left flex items-center space-x-3
                      ${action.color}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{action.label}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed-actions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {allActions.slice(0, 6).map((action) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-3 rounded-lg text-white transition-all duration-200 text-center flex flex-col items-center justify-center
                    ${action.color}
                  `}
                >
                  <Icon className="h-6 w-6 mb-1 flex-shrink-0" />
                  <p className="font-medium text-xs truncate">{action.label}</p>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};