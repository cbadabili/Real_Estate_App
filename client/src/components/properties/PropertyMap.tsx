
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Add custom styles
const mapStyles = `
  .property-marker {
    z-index: 1;
  }
  
  .property-marker:hover {
    z-index: 2;
  }
  
  .mapboxgl-popup.property-popup .mapboxgl-popup-content {
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
  }
  
  .mapboxgl-popup.property-popup .mapboxgl-popup-close-button {
    color: #6b7280;
    font-size: 18px;
    padding: 8px;
    right: 8px;
    top: 8px;
  }
  
  .mapboxgl-popup.property-popup .mapboxgl-popup-close-button:hover {
    color: #374151;
    background-color: #f3f4f6;
    border-radius: 50%;
  }
  
  .mapboxgl-popup.property-popup .mapboxgl-popup-tip {
    border-top-color: #e5e7eb;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mapStyles;
  document.head.appendChild(styleSheet);
}

// Initialize Mapbox with your token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || import.meta.env.MAPBOX_PUBLIC_KEY || '';

// Format price to show K for thousands, M for millions
const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
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

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  height = '800px', 
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
    if (!mapContainer.current) return;

    // Clean up existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: center,
      zoom: 12
    });

    // Add markers for each property
    validProperties.forEach((property) => {
      // Create custom marker element with price preview
      const markerElement = document.createElement('div');
      markerElement.className = 'property-marker';
      markerElement.setAttribute('data-property-id', property.id.toString());
      
      // Get actual location display - use full location or fallback
      const locationDisplay = property.location 
        ? property.location.split(',')[0].trim()
        : 'Location not specified';
      
      markerElement.innerHTML = `
        <div class="relative cursor-pointer">
          <!-- Main marker pin -->
          <div class="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg border-2 border-white transform hover:scale-110 transition-transform duration-200">
            <div class="text-sm font-bold">P${formatPrice(property.price)}</div>
            <div class="text-xs opacity-90">${locationDisplay}</div>
          </div>
          <!-- Pin tail -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600"></div>
        </div>
      `;

      // Create detailed popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'space-y-4 p-3 min-w-[280px]';
      popupContent.innerHTML = `
        <div class="space-y-2">
          <h3 class="font-bold text-xl text-gray-900 leading-tight">
            ${property.title}
          </h3>
          <div class="flex items-center text-gray-600 text-sm">
            <svg class="h-4 w-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="leading-tight">${property.location}</span>
          </div>
        </div>

        <div class="text-3xl font-bold text-blue-600">
          P${property.price?.toLocaleString()}
        </div>

        ${(property.bedrooms || property.bathrooms || property.squareFeet) ? `
          <div class="grid grid-cols-3 gap-3 text-gray-600 text-sm">
            ${property.bedrooms ? `
              <div class="flex items-center space-x-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"/>
                  <rect x="6" y="11" width="12" height="6" rx="1"/>
                </svg>
                <span class="font-medium">${property.bedrooms}</span>
                <span class="text-xs">beds</span>
              </div>
            ` : ''}
            ${property.bathrooms ? `
              <div class="flex items-center space-x-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <span class="font-medium">${property.bathrooms}</span>
                <span class="text-xs">baths</span>
              </div>
            ` : ''}
            ${property.squareFeet ? `
              <div class="flex items-center space-x-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
                <span class="font-medium">${property.squareFeet.toLocaleString()}</span>
                <span class="text-xs">sqm</span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium capitalize">
            ${property.propertyType}
          </span>
          ${property.views ? `
            <div class="flex items-center text-gray-500 text-sm">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>${property.views} views</span>
            </div>
          ` : ''}
        </div>

        <div class="pt-3 border-t border-gray-200">
          <a href="/properties/${property.id}" 
             onclick="window.location.href='/properties/${property.id}'; return false;"
             class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition-colors font-semibold text-sm cursor-pointer">
            View Full Details
          </a>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: [0, -15],
        maxWidth: '320px',
        className: 'property-popup'
      }).setDOMContent(popupContent);

      // Create marker with custom element
      new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
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
