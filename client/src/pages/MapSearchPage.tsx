import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Home, DollarSign, Bed, Bath } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  coordinates: { lat: number; lng: number };
  image: string;
}

const MapSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  // Fetch real properties for map
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setProperties(data.data.slice(0, 10)); // Show first 10 properties
        } else {
          // Fallback sample data if no properties in database
          setProperties([
            {
              id: 1,
              title: 'Modern Family Home',
              price: '2500000',
              address: 'Gaborone West',
              bedrooms: 3,
              bathrooms: 2,
              propertyType: 'house',
              images: '["https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
            },
            {
              id: 2,
              title: 'Luxury Apartment',
              price: '1800000',
              address: 'Francistown CBD',
              bedrooms: 2,
              bathrooms: 2,
              propertyType: 'apartment',
              images: '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
            },
            {
              id: 3,
              title: 'Safari Lodge Villa',
              price: '4500000',
              address: 'Maun',
              bedrooms: 5,
              bathrooms: 4,
              propertyType: 'house',
              images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"]'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Use fallback data
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location, neighborhood, or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>
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
          className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-beedab-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">Explore properties across Botswana</p>
              <div className="text-sm text-gray-500">
                Real-world mapping with OpenStreetMap integration
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Click on any property listing to see location on map
              </div>
            </div>
          </div>

          {/* Property markers */}
          <div className="absolute inset-0">
            {!loading && properties.map((property, index) => {
              const imageUrl = property.images ? 
                (typeof property.images === 'string' ? 
                  JSON.parse(property.images)[0] : 
                  property.images[0]) : 
                'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
              
              return (
                <div
                  key={property.id}
                  className={`absolute w-10 h-10 bg-beedab-blue rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-beedab-darkblue transition-all shadow-lg border-2 border-white ${
                    index === 0 ? 'top-1/3 left-1/4' : 
                    index === 1 ? 'top-1/4 right-1/3' : 
                    index === 2 ? 'bottom-1/3 left-1/3' :
                    index === 3 ? 'top-1/2 left-1/2' :
                    `top-${20 + (index % 3) * 20}% left-${15 + (index % 4) * 20}%`
                  }`}
                  onClick={() => setSelectedProperty({
                    ...property,
                    price: `P${parseInt(property.price || '0').toLocaleString()}`,
                    location: property.address,
                    image: imageUrl
                  })}
                  style={{
                    transform: selectedProperty?.id === property.id ? 'scale(1.3)' : 'scale(1)',
                    zIndex: selectedProperty?.id === property.id ? 10 : 5
                  }}
                >
                  P{Math.round(parseInt(property.price || '0') / 100000)}L
                </div>
              );
            })}
          </div>

          {/* Selected Property Popup */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm"
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
            {properties.map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedProperty?.id === property.id ? 'border-beedab-blue shadow-md' : 'border-gray-200'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                <p className="text-lg font-bold text-beedab-blue mb-2">{property.price}</p>
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
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MapSearchPage;