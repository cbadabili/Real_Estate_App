import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2JhZGFiaWxpIiwiYSI6ImNrcHNkbmduZjBmYW0ycHQ4c2V2dmNpbjAifQ.2TxX-aS70swDry_8SrE7iQ';

interface Property {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  city: string;
  propertyType: string;
  description?: string;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  className?: string;
  isRentalContext?: boolean;
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect, className, isRentalContext = false }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Botswana center coordinates
  const defaultCenter: [number, number] = [25.9231, -24.6282]; // [lng, lat] for Mapbox

  // Validate coordinates helper with Botswana bounds check
  const isValidCoordinate = (lat: any, lng: any) => {
    if (lat === null || lat === undefined || lng === null || lng === undefined) {
      console.warn(`Null/undefined coordinates: lat=${lat}, lng=${lng}`);
      return false;
    }

    const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

    const isBasicValid = latNum != null && lngNum != null && 
           typeof latNum === 'number' && typeof lngNum === 'number' &&
           !isNaN(latNum) && !isNaN(lngNum) &&
           latNum !== 0 && lngNum !== 0;

    const isInBotswana = isBasicValid && 
           latNum >= -26.9 && latNum <= -17.8 && 
           lngNum >= 20.0 && lngNum <= 29.4;

    if (!isBasicValid) {
      console.warn(`Invalid coordinate: lat=${lat} (type: ${typeof lat}), lng=${lng} (type: ${typeof lng})`);
    } else if (!isInBotswana) {
      console.warn(`Coordinate outside Botswana bounds: lat=${latNum}, lng=${lngNum}`);
    }

    return isBasicValid && isInBotswana;
  };

  const formatPrice = (price: number) => {
    return `BWP ${price.toLocaleString()}`;
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 10
    });

    map.current.on('load', () => {
      setMapLoaded(true);
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

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    console.group('PropertyMap: Rendering Analysis');
    console.log(`Total properties received: ${properties.length}`);

    const validProperties = properties.filter(property => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

      const isValid = isValidCoordinate(lat, lng);
      if (!isValid) {
        console.error(`❌ Invalid coordinates for property ${property.id} "${property.title}":`, {
          rawLat: property.latitude,
          rawLng: property.longitude,
          parsedLat: lat,
          parsedLng: lng
        });
      } else {
        console.log(`✅ Valid coordinates for property ${property.id} "${property.title}": [${lng}, ${lat}]`);
      }
      return isValid;
    });

    console.log(`📊 Results: ${validProperties.length}/${properties.length} properties have valid coordinates`);
    console.groupEnd();

    // Add markers for valid properties
    validProperties.forEach(property => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

      const isSelected = selectedProperty?.id === property.id;
      const formattedPrice = property.price >= 1000 ? `BWP ${(property.price / 1000).toFixed(0)}k` : `BWP ${property.price}`;

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.style.cssText = `
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      `;

      markerElement.innerHTML = `
        <div style="
          background-color: ${isSelected ? '#ef4444' : '#2563eb'}; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 6px; 
          font-size: 12px; 
          font-weight: 600; 
          white-space: nowrap; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          margin-bottom: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          ${formattedPrice}
        </div>
        <div style="
          background-color: ${isSelected ? '#ef4444' : '#2563eb'}; 
          width: 14px; 
          height: 14px; 
          border-radius: 50%; 
          border: 3px solid white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `;

      // Create popup content
      const popupContent = `
        <div style="padding: 16px; min-width: 280px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <h3 style="font-weight: 600; font-size: 18px; color: #1f2937; margin: 0; flex: 1; padding-right: 8px;">${property.title}</h3>
            <div style="text-align: right;">
              <p style="color: #2563eb; font-weight: 700; font-size: 20px; margin: 0;">
                ${formatPrice(property.price)}
              </p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">
                ${property.price > 10000 ? 'For Sale' : 'Monthly Rent'}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              <span style="margin-right: 8px;">📍</span>
              <span>${property.location}, ${property.city}</span>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <div style="display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 4px;">🛏️</span>
                <span>${property.bedrooms} bed</span>
              </div>
              <div style="display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 4px;">🚿</span>
                <span>${property.bathrooms} bath</span>
              </div>
              <div style="display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 4px;">🏠</span>
                <span>${property.propertyType}</span>
              </div>
            </div>
          </div>

          ${property.description ? `
            <div style="margin-bottom: 12px;">
              <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.4;">
                ${property.description.length > 100 ? property.description.substring(0, 100) + '...' : property.description}
              </p>
            </div>
          ` : ''}

          <div style="display: flex; gap: 8px;">
            <button 
              onclick="window.location.href='${isRentalContext ? `/rental/${property.id}` : `/properties/${property.id}`}'"
              style="flex: 1; background-color: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; border: none; font-size: 14px; cursor: pointer; font-weight: 500;"
              onmouseover="this.style.backgroundColor='#1d4ed8'"
              onmouseout="this.style.backgroundColor='#2563eb'"
            >
              View Details
            </button>
            <button 
              style="padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer; font-size: 14px;"
              onmouseover="this.style.backgroundColor='#f9fafb'"
              onmouseout="this.style.backgroundColor='white'"
              onclick="console.log('Added to favorites:', ${property.id})"
            >
              ❤️
            </button>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        onPropertySelect?.(property);
      });

      markers.current.push(marker);
    });

    // Fit map to show all properties
    if (validProperties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validProperties.forEach(property => {
        const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
        const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
        bounds.extend([lng, lat]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }

  }, [properties, selectedProperty, onPropertySelect, isRentalContext, mapLoaded]);

  return (
    <div className={className} style={{ height: "80vh", width: "100%", position: "relative" }}>
      <div 
        ref={mapContainer} 
        style={{ height: "100%", width: "100%" }}
      />

      {!mapLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2563eb',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p style={{ margin: 0, color: '#6b7280' }}>Loading map...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}