import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List as ListIcon, Search, MapPin, Bed, Bath, Square, Heart, Share2 } from 'lucide-react';
import { useProperties, type PropertyFilters } from '../hooks/useProperties';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLocation } from 'react-router-dom';

const RealPropertiesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PropertyFilters>({
    status: 'active',
    limit: 20
  });
  
  const location = useLocation();
  
  // Parse URL parameters and set initial filters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const propertyType = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const city = searchParams.get('city');
    
    setFilters(prev => ({
      ...prev,
      ...(propertyType && { propertyType }),
      ...(minPrice && { minPrice: parseInt(minPrice) }),
      ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
      ...(bedrooms && { minBedrooms: parseInt(bedrooms) }),
      ...(bathrooms && { minBathrooms: parseInt(bathrooms) }),
      ...(city && { city })
    }));
    
    if (searchParams.get('city')) {
      setSearchTerm(searchParams.get('city') || '');
    }
  }, [location.search]);

  const { data: properties, isLoading, error } = useProperties({
    ...filters,
    ...(searchTerm && { city: searchTerm })
  });

  const PropertyCard = ({ property }: { property: any }) => (
    <motion.div
      layoutId={`property-${property.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200"
      whileHover={{ y: -2 }}
    >
      <div className="relative">
        {property.images?.[0] ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.listingType === 'fsbo' 
              ? 'bg-accent-100 text-accent-800' 
              : 'bg-beedab-lightblue text-beedab-darkblue'
          }`}>
            {property.listingType?.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-neutral-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{property.title}</h3>
            <p className="text-neutral-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.city}, {property.state}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-beedab-darkblue">
            P{parseFloat(property.price || '0').toLocaleString()}
          </div>
          <div className="flex space-x-4 text-sm text-neutral-600">
            {property.bedrooms && (
              <span className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}bd
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}ba
              </span>
            )}
            {property.squareFeet && (
              <span className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.squareFeet.toLocaleString()}sqm
              </span>
            )}
          </div>
        </div>
        
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm text-neutral-500">
          <span>{property.views || 0} views</span>
          <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Properties</h1>
              <p className="text-neutral-600 mt-1">
                {filters.propertyType && (
                  <span className="inline-block bg-beedab-blue text-white px-2 py-1 rounded text-sm mr-2 capitalize">
                    {filters.propertyType}
                  </span>
                )}
                {properties ? `${properties.length} properties found` : 'Loading properties...'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-64"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-primary-50 border-primary-300 text-primary-700' 
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
              
              <div className="flex rounded-lg border border-neutral-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white border-b border-neutral-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setFilters(prev => ({ ...prev, minPrice: min || undefined, maxPrice: max || undefined }));
                  }}
                >
                  <option value="">Any Price</option>
                  <option value="0-300000">Under $300K</option>
                  <option value="300000-500000">$300K - $500K</option>
                  <option value="500000-750000">$500K - $750K</option>
                  <option value="750000-1000000">$750K - $1M</option>
                  <option value="1000000-">Over $1M</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Property Type</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value || undefined }))}
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="farm">Farm</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Bedrooms</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  onChange={(e) => setFilters(prev => ({ ...prev, minBedrooms: Number(e.target.value) || undefined }))}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Listing Type</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  onChange={(e) => setFilters(prev => ({ ...prev, listingType: e.target.value || undefined }))}
                >
                  <option value="">All Listings</option>
                  <option value="fsbo">FSBO</option>
                  <option value="agent">Agent Listed</option>
                  <option value="mls">MLS</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading properties: {error.message}</p>
          </div>
        )}
        
        {properties && properties.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-neutral-600">No properties found matching your criteria.</p>
          </div>
        )}
        
        {properties && properties.length > 0 && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealPropertiesPage;