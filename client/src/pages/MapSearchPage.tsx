
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Home, DollarSign, Bed, Bath } from 'lucide-react';
import { PropertyMap } from '../components/properties/PropertyMap';

interface Property {
  id: number;
  title: string;
  price: string | number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  coordinates?: [number, number];
  image: string;
  address: string;
  propertyType: string;
  images: string | string[];
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  property_type?: string;
}

const MapSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties from multiple sources...');
        setLoading(true);
        setError(null);

        // Try multiple endpoints
        const endpoints = [
          '/api/properties',
          '/api/rentals',
          '/api/services?section=find_pro'
        ];

        let allProperties: Property[] = [];

        for (const endpoint of endpoints) {
          try {
            console.log(`Fetching from ${endpoint}...`);
            const response = await fetch(endpoint);
            
            if (response.ok) {
              const data = await response.json();
              console.log(`Response from ${endpoint}:`, data);
              
              let fetchedProperties: any[] = [];
              
              if (Array.isArray(data)) {
                fetchedProperties = data;
              } else if (data.success && Array.isArray(data.data)) {
                fetchedProperties = data.data;
              } else if (data.data && Array.isArray(data.data)) {
                fetchedProperties = data.data;
              }

              // Convert to consistent format
              const convertedProperties = fetchedProperties.map((item: any, index: number) => {
                // Generate coordinates if not present
                const baseCoords = {
                  lat: item.latitude || item.lat || (-24.6282 + (index * 0.01)),
                  lng: item.longitude || item.lng || (25.9231 + (index * 0.01))
                };

                return {
                  id: item.id || `${endpoint}-${index}`,
                  title: item.title || item.name || `Property ${index + 1}`,
                  price: item.price || item.cost || '0',
                  location: item.location || item.address || item.city || 'Gaborone',
                  bedrooms: item.bedrooms || 2,
                  bathrooms: item.bathrooms || 1,
                  coordinates: [baseCoords.lat, baseCoords.lng] as [number, number],
                  image: getImageUrl(item.images || item.image),
                  address: item.address || item.location || item.city || 'Gaborone',
                  propertyType: item.property_type || item.propertyType || item.type || 'apartment',
                  images: item.images || item.image || '[]',
                  latitude: baseCoords.lat,
                  longitude: baseCoords.lng,
                  city: item.city || 'Gaborone',
                  district: item.district || 'South East'
                };
              });

              allProperties = [...allProperties, ...convertedProperties];
            }
          } catch (endpointError) {
            console.warn(`Failed to fetch from ${endpoint}:`, endpointError);
          }
        }

        // If no properties found, use sample data
        if (allProperties.length === 0) {
          console.log('No properties found, using sample data');
          allProperties = getSampleProperties();
        }

        console.log('Final properties:', allProperties);
        setProperties(allProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties');
        // Use sample data as fallback
        setProperties(getSampleProperties());
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getSampleProperties = (): Property[] => {
    return [
      {
        id: 1,
        title: 'Modern Family Home',
        price: '2500000',
        address: 'Gaborone West',
        location: 'Gaborone West',
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'house',
        coordinates: [-24.6282, 25.9231] as [number, number],
        images: '["https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]',
        image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        latitude: -24.6282,
        longitude: 25.9231,
        city: 'Gaborone',
        district: 'South East'
      },
      {
        id: 2,
        title: 'Luxury Apartment',
        price: '1800000',
        address: 'Francistown CBD',
        location: 'Francistown CBD',
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'apartment',
        coordinates: [-21.1699, 27.5084] as [number, number],
        images: '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        latitude: -21.1699,
        longitude: 27.5084,
        city: 'Francistown',
        district: 'North East'
      },
      {
        id: 3,
        title: 'Safari Lodge Villa',
        price: '4500000',
        address: 'Maun',
        location: 'Maun',
        bedrooms: 5,
        bathrooms: 4,
        propertyType: 'house',
        coordinates: [-19.9837, 23.4167] as [number, number],
        images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        latitude: -19.9837,
        longitude: 23.4167,
        city: 'Maun',
        district: 'North West'
      }
    ];
  };

  const getImageUrl = (images: any): string => {
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] : images;
      } catch {
        return images;
      }
    }
    if (Array.isArray(images)) {
      return images[0] || 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
    }
    return 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = properties.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProperties(filtered);
    }
  };

  const handlePropertySelect = (property: Property) => {
    const imageUrl = getImageUrl(property.images);
    
    setSelectedProperty({
      ...property,
      price: `P${parseInt(property.price?.toString() || '0').toLocaleString()}`,
      image: imageUrl
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location, neighborhood, or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </form>
            <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Map Area */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 relative"
        >
          <PropertyMap 
            properties={properties.map(prop => ({
              ...prop,
              price: parseInt(prop.price?.toString() || '0')
            }))}
            center={[-22.3285, 24.6849]}
            zoom={6}
            height="100%"
          />

          {/* Selected Property Popup */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-[1000]"
            >
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-semibold text-gray-900 mb-1">{selectedProperty.title}</h4>
              <p className="text-lg font-bold text-beedab-blue mb-2">{selectedProperty.price}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{selectedProperty.location}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Bed className="h-4 w-4" />
                  <span>{selectedProperty.bedrooms}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="h-4 w-4" />
                  <span>{selectedProperty.bathrooms}</span>
                </div>
              </div>
              <button className="w-full bg-beedab-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-beedab-darkblue transition-colors">
                View Details
              </button>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Properties List */}
        <motion.div 
          variants={itemVariants}
          className="w-96 bg-white border-l border-gray-200 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Properties Found</h3>
            <p className="text-sm text-gray-600">{properties.length} properties available</p>
          </div>

          <div className="space-y-4 p-4">
            {properties.map((property) => {
              const imageUrl = getImageUrl(property.images);
              
              return (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedProperty?.id === property.id ? 'border-beedab-blue shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => handlePropertySelect(property)}
                >
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                  <p className="text-lg font-bold text-beedab-blue mb-2">
                    P{parseInt(property.price?.toString() || '0').toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MapSearchPage;
