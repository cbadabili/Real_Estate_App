
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Home, DollarSign, Bed, Bath } from 'lucide-react';
import { PropertyMap } from '../components/properties/PropertyMap';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  coordinates?: [number, number];
  image: string;
  address: string;
  propertyType: string;
  images: string;
}

const MapSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.log('Fetching properties from API...');
        const response = await fetch('/api/properties');
        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          // Direct array response
          const propertiesWithCoords = data.map((property: any, index: number) => ({
            ...property,
            coordinates: [
              -24.6282 + (index * 0.05), // Gaborone area with slight offset
              25.9231 + (index * 0.05)
            ] as [number, number],
            location: property.address || property.city || property.location || 'Gaborone',
            bedrooms: property.bedrooms || 2,
            bathrooms: property.bathrooms || 1
          }));
          setProperties(propertiesWithCoords);
        } else if (data.success && Array.isArray(data.data)) {
          // Wrapped response
          const propertiesWithCoords = data.data.map((property: any, index: number) => ({
            ...property,
            coordinates: [
              -24.6282 + (index * 0.05),
              25.9231 + (index * 0.05)
            ] as [number, number],
            location: property.address || property.city || property.location || 'Gaborone',
            bedrooms: property.bedrooms || 2,
            bathrooms: property.bathrooms || 1
          }));
          setProperties(propertiesWithCoords);
        } else {
          // Always provide sample data for demonstration
          const sampleProperties = [
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
              images: '["https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
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
              images: '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
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
              images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
            }
          ];
          setProperties(sampleProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Always provide fallback sample data
        const sampleProperties = [
          {
            id: 1,
            title: 'Sample Property',
            price: '1500000',
            address: 'Gaborone CBD',
            location: 'Gaborone CBD',
            bedrooms: 2,
            bathrooms: 1,
            propertyType: 'apartment',
            coordinates: [-24.6282, 25.9231] as [number, number],
            images: '["https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
          }
        ];
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Filter properties based on search query
      const filtered = properties.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProperties(filtered);
    }
  };

  const handlePropertySelect = (property: any) => {
    const imageUrl = property.images ? 
      (typeof property.images === 'string' ? 
        JSON.parse(property.images)[0] : 
        property.images[0]) : 
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
    
    setSelectedProperty({
      ...property,
      price: `P${parseInt(property.price || '0').toLocaleString()}`,
      image: imageUrl
    });
  };

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
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : (
            <PropertyMap 
              properties={properties.map(prop => ({
                ...prop,
                price: parseInt(prop.price || '0')
              }))}
              center={[-22.3285, 24.6849]}
              zoom={6}
              height="100%"
            />
          )}

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
              const imageUrl = property.images ? 
                (typeof property.images === 'string' ? 
                  JSON.parse(property.images)[0] : 
                  property.images[0]) : 
                'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
              
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
                    P{parseInt(property.price || '0').toLocaleString()}
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
