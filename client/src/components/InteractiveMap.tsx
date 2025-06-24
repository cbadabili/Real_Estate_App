import React, { useState } from 'react';
import { MapPin, Navigation, Zoom, ZoomIn, ZoomOut } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  plotCount: number;
  averagePrice: number;
  popularSize: string;
  description: string;
}

interface InteractiveMapProps {
  locations: MapLocation[];
  onLocationClick: (location: MapLocation) => void;
  selectedLocation?: string;
  className?: string;
}

/**
 * Interactive Map Component for Botswana Plot Locations
 * Displays popular locations with clickable pins showing plot data
 * Focused on key areas: Mogoditshane, Manyana, Mahalapye, Pitsane
 * Uses simplified map visualization with plot count and pricing data
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  onLocationClick,
  selectedLocation,
  className = ""
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Botswana approximate bounds
  const mapBounds = {
    north: -17.7,
    south: -26.9,
    east: 29.4,
    west: 19.3
  };

  // Convert lat/lng to map coordinates (simplified projection)
  const projectCoordinates = (lng: number, lat: number) => {
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));

  const getLocationColor = (location: MapLocation) => {
    if (selectedLocation === location.id) return 'bg-beedab-blue border-beedab-darkblue';
    if (hoveredLocation === location.id) return 'bg-blue-500 border-blue-700';
    return 'bg-red-500 border-red-700';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-beedab-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Plot Locations in Botswana</h3>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-green-50 h-96 overflow-hidden">
        {/* Simplified Botswana Map Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-50"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(234, 179, 8, 0.1) 0%, transparent 50%),
              linear-gradient(to bottom right, rgba(168, 85, 247, 0.05) 0%, transparent 100%)
            `,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Country Border Outline */}
          <div className="absolute inset-4 border-2 border-gray-300 rounded-lg opacity-30"></div>
          
          {/* Major Cities Background Markers */}
          <div className="absolute inset-0">
            {/* Gaborone area */}
            <div className="absolute bottom-8 left-8 w-3 h-3 bg-gray-400 rounded-full opacity-50"></div>
            {/* Francistown area */}
            <div className="absolute top-16 right-12 w-2 h-2 bg-gray-400 rounded-full opacity-50"></div>
            {/* Maun area */}
            <div className="absolute top-8 left-16 w-2 h-2 bg-gray-400 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Plot Location Pins */}
        {locations.map((location) => {
          const { x, y } = projectCoordinates(location.coordinates[0], location.coordinates[1]);
          
          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `scale(${zoomLevel}) translate(-50%, -100%)`
              }}
              onClick={() => onLocationClick(location)}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {/* Pin */}
              <div className={`w-6 h-6 rounded-full border-2 ${getLocationColor(location)} shadow-lg flex items-center justify-center`}>
                <MapPin className="h-3 w-3 text-white" />
              </div>
              
              {/* Plot Count Badge */}
              <div className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full px-1 text-xs font-bold text-gray-700 min-w-[20px] text-center">
                {location.plotCount}
              </div>

              {/* Location Tooltip */}
              {(hoveredLocation === location.id || selectedLocation === location.id) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                  <h4 className="font-semibold text-gray-900 mb-1">{location.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{location.plotCount} plots available</p>
                    <p>Avg. price: BWP {location.averagePrice.toLocaleString()}</p>
                    <p>Popular size: {location.popularSize}</p>
                    <p className="text-xs text-gray-500 mt-2">{location.description}</p>
                  </div>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Available Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-beedab-blue rounded-full"></div>
              <span className="text-gray-600">Selected</span>
            </div>
          </div>
          
          <div className="text-gray-500">
            Click on pins to view plot listings
          </div>
        </div>
      </div>

      {/* Location Summary */}
      {selectedLocation && (
        <div className="border-t border-gray-200 p-4 bg-blue-50">
          {(() => {
            const location = locations.find(l => l.id === selectedLocation);
            return location ? (
              <div>
                <h4 className="font-semibold text-beedab-blue mb-2">{location.name}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Plots Available:</span>
                    <br />
                    <span className="font-medium">{location.plotCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Average Price:</span>
                    <br />
                    <span className="font-medium">BWP {location.averagePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Popular Size:</span>
                    <br />
                    <span className="font-medium">{location.popularSize}</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};