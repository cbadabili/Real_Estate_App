import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, FileText, Calendar, MapPin, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getToken } from '@/lib/storage';

const RenterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    // Fetch renter's applications
    const fetchApplications = async () => {
      try {
        const token = getToken();
        const response = await fetch('/api/renter/applications', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        });
        const data = await response.json();

        if (data.success) {
          setApplications(data.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    // Fetch saved properties
    const fetchSavedProperties = async () => {
      try {
        const token = getToken();
        const response = await fetch('/api/renter/saved-properties', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        });
        const data = await response.json();

        if (data.success) {
          setSavedProperties(data.data);
        }
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      }
    };

    fetchApplications();
    fetchSavedProperties();
  }, []);

  const stats = [
    {
      title: 'Active Applications',
      value: applications.filter((app: any) => app.status === 'pending').length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Saved Properties',
      value: savedProperties.length,
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Scheduled Viewings',
      value: applications.filter((app: any) => app.viewing_scheduled).length,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Messages',
      value: 3,
      icon: MessageSquare,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Renter Dashboard</h1>
              <p className="text-neutral-600 mt-1">Find your perfect rental property</p>
            </div>
            <Link
              to="/rent"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Rentals
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
              { id: 'search', label: 'Search & Browse' },
              { id: 'applications', label: 'My Applications' },
              { id: 'saved', label: 'Saved Properties' },
              { id: 'viewings', label: 'Viewings' },
              { id: 'messages', label: 'Messages' }
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
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Search</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search by location, price, or features..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample recommended properties */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-neutral-200"></div>
                  <div className="p-4">
                    <h4 className="font-semibold text-neutral-900">Modern Apartment in Gaborone</h4>
                    <p className="text-neutral-600 text-sm">2 bed, 2 bath • Gaborone CBD</p>
                    <p className="text-lg font-bold text-primary-600 mt-2">P 8,500/month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
                <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Applications Yet</h3>
                <p className="text-neutral-600">Start browsing properties to submit your first application.</p>
                <Link
                  to="/rent"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-4"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              applications.map((application: any) => (
                <div key={application.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{application.property_title}</h3>
                      <p className="text-neutral-600">{application.property_location}</p>
                      <p className="text-sm text-neutral-500 mt-1">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      application.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedProperties.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
                <Heart className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Saved Properties</h3>
                <p className="text-neutral-600">Save properties you're interested in to view them here.</p>
              </div>
            ) : (
              savedProperties.map((property: any) => (
                <div key={property.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                  <div className="h-48 bg-neutral-200"></div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{property.title}</h3>
                    <p className="text-neutral-600 mb-4">{property.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">P {property.rent?.toLocaleString()}/month</span>
                      <button className="text-red-500 hover:text-red-600">
                        <Heart className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterDashboard;