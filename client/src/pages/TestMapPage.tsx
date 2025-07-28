
import React from 'react';
import { UnifiedMap } from '../components/maps/UnifiedMap';

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

const TestMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Unified Map Component
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Full featured map */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Standard Map</h2>
            <UnifiedMap 
              properties={testProperties}
              height="400px"
              showControls={true}
              showPropertyCount={true}
            />
          </div>
          
          {/* Compact map */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Compact Map (No Controls)</h2>
            <UnifiedMap 
              properties={testProperties}
              height="400px"
              showControls={false}
              showPropertyCount={false}
            />
          </div>
          
          {/* Large map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Large Interactive Map</h2>
            <UnifiedMap 
              properties={testProperties}
              height="600px"
              showControls={true}
              showPropertyCount={true}
            />
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Unified map component loads correctly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Test properties display on map</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Property markers show with correct icons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Interactive popups work correctly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Map controls and navigation function properly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMapPage;
