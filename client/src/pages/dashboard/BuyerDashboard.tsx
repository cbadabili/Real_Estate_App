// @ts-nocheck

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Calendar, Building, TrendingUp, CreditCard } from 'lucide-react';
import UserDashboard from '../../components/domain/user/UserDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '@/lib/storage';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedProperties: 0,
    propertiesViewed: 0,
    inquiriesSent: 0,
    viewingsScheduled: 0
  });

  useEffect(() => {
    fetchBuyerStats();
  }, []);

  const fetchBuyerStats = async () => {
    try {
      const token = getToken();
      const response = await fetch('/api/dashboard/buyer-stats', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch buyer stats:', error);
    }
  };

  const quickActions = (
    <div className="grid md:grid-cols-3 gap-4">
      <Link
        to="/properties"
        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Building className="h-6 w-6 text-blue-600 mr-3" />
        <div>
          <div className="font-medium text-gray-900">Browse Properties</div>
          <div className="text-sm text-gray-600">Find your dream home</div>
        </div>
      </Link>

      <Link
        to="/market-intelligence"
        className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
      >
        <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
        <div>
          <div className="font-medium text-gray-900">Market Intelligence</div>
          <div className="text-sm text-gray-600">Get market insights</div>
        </div>
      </Link>

      <Link
        to="/services/financing"
        className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
        <div>
          <div className="font-medium text-gray-900">Get Pre-approved</div>
          <div className="text-sm text-gray-600">Mortgage consultation</div>
        </div>
      </Link>
    </div>
  );

  return (
    <UserDashboard 
      title="Buyer Dashboard" 
      subtitle={`Welcome back, ${user?.name}`}
      quickActions={quickActions}
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Saved Properties</div>
              <div className="text-2xl font-bold text-gray-900">{stats.savedProperties}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Properties Viewed</div>
              <div className="text-2xl font-bold text-gray-900">{stats.propertiesViewed}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Inquiries Sent</div>
              <div className="text-2xl font-bold text-gray-900">{stats.inquiriesSent}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Viewings Scheduled</div>
              <div className="text-2xl font-bold text-gray-900">{stats.viewingsScheduled}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Viewed 3-bedroom house</p>
              <p className="text-sm text-gray-600">Gaborone West • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Heart className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Saved townhouse</p>
              <p className="text-sm text-gray-600">Block 8 • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </UserDashboard>
  );
};

export default BuyerDashboard;
