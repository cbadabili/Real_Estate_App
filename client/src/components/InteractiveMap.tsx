
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Zoom, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
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

// Custom marker icons
const createCustomIcon = (color: string, isSelected: boolean = false) => {
  const size = isSelected ? 35 : 25;
  return L.divIcon({
    className: 'custom-marker',
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
        font-size: ${isSelected ? '14px' : '12px'};
      ">
        ${isSelected ? '📍' : '●'}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Map controller component for programmatic control
const MapController: React.FC<{ 
  center: [number, number]; 
  zoom: number;
  onMapReady: (map: L.Map) => void;
}> = ({ center, zoom, onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
    onMapReady(map);
  }, [center, zoom, map, onMapReady]);
  
  return null;
};

/**
 * Enhanced Interactive Map Component with Real World Mapping
 * Features real map tiles, Botswana focus, and property location visualization
 * Uses Leaflet for accurate geographical representation
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  onLocationClick,
  selectedLocation,
  className = ""
}) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'terrain'>('street');
  const [zoom, setZoom] = useState(6);
  
  // Botswana center coordinates
  const botswanaCenter: [number, number] = [-22.3285, 24.6849];
  
  // Map tile providers
  const tileProviders = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  };

  const handleZoomIn = () => {
    if (mapInstance && zoom < 18) {
      const newZoom = zoom + 1;
      setZoom(newZoom);
      mapInstance.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance && zoom > 2) {
      const newZoom = zoom - 1;
      setZoom(newZoom);
      mapInstance.setZoom(newZoom);
    }
  };

  const handleStyleChange = (style: 'street' | 'satellite' | 'terrain') => {
    setMapStyle(style);
  };

  const focusOnBotswana = () => {
    if (mapInstance) {
      mapInstance.setView(botswanaCenter, 6);
      setZoom(6);
    }
  };

  const getMarkerColor = (location: MapLocation) => {
    if (selectedLocation === location.id) return '#1e40af'; // Blue
    if (location.plotCount > 20) return '#dc2626'; // Red for high availability
    if (location.plotCount > 10) return '#f59e0b'; // Orange for medium availability
    return '#10b981'; // Green for low availability
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Map Header with Controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-beedab-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Property Locations - Botswana</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Map Style Selector */}
            <div className="flex items-center gap-1 mr-4">
              <Layers className="h-4 w-4 text-gray-600" />
              <select
                value={mapStyle}
                onChange={(e) => handleStyleChange(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="street">Street</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">
              {zoom}x
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            {/* Focus Botswana Button */}
            <button
              onClick={focusOnBotswana}
              className="ml-2 px-3 py-2 bg-beedab-blue text-white text-sm rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              Focus Botswana
            </button>
          </div>
        </div>
      </div>

      {/* Real Map Container */}
      <div className="relative h-96">
        <MapContainer
          center={botswanaCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <MapController 
            center={botswanaCenter} 
            zoom={zoom}
            onMapReady={setMapInstance}
          />
          
          {/* Tile Layer based on selected style */}
          <TileLayer
            key={mapStyle}
            attribution={tileProviders[mapStyle].attribution}
            url={tileProviders[mapStyle].url}
          />
          
          {/* Property Location Markers */}
          {locations.map((location) => {
            const isSelected = selectedLocation === location.id;
            const markerColor = getMarkerColor(location);
            
            return (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={createCustomIcon(markerColor, isSelected)}
                eventHandlers={{
                  click: () => onLocationClick(location),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-semibold text-gray-900 mb-2">{location.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>{location.plotCount}</strong> plots available</p>
                      <p><strong>BWP {location.averagePrice.toLocaleString()}</strong> avg. price</p>
                      <p><strong>{location.popularSize}</strong> popular size</p>
                      <p className="text-xs text-gray-500 mt-2 italic">{location.description}</p>
                    </div>
                    <button
                      onClick={() => onLocationClick(location)}
                      className="mt-3 w-full bg-beedab-blue text-white py-2 px-3 rounded text-sm hover:bg-beedab-darkblue transition-colors"
                    >
                      View Properties
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">1-10 plots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">11-20 plots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">20+ plots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">Selected</span>
            </div>
          </div>
          
          <div className="text-gray-500">
            Click markers to view property details
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
                <h4 className="font-semibold text-beedab-blue mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location.name}
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Plots Available:</span>
                    <br />
                    <span className="font-medium text-lg">{location.plotCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Average Price:</span>
                    <br />
                    <span className="font-medium text-lg">BWP {location.averagePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Popular Size:</span>
                    <br />
                    <span className="font-medium text-lg">{location.popularSize}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">{location.description}</p>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};
