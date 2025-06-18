import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  List, 
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Eye
} from 'lucide-react';
import { sampleProperties } from '../data/sampleData';

const MapSearchPage = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any'
  });

  const mapProperties = sampleProperties.slice(0, 8);

  const PropertyMarker = ({ property, index }: { property: any, index: number }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        selectedProperty === property.id ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${20 + (index % 4) * 20}%`,
        top: `${30 + Math.floor(index / 4) * 25}%`
      }}
      onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
    >
      <div className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        selectedProperty === property.id 
          ? 'border-beedab-blue scale-110' 
          : 'border-transparent hover:border-beedab-lightblue hover:scale-105'
      }`}>
        <div className="px-3 py-2">
          <div className="text-sm font-semibold text-neutral-900">
            P{property.price.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-600">
            {property.bedrooms}bd • {property.bathrooms}ba
          </div>
        </div>
        <div className="w-3 h-3 absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-45 bg-white border-r border-b border-beedab-blue"></div>
      </div>
    </motion.div>
  );

  const PropertyCard = ({ property }: { property: any }) => (
    <motion.div
      layoutId={`property-${property.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200"
    >
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.listingType === 'fsbo' 
              ? 'bg-accent-100 text-accent-800' 
              : 'bg-beedab-lightblue text-beedab-darkblue'
          }`}>
            {property.listingType.toUpperCase()}
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
              {property.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-beedab-darkblue">
              P{property.price.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-500">
              P{property.pricePerSqft}/sqft
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-neutral-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-neutral-500">
            <Eye className="h-4 w-4 mr-1" />
            {property.views} views
          </div>
          <button className="px-4 py-2 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by location in Botswana (Gaborone, Francistown, Maun...)..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors">
                <Filter className="h-5 w-5 mr-2 text-neutral-600" />
                Filters
              </button>
              
              <div className="flex border border-neutral-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-3 flex items-center transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-beedab-blue text-white' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <MapIcon className="h-5 w-5 mr-2" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 flex items-center transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-beedab-blue text-white' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <List className="h-5 w-5 mr-2" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="flex-1 relative">
            {/* Mock Map of Botswana */}
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-12 grid-rows-8 h-full">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="border border-neutral-300"></div>
                  ))}
                </div>
              </div>
              
              {/* Botswana Map Outline Simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-beedab-darkblue rounded-lg bg-green-50/50 flex items-center justify-center">
                  <span className="text-beedab-darkblue font-bold text-lg">BOTSWANA</span>
                </div>
              </div>
              
              {/* Property Markers */}
              {mapProperties.map((property, index) => (
                <PropertyMarker key={property.id} property={property} index={index} />
              ))}
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <button className="bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-all">
                  <span className="text-xl font-bold">+</span>
                </button>
                <button className="bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-all">
                  <span className="text-xl font-bold">−</span>
                </button>
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-beedab-blue rounded mr-2"></div>
                    <span>For Sale</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-accent-500 rounded mr-2"></div>
                    <span>FSBO</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success-500 rounded mr-2"></div>
                    <span>New Listing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex-1 p-6">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mapProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Property Details Sidebar */}
        {selectedProperty && viewMode === 'map' && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 bg-white border-l border-neutral-200 overflow-y-auto"
          >
            {(() => {
              const property = mapProperties.find(p => p.id === selectedProperty);
              return property ? (
                <div className="p-6">
                  <div className="relative mb-6">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900">{property.title}</h3>
                      <p className="text-neutral-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </p>
                    </div>
                    
                    <div className="text-2xl font-bold text-beedab-darkblue">
                      P{property.price.toLocaleString()}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-neutral-200">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900">{property.bedrooms}</div>
                        <div className="text-xs text-neutral-600">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900">{property.bathrooms}</div>
                        <div className="text-xs text-neutral-600">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900">{property.sqft.toLocaleString()}</div>
                        <div className="text-xs text-neutral-600">Sq Ft</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors">
                        Schedule Tour
                      </button>
                      <button className="w-full py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors">
                        Contact Agent
                      </button>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MapSearchPage;