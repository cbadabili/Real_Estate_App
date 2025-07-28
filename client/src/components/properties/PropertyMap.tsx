import React, { useEffect, useRef, useState, useMemo } from 'react';
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
    process.env.VITE_MAPBOX_ACCESS_TOKEN ||
    'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  // Test properties to ensure map shows immediately
  const testProperties = [
    {
      id: 'test1',
      title: 'three bed house',
      latitude: -24.6282,
      longitude: 25.9231,
      price: 650000,
      propertyType: 'house',
      address: 'Gaborone, South-East',
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: 'test2', 
      title: 'land',
      latitude: -24.6400,
      longitude: 25.9100,
      price: 100000,
      propertyType: 'land',
      address: 'Gaborone, South-East'
    },
    {
      id: 'test3',
      title: 'Mmatseta',
      latitude: -24.6200,
      longitude: 25.8900,
      price: 70000,
      propertyType: 'apartment',
      address: 'Gaborone, South-East',
      bedrooms: 2,
      bathrooms: 1
    }
  ];

  // Validate and process properties
  const validProperties = useMemo(() => {
    const propsToUse = properties.length > 0 ? properties : testProperties;

    return propsToUse.filter(property => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

      const isValid = lat != null && lng != null && !isNaN(lat) && !isNaN(lng) && 
                     lat !== 0 && lng !== 0 && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

      if (!isValid) {
        console.warn(`Property ${property.id} (${property.title}) has invalid coordinates:`, {
          originalLat: property.latitude,
          originalLng: property.longitude,
          parsedLat: lat,
          parsedLng: lng
        });
      }

      return isValid;
    }).map(property => ({
      ...property,
      latitude: typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude,
      longitude: typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude
    }));
  }, [properties]);

  // Fit map to show all properties
  useEffect(() => {
    if (validProperties.length > 0) {
      const bounds = validProperties.reduce(
        (acc, property) => {
          return {
            minLat: Math.min(acc.minLat, property.latitude),
            maxLat: Math.max(acc.maxLat, property.latitude),
            minLng: Math.min(acc.minLng, property.longitude),
            maxLng: Math.max(acc.maxLng, property.longitude)
          };
        },
        {
          minLat: validProperties[0].latitude,
          maxLat: validProperties[0].latitude,
          minLng: validProperties[0].longitude,
          maxLng: validProperties[0].longitude
        }
      );

      if (validProperties.length === 1) {
        setViewState({
          longitude: validProperties[0].longitude,
          latitude: validProperties[0].latitude,
          zoom: 14
        });
      } else {
        const centerLat = (bounds.minLat + bounds.maxLat) / 2;
        const centerLng = (bounds.minLng + bounds.maxLng) / 2;

        // Calculate appropriate zoom level
        const latDiff = bounds.maxLat - bounds.minLat;
        const lngDiff = bounds.maxLng - bounds.minLng;
        const maxDiff = Math.max(latDiff, lngDiff);

        let zoom = 11;
        if (maxDiff < 0.01) zoom = 15;
        else if (maxDiff < 0.05) zoom = 13;
        else if (maxDiff < 0.1) zoom = 12;
        else if (maxDiff < 0.5) zoom = 10;
        else zoom = 9;

        setViewState({
          longitude: centerLng,
          latitude: centerLat,
          zoom: zoom
        });
      }
    }
  }, [validProperties]);

  // Handle selected property change
  useEffect(() => {
    if (selectedProperty && selectedProperty.latitude && selectedProperty.longitude) {
      setViewState(prev => ({
        ...prev,
        longitude: selectedProperty.longitude,
        latitude: selectedProperty.latitude,
        zoom: Math.max(prev.zoom, 14)
      }));
      setPopupInfo(selectedProperty);
    }
  }, [selectedProperty]);

  const getMarkerColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'house': return '#22c55e';
      case 'apartment': return '#3b82f6';
      case 'land': case 'land_plot': return '#f59e0b';
      case 'townhouse': return '#8b5cf6';
      case 'commercial': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPropertyIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'land': case 'land_plot': return '🏞️';
      case 'townhouse': return '🏘️';
      case 'commercial': return '🏪';
      default: return '📍';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `P${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `P${(price / 1000).toFixed(0)}k`;
    }
    return `P${price.toLocaleString()}`;
  };

  const handleMarkerClick = (property: Property) => {
    setPopupInfo(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const MarkerComponent = ({ property }: { property: Property }) => (
    <Marker
      longitude={property.longitude}
      latitude={property.latitude}
      anchor="center"
      onClick={() => handleMarkerClick(property)}
    >
      <div
        className="custom-marker"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: getMarkerColor(property.propertyType),
          border: '3px solid white',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease-in-out',
          transformOrigin: 'center center',
          position: 'relative',
          zIndex: selectedProperty?.id === property.id ? 10 : 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {getPropertyIcon(property.propertyType)}
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
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              offset={25}
            >
              <div style={{ padding: '12px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {getPropertyIcon(popupInfo.propertyType)} {popupInfo.title}
                </h3>
                <div style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                  {formatPrice(popupInfo.price)}
                </div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  📍 {popupInfo.address || popupInfo.city || 'Gaborone'}
                </div>
                {popupInfo.bedrooms && (
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    🛏️ {popupInfo.bedrooms} bed • 🚿 {popupInfo.bathrooms || 1} bath
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Property Count Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">
            {validProperties.length} properties found
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-10">
        <div className="text-xs text-gray-600">
          <div className="font-semibold mb-2">Property Types:</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>🏠 Houses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>🏞️ Land/Plots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>🏢 Apartments</span>
            </div>
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