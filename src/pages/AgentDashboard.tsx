import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign,
  Calendar,
  MessageSquare,
  Star,
  Phone,
  Mail,
  Eye,
  Plus,
  Filter,
  BarChart3
} from 'lucide-react';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '24', icon: Home, change: '+3', changeType: 'increase' },
    { label: 'Total Clients', value: '156', icon: Users, change: '+12', changeType: 'increase' },
    { label: 'Properties Sold', value: '8', icon: TrendingUp, change: '+2', changeType: 'increase' },
    { label: 'Commission Earned', value: '$125K', icon: DollarSign, change: '+$15K', changeType: 'increase' }
  ];

  const recentListings = [
    {
      id: 1,
      title: 'Luxury Downtown Condo',
      price: 850000,
      location: 'Austin, TX',
      status: 'active',
      views: 2341,
      inquiries: 28,
      daysOnMarket: 5,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Modern Family Home',
      price: 675000,
      location: 'Miami, FL',
      status: 'pending',
      views: 1892,
      inquiries: 35,
      daysOnMarket: 18,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Suburban Villa',
      price: 925000,
      location: 'Phoenix, AZ',
      status: 'sold',
      views: 3156,
      inquiries: 42,
      daysOnMarket: 32,
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const recentClients = [
    {
      id: 1,
      name: 'John & Sarah Miller',
      type: 'Buyers',
      status: 'Active',
      budget: '$600K - $800K',
      lastContact: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Robert Chen',
      type: 'Seller',
      status: 'Listing Prep',
      budget: '$1.2M',
      lastContact: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Emily Davis',
      type: 'Buyer',
      status: 'Under Contract',
      budget: '$450K',
      lastContact: '3 days ago',
      priority: 'low'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      client: 'John & Sarah Miller',
      type: 'Property Showing',
      property: 'Luxury Downtown Condo',
      date: '2025-01-20',
      time: '2:00 PM',
      location: 'Austin, TX'
    },
    {
      id: 2,
      client: 'Robert Chen',
      type: 'Listing Consultation',
      property: 'Initial Meeting',
      date: '2025-01-21',
      time: '10:00 AM',
      location: 'Office'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Agent Dashboard</h1>
              <p className="text-neutral-600 mt-1">Manage your listings, clients, and track performance</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </button>
              <button className="inline-flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                New Listing
              </button>
            </div>
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
                        <div className="p-3 bg-primary-100 rounded-lg">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm text-success-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change} this month
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Listings Performance */}
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Listings Performance</h3>
                  <div className="space-y-4">
                    {recentListings.slice(0, 3).map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{listing.title}</h4>
                          <p className="text-sm text-neutral-600">{listing.location}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-neutral-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {listing.views}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {listing.inquiries}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-neutral-900">
                            ${listing.price.toLocaleString()}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'active' ? 'bg-success-100 text-success-800' :
                            listing.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                            'bg-neutral-100 text-neutral-800'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Appointments</h3>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-start space-x-3 p-3 rounded-lg border border-neutral-200">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-neutral-900">{appointment.client}</h4>
                            <span className="text-xs text-neutral-500">{appointment.time}</span>
                          </div>
                          <p className="text-sm text-neutral-600">{appointment.type}</p>
                          <p className="text-sm text-neutral-500">{appointment.property}</p>
                          <p className="text-xs text-neutral-500 mt-1">{appointment.date} • {appointment.location}</p>
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
              {recentListings.map((listing) => (
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          listing.status === 'active' ? 'bg-success-100 text-success-800' :
                          listing.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      
                      <div className="text-2xl font-bold text-primary-600 mb-4">
                        ${listing.price.toLocaleString()}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.views}</div>
                          <div className="text-xs text-neutral-600">Views</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.inquiries}</div>
                          <div className="text-xs text-neutral-600">Inquiries</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-semibold text-neutral-900">{listing.daysOnMarket}</div>
                          <div className="text-xs text-neutral-600">Days</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium transition-colors">
                          Edit Listing
                        </button>
                        <button className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">Client Management</h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {recentClients.map((client) => (
                  <div key={client.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-neutral-900">{client.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-neutral-600">{client.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.priority === 'high' ? 'bg-error-100 text-error-800' :
                              client.priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                              'bg-success-100 text-success-800'
                            }`}>
                              {client.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">Budget: {client.budget}</p>
                          <p className="text-sm text-neutral-500">Status: {client.status}</p>
                          <p className="text-xs text-neutral-400 mt-1">Last contact: {client.lastContact}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-neutral-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Upcoming Schedule</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-neutral-900">{appointment.client}</h4>
                        <span className="text-sm text-neutral-500">{appointment.date} at {appointment.time}</span>
                      </div>
                      <p className="text-neutral-600 mb-1">{appointment.type}</p>
                      <p className="text-sm text-neutral-500">{appointment.property}</p>
                      <p className="text-sm text-neutral-500">📍 {appointment.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm transition-colors">
                        Join
                      </button>
                      <button className="px-3 py-1 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded text-sm transition-colors">
                        Reschedule
                      </button>
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

export default AgentDashboard;