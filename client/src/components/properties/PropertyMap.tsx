import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2JhZGFiaWxpIiwiYSI6ImNrcHNkbmduZjBmYW0ycHQ4c2V2dmNpbjAifQ.2TxX-aS70swDry_8SrE7iQ';

interface Property {
  id: number;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
  price?: number;
  propertyType?: string;
  location?: string;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  height?: string;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  height = '400px',
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Gaborone, Botswana
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [25.9267, -24.6282], // Gaborone coordinates
      zoom: 10
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

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for properties with valid coordinates
    const validProperties = properties.filter(
      property => property.latitude && property.longitude
    );

    if (validProperties.length === 0) {
      console.log('No properties with valid coordinates to display');
      return;
    }

    validProperties.forEach(property => {
      if (!property.latitude || !property.longitude) return;

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'property-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        background-color: #2563eb;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      markerElement.textContent = property.propertyType?.charAt(0).toUpperCase() || 'P';

      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            ${property.title}
          </h3>
          ${property.location ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${property.location}</p>` : ''}
          ${property.price ? `<p style="margin: 0; font-weight: bold; color: #2563eb;">P ${property.price.toLocaleString()}</p>` : ''}
          <button 
            onclick="window.selectProperty(${property.id})" 
            style="margin-top: 8px; padding: 4px 8px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            View Details
          </button>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (validProperties.length > 0) {
      const coordinates = validProperties.map(p => [p.longitude!, p.latitude!] as [number, number]);

      if (coordinates.length === 1) {
        map.current.setCenter(coordinates[0]);
        map.current.setZoom(12);
      } else {
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.current.fitBounds(bounds, { padding: 50 });
      }
    }

    // Add global function for popup button clicks
    (window as any).selectProperty = (propertyId: number) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertySelect) {
        onPropertySelect(property);
      }
    };

  }, [properties, onPropertySelect]);

  useEffect(() => {
    if (!map.current || !selectedProperty) return;

    // Highlight selected property
    if (selectedProperty.latitude && selectedProperty.longitude) {
      map.current.setCenter([selectedProperty.longitude, selectedProperty.latitude]);
      map.current.setZoom(14);
    }
  }, [selectedProperty]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        style={{ height }} 
        className="w-full rounded-lg overflow-hidden border border-gray-200"
      />
      {properties.filter(p => p.latitude && p.longitude).length === 0 && (
        <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center z-10">
          <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-sm border">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <div className="text-lg font-medium mb-2">No Properties with Coordinates</div>
            <div className="text-sm">Properties need valid coordinates to display on the map.</div>
            <div className="text-xs text-gray-500 mt-2">Total properties: {properties.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
export { PropertyMap };