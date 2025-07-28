
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox with your token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

interface Property {
  id: number;
  title: string;
  latitude?: number;
  longitude?: number;
  price: number;
  propertyType: string;
  address?: string;
}

interface PropertyMapProps {
  properties: Property[];
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties = [], 
  height = '500px' 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  console.log('🗺️ PropertyMap rendering with properties:', properties.length);

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🚀 Initializing new Mapbox map');

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [25.9231, -24.6282], // Gaborone [longitude, latitude]
        zoom: 11,
        attributionControl: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Map loaded event
      map.current.on('load', () => {
        console.log('✅ Mapbox map loaded successfully');
        setIsLoaded(true);
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e.error);
      });

    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        console.log('🧹 Cleaning up map');
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded and properties change
  useEffect(() => {
    if (!map.current || !isLoaded || !properties.length) {
      console.log('⏸️ Skipping markers:', { mapExists: !!map.current, isLoaded, propCount: properties.length });
      return;
    }

    console.log('📍 Adding markers for', properties.length, 'properties');

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Sample coordinates around Gaborone for properties without coordinates
    const sampleCoords = [
      [25.9231, -24.6282], // Central Gaborone
      [25.9100, -24.6400], // West Gaborone  
      [25.8900, -24.6200]  // South Gaborone
    ];

    properties.forEach((property, index) => {
      // Use property coordinates or fallback to sample coordinates
      const lng = property.longitude || sampleCoords[index % sampleCoords.length][0];
      const lat = property.latitude || sampleCoords[index % sampleCoords.length][1];

      console.log(`📌 Creating marker for "${property.title}" at [${lng}, ${lat}]`);

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">${property.title}</h3>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
            📍 ${property.address || 'Gaborone, Botswana'}
          </p>
          <p style="margin: 0; font-weight: bold; color: #007bff; font-size: 16px;">
            💰 P${property.price.toLocaleString()}
          </p>
          <div style="margin-top: 8px; font-size: 12px; color: #888;">
            Type: ${property.propertyType}
          </div>
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker({
        color: getPropertyColor(property.propertyType)
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current!);

      console.log('✅ Marker added successfully');
    });

    // Fit map to show all properties
    if (properties.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      
      properties.forEach((property, index) => {
        const lng = property.longitude || sampleCoords[index % sampleCoords.length][0];
        const lat = property.latitude || sampleCoords[index % sampleCoords.length][1];
        bounds.extend([lng, lat]);
      });

      map.current!.fitBounds(bounds, { 
        padding: 50,
        maxZoom: 15 
      });

      console.log('🎯 Map fitted to show all properties');
    }

  }, [properties, isLoaded]);

  // Get color for property type
  const getPropertyColor = (type: string): string => {
    const colors = {
      house: '#28a745',      // Green
      apartment: '#007bff',  // Blue
      land_plot: '#fd7e14',  // Orange
      farm: '#6f42c1',       // Purple
      commercial: '#dc3545'  // Red
    };
    return colors[type.toLowerCase() as keyof typeof colors] || '#6c757d';
  };

  // Error state - no token
  if (!mapboxgl.accessToken) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center', color: '#6c757d' }}>
          <h3>⚠️ Mapbox Token Missing</h3>
          <p>Add REACT_APP_MAPBOX_ACCESS_TOKEN to Replit Secrets</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height,
      position: 'relative',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Status overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        🏠 {properties.length} properties • {isLoaded ? '✅ Loaded' : '⏳ Loading...'}
      </div>
    </div>
  );
};

export default PropertyMap;
