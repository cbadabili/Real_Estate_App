import React, { useState, useEffect } from 'react';
import PropertyMap from '../components/properties/PropertyMap';
import { PropertyFilters } from '../components/properties/PropertyFilters';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MapPin, Filter, Search } from 'lucide-react';

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

const BuyMapPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000] as [number, number],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all'
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/properties?status=active');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched properties for Buy Map:', data);

      // Process coordinates and ensure they are valid numbers
      const propertiesWithCoords = data.map((property: any) => {
        // Convert coordinates to numbers and validate
        let lat = property.latitude;
        let lng = property.longitude;

        // If coordinates are strings, try to parse them
        if (typeof lat === 'string') lat = parseFloat(lat);
        if (typeof lng === 'string') lng = parseFloat(lng);

        // If coordinates are missing or invalid, assign default Gaborone area coordinates
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          // Generate random coordinates around Gaborone for demo purposes
          lat = -24.6282 + (Math.random() - 0.5) * 0.1;
          lng = 25.9231 + (Math.random() - 0.5) * 0.1;
          console.warn(`Property ${property.id} "${property.title}" has invalid coordinates, using demo coordinates: ${lat}, ${lng}`);
        }

        return {
          id: property.id,
          title: property.title,
          price: typeof property.price === 'string' ? parseInt(property.price) : property.price,
          latitude: lat,
          longitude: lng,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          location: property.location || property.address || `${property.city}, ${property.district}`,
          city: property.city || 'Gaborone',
          propertyType: property.propertyType || property.property_type || 'house',
          description: property.description
        };
      });

      console.log(`Loaded ${propertiesWithCoords.length} properties for Buy Map`);
      setProperties(propertiesWithCoords);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // You can add filtering logic here if needed
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    console.log('Selected property:', property);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProperties}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Buy Properties - Map View</h1>
          </div>
          <p className="text-gray-600">Explore available properties for sale on the interactive map</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{properties.length}</span> properties found
          </div>
        </div>

        <div className="flex gap-6 h-[80vh]">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
                <PropertyFilters 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  propertyCount={properties.length}
                />
              </div>
            </div>
          )}

          {/* Map */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
              <PropertyMap 
                properties={properties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
                height="100%"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {properties.length} properties for sale in Botswana
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMapPage;