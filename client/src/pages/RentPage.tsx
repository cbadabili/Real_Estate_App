
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Car, 
  Wifi, 
  Heart,
  Star,
  Calendar,
  DollarSign,
  User,
  Building,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface RentalProperty {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  district: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  monthly_rent: number;
  deposit_amount: number;
  lease_duration: number;
  available_from: string;
  furnished: boolean;
  pets_allowed: boolean;
  parking_spaces: number;
  photos: string[];
  amenities: string[];
  utilities_included: string[];
  status: string;
  created_at: string;
  landlord_id: number;
}

interface RentalApplication {
  id: number;
  rental_id: number;
  status: 'pending' | 'approved' | 'rejected';
  background_check_status: string;
  credit_report_status: string;
  created_at: string;
  rental: RentalProperty;
}

const RentPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'search' | 'applications' | 'listings'>('search');
  const [rentals, setRentals] = useState<RentalProperty[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [myListings, setMyListings] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    city: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Fetch rentals
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('location', searchQuery);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);

      const response = await fetch(`/api/rentals/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRentals(data.data);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's applications
  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/renter/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  // Fetch landlord's listings
  const fetchMyListings = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/landlord/rentals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setMyListings(data.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [searchQuery, filters]);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchMyListings();
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRentals();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Properties</h1>
                <p className="text-gray-600">Find your perfect rental home in Botswana</p>
              </div>
              
              {user && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'search'
                        ? 'bg-beedab-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Search Rentals
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'applications'
                        ? 'bg-beedab-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    My Applications
                  </button>
                  <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'listings'
                        ? 'bg-beedab-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    My Listings
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by city or area..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min rent"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max rent"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select 
                      value={filters.bedrooms}
                      onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select 
                      value={filters.propertyType}
                      onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </form>
              </div>

              {/* Property Grid */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentals.map((property) => (
                    <motion.div
                      key={property.id}
                      variants={itemVariants}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={property.photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-beedab-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                          For Rent
                        </div>
                        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                        <div className="flex items-center text-gray-500 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.address}, {property.city}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms} bed</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms} bath</span>
                          </div>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            <span>{property.square_meters}m²</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {property.furnished && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                              Furnished
                            </span>
                          )}
                          {property.pets_allowed && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                              Pets Allowed
                            </span>
                          )}
                          {property.parking_spaces > 0 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {property.parking_spaces} Parking
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-beedab-blue">P{property.monthly_rent.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <Link
                            to={`/rental/${property.id}`}
                            className="bg-beedab-blue text-white px-4 py-2 rounded-md hover:bg-beedab-darkblue transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && user && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Applications</h2>
                
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400 mt-2">Start browsing rentals to submit your first application</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{application.rental.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {application.rental.address}, {application.rental.city}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Applied on {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                              <StatusIcon className="h-4 w-4 mr-1" />
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-lg font-semibold text-beedab-blue">
                              P{application.rental.monthly_rent.toLocaleString()}/month
                            </span>
                            <Link
                              to={`/rental/${application.rental.id}`}
                              className="text-beedab-blue hover:text-beedab-darkblue font-medium"
                            >
                              View Property
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && user && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Rental Listings</h2>
                  <Link
                    to="/rent/create-listing"
                    className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Create New Listing
                  </Link>
                </div>
                
                {myListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No listings yet</p>
                    <p className="text-sm text-gray-400 mt-2">Create your first rental listing to start earning</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={listing.photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{listing.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{listing.city}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-semibold text-beedab-blue">
                              P{listing.monthly_rent.toLocaleString()}/month
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              listing.status === 'active' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Link
                              to={`/rental/${listing.id}`}
                              className="flex-1 text-center px-3 py-1 border border-beedab-blue text-beedab-blue rounded hover:bg-beedab-blue hover:text-white transition-colors"
                            >
                              View
                            </Link>
                            <Link
                              to={`/rent/edit/${listing.id}`}
                              className="flex-1 text-center px-3 py-1 bg-beedab-blue text-white rounded hover:bg-beedab-darkblue transition-colors"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RentPage;
