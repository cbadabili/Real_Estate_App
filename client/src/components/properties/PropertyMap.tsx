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
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter properties with valid coordinates
  const validProperties = properties.filter(property => {
    const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
    const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

    const isValid = lat != null && lng != null && 
                   !isNaN(lat) && !isNaN(lng) && 
                   lat !== 0 && lng !== 0;

    return isValid;
  });

  console.log(`PropertyMap: ${validProperties.length} valid properties out of ${properties.length} total`);

  const getPropertyIcon = (type?: string) => {
    switch (type) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'land_plot': case 'land': return '🌾';
      case 'townhouse': return '🏘️';
      case 'commercial': return '🏪';
      default: return '🏠';
    }
  };

  const formatPrice = (price: number) => {
    return `P${price.toLocaleString()}`;
  };

  // Generate map URL with markers for valid properties
  const generateMapUrl = () => {
    const center = validProperties.length > 0 
      ? {
          lat: validProperties.reduce((sum, p) => sum + (typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude), 0) / validProperties.length,
          lng: validProperties.reduce((sum, p) => sum + (typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude), 0) / validProperties.length
        }
      : { lat: -24.6282, lng: 25.9231 }; // Default to Gaborone

    const zoom = validProperties.length === 1 ? 14 : 11;

    // Create markers parameter for Google Maps
    const markers = validProperties.slice(0, 20).map(property => { // Limit to 20 markers to avoid URL length issues
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
      return `${lat},${lng}`;
    }).join('|');

    const markersParam = markers ? `&markers=color:red|${markers}` : '';

    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHqfeaM&center=${center.lat},${center.lng}&zoom=${zoom}${markersParam}`;
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const handlePropertyClick = (property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
        {mapLoaded ? (
          <iframe
            src={generateMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Count Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium">
            {validProperties.length} properties found
          </span>
        </div>
      </div>

      {/* Property List Overlay */}
      {validProperties.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md max-w-xs max-h-96 overflow-y-auto z-10">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Properties on Map</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {validProperties.slice(0, 10).map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedProperty?.id === property.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getPropertyIcon(property.propertyType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.title}
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {property.address || property.city || 'Gaborone'}
                    </p>
                    {property.bedrooms !== undefined && property.bedrooms > 0 && (
                      <p className="text-xs text-gray-500">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {validProperties.length > 10 && (
              <div className="p-3 text-center text-sm text-gray-500">
                +{validProperties.length - 10} more properties
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-10">
        <div className="text-xs text-gray-600">
          <div className="font-semibold mb-1">Property Types:</div>
          <div className="space-y-1">
            <div>🏠 Houses • 🏢 Apartments</div>
            <div>🌾 Land/Plots • 🏘️ Townhouses</div>
            <div>🏪 Commercial</div>
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
              {properties.length > 0 
                ? 'Properties found but missing location coordinates'
                : 'No properties available to display on map'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;