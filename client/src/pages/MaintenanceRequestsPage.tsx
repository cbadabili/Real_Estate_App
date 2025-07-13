
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, Plus, Filter, Search, Calendar, AlertCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  property: string;
  created_at: string;
  estimated_cost?: number;
  photos: string[];
}

const MaintenanceRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      // Mock data for tenant requests
      const mockRequests: MaintenanceRequest[] = [
        {
          id: 1,
          title: 'Leaking Faucet',
          description: 'Kitchen faucet has been dripping for days',
          priority: 'medium',
          status: 'pending',
          category: 'plumbing',
          property: 'Apartment 2B - Gaborone CBD',
          created_at: new Date().toISOString(),
          estimated_cost: 350,
          photos: []
        },
        {
          id: 2,
          title: 'AC Not Working',
          description: 'Air conditioning unit stopped working completely',
          priority: 'high',
          status: 'in_progress',
          category: 'hvac',
          property: 'House 15 - Phakalane',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          estimated_cost: 1200,
          photos: []
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-200 bg-red-50 text-red-800';
      case 'high': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default: return 'border-green-200 bg-green-50 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50 text-green-800';
      case 'in_progress': return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'pending': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Maintenance Requests</h1>
              <p className="text-gray-600">
                Track your submitted maintenance requests
              </p>
            </div>
            <button className="flex items-center gap-2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in_progress', 'completed'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    filter === filterOption
                      ? 'bg-beedab-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'You haven\'t submitted any requests yet'
                  : `No ${filter.replace('_', ' ')} requests`
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{request.property}</span>
                      <span>•</span>
                      <span>{request.category}</span>
                      <span>•</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {request.estimated_cost && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Estimated Cost</div>
                      <div className="text-lg font-semibold text-gray-900">
                        P{request.estimated_cost.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenanceRequestsPage;
