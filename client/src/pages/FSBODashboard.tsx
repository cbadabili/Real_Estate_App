import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Home,
  Users,
  Clock,
  Edit,
  Trash2,
  Share2,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FSBODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const myListings = [
    {
      id: 1,
      title: 'Modern Family Home in Suburbia',
      price: 650000,
      location: 'Austin, TX',
      status: 'active',
      views: 1247,
      inquiries: 18,
      showings: 7,
      daysOnMarket: 12,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Cozy Downtown Condo',
      price: 425000,
      location: 'Miami, FL',
      status: 'pending',
      views: 892,
      inquiries: 12,
      showings: 15,
      daysOnMarket: 28,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const recentInquiries = [
    {
      id: 1,
      buyerName: 'Sarah Johnson',
      property: 'Modern Family Home in Suburbia',
      message: 'Hi, I\'m very interested in viewing this property. When would be a good time?',
      timestamp: '2 hours ago',
      status: 'unread'
    },
    {
      id: 2,
      buyerName: 'Mike Chen',
      property: 'Cozy Downtown Condo',
      message: 'Is the price negotiable? I\'d like to make an offer.',
      timestamp: '5 hours ago',
      status: 'read'
    },
    {
      id: 3,
      buyerName: 'Emily Davis',
      property: 'Modern Family Home in Suburbia',
      message: 'Can you provide more details about the neighborhood schools?',
      timestamp: '1 day ago',
      status: 'replied'
    }
  ];

  const upcomingShowings = [
    {
      id: 1,
      buyerName: 'Robert Wilson',
      property: 'Modern Family Home in Suburbia',
      date: '2025-01-20',
      time: '2:00 PM',
      type: 'In-person'
    },
    {
      id: 2,
      buyerName: 'Lisa Anderson',
      property: 'Cozy Downtown Condo',
      date: '2025-01-21',
      time: '10:00 AM',
      type: 'Virtual'
    }
  ];

  const stats = [
    { label: 'Total Views', value: '2,139', icon: Eye, change: '+12%', changeType: 'increase' },
    { label: 'Inquiries', value: '30', icon: MessageSquare, change: '+8%', changeType: 'increase' },
    { label: 'Showings', value: '22', icon: Calendar, change: '+15%', changeType: 'increase' },
    { label: 'Avg. Days on Market', value: '20', icon: Clock, change: '-5%', changeType: 'decrease' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: Home },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'showings', label: 'Showings', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">FSBO Dashboard</h1>
              <p className="text-neutral-600 mt-1">Manage your property listings and track performance</p>
            </div>
            <Link
              to="/create-listing"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Listing
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          stat.changeType === 'increase' ? 'bg-success-100' : 'bg-primary-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            stat.changeType === 'increase' ? 'text-success-600' : 'text-primary-600'
                          }`} />
                        </div>
                      </div>
                      <div className={`flex items-center mt-4 text-sm ${
                        stat.changeType === 'increase' ? 'text-success-600' : 'text-primary-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change} from last month
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Inquiries */}
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Inquiries</h3>
                  <div className="space-y-4">
                    {recentInquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-900">{inquiry.buyerName}</p>
                            <span className="text-xs text-neutral-500">{inquiry.timestamp}</span>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">{inquiry.property}</p>
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{inquiry.message}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          inquiry.status === 'unread' ? 'bg-primary-500' : 'bg-neutral-300'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Showings */}
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Showings</h3>
                  <div className="space-y-4">
                    {upcomingShowings.map((showing) => (
                      <div key={showing.id} className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-200">
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-accent-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-900">{showing.buyerName}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              showing.type === 'Virtual' 
                                ? 'bg-secondary-100 text-secondary-800' 
                                : 'bg-primary-100 text-primary-800'
                            }`}>
                              {showing.type}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">{showing.property}</p>
                          <p className="text-sm text-neutral-500">{showing.date} at {showing.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-6">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img src={listing.image} alt={listing.title} className="w-full h-48 md:h-full object-cover" />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900">{listing.title}</h3>
                          <p className="text-neutral-600">{listing.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            listing.status === 'active' 
                              ? 'bg-success-100 text-success-800'
                              : 'bg-warning-100 text-warning-800'
                          }`}>
                            {listing.status}
                          </span>
                          <div className="flex space-x-1">
                            <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-primary-600 mb-4">
                        ${listing.price.toLocaleString()}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.views}</div>
                          <div className="text-xs text-neutral-600">Views</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.inquiries}</div>
                          <div className="text-xs text-neutral-600">Inquiries</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.showings}</div>
                          <div className="text-xs text-neutral-600">Showings</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.daysOnMarket}</div>
                          <div className="text-xs text-neutral-600">Days</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                          View Listing
                        </button>
                        <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium transition-colors">
                          Edit Listing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">All Inquiries</h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-neutral-900">{inquiry.buyerName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-500">{inquiry.timestamp}</span>
                            <span className={`w-2 h-2 rounded-full ${
                              inquiry.status === 'unread' ? 'bg-primary-500' : 'bg-neutral-300'
                            }`}></span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{inquiry.property}</p>
                        <p className="text-neutral-700">{inquiry.message}</p>
                        <div className="flex space-x-3 mt-4">
                          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Reply
                          </button>
                          <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium transition-colors">
                            Schedule Showing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'showings' && (
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">Scheduled Showings</h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {upcomingShowings.map((showing) => (
                  <div key={showing.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-neutral-900">{showing.buyerName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            showing.type === 'Virtual' 
                              ? 'bg-secondary-100 text-secondary-800' 
                              : 'bg-primary-100 text-primary-800'
                          }`}>
                            {showing.type}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{showing.property}</p>
                        <p className="text-neutral-700 font-medium">{showing.date} at {showing.time}</p>
                        <div className="flex space-x-3 mt-4">
                          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Join Call
                          </button>
                          <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium transition-colors">
                            Reschedule
                          </button>
                          <button className="px-4 py-2 text-error-600 hover:bg-error-50 rounded-lg text-sm font-medium transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FSBODashboard;