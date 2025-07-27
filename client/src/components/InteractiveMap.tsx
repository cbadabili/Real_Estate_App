
import React, { useEffect, useRef } from 'react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  coordinates: [number, number];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
}

interface InteractiveMapProps {
  properties?: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const sampleProperties: Property[] = [
  {
    id: 1,
    title: "Modern Family Home",
    price: 850000,
    location: "Gaborone, South East",
    coordinates: [25.9231, -24.6282], // [lng, lat] for Mapbox
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "house"
  },
  {
    id: 2,
    title: "Executive Apartment",
    price: 450000,
    location: "Francistown, North East",
    coordinates: [27.5084, -21.1670], // [lng, lat] for Mapbox
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: "apartment"
  },
  {
    id: 3,
    title: "Luxury Villa",
    price: 1200000,
    location: "Maun, North West",
    coordinates: [23.4162, -20.0028], // [lng, lat] for Mapbox
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "house"
  }
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  properties = sampleProperties, 
  center = [24.6849, -22.3285], // [lng, lat] for Mapbox - Center of Botswana
  zoom = 6,
  height = "400px"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

    // Use the same Mapbox token as PropertyMap
    const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    // @ts-ignore
    window.mapboxgl.accessToken = mapboxToken;

    // @ts-ignore
    mapRef.current = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
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

    properties.forEach((property) => {
      const [lng, lat] = property.coordinates;

      // Validate coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for property ${property.id}: [${lng}, ${lat}]`);
        return;
      }

      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: #3b82f6;
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
      markerEl.innerHTML = '🏠';

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
            ${property.title}
          </h3>
          <div style="color: #0066cc; font-weight: bold; font-size: 18px; margin-bottom: 8px;">
            P${property.price.toLocaleString()}
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
            📍 ${property.location}
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span style="font-weight: 500;">Bedrooms:</span> ${property.bedrooms}
            </div>
            <div>
              <span style="font-weight: 500;">Bathrooms:</span> ${property.bathrooms}
            </div>
            <div>
              <span style="font-weight: 500;">Area:</span> ${property.area}m²
            </div>
            <div>
              <span style="font-weight: 500;">Type:</span> ${property.type}
            </div>
          </div>
          <button style="margin-top: 8px; width: 100%; background-color: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; border: none; font-size: 12px; cursor: pointer;">
            View Details
          </button>
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

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are multiple properties
    if (properties.length > 1) {
      try {
        // @ts-ignore
        const bounds = new window.mapboxgl.LngLatBounds();
        properties.forEach(property => {
          bounds.extend(property.coordinates);
        });
        mapRef.current.fitBounds(bounds, { padding: 50 });
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }
  };

  useEffect(() => {
    if (mapRef.current && properties.length > 0) {
      addPropertyMarkers();
    }
  }, [properties]);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Interactive Map</h2>
            <p className="text-blue-100 text-sm">Explore properties across Botswana</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Interactive mapping with Mapbox integration</p>
          <p className="text-xs text-gray-500">Click on any property marker to see details</p>
        </div>

        <div 
          ref={mapContainerRef}
          style={{ height }}
          className="rounded-lg bg-gray-100"
        />
      </div>
    </div>
  );
};

export default InteractiveMap;
export { InteractiveMap };
