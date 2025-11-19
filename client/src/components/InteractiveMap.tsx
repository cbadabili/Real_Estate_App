import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
  price?: number;
  area?: number;
  [key: string]: any;
}

interface InteractiveMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  selectedLocation?: Location | null;
  height?: string;
  className?: string;
}

const defaultCenter: google.maps.LatLngLiteral = { lat: -24.6282, lng: 25.9231 };

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  onLocationClick,
  selectedLocation,
  height = '600px',
  className = ''
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(selectedLocation?.id ?? null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'interactive-map-loader',
    googleMapsApiKey: apiKey ?? '',
  });

  const validLocations = useMemo(
    () =>
      locations.filter(location =>
        location.latitude &&
        location.longitude &&
        !isNaN(location.latitude) &&
        !isNaN(location.longitude) &&
        location.latitude !== 0 &&
        location.longitude !== 0
      ),
    [locations]
  );

  const center: google.maps.LatLngLiteral =
    validLocations.length > 0
      ? { lat: validLocations[0].latitude, lng: validLocations[0].longitude }
      : defaultCenter;

  useEffect(() => {
    setActiveLocationId(selectedLocation?.id ?? null);
  }, [selectedLocation]);

  const handleMarkerClick = (location: Location) => {
    setActiveLocationId(location.id);
    onLocationClick?.(location);
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (validLocations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      validLocations.forEach(location => bounds.extend({ lat: location.latitude, lng: location.longitude }));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } else {
      map.setCenter(center);
      map.setZoom(10);
    }
  };

  const activeLocation = activeLocationId
    ? validLocations.find(location => location.id === activeLocationId)
    : null;

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
        <p className="font-semibold">Google Maps API key missing</p>
        <p className="mt-2 text-sm">Set VITE_GOOGLE_MAPS_API_KEY to view the interactive map.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Unable to load Google Maps. Please check your API key and network connection.
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoaded ? (
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ height, width: '100%' }}
          center={center}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
          }}
        >
          {validLocations.map(location => (
            <Marker
              key={location.id}
              position={{ lat: location.latitude, lng: location.longitude }}
              onClick={() => handleMarkerClick(location)}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
                    <path d="M24 0C11 0 0 10.5 0 23.5C0 36.5 24 48 24 48C24 48 48 36.5 48 23.5C48 10.5 37 0 24 0Z" fill="${activeLocationId === location.id ? '#ef4444' : '#3b82f6'}" />
                    <circle cx="24" cy="20" r="9" fill="white" />
                    <circle cx="24" cy="20" r="6" fill="${activeLocationId === location.id ? '#ef4444' : '#3b82f6'}" />
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              }}
            />
          ))}

          {activeLocation && (
            <InfoWindow
              position={{ lat: activeLocation.latitude, lng: activeLocation.longitude }}
              onCloseClick={() => setActiveLocationId(null)}
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{activeLocation.name}</p>
                {activeLocation.type && (
                  <p className="text-xs text-gray-600">Type: {activeLocation.type}</p>
                )}
                {activeLocation.price && (
                  <p className="text-xs text-gray-600">Price: BWP {activeLocation.price.toLocaleString()}</p>
                )}
                {activeLocation.area && (
                  <p className="text-xs text-gray-600">Area: {activeLocation.area} m²</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        validLocations.length > 0 && (
          <div className="flex w-full items-center justify-center rounded-lg bg-gray-100" style={{ height }}>
            <div className="text-center text-gray-500">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
              <p className="text-sm">Loading Google Maps...</p>
            </div>
          </div>
        )
      )}

      {validLocations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
          <div className="text-center text-gray-500">
            <p className="text-sm">No locations with valid coordinates to display</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
