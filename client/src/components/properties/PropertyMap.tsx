
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
  latitude?: number;
  longitude?: number;
  address?: string;
  image?: string;
  images?: string;
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

  // Process properties to ensure they have valid coordinates
  const processedProperties = properties.map((property, index) => {
    let coordinates: [number, number] = [0, 0];
    
    if (property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2) {
      coordinates = property.coordinates;
    } else if (property.latitude && property.longitude) {
      coordinates = [property.latitude, property.longitude];
    } else {
      // Generate fallback coordinates around Botswana
      const baseCoords = getBotswanaCoordinates(index);
      coordinates = [baseCoords.lat, baseCoords.lng];
    }
    
    return {
      ...property,
      coordinates
    };
  });

  const validProperties = processedProperties.filter(property => 
    property.coordinates && 
    Array.isArray(property.coordinates) && 
    property.coordinates.length === 2 &&
    !isNaN(property.coordinates[0]) &&
    !isNaN(property.coordinates[1])
  );

  console.log('Valid properties for map:', validProperties.length);

  if (!validProperties || validProperties.length === 0) {
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
          {validProperties.map((property) => {
            const imageUrl = getImageUrl(property.images || property.image);
            
            return (
              <Marker
                key={`property-${property.id}`}
                position={property.coordinates!}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={property.title}
                        className="w-full h-24 object-cover rounded mb-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">{property.location || property.address}</p>
                    <p className="font-bold text-sm text-blue-600 mb-1">
                      P{formatPrice(property.price)}
                    </p>
                    {property.bedrooms && property.bathrooms && (
                      <p className="text-xs text-gray-500 mb-1">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                    )}
                    {property.area && (
                      <p className="text-xs text-gray-500 mb-1">
                        {property.area}m²
                      </p>
                    )}
                    {property.type && (
                      <p className="text-xs text-gray-500 mb-2">
                        {property.type}
                      </p>
                    )}
                    <button className="w-full bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition-colors">
                      View Details
                    </button>
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

// Helper function to generate Botswana coordinates
const getBotswanaCoordinates = (index: number) => {
  const cities = [
    { name: 'Gaborone', lat: -24.6282, lng: 25.9231 },
    { name: 'Francistown', lat: -21.1699, lng: 27.5084 },
    { name: 'Molepolole', lat: -24.4031, lng: 25.4914 },
    { name: 'Serowe', lat: -22.3928, lng: 26.7142 },
    { name: 'Selibe Phikwe', lat: -22.0085, lng: 27.8477 },
    { name: 'Maun', lat: -19.9837, lng: 23.4167 },
    { name: 'Kanye', lat: -24.9833, lng: 25.3333 },
    { name: 'Mochudi', lat: -24.4833, lng: 26.1500 },
    { name: 'Mahalapye', lat: -23.1000, lng: 26.7833 },
    { name: 'Palapye', lat: -22.5503, lng: 27.1253 }
  ];
  
  const city = cities[index % cities.length];
  return {
    lat: city.lat + (Math.random() - 0.5) * 0.01, // Small random offset
    lng: city.lng + (Math.random() - 0.5) * 0.01
  };
};

// Helper function to get image URL
const getImageUrl = (images: any): string => {
  if (!images) return '';
  
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] : images;
    } catch {
      return images;
    }
  }
  
  if (Array.isArray(images)) {
    return images[0] || '';
  }
  
  return '';
};

// Helper function to format price
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseInt(price) : price;
  return numPrice.toLocaleString();
};

export { PropertyMap };
