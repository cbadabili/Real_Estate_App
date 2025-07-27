
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

interface TestPropertyMapProps {
  height?: string;
  showPropertyList?: boolean;
}

const TestPropertyMap: React.FC<TestPropertyMapProps> = ({ 
  height = '600px',
  showPropertyList = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Test properties for demonstration
  const testProperties: Property[] = [
    {
      id: 'test1',
      title: 'Modern Family Home',
      latitude: -24.6282,
      longitude: 25.9231,
      price: 850000,
      propertyType: 'house',
      address: 'Gaborone CBD',
      city: 'Gaborone',
      bedrooms: 4,
      bathrooms: 3,
      description: 'Beautiful family home in prime location'
    },
    {
      id: 'test2', 
      title: 'Executive Apartment',
      latitude: -24.6400,
      longitude: 25.9100,
      price: 450000,
      propertyType: 'apartment',
      address: 'Gaborone West',
      city: 'Gaborone',
      bedrooms: 2,
      bathrooms: 2,
      description: 'Modern apartment with city views'
    },
    {
      id: 'test3',
      title: 'Investment Plot',
      latitude: -24.6200,
      longitude: 25.8900,
      price: 250000,
      propertyType: 'land',
      address: 'Mogoditshane',
      city: 'Mogoditshane',
      description: 'Prime land for development'
    }
  ];

  const getMarkerColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'house': return '#22c55e';
      case 'apartment': return '#3b82f6';
      case 'land': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPropertyIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'land': return '🏞️';
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

    // Mapbox token
    const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    // @ts-ignore
    window.mapboxgl.accessToken = mapboxToken;

    // @ts-ignore
    mapRef.current = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [25.9231, -24.6282],
      zoom: 11
    });

    // @ts-ignore
    mapRef.current.addControl(new window.mapboxgl.NavigationControl());

    mapRef.current.on('load', () => {
      addPropertyMarkers();
    });
  };

  const addPropertyMarkers = () => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    testProperties.forEach(property => {
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

      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
            ${getPropertyIcon(property.propertyType)} ${property.title}
          </h3>
          <div style="color: #0066cc; font-weight: bold; font-size: 18px; margin-bottom: 8px;">
            ${formatPrice(property.price)}
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
            📍 ${property.address}
          </div>
          ${property.bedrooms ? `
            <div style="color: #666; font-size: 12px;">
              🛏️ ${property.bedrooms} bed • 🚿 ${property.bathrooms} bath
            </div>
          ` : ''}
        </div>
      `;

      // @ts-ignore
      const popup = new window.mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      // @ts-ignore
      const marker = new window.mapboxgl.Marker(markerEl)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        setSelectedProperty(property);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="flex gap-4">
      {/* Map */}
      <div className={showPropertyList ? 'flex-1' : 'w-full'}>
        <div 
          ref={mapContainerRef}
          className="bg-gray-100 rounded-lg overflow-hidden"
          style={{ height }}
        />
        
        {/* Property count overlay */}
        <div className="relative">
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-10">
            <span className="text-sm font-medium">
              {testProperties.length} test properties
            </span>
          </div>
        </div>
      </div>

      {/* Property List */}
      {showPropertyList && (
        <div className="w-80 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Test Properties</h3>
          <div className="space-y-3">
            {testProperties.map(property => (
              <div 
                key={property.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {getPropertyIcon(property.propertyType)} {property.title}
                    </div>
                    <div className="text-blue-600 font-semibold">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      📍 {property.address}
                    </div>
                    {property.bedrooms && (
                      <div className="text-xs text-gray-500">
                        🛏️ {property.bedrooms} bed • 🚿 {property.bathrooms} bath
                      </div>
                    )}
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getMarkerColor(property.propertyType) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPropertyMap;
