
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Home, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  image?: string;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: string;
  onPropertySelect?: (propertyId: string) => void;
  className?: string;
}

// Popular Botswana locations with coordinates
const botswanaLocations = [
  { name: 'Gaborone', coordinates: [-24.6282, 25.9231], count: 0 },
  { name: 'Francistown', coordinates: [-21.1700, 27.5100], count: 0 },
  { name: 'Molepolole', coordinates: [-24.4167, 25.4833], count: 0 },
  { name: 'Serowe', coordinates: [-22.3833, 26.7167], count: 0 },
  { name: 'Selibe-Phikwe', coordinates: [-22.0167, 27.8667], count: 0 },
  { name: 'Maun', coordinates: [-19.9833, 23.4167], count: 0 },
  { name: 'Kanye', coordinates: [-24.9833, 25.3500], count: 0 },
  { name: 'Mochudi', coordinates: [-24.4333, 26.1500], count: 0 },
  { name: 'Mahalapye', coordinates: [-23.1000, 26.7833], count: 0 },
  { name: 'Lobatse', coordinates: [-25.2333, 25.6833], count: 0 },
];

// Create custom icons for different property types
const createPropertyIcon = (type: string, isSelected: boolean = false) => {
  const colors = {
    house: '#10b981',
    apartment: '#3b82f6', 
    plot: '#f59e0b',
    commercial: '#8b5cf6',
    default: '#6b7280'
  };
  
  const color = colors[type.toLowerCase() as keyof typeof colors] || colors.default;
  const size = isSelected ? 35 : 25;
  
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        🏠
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  className = ""
}) => {
  const [mapCenter] = useState<[number, number]>([-22.3285, 24.6849]); // Botswana center
  
  // Count properties by location
  const locationsWithCounts = botswanaLocations.map(location => {
    const count = properties.filter(property => 
      property.location.toLowerCase().includes(location.name.toLowerCase())
    ).length;
    return { ...location, count };
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-beedab-blue" />
        Properties Map - Botswana
      </h3>
      
      {/* Real map with Leaflet */}
      <div className="relative rounded-lg overflow-hidden h-96">
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Property markers */}
          {properties.map((property) => {
            const isSelected = selectedProperty === property.id;
            
            return (
              <Marker
                key={property.id}
                position={property.coordinates}
                icon={createPropertyIcon(property.type, isSelected)}
                eventHandlers={{
                  click: () => onPropertySelect?.(property.id),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    {property.image && (
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.location}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <strong>BWP {property.price.toLocaleString()}</strong>
                      </p>
                      {property.bedrooms && (
                        <p>{property.bedrooms} bed • {property.bathrooms} bath</p>
                      )}
                      {property.size && <p>{property.size}</p>}
                      <p className="text-xs text-gray-500 capitalize">{property.type}</p>
                    </div>
                    <button
                      onClick={() => onPropertySelect?.(property.id)}
                      className="mt-3 w-full bg-beedab-blue text-white py-2 px-3 rounded text-sm hover:bg-beedab-darkblue transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Location markers for areas with property counts */}
          {locationsWithCounts.filter(loc => loc.count > 0).map((location) => (
            <Marker
              key={`location-${location.name}`}
              position={location.coordinates}
              icon={L.divIcon({
                className: 'location-count-marker',
                html: `
                  <div style="
                    background-color: rgba(59, 130, 246, 0.9);
                    color: white;
                    border-radius: 15px;
                    padding: 4px 8px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  ">
                    ${location.count}
                  </div>
                `,
                iconSize: [30, 20],
                iconAnchor: [15, 10],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold">{location.name}</h4>
                  <p className="text-sm text-gray-600">{location.count} properties available</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Property type legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Houses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Apartments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Plots</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Commercial</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <motion.div 
          className="bg-gray-50 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-beedab-blue">{properties.length}</div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </motion.div>
        <motion.div 
          className="bg-gray-50 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-green-600">
            {locationsWithCounts.filter(loc => loc.count > 0).length}
          </div>
          <div className="text-sm text-gray-600">Active Locations</div>
        </motion.div>
        <motion.div 
          className="bg-gray-50 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-orange-600">
            BWP {properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString() : 0}
          </div>
          <div className="text-sm text-gray-600">Avg. Price</div>
        </motion.div>
        <motion.div 
          className="bg-gray-50 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-purple-600">
            {new Set(properties.map(p => p.type)).size}
          </div>
          <div className="text-sm text-gray-600">Property Types</div>
        </motion.div>
      </div>
    </div>
  );
};
