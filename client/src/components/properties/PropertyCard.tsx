import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface PropertyCardProps {
  property: any;
  viewMode?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  const isListView = viewMode === 'list';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200 ${
        isListView ? 'flex' : ''
      }`}
    >
      <div className={`relative ${isListView ? 'w-1/3' : ''}`}>
        <img 
          src={property.images ? (typeof property.images === 'string' ? JSON.parse(property.images)[0] : property.images[0]) : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'} 
          alt={property.title}
          className={`object-cover ${isListView ? 'w-full h-full' : 'w-full h-48'}`}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.listingType === 'owner' 
              ? 'bg-accent-100 text-accent-800' 
              : property.status === 'new'
              ? 'bg-success-100 text-success-800'
              : 'bg-beedab-lightblue text-beedab-darkblue'
          }`}>
            {property.status === 'new' ? 'New Listing' : (property.listingType === 'owner' ? 'OWNER' : 'AGENT')}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm"
          >
            <Heart className="h-4 w-4 text-neutral-600 hover:text-error-500" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm"
          >
            <Share2 className="h-4 w-4 text-neutral-600" />
          </motion.button>
        </div>
        
        {/* Image Count Indicator */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {property.images ? (typeof property.images === 'string' ? JSON.parse(property.images).length : property.images.length) : 1} photos
        </div>
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className={`${isListView ? 'flex justify-between h-full' : ''}`}>
          <div className={`${isListView ? 'flex-1 pr-6' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link 
                  to={`/property/${property.id}`}
                  className="block hover:text-beedab-darkblue transition-colors"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1 line-clamp-2">
                    {property.title}
                  </h3>
                </Link>
                <p className="text-neutral-600 flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  {property.location || `${property.city}, ${property.state}`}
                </p>
              </div>
              {!isListView && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-beedab-darkblue">
                    P{parseFloat(property.price || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500">
                    P{Math.round(parseFloat(property.price || 0) / (property.squareFeet || 1))}/sqm
                  </div>
                </div>
              )}
            </div>
            
            {/* Property Details */}
            <div className="flex items-center space-x-4 text-neutral-600 mb-4">
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
                <span className="text-sm">{(property.squareFeet || 0).toLocaleString()} sqm</span>
              </div>
            </div>
            
            {/* Features */}
            {property.features && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {(typeof property.features === 'string' ? JSON.parse(property.features) : property.features).slice(0, 3).map((feature: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {(typeof property.features === 'string' ? JSON.parse(property.features) : property.features).length > 3 && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                      +{(typeof property.features === 'string' ? JSON.parse(property.features) : property.features).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Bottom Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {property.views || 0} views
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Listed {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              
              {!isListView && (
                <Link
                  to={`/property/${property.id}`}
                  className="px-4 py-2 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
          
          {/* List View Price */}
          {isListView && (
            <div className="text-right flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-beedab-darkblue">
                  P{parseFloat(property.price || 0).toLocaleString()}
                </div>
                <div className="text-sm text-neutral-500">
                  P{Math.round(parseFloat(property.price || 0) / (property.squareFeet || 1))}/sqm
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  to={`/property/${property.id}`}
                  className="block px-6 py-2 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg text-sm font-medium transition-colors text-center"
                >
                  View Details
                </Link>
                <button className="block w-full px-6 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-sm font-medium transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;