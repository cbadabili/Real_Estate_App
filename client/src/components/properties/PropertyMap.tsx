import React, { useState, useMemo } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
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
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  className?: string;
  height?: string;
  selectedProperty?: Property | null;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties = [], 
  onPropertySelect,
  className = '',
  height = '600px',
  selectedProperty
}) => {
  const [viewState, setViewState] = useState({
    longitude: 25.9231,
    latitude: -24.6282,
    zoom: 11
  });
  const [popupInfo, setPopupInfo] = useState<Property | null>(null);

  // Get Mapbox token from environment variable
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
    'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  // Filter properties with valid coordinates
  const validProperties = useMemo(() => {
    return properties.filter(property => 
      property.latitude && 
      property.longitude && 
      !isNaN(property.latitude) && 
      !isNaN(property.longitude) &&
      property.latitude !== 0 &&
      property.longitude !== 0
    );
  }, [properties]);

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
      case 'land': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleMarkerClick = (property: Property) => {
    setPopupInfo(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const MarkerComponent = ({ property }: { property: Property }) => (
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
        className={`w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-110 flex items-center justify-center text-white text-xs font-bold ${
          selectedProperty?.id === property.id ? 'ring-4 ring-blue-400' : ''
        }`}
        style={{ backgroundColor: getMarkerColor(property.propertyType) }}
      >
        🏠
      </div>
    </Marker>
  );

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          interactiveLayerIds={['property-markers']}
        >
          {/* Render property markers */}
          {validProperties.map((property) => (
            <MarkerComponent key={property.id} property={property} />
          ))}

          {/* Popup for selected property */}
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              className="property-popup"
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-sm mb-1 text-gray-900">
                  {popupInfo.title}
                </h3>
                <p className="text-lg font-bold text-green-600 mb-1">
                  {formatPrice(popupInfo.price)}
                </p>
                {popupInfo.address && (
                  <p className="text-xs text-gray-600 mb-2">
                    📍 {popupInfo.address}
                  </p>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  {popupInfo.bedrooms && (
                    <span>🛏️ {popupInfo.bedrooms}</span>
                  )}
                  {popupInfo.bathrooms && (
                    <span>🚿 {popupInfo.bathrooms}</span>
                  )}
                  {popupInfo.propertyType && (
                    <span className="capitalize">
                      {popupInfo.propertyType}
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          )}
        </Map>

        {/* Property Count Badge */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {validProperties.length} {validProperties.length === 1 ? 'Property' : 'Properties'}
            </span>
          </div>
        </div>
      </div>

      {/* No Properties Message */}
      {validProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Properties Found</h3>
            <p className="text-gray-600 text-sm">
              No properties available to display on map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;