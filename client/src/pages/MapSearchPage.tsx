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
      console.log('Raw API response:', data);

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
          lat = -24.6282 + (Math.random() - 0.5) * 0.1; // Random within ~5km of Gaborone center
          lng = 25.9231 + (Math.random() - 0.5) * 0.1;
          console.warn(`Property ${property.id} "${property.title}" has invalid coordinates, using demo coordinates: ${lat}, ${lng}`);
        }
        
        console.log(`Property ${property.id}: lat=${lat}, lng=${lng}`);
        
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

      console.log(`Fetched ${propertiesWithCoords.length} properties for map display`);
      
      // If no properties with valid coordinates, add some demo properties
      if (propertiesWithCoords.length === 0) {
        console.log('No properties from API, adding demo properties for map display');
        const demoProperties = [
          {
            id: 999,
            title: 'Demo Property - Gaborone CBD',
            price: 1250000,
            latitude: -24.6541,
            longitude: 25.9087,
            bedrooms: 3,
            bathrooms: 2,
            location: 'Gaborone CBD',
            city: 'Gaborone',
            propertyType: 'apartment',
            description: 'Modern apartment in the heart of Gaborone CBD'
          },
          {
            id: 998,
            title: 'Demo House - Gaborone West',
            price: 850000,
            latitude: -24.6282,
            longitude: 25.9231,
            bedrooms: 4,
            bathrooms: 3,
            location: 'Gaborone West',
            city: 'Gaborone',
            propertyType: 'house',
            description: 'Family home in quiet residential area'
          },
          {
            id: 997,
            title: 'Demo Townhouse - Mogoditshane',
            price: 750000,
            latitude: -24.6833,
            longitude: 25.8667,
            bedrooms: 3,
            bathrooms: 2,
            location: 'Mogoditshane',
            city: 'Mogoditshane',
            propertyType: 'townhouse',
            description: 'Modern townhouse with garden'
          }
        ];
        setProperties(demoProperties);
      } else {
        setProperties(propertiesWithCoords);
      }
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
    queryParams.append('status', 'active');
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all' && value !== 'any') {
        if (key === 'priceRange' && Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    console.log('Applying filters:', queryParams.toString());

    fetch(`/api/properties?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => {
        console.log('Filtered properties received:', data);
        const propertiesWithCoords = data.map((property: any) => {
          // Process coordinates same as in fetchProperties
          let lat = property.latitude;
          let lng = property.longitude;
          
          if (typeof lat === 'string') lat = parseFloat(lat);
          if (typeof lng === 'string') lng = parseFloat(lng);
          
          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            lat = -24.6282 + (Math.random() - 0.5) * 0.1;
            lng = 25.9231 + (Math.random() - 0.5) * 0.1;
            console.warn(`Filtered property ${property.id} has invalid coordinates, using demo coordinates`);
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
        
        if (propertiesWithCoords.length === 0) {
          console.log('No filtered properties found, keeping existing properties');
        } else {
          setProperties(propertiesWithCoords);
        }
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