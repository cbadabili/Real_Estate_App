import React from 'react';
import { UnifiedMap } from './maps/UnifiedMap';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  coordinates: [number, number];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
}

interface InteractiveMapProps {
  properties?: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const sampleProperties: Property[] = [
  {
    id: 1,
    title: "Modern Family Home",
    price: 850000,
    location: "Gaborone, South East",
    coordinates: [25.9231, -24.6282],
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "house"
  },
  {
    id: 2,
    title: "Executive Apartment",
    price: 450000,
    location: "Francistown, North East",
    coordinates: [27.5084, -21.1670],
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: "apartment"
  },
  {
    id: 3,
    title: "Luxury Villa",
    price: 1200000,
    location: "Maun, North West",
    coordinates: [23.4162, -20.0028],
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "house"
  }
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  properties = sampleProperties, 
  center = [24.6849, -22.3285],
  zoom = 6,
  height = "400px"
}) => {
  // Convert properties to unified format
  const unifiedProperties = properties.map(prop => ({
    id: prop.id,
    title: prop.title,
    price: prop.price,
    latitude: prop.coordinates[1], // lat is second in coordinates array
    longitude: prop.coordinates[0], // lng is first in coordinates array
    propertyType: prop.type,
    address: prop.location,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    description: `${prop.area}m² ${prop.type} in ${prop.location}`
  }));

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Interactive Map</h2>
            <p className="text-blue-100 text-sm">Explore properties across Botswana</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Interactive mapping with Mapbox integration</p>
          <p className="text-xs text-gray-500">Click on any property marker to see details</p>
        </div>

        <UnifiedMap
          properties={unifiedProperties}
          height={height}
          initialCenter={center}
          initialZoom={zoom}
          showControls={true}
          showPropertyCount={true}
        />
      </div>
    </div>
  );
};

export default InteractiveMap;
export { InteractiveMap };