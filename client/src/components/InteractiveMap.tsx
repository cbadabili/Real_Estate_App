
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - you'll need to set this in your environment
const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYmVlZGFiIiwiYSI6ImNsdXNxYjhxZDBienEyanRiOGt4cXNrd2QifQ.your-token-here';

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

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  onLocationClick,
  selectedLocation,
  height = '600px',
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter locations with valid coordinates
  const validLocations = locations.filter(location => 
    location.latitude && 
    location.longitude && 
    !isNaN(location.latitude) && 
    !isNaN(location.longitude) &&
    location.latitude !== 0 &&
    location.longitude !== 0
  );

  // Default center (Gaborone, Botswana)
  const center: [number, number] = validLocations.length > 0 
    ? [validLocations[0].longitude, validLocations[0].latitude]
    : [25.9231, -24.6282];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Clean up existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 10
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      
      // Add markers for each location
      validLocations.forEach(location => {
        if (!map.current) return;

        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.width = '30px';
        markerElement.style.height = '30px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = selectedLocation?.id === location.id ? '#ef4444' : '#3b82f6';
        markerElement.style.border = '2px solid white';
        markerElement.style.cursor = 'pointer';
        markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Add marker to map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current);

        // Add click handler
        markerElement.addEventListener('click', () => {
          if (onLocationClick) {
            onLocationClick(location);
          }
        });

        // Add popup with location info
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${location.name}</h3>
            ${location.type ? `<p class="text-xs text-gray-600">Type: ${location.type}</p>` : ''}
            ${location.price ? `<p class="text-xs text-gray-600">Price: BWP ${location.price.toLocaleString()}</p>` : ''}
            ${location.area ? `<p class="text-xs text-gray-600">Area: ${location.area} m²</p>` : ''}
          </div>
        `);

        marker.setPopup(popup);
      });

      // Fit map to show all markers if there are valid locations
      if (validLocations.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        validLocations.forEach(location => {
          bounds.extend([location.longitude, location.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations]);

  // Update marker colors when selected location changes
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    const markers = document.querySelectorAll('.custom-marker');
    markers.forEach((marker, index) => {
      const location = validLocations[index];
      if (location) {
        (marker as HTMLElement).style.backgroundColor = 
          selectedLocation?.id === location.id ? '#ef4444' : '#3b82f6';
      }
    });
  }, [selectedLocation, isLoaded, validLocations]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        style={{ height }} 
        className="w-full rounded-lg overflow-hidden"
      />
      
      {validLocations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="text-sm">No locations with valid coordinates to display</p>
          </div>
        </div>
      )}
      
      {!isLoaded && validLocations.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
