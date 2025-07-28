import React from 'react';
import { UnifiedMap } from '../maps/UnifiedMap';

interface TestPropertyMapProps {
  height?: string;
  showPropertyList?: boolean;
}

const testProperties = [
  {
    id: 1,
    title: 'Modern Family Home',
    latitude: -24.6282,
    longitude: 25.9231,
    price: 850000,
    propertyType: 'house',
    address: 'Gaborone CBD',
    bedrooms: 4,
    bathrooms: 3,
    description: 'Beautiful family home in prime location'
  },
  {
    id: 2,
    title: 'Executive Apartment',
    latitude: -24.6400,
    longitude: 25.9100,
    price: 450000,
    propertyType: 'apartment',
    address: 'Main Mall Area',
    bedrooms: 2,
    bathrooms: 2,
    description: 'Luxury apartment with city views'
  },
  {
    id: 3,
    title: 'Investment Plot',
    latitude: -24.6150,
    longitude: 25.9350,
    price: 250000,
    propertyType: 'land',
    address: 'Gaborone West',
    bedrooms: 0,
    bathrooms: 0,
    description: 'Prime residential plot ready for development'
  }
];

const TestPropertyMap: React.FC<TestPropertyMapProps> = ({ 
  height = '500px',
  showPropertyList = false 
}) => {
  return (
    <div className="space-y-4">
      <UnifiedMap
        properties={testProperties}
        height={height}
        showControls={true}
        showPropertyCount={true}
      />

      {showPropertyList && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Test Properties</h3>
          <div className="space-y-2">
            {testProperties.map(property => (
              <div key={property.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{property.title}</h4>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                  <span className="text-green-600 font-semibold">
                    P{property.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPropertyMap;