import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    coordinates: [-24.6282, 25.9231],
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
    coordinates: [-21.1670, 27.5084],
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
    coordinates: [-20.0028, 23.4162],
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "house"
  }
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  properties = sampleProperties, 
  center = [-22.3285, 24.6849], // Center of Botswana
  zoom = 6,
  height = "400px"
}) => {
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
          <p className="text-sm text-gray-600 mb-2">Real-world mapping with OpenStreetMap integration</p>
          <p className="text-xs text-gray-500">Click on any property listing to see location on map</p>
        </div>

        <div style={{ height }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.filter(property => 
              property.coordinates && 
              property.coordinates.length === 2 &&
              property.coordinates[0] != null && 
              property.coordinates[1] != null &&
              !isNaN(property.coordinates[0]) && 
              !isNaN(property.coordinates[1])
            ).map((property) => (
              <Marker
                key={property.id}
                position={property.coordinates}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                    <p className="text-blue-600 font-semibold mb-1">
                      P{property.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                      </div>
                      <div>
                        <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                      </div>
                      <div>
                        <span className="font-medium">Area:</span> {property.area}m²
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {property.type}
                      </div>
                    </div>
                    <button className="mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
export { InteractiveMap };