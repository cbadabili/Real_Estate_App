import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List as ListIcon, Search, MapPin, Bed, Bath, Square, Heart, Share2, Eye } from 'lucide-react';
import { useProperties, type PropertyFilters } from '../hooks/useProperties';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { VerificationBadge } from '../components/VerificationBadge';
import { TrustSafetyFeatures } from '../components/TrustSafetyFeatures';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { AISearchBar } from '../components/search/AISearchBar';

const RealPropertiesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PropertyFilters>({
    status: 'active',
    limit: 20
  });
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

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

  const { data: properties = [], isLoading, error } = useProperties({
    ...filters,
    ...(searchTerm && { city: searchTerm })
  });

  // Handle empty or undefined properties
  const safeProperties = Array.isArray(properties) ? properties : [];

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleAISearch = (query: string, aiFilters?: any) => {
    if (aiFilters) {
      setFilters(prev => ({ ...prev, ...aiFilters }));
    }
    if (query) {
      setSearchTerm(query);
    }
  };

  const MapSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-beedab-blue" />
          Properties Map
        </h3>

        {/* Map placeholder with property markers */}
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 opacity-30"></div>

          {/* Property markers */}
          {safeProperties.slice(0, 8).map((property: any, index: number) => (
            <div
              key={property.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${15 + (index % 4) * 20}%`,
                top: `${20 + Math.floor(index / 4) * 30}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedProperty(property)}
            >
              {/* Price marker */}
              <div className={`
                relative bg-white border-2 border-beedab-blue rounded-lg px-3 py-2 shadow-lg
                hover:bg-beedab-blue hover:text-white transition-all
                ${selectedProperty?.id === property.id ? 'bg-beedab-blue text-white' : ''}
              `}>
                <div className="text-sm font-bold">
                  P{parseFloat(property.price || '0').toLocaleString()}
                </div>

                {/* Arrow pointer */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                  border-l-4 border-r-4 border-t-4 border-transparent
                  ${selectedProperty?.id === property.id ? 'border-t-beedab-blue' : 'border-t-white'}
                `}></div>

                {/* Tooltip with property details */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-semibold">{property.title}</div>
                  <div className="text-xs">{property.bedrooms}bd • {property.bathrooms}ba</div>
                </div>
              </div>
            </div>
          ))}

          {/* Selected property popup */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-neutral-200"
            >
              <div className="flex space-x-3">
                {selectedProperty.images?.[0] ? (
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-neutral-500">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 text-sm mb-1">{selectedProperty.title}</h4>
                  <p className="text-lg font-bold text-beedab-blue mb-1">
                    P{parseFloat(selectedProperty.price || '0').toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-neutral-600 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedProperty.city}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-neutral-600 mb-3">
                    {selectedProperty.bedrooms && (
                      <span className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        {selectedProperty.bedrooms}
                      </span>
                    )}
                    {selectedProperty.bathrooms && (
                      <span className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        {selectedProperty.bathrooms}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handlePropertyClick(selectedProperty)}
                    className="w-full bg-beedab-blue text-white py-2 rounded-lg text-xs font-medium hover:bg-beedab-darkblue transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const PropertyCard = ({ property }: { property: any }) => (
    <motion.div
      layoutId={`property-${property.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200 cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => handlePropertyClick(property)}
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
          <button 
            onClick={(e) => {e.stopPropagation();}}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className="h-4 w-4 text-neutral-600" />
          </button>
          <button 
            onClick={(e) => {e.stopPropagation();}}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
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

        {property.features && (() => {
          let featuresArray;
          try {
            if (typeof property.features === 'string') {
              featuresArray = JSON.parse(property.features);
            } else {
              featuresArray = property.features;
            }
            
            // Ensure it's an array
            if (!Array.isArray(featuresArray)) {
              return null;
            }
            
            return (
              <div className="flex flex-wrap gap-2 mb-4">
                {featuresArray.slice(0, 3).map((feature: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
                {featuresArray.length > 3 && (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                    +{featuresArray.length - 3} more
                  </span>
                )}
              </div>
            );
          } catch (e) {
            return null;
          }
        })()}

        <div className="flex justify-between items-center text-sm text-neutral-500">
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {property.views || 0} views
          </span>
          <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header with AI Search */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Properties</h1>
            <AISearchBar onSearch={handleAISearch} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              {filters.propertyType && (
                <span className="inline-block bg-beedab-blue text-white px-2 py-1 rounded text-sm mr-2 capitalize">
                  {filters.propertyType}
                </span>
              )}
              <span className="text-neutral-600">
                {properties ? `${properties.length} properties found` : 'Loading properties...'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Always visible filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-beedab-blue" />
              Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  <option value="0-300000">Under P300K</option>
                  <option value="300000-500000">P300K - P500K</option>
                  <option value="500000-750000">P500K - P750K</option>
                  <option value="750000-1000000">P750K - P1M</option>
                  <option value="1000000-">Over P1M</option>
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
                  <option value="condo">Condo</option>
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">District</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value || undefined }))}
                  value={filters.state || ''}
                >
                  <option value="">All Districts</option>
                  <option value="South-East">South-East</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="Central">Central</option>
                  <option value="Kweneng">Kweneng</option>
                  <option value="Southern">Southern</option>
                  <option value="Kgatleng">Kgatleng</option>
                  <option value="Kgalagadi">Kgalagadi</option>
                  <option value="Chobe">Chobe</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <MapSection />

        {/* Content */}
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