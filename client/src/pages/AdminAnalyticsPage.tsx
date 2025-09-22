
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Home, 
  Activity,
  DollarSign,
  Eye,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface BusinessMetrics {
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    avgSessionDuration: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number;
  };
  properties: {
    totalListings: number;
    activeListings: number;
    viewsPerListing: number;
    inquiryRate: number;
    conversionToViewing: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
    searchSuccessRate: number;
  };
}

interface TopProperty {
  id: number;
  title: string;
  views: number;
  price: string;
  location: string;
}

const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [metricsRes, topPropsRes, activityRes] = await Promise.all([
        fetch(`/api/analytics/metrics/overview?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/analytics/metrics/properties/top?limit=10', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/analytics/metrics/users/activity?days=30', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data);
      }

      if (topPropsRes.ok) {
        const topPropsData = await topPropsRes.json();
        setTopProperties(topPropsData.data);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setUserActivity(activityData.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Analytics</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
              <p className="text-gray-600 mt-1">Monitor your platform's performance and growth</p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* User Engagement */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.userEngagement.totalUsers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{metrics.userEngagement.newUsers} this period
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.userEngagement.activeUsers}</p>
                <p className="text-sm text-blue-600">
                  {metrics.userEngagement.retentionRate}% retention
                </p>
              </div>
              <Activity className="h-12 w-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.properties.activeListings}</p>
                <p className="text-sm text-gray-600">
                  {metrics.properties.viewsPerListing} avg views
                </p>
              </div>
              <Home className="h-12 w-12 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.performance.avgResponseTime}ms</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  {metrics.performance.uptime}% uptime
                </p>
              </div>
              <Activity className="h-12 w-12 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inquiry Rate</span>
                <span className="font-medium">{metrics.properties.inquiryRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Viewing Conversion</span>
                <span className="font-medium">{metrics.properties.conversionToViewing}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Views per Listing</span>
                <span className="font-medium">{metrics.properties.viewsPerListing}</span>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Error Rate</span>
                <span className={`font-medium ${
                  metrics.performance.errorRate > 5 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metrics.performance.errorRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Search Success Rate</span>
                <span className="font-medium text-green-600">{metrics.performance.searchSuccessRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium text-green-600">{metrics.performance.uptime}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Performing Properties */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Property</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {topProperties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="py-3 text-gray-600">{property.location}</td>
                    <td className="py-3 font-medium">P{parseFloat(property.price).toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {property.views}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
