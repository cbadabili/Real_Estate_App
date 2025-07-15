import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  coordinates?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
}

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  center = [-22.3285, 24.6849], // Botswana center
  zoom = 6,
  height = "400px"
}) => {
  useEffect(() => {
    console.log('PropertyMap rendered with properties:', properties.length);
  }, [properties]);

  if (!properties || properties.length === 0) {
    return (
      <div 
        style={{ height, width: '100%' }} 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-2">No properties to display on map</p>
          <p className="text-sm text-gray-500">Properties will appear here when available</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div style={{ height, width: '100%' }} className="relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {properties.map((property) => {
            if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
              console.warn('Invalid coordinates for property:', property.id, property.coordinates);
              return null;
            }

            return (
              <Marker
                key={`property-${property.id}`}
                position={property.coordinates}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">{property.location}</p>
                    <p className="font-bold text-sm text-blue-600 mb-1">
                      P{typeof property.price === 'string' ? parseInt(property.price).toLocaleString() : property.price.toLocaleString()}
                    </p>
                    {property.bedrooms && property.bathrooms && (
                      <p className="text-xs text-gray-500">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Error rendering map:', error);
    return (
      <div 
        style={{ height, width: '100%' }} 
        className="flex items-center justify-center bg-red-50 border border-red-300 rounded"
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading map</p>
          <p className="text-sm text-red-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
};

export { PropertyMap };