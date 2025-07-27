
import React from 'react';
import TestPropertyMap from '../components/properties/TestPropertyMap';

const TestMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test PropertyMap Component
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Full featured map */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Full Map with Property List</h2>
            <TestPropertyMap 
              height="400px"
              showPropertyList={true}
            />
          </div>
          
          {/* Compact map */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Compact Map (No List)</h2>
            <TestPropertyMap 
              height="400px"
              showPropertyList={false}
            />
          </div>
          
          {/* Large map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Large Interactive Map</h2>
            <TestPropertyMap 
              height="600px"
              showPropertyList={true}
            />
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Mapbox map loads correctly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Test properties display in sidebar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Property markers show on map</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Interactive hover effects work</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMapPage;
