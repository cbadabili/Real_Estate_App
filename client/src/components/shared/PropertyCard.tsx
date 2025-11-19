
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Share2, Plus, Check, Building2 } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location?: string;
  address?: string;
  city?: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  imageUrl?: string;
  images?: string[];
  features?: string[];
  isSaved?: boolean;
}

interface PropertyCardProps {
  property: Property;
  onSave?: (id: number) => void;
  onShare?: (property: Property) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSave,
  onShare,
  variant = 'default',
  showActions = true
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const displayLocation = property.location || property.address || 
    (property.city ? `${property.city}` : 'Location not specified');

  const mainImage = property.imageUrl || (property.images && property.images[0]) || null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-24 h-24 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-beedab-blue/40" />
            </div>
          )}
          <div className="flex-1 p-3">
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{property.title}</h3>
            <p className="text-lg font-bold text-beedab-blue mb-1">{formatPrice(property.price)}</p>
            <p className="text-xs text-gray-600">{displayLocation}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <Building2 className="h-20 w-20 text-beedab-blue/40" />
          </div>
        )}
        {showActions && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(property.id);
              }}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              {property.isSaved ? (
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              ) : (
                <Heart className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(property);
              }}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-sm font-medium text-beedab-blue">
          {property.propertyType}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{displayLocation}</span>
        </div>
        
        <p className="text-2xl font-bold text-beedab-blue mb-4">{formatPrice(property.price)}</p>
        
        {(property.bedrooms || property.bathrooms || property.squareFeet) && (
          <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.squareFeet} sqm</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;
