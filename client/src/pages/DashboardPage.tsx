import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { MortgageCalculator } from '../components/features/MortgageCalculator';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Home, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react';

const DashboardPage = () => {
  const { data: recentProperties, isLoading } = useProperties({ 
    limit: 6, 
    sortBy: 'date', 
    sortOrder: 'desc' 
  });

  const stats = [
    {
      label: 'Active Properties',
      value: recentProperties?.length || 0,
      icon: Home,
      change: '+3 this week',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Total Views',
      value: recentProperties?.reduce((sum: number, prop: any) => sum + (prop.views || 0), 0) || 0,
      icon: Eye,
      change: '+12% this month',
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Average Price',
      value: recentProperties?.length ? 
        `$${Math.round(recentProperties.reduce((sum: number, prop: any) => sum + parseFloat(prop.price || '0'), 0) / recentProperties.length).toLocaleString()}` : 
        '$0',
      icon: DollarSign,
      change: '+5% vs last month',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Cities Covered',
      value: recentProperties?.length ? 
        new Set(recentProperties.map((prop: any) => prop.city)).size : 
        0,
      icon: MapPin,
      change: 'Across Texas',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'List New Property',
      description: 'Create a new property listing',
      href: '/create-listing',
      icon: Home,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Browse Properties',
      description: 'Explore available properties',
      href: '/properties',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Map Search',
      description: 'Find properties on map',
      href: '/map-search',
      icon: MapPin,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Test APIs',
      description: 'Explore platform APIs',
      href: '/test-api',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Platform Dashboard</h1>
          <p className="text-neutral-600">
            Welcome to your real estate platform. Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                  <p className="text-neutral-600 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={action.href}
                        className="block p-4 rounded-lg border-2 border-neutral-200 hover:border-primary-300 transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg text-white transition-colors ${action.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-neutral-600 text-sm">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Properties</h2>
                <Link 
                  to="/properties" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentProperties?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentProperties.slice(0, 4).map((property: any) => (
                    <div key={property.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                          {property.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.listingType === 'fsbo' 
                            ? 'bg-accent-100 text-accent-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.listingType?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-sm mb-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.city}, {property.state}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-primary-600">
                          ${parseFloat(property.price || '0').toLocaleString()}
                        </p>
                        <div className="flex items-center text-xs text-neutral-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {property.views || 0} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600">No properties found</p>
                  <Link 
                    to="/create-listing" 
                    className="inline-flex items-center mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Create your first listing
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mortgage Calculator Sidebar */}
          <div className="lg:col-span-1">
            <MortgageCalculator className="sticky top-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;