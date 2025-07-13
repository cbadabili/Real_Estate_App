
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  DollarSign, 
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Camera,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  rental_property: string;
  tenant_name: string;
  created_at: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  photos: string[];
}

const MaintenanceManagementPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      // Mock data for now
      const mockRequests: MaintenanceRequest[] = [
        {
          id: 1,
          title: 'Leaking Faucet in Kitchen',
          description: 'Kitchen faucet has been dripping continuously for the past week.',
          priority: 'medium',
          status: 'pending',
          category: 'plumbing',
          rental_property: 'Apartment 2B - Gaborone CBD',
          tenant_name: 'John Doe',
          created_at: new Date().toISOString(),
          estimated_cost: 350,
          photos: []
        },
        {
          id: 2,
          title: 'Air Conditioning Not Working',
          description: 'AC unit stopped working completely. Room is getting very hot.',
          priority: 'high',
          status: 'in_progress',
          category: 'hvac',
          rental_property: 'House 15 - Phakalane',
          tenant_name: 'Jane Smith',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          estimated_cost: 1200,
          assigned_to: 'Cool Air Solutions',
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

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      // Update the request status
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: status as any } : req
      ));
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: Wrench,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending',
      value: requests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'In Progress',
      value: requests.filter(r => r.status === 'in_progress').length,
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
    {
      title: 'Completed',
      value: requests.filter(r => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
              <p className="text-gray-600">
                Track and manage maintenance requests for your rental properties
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === status
                    ? 'bg-beedab-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance Requests */}
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
                  ? 'No requests yet'
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
                        {request.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{request.rental_property}</span>
                      <span>•</span>
                      <span>Tenant: {request.tenant_name}</span>
                      <span>•</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    {request.estimated_cost && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          Estimated Cost: <span className="font-medium text-beedab-blue">P{request.estimated_cost}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => updateRequestStatus(request.id, 'in_progress')}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Start Work
                      </button>
                    )}
                    {request.status === 'in_progress' && (
                      <button
                        onClick={() => updateRequestStatus(request.id, 'completed')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenanceManagementPage;
