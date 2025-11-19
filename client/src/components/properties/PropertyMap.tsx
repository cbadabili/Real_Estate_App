import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';

const formatPrice = (price: number): string => {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
  return price.toString();
};

interface Property {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  propertyType: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  views?: number;
}

interface PropertyMapProps {
  properties: Property[];
  height?: string;
  className?: string;
}

const defaultCenter: google.maps.LatLngLiteral = { lat: -24.6282, lng: 25.9231 };

const isWithinBotswana = (lng: number, lat: number) => lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

const createPriceMarker = (property: Property, isActive: boolean): google.maps.Icon | undefined => {
  if (typeof google === 'undefined') return undefined;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="80" viewBox="0 0 180 80">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.18)" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <rect x="25" y="10" rx="14" ry="14" width="130" height="52" fill="${isActive ? '#ef4444' : '#1d4ed8'}" />
        <rect x="81" y="58" width="18" height="18" fill="${isActive ? '#ef4444' : '#1d4ed8'}" transform="rotate(45 90 67)" />
        <text x="90" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="white">P${formatPrice(property.price)}</text>
        <text x="90" y="54" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="rgba(255,255,255,0.92)">${property.location}</text>
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(150, 90),
    anchor: new google.maps.Point(90, 70),
  };
};

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  height = '800px',
  className = ''
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'property-map-loader',
    googleMapsApiKey: apiKey ?? '',
  });

  const validProperties = useMemo(
    () =>
      properties.filter(property =>
        property.latitude &&
        property.longitude &&
        !isNaN(property.latitude) &&
        !isNaN(property.longitude) &&
        property.latitude !== 0 &&
        property.longitude !== 0 &&
        isWithinBotswana(property.longitude, property.latitude)
      ),
    [properties]
  );

  const center: google.maps.LatLngLiteral =
    validProperties.length > 0
      ? { lat: validProperties[0].latitude, lng: validProperties[0].longitude }
      : defaultCenter;

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (validProperties.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      validProperties.forEach(property =>
        bounds.extend({ lat: property.latitude, lng: property.longitude })
      );
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } else {
      map.setCenter(center);
      map.setZoom(10);
    }
  };

  const activeProperty = activePropertyId
    ? validProperties.find(property => property.id === activePropertyId)
    : null;

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
        <p className="font-semibold">Google Maps API key missing</p>
        <p className="mt-2 text-sm">Set VITE_GOOGLE_MAPS_API_KEY to explore properties on the map.</p>
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
          {validProperties.map(property => (
            <Marker
              key={property.id}
              position={{ lat: property.latitude, lng: property.longitude }}
              onClick={() => setActivePropertyId(property.id)}
              icon={createPriceMarker(property, activePropertyId === property.id)}
            />
          ))}

          {activeProperty && (
            <InfoWindow
              position={{ lat: activeProperty.latitude, lng: activeProperty.longitude }}
              onCloseClick={() => setActivePropertyId(null)}
            >
              <div className="w-72 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{activeProperty.propertyType}</p>
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug">{activeProperty.title}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{activeProperty.location}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-blue-600">
                  P{activeProperty.price?.toLocaleString()}
                </div>

                {(activeProperty.bedrooms || activeProperty.bathrooms || activeProperty.squareFeet) && (
                  <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
                    {activeProperty.bedrooms && (
                      <div className="flex items-center space-x-1">
                        <Bed className="h-4 w-4" />
                        <span className="font-medium">{activeProperty.bedrooms}</span>
                        <span className="text-xs text-gray-500">beds</span>
                      </div>
                    )}
                    {activeProperty.bathrooms && (
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span className="font-medium">{activeProperty.bathrooms}</span>
                        <span className="text-xs text-gray-500">baths</span>
                      </div>
                    )}
                    {activeProperty.squareFeet && (
                      <div className="flex items-center space-x-1">
                        <Square className="h-4 w-4" />
                        <span className="font-medium">{activeProperty.squareFeet.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">sqm</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                    {activeProperty.propertyType}
                  </span>
                  {activeProperty.views && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-4 w-4" />
                      {activeProperty.views} views
                    </span>
                  )}
                </div>

                <Link
                  to={`/properties/${activeProperty.id}`}
                  className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View Full Details
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        validProperties.length > 0 && (
          <div className="flex items-center justify-center rounded-lg bg-gray-100" style={{ height }}>
            <div className="text-center text-gray-500">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
              <p className="text-sm">Loading Google Maps...</p>
            </div>
          </div>
        )
      )}

      {validProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
          <div className="text-center text-gray-500">
            <p className="text-sm">No properties with valid coordinates to display</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
