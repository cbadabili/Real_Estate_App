import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home } from 'lucide-react';

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
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property | null) => void;
  className?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  className = ''
}) => {
  const botswanaLocations = [
    { name: 'Gaborone', lat: -24.6282, lng: 25.9231, count: 0 },
    { name: 'Francistown', lat: -21.1673, lng: 27.5108, count: 0 },
    { name: 'Molepolole', lat: -24.4067, lng: 25.4956, count: 0 },
    { name: 'Kanye', lat: -24.9833, lng: 25.3333, count: 0 },
    { name: 'Serowe', lat: -22.3925, lng: 26.7106, count: 0 },
    { name: 'Mahalapye', lat: -23.1042, lng: 26.8381, count: 0 },
    { name: 'Mogoditshane', lat: -24.6333, lng: 25.8667, count: 0 },
    { name: 'Mochudi', lat: -24.4333, lng: 26.1500, count: 0 },
    { name: 'Maun', lat: -19.9833, lng: 23.4167, count: 0 },
    { name: 'Lobatse', lat: -25.2167, lng: 25.6833, count: 0 }
  ];

  // Count properties by location
  const locationsWithCounts = botswanaLocations.map(location => ({
    ...location,
    count: properties.filter(p => 
      p.location.toLowerCase().includes(location.name.toLowerCase())
    ).length
  }));

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    }
    return `P${price.toLocaleString()}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-beedab-blue" />
        Properties Map - Botswana
      </h3>
      
      {/* Simplified map representation */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 min-h-[400px]">
        {/* Map background */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 opacity-30"></div>
        
        {/* Location markers */}
        <div className="relative z-10">
          {locationsWithCounts.map((location, index) => (
            <motion.div
              key={location.name}
              className="absolute cursor-pointer group"
              style={{
                left: `${((location.lng + 28) / 8) * 100}%`,
                top: `${((25 - location.lat) / 10) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.2 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Location marker */}
              <div className={`
                relative w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg
                ${location.count > 0 
                  ? 'bg-beedab-blue text-white' 
                  : 'bg-gray-300 text-gray-600'
                }
              `}>
                <span className="text-xs font-bold">{location.count}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {location.name}: {location.count} properties
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-beedab-blue rounded-full mr-2"></div>
              <span>Available properties</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span>No properties</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property list for selected location */}
      {properties.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Properties ({properties.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {properties.slice(0, 8).map((property) => (
              <motion.div
                key={property.id}
                className={`
                  p-3 border rounded-lg cursor-pointer transition-all
                  ${selectedProperty?.id === property.id
                    ? 'border-beedab-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => onPropertySelect?.(property)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Home className="h-8 w-8 text-beedab-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-900 truncate">
                      {property.title}
                    </h5>
                    <p className="text-sm text-gray-600 truncate">
                      {property.location}
                    </p>
                    <p className="text-sm font-bold text-beedab-blue">
                      {formatPrice(property.price)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span className="capitalize">{property.propertyType}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {properties.length > 8 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Showing 8 of {properties.length} properties
            </p>
          )}
        </div>
      )}
    </div>
  );
};