import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Home,
  Wrench
} from 'lucide-react';

interface DashboardData {
  totalProperties: number;
  activeRentals: number;
  maintenanceRequests: number;
  monthlyRevenue: number;
  occupancyRate: number;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    date: string;
    status: string;
  }>;
}

const PropertyManagementPage: FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/property-management/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Property Management</h1>
          <p className="text-neutral-600">Manage your rental properties efficiently</p>
        </div>

        {/* Dashboard Stats */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Properties</p>
                  <p className="text-2xl font-bold text-neutral-900">{dashboardData.totalProperties}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Active Rentals</p>
                  <p className="text-2xl font-bold text-neutral-900">{dashboardData.activeRentals}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Maintenance Requests</p>
                  <p className="text-2xl font-bold text-neutral-900">{dashboardData.maintenanceRequests}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">P{dashboardData.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 text-beedab-blue mr-3" />
              <h3 className="text-lg font-semibold text-neutral-900">Property Listings</h3>
            </div>
            <p className="text-neutral-600 mb-4">Manage your rental property listings and availability</p>
            <button 
              onClick={() => window.location.href = '/rent?tab=listings'}
              className="w-full bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              Manage Listings
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-neutral-900">Tenant Management</h3>
            </div>
            <p className="text-neutral-600 mb-4">Screen tenants, manage applications and lease agreements</p>
            <button 
              onClick={() => window.location.href = '/rent?tab=applications'}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Tenants
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-neutral-900">Rent Collection</h3>
            </div>
            <p className="text-neutral-600 mb-4">Track payments, send reminders and manage finances</p>
            <button 
              onClick={() => window.location.href = '/rent-collection'}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Payments
            </button>
          </motion.div>
        </div>

        {/* Recent Activity */}
        {dashboardData && dashboardData.recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200"
          >
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'maintenance' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'maintenance' ? (
                        <Wrench className={`h-4 w-4 ${
                          activity.type === 'maintenance' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{activity.description}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {activity.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={`ml-1 text-xs font-medium ${
                        activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Professional Property Management Services</h2>
          <p className="text-blue-100 mb-6">
            Let our experts handle your properties while you focus on growing your portfolio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white/10 rounded-lg p-4">
              <Shield className="h-6 w-6 mb-2" />
              <h4 className="font-semibold mb-1">Full Management</h4>
              <p className="text-sm text-blue-100">Complete property management services</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Calendar className="h-6 w-6 mb-2" />
              <h4 className="font-semibold mb-1">Maintenance Coordination</h4>
              <p className="text-sm text-blue-100">24/7 maintenance and repair services</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <TrendingUp className="h-6 w-6 mb-2" />
              <h4 className="font-semibold mb-1">Revenue Optimization</h4>
              <p className="text-sm text-blue-100">Market analysis and rent optimization</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/contact-agent'}
            className="bg-white text-beedab-blue px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors mt-6"
          >
            Get Professional Management
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyManagementPage;
