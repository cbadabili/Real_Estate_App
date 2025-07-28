import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Property {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  propertyType: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  views?: number;
}

interface PropertyMapProps {
  properties: Property[];
  height?: string;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  height = '400px', 
  className = '' 
}) => {
  // Filter properties with valid coordinates
  const validProperties = properties.filter(property => 
    property.latitude && 
    property.longitude && 
    !isNaN(property.latitude) && 
    !isNaN(property.longitude) &&
    property.latitude !== 0 &&
    property.longitude !== 0
  );

  // Default center (Gaborone, Botswana)
  const center: [number, number] = validProperties.length > 0 
    ? [validProperties[0].latitude, validProperties[0].longitude]
    : [-24.6282, 25.9231];

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('Mapbox access token not found. Map will use OpenStreetMap tiles.');
  }

  return (
    <div className={`${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
          >
            <Popup maxWidth={300} className="property-popup">
              <div className="space-y-3 p-2">
                {/* Header */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-beedab-darkblue">
                  P{property.price?.toLocaleString()}
                </div>

                {/* Property Details */}
                {(property.bedrooms || property.bathrooms || property.squareFeet) && (
                  <div className="flex items-center space-x-4 text-gray-600 text-sm">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                    )}
                    {property.squareFeet && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.squareFeet.toLocaleString()} sqm</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Property Type & Views */}
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                    {property.propertyType}
                  </span>
                  {property.views && (
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {property.views} views
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to={`/properties/${property.id}`}
                    className="block w-full bg-beedab-blue hover:bg-beedab-darkblue text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;