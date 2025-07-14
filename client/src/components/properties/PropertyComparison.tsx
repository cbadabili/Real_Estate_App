import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bed, Bath, Square, MapPin, Heart, Share2, ExternalLink } from 'lucide-react';

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

interface PropertyComparisonProps {
  properties: Property[];
  onClose: () => void;
  onRemoveProperty: (propertyId: number) => void;
  className?: string;
}

export const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  properties,
  onClose,
  onRemoveProperty,
  className = ''
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    }
    return `P${price.toLocaleString()}`;
  };

  const comparisonFeatures = [
    { key: 'price', label: 'Price', format: (value: number) => formatPrice(value) },
    { key: 'propertyType', label: 'Property Type', format: (value: string) => value },
    { key: 'bedrooms', label: 'Bedrooms', format: (value: number) => `${value} beds` },
    { key: 'bathrooms', label: 'Bathrooms', format: (value: number) => `${value} baths` },
    { key: 'squareFeet', label: 'Square Feet', format: (value: number) => value ? `${value.toLocaleString()} sq ft` : 'N/A' },
    { key: 'location', label: 'Location', format: (value: string) => value }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Property Comparison ({properties.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              Compare up to 4 properties side by side
            </p>
          </div>

          {/* Comparison Content */}
          <div className="p-6 overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 min-w-max">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 min-w-[300px]"
                >
                  {/* Property Header */}
                  <div className="relative mb-4">
                    <div className="h-48 bg-gray-300 rounded-lg overflow-hidden">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">
                            {property.propertyType.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveProperty(property.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {property.title}
                    </h3>

                    <p className="text-2xl font-bold text-beedab-blue">
                      {formatPrice(property.price)}
                    </p>

                    {/* Comparison Features */}
                    {comparisonFeatures.map((feature) => (
                      <div key={feature.key} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">{feature.label}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {feature.format((property as any)[feature.key])}
                        </span>
                      </div>
                    ))}

                    {/* Features */}
                    {property.features && property.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {property.features.slice(0, 4).map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {property.features.length > 4 && (
                            <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                              +{property.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-beedab-blue text-white py-2 px-3 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Comparing {properties.length} of 4 maximum properties
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Close Comparison
                </button>
                <button className="px-4 py-2 bg-beedab-blue text-white rounded-lg text-sm hover:bg-beedab-darkblue transition-colors">
                  Save Comparison
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};