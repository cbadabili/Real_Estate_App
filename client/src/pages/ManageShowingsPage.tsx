
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, User, Phone, MessageCircle, 
  CheckCircle, XCircle, Eye, Edit, Plus, Filter
} from 'lucide-react';

const ManageShowingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const upcomingShowings = [
    {
      id: 1,
      property: 'Modern 3BR House in Phakalane',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '30 min',
      visitor: 'John Smith',
      phone: '+267 7123 4567',
      email: 'john@email.com',
      type: 'in-person',
      status: 'confirmed',
      notes: 'Interested in the garden area'
    },
    {
      id: 2,
      property: 'Luxury Villa in Broadhurst',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '45 min',
      visitor: 'Sarah Johnson',
      phone: '+267 7234 5678',
      email: 'sarah@email.com',
      type: 'virtual',
      status: 'pending',
      notes: 'First-time buyer'
    },
    {
      id: 3,
      property: 'Family Home in Extension 15',
      date: '2024-01-16',
      time: '11:00 AM',
      duration: '30 min',
      visitor: 'Mike Brown',
      phone: '+267 7345 6789',
      email: 'mike@email.com',
      type: 'in-person',
      status: 'confirmed',
      notes: 'Bringing family for viewing'
    }
  ];

  const completedShowings = [
    {
      id: 4,
      property: 'Townhouse in Mogoditshane',
      date: '2024-01-10',
      time: '3:00 PM',
      visitor: 'Lisa Davis',
      phone: '+267 7456 7890',
      email: 'lisa@email.com',
      type: 'in-person',
      status: 'completed',
      feedback: 'Very interested, will submit offer soon',
      rating: 5
    },
    {
      id: 5,
      property: 'Apartment in CBD',
      date: '2024-01-08',
      time: '10:30 AM',
      visitor: 'Tom Wilson',
      phone: '+267 7567 8901',
      email: 'tom@email.com',
      type: 'virtual',
      status: 'no-show',
      feedback: 'Did not attend scheduled viewing',
      rating: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no-show': return <XCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const currentShowings = activeTab === 'upcoming' ? upcomingShowings : completedShowings;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Manage Showings</h1>
            <p className="text-neutral-600 mt-2">Schedule and manage property viewings</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-beedab-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Showing
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Showings</p>
                <p className="text-2xl font-bold text-neutral-900">8</p>
              </div>
              <Calendar className="h-8 w-8 text-beedab-blue" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">This Week</p>
                <p className="text-2xl font-bold text-neutral-900">3</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-neutral-900">75%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-beedab-blue text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Upcoming ({upcomingShowings.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-beedab-blue text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Completed ({completedShowings.length})
              </button>
            </div>
            <button className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>

          {/* Showings List */}
          <div className="space-y-4">
            {currentShowings.map((showing) => (
              <motion.div
                key={showing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {showing.property}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {showing.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {showing.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {showing.type === 'virtual' ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(showing.status)}`}>
                    {getStatusIcon(showing.status)}
                    <span className="ml-1 capitalize">{showing.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{showing.visitor}</p>
                      <p className="text-sm text-neutral-600">{showing.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm text-neutral-600">{showing.phone}</span>
                  </div>
                </div>

                {showing.notes && (
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-700">
                      <strong>Notes:</strong> {showing.notes}
                    </p>
                  </div>
                )}

                {'feedback' in showing && showing.feedback && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Feedback:</strong> {showing.feedback}
                    </p>
                    {'rating' in showing && showing.rating && (
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < showing.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-blue-700">({showing.rating}/5)</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  {activeTab === 'upcoming' && (
                    <>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit className="h-4 w-4 mr-2" />
                        Reschedule
                      </button>
                    </>
                  )}
                  <button className="flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button className="flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Showing Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Schedule New Showing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Property
                  </label>
                  <select className="w-full border border-neutral-300 rounded-lg px-3 py-2">
                    <option value="">Select property</option>
                    <option value="1">Modern 3BR House in Phakalane</option>
                    <option value="2">Luxury Villa in Broadhurst</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Date
                    </label>
                    <input type="date" className="w-full border border-neutral-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Time
                    </label>
                    <input type="time" className="w-full border border-neutral-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Visitor Name
                  </label>
                  <input type="text" className="w-full border border-neutral-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Contact Number
                  </label>
                  <input type="tel" className="w-full border border-neutral-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Type
                  </label>
                  <select className="w-full border border-neutral-300 rounded-lg px-3 py-2">
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 px-4 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageShowingsPage;
