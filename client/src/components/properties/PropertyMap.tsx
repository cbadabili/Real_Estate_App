
import React from 'react';
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
  center = [-22.3285, 24.6849], // Center of Botswana
  zoom = 6,
  height = "400px"
}) => {
  // Filter properties that have coordinates
  const mappableProperties = properties.filter(p => p.coordinates);

  // If no properties have coordinates, add sample coordinates
  const propertiesWithCoords = mappableProperties.length > 0 ? mappableProperties : properties.map((property, index) => ({
    ...property,
    coordinates: [
      -24.6282 + (index * 0.1), // Gaborone area with slight offset
      25.9231 + (index * 0.1)
    ] as [number, number]
  }));

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates!}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <p className="text-blue-600 font-semibold mb-1">
                  P{property.price.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                {property.bedrooms && property.bathrooms && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                    </div>
                    <div>
                      <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                    </div>
                    {property.area && (
                      <div>
                        <span className="font-medium">Area:</span> {property.area}m²
                      </div>
                    )}
                    {property.type && (
                      <div>
                        <span className="font-medium">Type:</span> {property.type}
                      </div>
                    )}
                  </div>
                )}
                <button className="mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600">
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
