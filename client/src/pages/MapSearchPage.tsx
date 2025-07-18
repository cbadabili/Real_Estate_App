import React, { useState, useEffect } from 'react';
import { PropertyMap } from '../components/properties/PropertyMap';
import { PropertyFilters } from '../components/properties/PropertyFilters';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

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

const MapSearchPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      // Transform properties to include coordinates if missing
      const propertiesWithCoords = data.map((property: any) => {
        const lat = property.latitude || (-24.6282 + (Math.random() - 0.5) * 0.1); // Gaborone area
        const lng = property.longitude || (25.9231 + (Math.random() - 0.5) * 0.1);
        
        console.log(`Property ${property.id}: original lat=${property.latitude}, lng=${property.longitude}, final lat=${lat}, lng=${lng}`);
        
        return {
          id: property.id,
          title: property.title,
          price: property.price,
          latitude: lat,
          longitude: lng,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          location: property.address || property.location,
          city: property.city,
          propertyType: property.propertyType,
          description: property.description
        };
      });

      console.log(`Fetched ${propertiesWithCoords.length} properties for map display`);
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

    // Apply filters to properties
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    fetch(`/api/properties?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => {
        const propertiesWithCoords = data.map((property: any) => ({
          id: property.id,
          title: property.title,
          price: property.price,
          latitude: property.latitude || (-24.6282 + (Math.random() - 0.5) * 0.1),
          longitude: property.longitude || (25.9231 + (Math.random() - 0.5) * 0.1),
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          location: property.address || property.location,
          city: property.city,
          propertyType: property.propertyType,
          description: property.description
        }));
        setProperties(propertiesWithCoords);
      })
      .catch(err => {
        console.error('Error filtering properties:', err);
        setError('Failed to filter properties.');
      });
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Map</h2>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Property Map Search</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              propertyCount={properties.length}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <PropertyMap 
                properties={properties}
                selectedProperty={null}
                onPropertySelect={() => {}}
                className="min-h-[600px]"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600">
            Showing {properties.length} properties on the map
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapSearchPage;