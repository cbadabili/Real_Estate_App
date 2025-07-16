
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'wouter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Property {
  id: number;
  title: string;
  price: number;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  address?: string;
  city?: string;
  propertyType?: string;
  description?: string;
  images?: string | string[];
  squareFeet?: number;
  features?: string | string[];
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

export function PropertyMap({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  className 
}: PropertyMapProps) {
  // Botswana center coordinates
  const center: [number, number] = [-24.6282, 25.9231]; // Gaborone
  const zoom = 12;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyCoordinates = (property: Property): [number, number] => {
    // Use provided coordinates or generate random ones around Botswana cities
    if (property.latitude && property.longitude) {
      return [property.latitude, property.longitude];
    }

    // Generate coordinates based on city or use default Gaborone area
    const cities = {
      'Gaborone': [-24.6282, 25.9231],
      'Francistown': [-21.1670, 27.5084],
      'Maun': [-20.0028, 23.4162],
      'Kasane': [-17.8145, 25.1557],
      'Lobatse': [-25.2227, 25.6849]
    };

    const cityName = property.city || 'Gaborone';
    const baseCoords = cities[cityName as keyof typeof cities] || cities['Gaborone'];
    
    // Add small random offset to avoid overlapping markers
    return [
      baseCoords[0] + (Math.random() - 0.5) * 0.1,
      baseCoords[1] + (Math.random() - 0.5) * 0.1
    ];
  };

  const getPropertyImage = (property: Property): string => {
    if (property.images) {
      const images = typeof property.images === 'string' 
        ? JSON.parse(property.images) 
        : property.images;
      return Array.isArray(images) && images.length > 0 
        ? images[0] 
        : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  return (
    <div className={`${className || 'h-96'}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property) => {
          const coordinates = getPropertyCoordinates(property);
          
          return (
            <Marker
              key={property.id}
              position={coordinates}
              eventHandlers={{
                click: () => {
                  if (onPropertySelect) {
                    onPropertySelect(property);
                  }
                }
              }}
            >
              <Popup maxWidth={350} className="property-popup">
                <div className="p-3 max-w-sm">
                  {/* Property Image */}
                  <img 
                    src={getPropertyImage(property)}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  
                  {/* Property Title */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  {/* Price */}
                  <p className="text-blue-600 font-bold text-xl mb-3">
                    {formatPrice(property.price || 0)}
                  </p>
                  
                  {/* Property Details */}
                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <p className="flex items-center">
                      📍 {property.address || property.location || 'Location not specified'}, {property.city || 'Gaborone'}
                    </p>
                    
                    {(property.bedrooms || property.bathrooms) && (
                      <p>
                        {property.bedrooms && `🛏️ ${property.bedrooms} bed`}
                        {property.bedrooms && property.bathrooms && ' • '}
                        {property.bathrooms && `🚿 ${property.bathrooms} bath`}
                      </p>
                    )}
                    
                    {property.propertyType && (
                      <p>🏠 {property.propertyType}</p>
                    )}
                    
                    {property.squareFeet && (
                      <p>📐 {property.squareFeet.toLocaleString()} sqm</p>
                    )}
                  </div>

                  {/* Features */}
                  {property.features && (() => {
                    try {
                      const features = typeof property.features === 'string' 
                        ? JSON.parse(property.features) 
                        : property.features;
                      
                      if (Array.isArray(features) && features.length > 0) {
                        return (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {features.slice(0, 3).map((feature: string, index: number) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                              {features.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  +{features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      return null;
                    }
                    return null;
                  })()}

                  {/* Description */}
                  {property.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/property/${property.id}`}
                      className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm text-center hover:bg-blue-700 transition-colors"
                    >
                      View Full Details
                    </Link>
                    
                    <button 
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add contact functionality here
                        alert('Contact functionality will be implemented');
                      }}
                    >
                      Contact Agent
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
