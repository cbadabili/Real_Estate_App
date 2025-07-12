import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Users, TrendingUp, Calendar, DollarSign, Eye, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Corrected import

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [myRentals, setMyRentals] = useState([]);
  const { user } = useAuth(); // Using useAuth

  useEffect(() => {
    // Fetch landlord's rental listings
    const fetchMyRentals = async () => {
      try {
        const response = await fetch('/api/landlord/rentals', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        if (data.success) {
          setMyRentals(data.data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchMyRentals();
  }, []);

  const stats = [
    {
      title: 'Total Properties',
      value: myRentals.length,
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Tenants',
      value: myRentals.filter((r: any) => r.status === 'occupied').length,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: `P ${myRentals.reduce((sum: number, r: any) => sum + (r.rent || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Vacancy Rate',
      value: `${myRentals.length > 0 ? Math.round((myRentals.filter((r: any) => r.status === 'available').length / myRentals.length) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Landlord Dashboard</h1>
              <p className="text-neutral-600 mt-1">Manage your rental properties and tenants</p>
            </div>
            <Link
              to="/rent/create-listing"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'properties', label: 'Properties' },
              { id: 'tenants', label: 'Tenants' },
              { id: 'applications', label: 'Applications' },
              { id: 'maintenance', label: 'Maintenance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-neutral-600">New application received for Gaborone Apartment</span>
                  <span className="text-neutral-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-neutral-600">Rent payment received from John Doe</span>
                  <span className="text-neutral-400">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-neutral-600">Maintenance request submitted for Unit 3B</span>
                  <span className="text-neutral-400">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myRentals.map((rental: any) => (
              <div key={rental.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{rental.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rental.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rental.status}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4">{rental.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">P {rental.rent?.toLocaleString()}/month</span>
                    <div className="flex items-center space-x-2 text-sm text-neutral-500">
                      <Eye className="h-4 w-4" />
                      <span>{rental.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;