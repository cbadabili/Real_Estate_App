import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Filter, 
  Heart, 
  Eye,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { AISearchBar } from '../../components/search/AISearchBar';

const SearchingPage = () => {
  const [searchFilters, setSearchFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    location: ''
  });

  const [savedProperties, setSavedProperties] = useState<number[]>([]);

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

  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Family Home in Gaborone West',
      price: 1250000,
      location: 'Gaborone West',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      features: ['Garden', 'Garage', 'Security', 'Pool'],
      listingType: 'mls',
      daysOnMarket: 15
    },
    {
      id: 2,
      title: 'Luxury Apartment in CBD',
      price: 850000,
      location: 'Gaborone CBD',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      features: ['City View', 'Parking', 'Gym', 'Security'],
      listingType: 'mls',
      daysOnMarket: 8
    },
    {
      id: 3,
      title: 'Spacious Townhouse in Mogoditshane',
      price: 750000,
      location: 'Mogoditshane',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      features: ['Patio', 'Storage', 'Security', 'Schools Nearby'],
      listingType: 'fsbo',
      daysOnMarket: 22
    }
  ];

  const toggleSaveProperty = (propertyId: number) => {
    setSavedProperties(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section with Search */}
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Use our AI-powered search to discover properties that match your lifestyle and budget.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <AISearchBar 
              onSearch={(query, filters) => {
                console.log('Search:', query, filters);
              }}
              className="bg-white rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <select 
              value={searchFilters.propertyType}
              onChange={(e) => setSearchFilters(prev => ({...prev, propertyType: e.target.value}))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue"
            >
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
              <option value="farm">Farm</option>
              <option value="land">Land</option>
            </select>
            
            <Link
              to="/map-search"
              className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map View
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Handpicked properties that match popular search criteria</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      property.listingType === 'mls' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {property.listingType === 'mls' ? 'MLS' : 'FSBO'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleSaveProperty(property.id)}
                      className={`p-2 rounded-full ${
                        savedProperties.includes(property.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                      } transition-colors`}
                    >
                      <Heart className="h-4 w-4" fill={savedProperties.includes(property.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                    <span className="text-lg font-bold text-beedab-blue">P {property.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{property.daysOnMarket} days on market</span>
                    <Link
                      to={`/property/${property.id}`}
                      className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white text-sm rounded-lg hover:bg-beedab-darkblue transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Found Properties You Like?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Schedule viewings and get expert insights about neighborhoods and property values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                Schedule Viewings
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Bookmark className="mr-2 h-5 w-5" />
                View Saved Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default SearchingPage;