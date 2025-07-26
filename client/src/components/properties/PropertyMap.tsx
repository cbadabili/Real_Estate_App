
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdC1kZXYiLCJhIjoiY2swMDAwMDAwMDAwMDAwMDBiY2RlZjEyMyJ9.ABC123'; // Demo token

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
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties = [], 
  onPropertySelect,
  className = '',
  height = '600px'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing PropertyMap with', properties.length, 'properties');

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [25.9231, -24.6282], // Gaborone center
      zoom: 11,
      maxBounds: [
        [19.999, -26.907], // Southwest Botswana
        [29.375, -17.778]  // Northeast Botswana
      ]
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add/update property markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    console.log('Adding markers for', properties.length, 'properties');

    // Filter properties with valid coordinates
    const validProperties = properties.filter(property => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
      
      const isValid = lat != null && lng != null && 
                     !isNaN(lat) && !isNaN(lng) && 
                     lat !== 0 && lng !== 0;
      
      if (!isValid) {
        console.warn(`Property ${property.id} has invalid coordinates:`, property.latitude, property.longitude);
      }
      
      return isValid;
    });

    console.log(`Found ${validProperties.length} properties with valid coordinates`);

    if (validProperties.length === 0) {
      console.log('No valid properties, adding demo properties');
      // Add demo properties for testing
      const demoProperties: Property[] = [
        {
          id: 'demo-1',
          title: 'Demo House - Gaborone CBD',
          latitude: -24.6541,
          longitude: 25.9087,
          price: 1250000,
          propertyType: 'house',
          address: 'Central Business District',
          city: 'Gaborone',
          bedrooms: 3,
          bathrooms: 2,
          description: 'Modern house in CBD'
        },
        {
          id: 'demo-2',
          title: 'Demo Plot - Block 8',
          latitude: -24.6400,
          longitude: 25.9100,
          price: 750000,
          propertyType: 'land_plot',
          address: 'Block 8',
          city: 'Gaborone',
          bedrooms: 0,
          bathrooms: 0,
          description: 'Residential plot ready for development'
        },
        {
          id: 'demo-3',
          title: 'Demo Apartment - Mogoditshane',
          latitude: -24.6200,
          longitude: 25.8900,
          price: 850000,
          propertyType: 'apartment',
          address: 'Mogoditshane',
          city: 'Mogoditshane',
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern apartment with amenities'
        }
      ];
      
      demoProperties.forEach(property => addMarker(property));
    } else {
      validProperties.forEach(property => addMarker(property));
    }

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      if (markersRef.current.length === 1) {
        map.current!.setCenter(markersRef.current[0].getLngLat());
        map.current!.setZoom(14);
      } else {
        map.current!.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 15
        });
      }
    }

  }, [properties]);

  const addMarker = (property: Property) => {
    if (!map.current) return;

    const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
    const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

    // Create custom marker element
    const el = document.createElement('div');
    el.style.cssText = `
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: #ff4444;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s;
    `;
    
    // Set icon based on property type
    const getPropertyIcon = (type?: string) => {
      switch (type) {
        case 'house': return '🏠';
        case 'apartment': return '🏢';
        case 'land_plot': case 'land': return '🌾';
        case 'townhouse': return '🏘️';
        default: return '🏠';
      }
    };
    
    el.innerHTML = getPropertyIcon(property.propertyType);

    // Add hover effect
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // Create detailed popup
    const popup = new mapboxgl.Popup({ 
      offset: 25,
      closeButton: true,
      closeOnClick: false
    }).setHTML(`
      <div style="padding: 15px; min-width: 250px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">
          ${property.title}
        </h3>
        <div style="margin-bottom: 8px;">
          <strong style="color: #007bff; font-size: 18px;">
            P${property.price.toLocaleString()}
          </strong>
        </div>
        <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
          📍 ${property.address || property.city || 'Gaborone'}
        </div>
        ${property.bedrooms !== undefined && property.bedrooms > 0 ? `
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
            🛏️ ${property.bedrooms} bed • 🚿 ${property.bathrooms} bath
          </div>
        ` : ''}
        ${property.description ? `
          <div style="color: #666; font-size: 13px; margin-top: 8px; font-style: italic;">
            ${property.description}
          </div>
        ` : ''}
        <div style="margin-top: 10px;">
          <button onclick="window.viewPropertyDetails('${property.id}')" 
                  style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            View Details
          </button>
        </div>
      </div>
    `);

    // Create and add marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.current);

    // Handle marker click
    el.addEventListener('click', () => {
      if (onPropertySelect) {
        onPropertySelect(property);
      }
    });

    markersRef.current.push(marker);
    console.log(`Added marker for property ${property.id} at [${lng}, ${lat}]`);
  };

  // Add global function for button clicks
  useEffect(() => {
    (window as any).viewPropertyDetails = (propertyId: string) => {
      console.log('View details for property:', propertyId);
      const property = properties.find(p => p.id.toString() === propertyId);
      if (property && onPropertySelect) {
        onPropertySelect(property);
      }
    };

    return () => {
      delete (window as any).viewPropertyDetails;
    };
  }, [properties, onPropertySelect]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Property count overlay */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000
      }}>
        🏠 {properties.length} properties found
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Property Types:</div>
        <div>🏠 Houses • 🏢 Apartments</div>
        <div>🌾 Land/Plots • 🏘️ Townhouses</div>
      </div>
    </div>
  );
};

export default PropertyMap;
