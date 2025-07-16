import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect, className }: PropertyMapProps) {
  // Botswana center coordinates
  const center: [number, number] = [-24.6282, 25.9231]; // Gaborone
  const zoom = 12;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Create custom markers for selected properties
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      html: `<div style="background-color: ${isSelected ? '#ef4444' : '#2563eb'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      className: 'custom-marker'
    });
  };

  return (
    <div className={className} style={{ height: "80vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => {
                  onPropertySelect?.(property);
                }
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-blue-600 font-bold text-xl mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>📍 {property.location}, {property.city}</p>
                    <p>🛏️ {property.bedrooms} bed • 🚿 {property.bathrooms} bath</p>
                    <p>🏠 {property.propertyType}</p>
                  </div>
                  {property.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                  <button 
                    onClick={() => window.location.href = `/properties/${property.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}