import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home,
  Building,
  Key,
  Calendar,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Star,
  MapPin,
  FileText,
  CreditCard,
  Eye,
  Heart,
  Plus,
  UserCheck,
  Briefcase,
  DollarSign,
  Target,
  Shield,
  Activity,
  BarChart3,
  Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BuyerDashboard from './dashboard/BuyerDashboard';

// Role-specific dashboard components

const SellerDashboard = ({ user, stats }) => (
  <>
    {/* Seller Stats */}
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        icon={Building} 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
        title="Active Listings" 
        value={stats?.activeListings || "0"} 
      />
      <StatCard 
        icon={Eye} 
        iconColor="text-green-600" 
        bgColor="bg-green-100" 
        title="Total Views" 
        value={stats?.totalViews || "0"} 
      />
      <StatCard 
        icon={MessageCircle} 
        iconColor="text-purple-600" 
        bgColor="bg-purple-100" 
        title="Inquiries" 
        value={stats?.totalInquiries || "0"} 
      />
      <StatCard 
        icon={DollarSign} 
        iconColor="text-orange-600" 
        bgColor="bg-orange-100" 
        title="Avg. List Price" 
        value="P 2.5M" 
      />
    </div>

    {/* Seller Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <QuickAction
        to="/create-listing"
        icon={Plus}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="Create New Listing"
        description="List your property"
      />
      <QuickAction
        to="/my-properties"
        icon={Building}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Manage Listings"
        description="View and edit properties"
      />
      <QuickAction
        to="/market-intelligence?tab=valuation"
        icon={TrendingUp}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="Value My Property"
        description="Get market valuation"
      />
    </div>
  </>
);

const AgentDashboard = ({ user }) => (
  <>
    {/* Agent Stats */}
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        icon={Users} 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
        title="Active Clients" 
        value="15" 
      />
      <StatCard 
        icon={Building} 
        iconColor="text-green-600" 
        bgColor="bg-green-100" 
        title="Listings Managed" 
        value="28" 
      />
      <StatCard 
        icon={Briefcase} 
        iconColor="text-purple-600" 
        bgColor="bg-purple-100" 
        title="Deals Closed" 
        value="7" 
      />
      <StatCard 
        icon={Star} 
        iconColor="text-orange-600" 
        bgColor="bg-orange-100" 
        title="Rating" 
        value="4.8" 
      />
    </div>

    {/* Agent Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <QuickAction
        to="/agent-dashboard"
        icon={UserCheck}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="Agent Tools"
        description="Professional dashboard"
      />
      <QuickAction
        to="/create-listing"
        icon={Plus}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Add Client Listing"
        description="Create property listing"
      />
      <QuickAction
        to="/market-intelligence"
        icon={BarChart3}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="Market Reports"
        description="Generate client reports"
      />
    </div>
  </>
);

const FSBODashboard = ({ user }) => (
  <>
    {/* FSBO Stats */}
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        icon={Home} 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
        title="FSBO Listings" 
        value="2" 
      />
      <StatCard 
        icon={Eye} 
        iconColor="text-green-600" 
        bgColor="bg-green-100" 
        title="Views This Month" 
        value="156" 
      />
      <StatCard 
        icon={MessageCircle} 
        iconColor="text-purple-600" 
        bgColor="bg-purple-100" 
        title="Direct Inquiries" 
        value="8" 
      />
      <StatCard 
        icon={FileText} 
        iconColor="text-orange-600" 
        bgColor="bg-orange-100" 
        title="Documents Ready" 
        value="85%" 
      />
    </div>

    {/* FSBO Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <QuickAction
        to="/create-listing"
        icon={Plus}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="Create FSBO Listing"
        description="Sell without an agent"
      />
      <QuickAction
        to="/services/legal"
        icon={FileText}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Legal Documents"
        description="Download templates"
      />
      <QuickAction
        to="/buyer-seller-platform"
        icon={TrendingUp}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="FSBO Tools"
        description="Complete selling toolkit"
      />
    </div>
  </>
);

const LandlordDashboard = ({ user }) => (
  <>
    {/* Landlord Stats */}
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        icon={Building} 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
        title="Rental Properties" 
        value="5" 
      />
      <StatCard 
        icon={Users} 
        iconColor="text-green-600" 
        bgColor="bg-green-100" 
        title="Active Tenants" 
        value="4" 
      />
      <StatCard 
        icon={DollarSign} 
        iconColor="text-purple-600" 
        bgColor="bg-purple-100" 
        title="Monthly Income" 
        value="P 32K" 
      />
      <StatCard 
        icon={Wrench} 
        iconColor="text-orange-600" 
        bgColor="bg-orange-100" 
        title="Maintenance" 
        value="2" 
      />
    </div>

    {/* Landlord Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <QuickAction
        to="/rental-listing-wizard"
        icon={Plus}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="List Rental Property"
        description="Add new rental"
      />
      <QuickAction
        to="/maintenance-management"
        icon={Wrench}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Maintenance"
        description="Manage requests"
      />
      <QuickAction
        to="/rental-applications"
        icon={FileText}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="Tenant Applications"
        description="Review applications"
      />
    </div>
  </>
);

// Reusable components
const StatCard = ({ icon: Icon, iconColor, bgColor, title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border"
  >
    <div className="flex items-center">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ to, icon: Icon, iconColor, bgColor, title, description }) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow group"
  >
    <div className="flex items-center">
      <div className={`p-2 ${bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="ml-4">
        <div className="text-lg font-semibold text-gray-900 group-hover:text-beedab-blue">
          {title}
        </div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real statistics from API
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('No auth token found');
        // Set default stats instead of returning
        setStats({
          savedProperties: 0,
          propertiesViewed: 0,
          inquiriesSent: 0,
          viewingsScheduled: 0,
          activeListings: 0,
          totalViews: 0,
          totalInquiries: 0
        });
        return;
      }

      console.log('Fetching dashboard stats...');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dashboard API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statsData = await response.json();
      console.log('Dashboard stats received:', statsData);
      setStats(statsData);
      
      // Generate realistic activity based on actual stats
      const activities = [];
      if (statsData.propertiesViewed > 0) {
        activities.push({
          action: 'Property viewed',
          details: '3-bedroom house in Gaborone West',
          time: '2 hours ago',
          icon: Eye
        });
      }
      if (statsData.savedProperties > 0) {
        activities.push({
          action: 'Property saved',
          details: 'Added townhouse to your favorites',
          time: '1 day ago',
          icon: Heart
        });
      }
      if (statsData.inquiriesSent > 0) {
        activities.push({
          action: 'Inquiry sent',
          details: 'Contacted seller about apartment',
          time: '2 days ago',
          icon: MessageCircle
        });
      }
      if (statsData.viewingsScheduled > 0) {
        activities.push({
          action: 'Viewing scheduled',
          details: 'Appointment booked for Saturday',
          time: '3 days ago',
          icon: Calendar
        });
      }
      
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to minimal stats if API fails
      setStats({
        savedProperties: 0,
        propertiesViewed: 0,
        inquiriesSent: 0,
        viewingsScheduled: 0,
        activeListings: 0,
        totalViews: 0,
        totalInquiries: 0
      });
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please log in to access your dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Your personalized real estate dashboard awaits
            </p>
            <Link 
              to="/login" 
              className="bg-beedab-blue text-white px-6 py-3 rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              Log In
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Determine dashboard type based on user role and userType
  const getDashboardType = () => {
    if (user.role === 'agent') return 'agent';
    if (user.userType === 'landlord' || user.role === 'landlord') return 'landlord';
    if (user.userType === 'fsbo' || user.role === 'fsbo') return 'fsbo';
    if (user.userType === 'seller' || user.role === 'seller') return 'seller';
    return 'buyer'; // Default to buyer dashboard
  };

  const dashboardType = getDashboardType();

  // Use specialized dashboard components for better UX
  if (dashboardType === 'buyer') {
    return <BuyerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.firstName || user.email}!
              </h1>
              <p className="text-gray-600">
                {dashboardType === 'agent' && 'Manage your clients and listings from your professional dashboard'}
                {dashboardType === 'landlord' && 'Monitor your rental properties and tenant activities'}
                {dashboardType === 'fsbo' && 'Manage your For Sale By Owner listings and documents'}
                {dashboardType === 'seller' && 'Track your property listings and buyer inquiries'}
                {dashboardType === 'buyer' && 'Continue your property search and manage your favorites'}
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className={`px-3 py-1 rounded-full ${
                dashboardType === 'agent' ? 'bg-blue-100 text-blue-800' :
                dashboardType === 'landlord' ? 'bg-green-100 text-green-800' :
                dashboardType === 'fsbo' ? 'bg-purple-100 text-purple-800' :
                dashboardType === 'seller' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard
              </div>
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Online</span>
            </div>
          </div>
        </motion.div>

        {/* Role-based Dashboard Content */}
        {dashboardType === 'buyer' && <BuyerDashboard />}
        {dashboardType === 'seller' && <SellerDashboard user={user} stats={stats} />}
        {dashboardType === 'agent' && <AgentDashboard user={user} stats={stats} />}
        {dashboardType === 'fsbo' && <FSBODashboard user={user} stats={stats} />}
        {dashboardType === 'landlord' && <LandlordDashboard user={user} stats={stats} />}

        {/* Universal Recent Activity Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link 
              to="/activity" 
              className="text-sm text-beedab-blue hover:text-beedab-darkblue"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.details}</div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity yet</p>
                <p className="text-sm">Your property interactions will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;