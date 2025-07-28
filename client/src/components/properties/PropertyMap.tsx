
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox with your token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

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

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  height = '400px', 
  className = '' 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Filter properties with valid coordinates
  const validProperties = properties.filter(property => 
    property.latitude && 
    property.longitude && 
    !isNaN(property.latitude) && 
    !isNaN(property.longitude) &&
    property.latitude !== 0 &&
    property.longitude !== 0
  );

  // Default center (Gaborone, Botswana)
  const center: [number, number] = validProperties.length > 0 
    ? [validProperties[0].longitude, validProperties[0].latitude] // Note: Mapbox uses [lng, lat]
    : [25.9231, -24.6282];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 12
    });

    // Add markers for each property
    validProperties.forEach((property) => {
      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'space-y-3 p-2';
      popupContent.innerHTML = `
        <div>
          <h3 class="font-semibold text-lg text-gray-900 mb-1">
            ${property.title}
          </h3>
          <div class="flex items-center text-gray-600 text-sm">
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            ${property.location}
          </div>
        </div>

        <div class="text-2xl font-bold text-blue-600">
          P${property.price?.toLocaleString()}
        </div>

        ${(property.bedrooms || property.bathrooms || property.squareFeet) ? `
          <div class="flex items-center space-x-4 text-gray-600 text-sm">
            ${property.bedrooms ? `
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v18H3V3zm3 6h12v9H6V9z"/>
                </svg>
                <span>${property.bedrooms} beds</span>
              </div>
            ` : ''}
            ${property.bathrooms ? `
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <span>${property.bathrooms} baths</span>
              </div>
            ` : ''}
            ${property.squareFeet ? `
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
                <span>${property.squareFeet.toLocaleString()} sqm</span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="flex items-center justify-between text-sm">
          <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
            ${property.propertyType}
          </span>
          ${property.views ? `
            <div class="flex items-center text-gray-500">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              ${property.views} views
            </div>
          ` : ''}
        </div>

        <div class="pt-2 border-t border-gray-200">
          <a href="/properties/${property.id}" 
             class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium">
            View Details
          </a>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        maxWidth: '300px'
      }).setDOMContent(popupContent);

      // Create marker
      new mapboxgl.Marker()
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [validProperties]);

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Map requires Mapbox access token</p>
          <p className="text-sm text-gray-500">Please add VITE_MAPBOX_ACCESS_TOKEN to your environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`} style={{ height }}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default PropertyMap;
