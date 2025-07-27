
import React, { useEffect, useRef, useState } from 'react';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

  // Use test properties if no valid properties provided
  const validProperties = properties.length > 0 ? properties.filter(property => {
    const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
    const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
    return lat != null && lng != null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  }) : testProperties;

  const getMarkerColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'house': return '#22c55e'; // Green
      case 'apartment': return '#3b82f6'; // Blue  
      case 'land': case 'land_plot': return '#f59e0b'; // Orange
      case 'townhouse': return '#8b5cf6'; // Purple
      case 'commercial': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
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

  useEffect(() => {
    // Load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Replace with your Mapbox token
    const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    // @ts-ignore
    window.mapboxgl.accessToken = mapboxToken;

    // @ts-ignore
    mapRef.current = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [25.9231, -24.6282], // Gaborone coordinates
      zoom: 11
    });

    // Add navigation controls
    // @ts-ignore
    mapRef.current.addControl(new window.mapboxgl.NavigationControl());

    mapRef.current.on('load', () => {
      addPropertyMarkers();
    });
  };

  const addPropertyMarkers = () => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const validCoordinates: [number, number][] = [];

    validProperties.forEach(property => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

      // Validate coordinates before using them
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.warn(`Invalid coordinates for property ${property.id}: [${lng}, ${lat}]`);
        return;
      }

      // Store valid coordinates for bounds calculation
      validCoordinates.push([lng, lat]);

      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${getMarkerColor(property.propertyType)};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;
      markerEl.innerHTML = getPropertyIcon(property.propertyType);

      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.1)';
      });

      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
            ${getPropertyIcon(property.propertyType)} ${property.title}
          </h3>
          <div style="color: #0066cc; font-weight: bold; font-size: 18px; margin-bottom: 8px;">
            ${formatPrice(property.price)}
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
            📍 ${property.address || property.city || 'Gaborone'}
          </div>
          ${property.bedrooms ? `
            <div style="color: #666; font-size: 12px;">
              🛏️ ${property.bedrooms} bed • 🚿 ${property.bathrooms || 1} bath
            </div>
          ` : ''}
        </div>
      `;

      // @ts-ignore
      const popup = new window.mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      // @ts-ignore
      const marker = new window.mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers only if we have valid coordinates
    if (validCoordinates.length > 1) {
      try {
        // @ts-ignore
        const bounds = new window.mapboxgl.LngLatBounds();
        validCoordinates.forEach(coord => {
          bounds.extend(coord);
        });
        mapRef.current.fitBounds(bounds, { padding: 50 });
      } catch (error) {
        console.warn('Error fitting bounds:', error);
        // Fallback to center on Gaborone
        mapRef.current.setCenter([25.9231, -24.6282]);
        mapRef.current.setZoom(11);
      }
    } else if (validCoordinates.length === 1) {
      // If only one property, center on it
      mapRef.current.setCenter(validCoordinates[0]);
      mapRef.current.setZoom(14);
    }
  };

  useEffect(() => {
    if (mapRef.current && validProperties.length > 0) {
      addPropertyMarkers();
    }
  }, [validProperties]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden"
        style={{ height: '100%', width: '100%' }}
      />

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
