
import React from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  Camera
} from 'lucide-react';

interface PropertyCardProps {
  property: any;
  viewMode?: 'grid' | 'list';
  onAddToComparison?: () => void;
  isInComparison?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  viewMode = 'grid',
  onAddToComparison,
  isInComparison = false
}) => {
  const isListView = viewMode === 'list';

  let imageUrls = [];
  try {
    if (property.images) {
      // Handle both string and array formats
      if (typeof property.images === 'string') {
        imageUrls = JSON.parse(property.images);
      } else if (Array.isArray(property.images)) {
        imageUrls = property.images;
      }
    }
  } catch (error) {
    console.warn('Failed to parse property images:', error);
    imageUrls = [];
  }
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : '/placeholder-property.jpg';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200 ${
        isListView ? 'flex' : ''
      }`}
    >
      <div className={`relative ${isListView ? 'w-1/3' : ''}`}>
        <img 
          src={mainImage} 
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
          {onAddToComparison && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onAddToComparison}
              className={`p-2 backdrop-blur-sm rounded-full transition-all shadow-sm ${
                isInComparison 
                  ? 'bg-beedab-blue text-white' 
                  : 'bg-white/90 hover:bg-white text-neutral-600'
              }`}
              title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
            >
              <TrendingUp className="h-4 w-4" />
            </motion.button>
          )}
          {/* Professional Photography Option for Property Owners */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open('/services?category=photography', '_blank');
            }}
            className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full hover:bg-blue-600 transition-colors"
            title="Book Professional Photography"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
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
                  to={`/properties/${property.id}`}
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
                </div>
              </div>
            )}
          </div>

          {/* List View Price and Actions */}
          {isListView && (
            <div className="text-right">
              <div className="text-2xl font-bold text-beedab-darkblue mb-2">
                P{parseFloat(property.price || 0).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-500 mb-4">
                P{Math.round(parseFloat(property.price || 0) / (property.squareFeet || 1))}/sqm
              </div>
              <Link
                to={`/properties/${property.id}`}
                className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </div>
          )}
        </div>

        {/* Grid View Actions */}
        {!isListView && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <Calendar className="h-4 w-4" />
              <span>Listed 2 days ago</span>
            </div>
            <Link
              to={`/properties/${property.id}`}
              className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors text-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;
