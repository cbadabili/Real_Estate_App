
import React, { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Property {
  id: number | string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  propertyType?: string;
  address?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  status?: string;
}

interface UnifiedMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  height?: string;
  className?: string;
  showControls?: boolean;
  showPropertyCount?: boolean;
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
}

export const UnifiedMap: React.FC<UnifiedMapProps> = ({
  properties = [],
  onPropertySelect,
  selectedProperty,
  height = '500px',
  className = '',
  showControls = true,
  showPropertyCount = true,
  initialCenter = [25.9231, -24.6282], // Gaborone center
  initialZoom = 11
}) => {
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom
  });
  const [popupInfo, setPopupInfo] = useState<Property | null>(null);

  // Mapbox token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
    'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  // Filter and validate properties with coordinates
  const validProperties = useMemo(() => {
    return properties.filter(property => {
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);
      
      const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
      const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
      
      if (!isValidLat || !isValidLng) {
        console.warn(`Property ${property.id} has invalid coordinates: lat=${lat}, lng=${lng}`);
        return false;
      }
      
      return true;
    }).map(property => ({
      ...property,
      latitude: Number(property.latitude),
      longitude: Number(property.longitude)
    }));
  }, [properties]);

  // Fit map to show all properties when properties change
  useEffect(() => {
    if (validProperties.length > 1) {
      const bounds = validProperties.reduce(
        (bounds, property) => {
          return [
            Math.min(bounds[0], property.longitude),
            Math.min(bounds[1], property.latitude),
            Math.max(bounds[2], property.longitude),
            Math.max(bounds[3], property.latitude)
          ];
        },
        [Infinity, Infinity, -Infinity, -Infinity]
      );

      // Add padding around bounds
      const padding = 0.01;
      const [minLng, minLat, maxLng, maxLat] = bounds;
      
      if (minLng !== Infinity) {
        setViewState(prev => ({
          ...prev,
          longitude: (minLng + maxLng) / 2,
          latitude: (minLat + maxLat) / 2,
          zoom: Math.min(12, Math.max(8, 12 - Math.log2(Math.max(maxLng - minLng, maxLat - minLat) / 0.1)))
        }));
      }
    }
  }, [validProperties]);

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `P${(price / 1000).toFixed(0)}k`;
    }
    return `P${price.toLocaleString()}`;
  };

  const getMarkerColor = (type?: string): string => {
    switch (type?.toLowerCase()) {
      case 'house': return '#22c55e';
      case 'apartment': return '#3b82f6';
      case 'land': 
      case 'land_plot':
      case 'plot': return '#f59e0b';
      case 'townhouse': return '#8b5cf6';
      case 'commercial': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPropertyIcon = (type?: string): string => {
    switch (type?.toLowerCase()) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'land':
      case 'land_plot':
      case 'plot': return '🏞️';
      case 'townhouse': return '🏘️';
      case 'commercial': return '🏬';
      default: return '📍';
    }
  };

  const handleMarkerClick = (property: Property) => {
    setPopupInfo(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const handleMapClick = () => {
    setPopupInfo(null);
  };

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={false}
      >
        {/* Navigation controls */}
        {showControls && (
          <NavigationControl position="top-right" />
        )}

        {/* Property markers */}
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.longitude}
            latitude={property.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(property);
            }}
          >
            <div
              className={`w-10 h-10 rounded-full border-3 border-white shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-110 flex items-center justify-center text-white text-lg font-bold ${
                selectedProperty?.id === property.id ? 'ring-4 ring-blue-400 scale-110' : ''
              }`}
              style={{ backgroundColor: getMarkerColor(property.propertyType) }}
            >
              {getPropertyIcon(property.propertyType)}
            </div>
          </Marker>
        ))}

        {/* Property popup */}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="property-popup"
          >
            <div className="p-4 max-w-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {popupInfo.title}
              </h3>
              <p className="text-xl font-bold text-green-600 mb-2">
                {formatPrice(popupInfo.price)}
              </p>
              {popupInfo.address && (
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <span className="mr-1">📍</span> {popupInfo.address}
                </p>
              )}
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                {popupInfo.bedrooms && (
                  <span className="flex items-center">
                    <span className="mr-1">🛏️</span> {popupInfo.bedrooms}
                  </span>
                )}
                {popupInfo.bathrooms && (
                  <span className="flex items-center">
                    <span className="mr-1">🚿</span> {popupInfo.bathrooms}
                  </span>
                )}
                {popupInfo.propertyType && (
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                    {popupInfo.propertyType.replace('_', ' ')}
                  </span>
                )}
              </div>
              {popupInfo.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {popupInfo.description}
                </p>
              )}
              <button 
                onClick={() => onPropertySelect && onPropertySelect(popupInfo)}
                className="w-full bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        )}

        {/* Property count badge */}
        {showPropertyCount && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {validProperties.length} {validProperties.length === 1 ? 'Property' : 'Properties'}
              </span>
            </div>
          </div>
        )}
      </Map>

      {/* No properties message */}
      {validProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Properties Found</h3>
            <p className="text-gray-600 text-sm">
              {properties.length === 0 
                ? "No properties available to display" 
                : `${properties.length} properties found but none have valid coordinates`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedMap;
