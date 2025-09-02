
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Users, 
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Star,
  Activity
} from 'lucide-react';

interface MarketMetrics {
  averagePrice: number;
  priceChange: number;
  totalListings: number;
  newListings: number;
  averageDaysOnMarket: number;
  popularAreas: string[];
  propertyTypeDistribution: { type: string; percentage: number; count: number }[];
  priceRangeDistribution: { range: string; percentage: number; count: number }[];
}

interface PropertyAnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  location?: string;
}

export const PropertyAnalyticsDashboard: React.FC<PropertyAnalyticsDashboardProps> = ({
  timeRange = '30d',
  location = 'All Botswana'
}) => {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with actual endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMetrics({
          averagePrice: 2850000,
          priceChange: 5.2,
          totalListings: 1247,
          newListings: 89,
          averageDaysOnMarket: 45,
          popularAreas: ['Gaborone West', 'Phakalane', 'Tlokweng', 'Block 8', 'Extension 9'],
          propertyTypeDistribution: [
            { type: 'House', percentage: 45, count: 561 },
            { type: 'Apartment', percentage: 30, count: 374 },
            { type: 'Townhouse', percentage: 15, count: 187 },
            { type: 'Land Plot', percentage: 10, count: 125 }
          ],
          priceRangeDistribution: [
            { range: 'Under P1M', percentage: 20, count: 249 },
            { range: 'P1M - P2M', percentage: 35, count: 437 },
            { range: 'P2M - P5M', percentage: 30, count: 374 },
            { range: 'Above P5M', percentage: 15, count: 187 }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-gray-500 py-8">
        Failed to load analytics data
      </div>
    );
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string; 
    change?: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-beedab-blue/10 rounded-lg">
          <Icon className="h-6 w-6 text-beedab-blue" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Analytics</h2>
          <p className="text-gray-600">
            {location} • Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : 'year'}
          </p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="All Botswana">All Botswana</option>
            <option value="Gaborone">Gaborone</option>
            <option value="Francistown">Francistown</option>
            <option value="Maun">Maun</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Property Price"
          value={`P${(metrics.averagePrice / 1000000).toFixed(1)}M`}
          change={`+${metrics.priceChange}% vs last period`}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Total Active Listings"
          value={metrics.totalListings.toLocaleString()}
          change={`+${metrics.newListings} new this period`}
          icon={Home}
          trend="up"
        />
        <MetricCard
          title="Average Days on Market"
          value={`${metrics.averageDaysOnMarket} days`}
          change="-3 days vs last period"
          icon={Clock}
          trend="down"
        />
        <MetricCard
          title="Market Activity"
          value="High"
          change="+12% buyer inquiries"
          icon={Activity}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Types</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {metrics.propertyTypeDistribution.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ 
                      backgroundColor: `hsl(${index * 90 + 210}, 70%, 50%)` 
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.percentage}%</div>
                  <div className="text-xs text-gray-500">{item.count} properties</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Price Ranges</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {metrics.priceRangeDistribution.map((item, index) => (
              <div key={item.range} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{item.range}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-beedab-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{item.count} properties</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Areas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Most Popular Areas</h3>
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.popularAreas.map((area, index) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gray-50 rounded-lg hover:bg-beedab-blue/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 text-beedab-blue" />
              </div>
              <div className="text-sm font-medium text-gray-900">{area}</div>
              <div className="text-xs text-gray-500">#{index + 1} in demand</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalyticsDashboard;
