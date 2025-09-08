
import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';

interface Property {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  price?: number;
  area?: number;
}

const TestMapPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties?status=active');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched properties:', data);

        // Transform the data to match our interface
        const transformedProperties = data.map((property: any) => ({
          id: property.id.toString(),
          name: property.title || property.name || 'Untitled Property',
          latitude: parseFloat(property.latitude) || 0,
          longitude: parseFloat(property.longitude) || 0,
          type: property.property_type || property.type || 'unknown',
          price: property.price,
          area: property.area
        }));

        setProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Use test data if API fails
        setProperties([
          {
            id: '1',
            name: 'CBD Office Building',
            latitude: -24.6282,
            longitude: 25.9231,
            type: 'commercial',
            price: 2500000,
            area: 450
          },
          {
            id: '2', 
            name: 'Gaborone West Plot',
            latitude: -24.6540,
            longitude: 25.8920,
            type: 'land',
            price: 850000,
            area: 1200
          },
          {
            id: '3',
            name: 'Extension 10 House',
            latitude: -24.6100,
            longitude: 25.9500,
            type: 'residential',
            price: 1200000,
            area: 350
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Map Page</h1>
          <p className="text-gray-600">Interactive map testing with {properties.length} properties</p>
          
          {selectedProperty && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold text-lg">{selectedProperty.name}</h3>
              <p className="text-gray-600">Type: {selectedProperty.type}</p>
              {selectedProperty.price && (
                <p className="text-gray-600">Price: BWP {selectedProperty.price.toLocaleString()}</p>
              )}
              {selectedProperty.area && (
                <p className="text-gray-600">Area: {selectedProperty.area} m²</p>
              )}
              <p className="text-sm text-gray-500">
                Coordinates: {selectedProperty.latitude}, {selectedProperty.longitude}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <InteractiveMap
            locations={properties}
            onLocationClick={handlePropertyClick}
            selectedLocation={selectedProperty}
            height="600px"
            className="w-full"
          />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Properties ({properties.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`p-4 bg-white rounded-lg shadow cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <h3 className="font-semibold">{property.name}</h3>
                <p className="text-sm text-gray-600">Type: {property.type}</p>
                {property.price && (
                  <p className="text-sm text-gray-600">BWP {property.price.toLocaleString()}</p>
                )}
                <p className="text-xs text-gray-500">
                  {property.latitude}, {property.longitude}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMapPage;
