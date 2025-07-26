import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Add custom styles for tooltips and popups
const customStyles = `
  .leaflet-container {
    z-index: 1 !important;
  }
  
  .leaflet-control-container {
    z-index: 1000 !important;
  }
  
  .leaflet-popup-pane {
    z-index: 1200 !important;
  }
  
  .custom-tooltip {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    z-index: 1200 !important;
  }
  
  .custom-tooltip::before {
    border-top-color: #e5e7eb !important;
  }
  
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  }
  
  .custom-popup .leaflet-popup-tip {
    background: white !important;
  }
  
  .custom-price-marker {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = customStyles;
  document.head.appendChild(styleElement);
}

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  // Botswana center coordinates with validation
  const defaultCenter: [number, number] = [-24.6282, 25.9231]; // Gaborone
  
  // Try to center on first valid property, fallback to Gaborone
  const getMapCenter = (): [number, number] => {
    const validProperty = properties.find(p =>
      p.latitude != null && p.longitude != null &&
      !isNaN(p.latitude) && !isNaN(p.longitude) &&
      isValidCoordinate(
        typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude,
        typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude
      )
    );
    return validProperty
      ? [
          typeof validProperty.latitude === 'string'
            ? parseFloat(validProperty.latitude)
            : validProperty.latitude,
          typeof validProperty.longitude === 'string'
            ? parseFloat(validProperty.longitude)
            : validProperty.longitude,
        ]
      : defaultCenter;
  };
  
  const center = getMapCenter();
  const zoom = 12;

  const formatPrice = (price: number) => {
    return `BWP ${price.toLocaleString()}`;
  };

  // Validate coordinates helper with Botswana bounds check
  const isValidCoordinate = (lat: any, lng: any) => {
    // Handle null/undefined explicitly
    if (lat === null || lat === undefined || lng === null || lng === undefined) {
      console.warn(`Null/undefined coordinates: lat=${lat}, lng=${lng}`);
      return false;
    }

    const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
    
    // Basic validation
    const isBasicValid = latNum != null && lngNum != null && 
           typeof latNum === 'number' && typeof lngNum === 'number' &&
           !isNaN(latNum) && !isNaN(lngNum) &&
           latNum !== 0 && lngNum !== 0; // Exclude 0,0 coordinates
    
    // Botswana bounds check (approximately -26.9 to -17.8 lat, 20.0 to 29.4 lng)
    const isInBotswana = isBasicValid && 
           latNum >= -26.9 && latNum <= -17.8 && 
           lngNum >= 20.0 && lngNum <= 29.4;
    
    if (!isBasicValid) {
      console.warn(`Invalid coordinate: lat=${lat} (type: ${typeof lat}), lng=${lng} (type: ${typeof lng})`);
      console.warn(`Parsed: lat=${latNum}, lng=${lngNum}`);
    } else if (!isInBotswana) {
      console.warn(`Coordinate outside Botswana bounds: lat=${latNum}, lng=${lngNum}`);
    }
    
    return isBasicValid && isInBotswana;
  };

  // Create custom markers with price display
  const createCustomIcon = (isSelected: boolean, price: number) => {
    const formattedPrice = price >= 1000 ? `BWP ${(price / 1000).toFixed(0)}k` : `BWP ${price}`;
    return L.divIcon({
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            background-color: ${isSelected ? '#ef4444' : '#2563eb'}; 
            color: white; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: 600; 
            white-space: nowrap; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 2px;
          ">
            ${formattedPrice}
          </div>
          <div style="
            background-color: ${isSelected ? '#ef4444' : '#2563eb'}; 
            width: 12px; 
            height: 12px; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        </div>
      `,
      iconSize: [60, 35],
      iconAnchor: [30, 35],
      className: 'custom-price-marker'
    });
  };

  return (
    <div className={className} style={{ height: "80vh", width: "100%", position: "relative", zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(() => {
          console.group('PropertyMap: Rendering Analysis');
          console.log(`Total properties received: ${properties.length}`);
          
          // Detailed property analysis
          properties.forEach((p, index) => {
            console.log(`Property ${index + 1}:`, {
              id: p.id,
              title: p.title,
              latitude: p.latitude,
              longitude: p.longitude,
              latType: typeof p.latitude,
              lngType: typeof p.longitude,
              latParsed: typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude,
              lngParsed: typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude
            });
          });
          
          const validProperties = properties.filter(property => {
            const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
            const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
            
            const isValid = isValidCoordinate(lat, lng);
            if (!isValid) {
              console.error(`❌ Invalid coordinates for property ${property.id} "${property.title}":`, {
                rawLat: property.latitude,
                rawLng: property.longitude,
                parsedLat: lat,
                parsedLng: lng,
                latType: typeof property.latitude,
                lngType: typeof property.longitude
              });
            } else {
              console.log(`✅ Valid coordinates for property ${property.id} "${property.title}": [${lat}, ${lng}]`);
            }
            return isValid;
          });
          
          console.log(`📊 Results: ${validProperties.length}/${properties.length} properties have valid coordinates`);
          
          if (validProperties.length === 0) {
            console.error('🚨 NO VALID PROPERTIES FOR MAP RENDERING');
            console.error('This explains why the map appears empty despite showing property count');
            console.error('Raw properties data for debugging:', properties);
          }
          
          console.groupEnd();
          
          return validProperties.map((property) => {
            const isSelected = selectedProperty?.id === property.id;
            const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
            const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
            
            console.log(`Rendering marker for property ${property.id} "${property.title}" at [${lat}, ${lng}]`);
            return (
            <Marker
              key={property.id}
              position={[lat, lng]}
              icon={createCustomIcon(isSelected, property.price)}
              eventHandlers={{
                click: () => {
                  onPropertySelect?.(property);
                },
                mouseover: (e) => {
                  // Show tooltip on hover
                  const tooltip = L.tooltip({
                    permanent: false,
                    direction: 'top',
                    className: 'custom-tooltip'
                  }).setContent(`
                    <div style="text-align: center; padding: 4px;">
                      <div style="font-weight: 600; color: #1f2937;">${property.title}</div>
                      <div style="font-size: 14px; color: #6b7280;">${formatPrice(property.price)}</div>
                      <div style="font-size: 12px; color: #9ca3af;">${property.bedrooms}bd • ${property.bathrooms}ba</div>
                    </div>
                  `);
                  e.target.bindTooltip(tooltip).openTooltip();
                },
                mouseout: (e) => {
                  e.target.closeTooltip();
                }
              }}
            >
              <Popup maxWidth={320} className="custom-popup">
                <div className="p-3">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-2">{property.title}</h3>
                    <div className="text-right">
                      <p className="text-blue-600 font-bold text-xl">
                        {formatPrice(property.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.price > 10000 ? 'For Sale' : 'Monthly Rent'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span className="flex-1">{property.location}, {property.city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">🛏️</span>
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">🚿</span>
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">🏠</span>
                        <span>{property.propertyType}</span>
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {property.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = isRentalContext ? `/rental/${property.id}` : `/properties/${property.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites functionality
                        console.log('Added to favorites:', property.id);
                      }}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
            );
          });
        })()}
      </MapContainer>
    </div>
  );
}