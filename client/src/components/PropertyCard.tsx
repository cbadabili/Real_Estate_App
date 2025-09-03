import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Share2, Plus, Check } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  imageUrl?: string;
  features?: string[];
}

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list' | 'map';
  onAddToComparison?: () => void;
  isInComparison?: boolean;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  viewMode = 'grid',
  onAddToComparison,
  isInComparison = false,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    }
    return `P${price.toLocaleString()}`;
  };

  const cardContent = (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-48'} bg-gray-300`}>
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {property.propertyType.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-beedab-blue text-white text-xs px-2 py-1 rounded-full capitalize">
            {property.propertyType}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
          {onAddToComparison && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToComparison();
              }}
              className={`p-2 rounded-full transition-colors ${
                isInComparison
                  ? 'bg-green-500 text-white'
                  : 'bg-white bg-opacity-90 hover:bg-opacity-100'
              }`}
            >
              {isInComparison ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-2xl font-bold text-beedab-blue mb-2">
          {formatPrice(property.price)}
        </p>

        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>

        {/* Property details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath
          </span>
          {property.squareFeet && (
            <span className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.squareFeet.toLocaleString()} sq ft
            </span>
          )}
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
            {Array.isArray(property.features) && property.features.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <button 
          onClick={() => navigate(`/property/${property.id}`)}
          className="w-full bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  if (viewMode === 'list' || viewMode === 'map') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex"
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
};