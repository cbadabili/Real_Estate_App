import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Phone, 
  Mail, 
  MessageCircle,
  Calendar,
  Calculator,
  Eye,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { analytics } from '../lib/analytics';

// Placeholder for a LoadingSpinner component, assuming it exists elsewhere
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-beedab-blue"></div>
);

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  address: string;
  description: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  parking?: boolean;
  pool?: boolean;
  garden?: boolean;
  images: string[];
  agent: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    email: string;
    photo?: string;
    verified: boolean;
  };
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  listingDate: string;
  status: 'available' | 'sold' | 'under_contract';
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Renamed from 'loading' to 'isLoading' for clarity
  const [error, setError] = useState<Error | null>(null); // Added error state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  // Parse images safely
  const images = React.useMemo(() => {
    if (!property?.images) return [];
    
    try {
      if (typeof property.images === 'string') {
        return JSON.parse(property.images);
      } else if (Array.isArray(property.images)) {
        return property.images;
      }
    } catch (error) {
      console.warn('Failed to parse property images:', error);
    }
    
    return [];
  }, [property?.images]);

  // Get coordinates safely with proper null checks - MOVED TO TOP
  const coordinates = React.useMemo(() => {
    if (!property?.coordinates) return null;
    
    // Handle different coordinate formats
    if (Array.isArray(property.coordinates) && property.coordinates.length >= 2) {
      return [parseFloat(property.coordinates[0]), parseFloat(property.coordinates[1])];
    }
    
    // Handle string coordinates (lat,lng format)
    if (typeof property.coordinates === 'string') {
      try {
        const coords = property.coordinates.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          return coords;
        }
      } catch (e) {
        console.warn('Failed to parse coordinates:', property.coordinates);
      }
    }
    
    // Handle object coordinates {lat, lng}
    if (typeof property.coordinates === 'object' && property.coordinates.lat && property.coordinates.lng) {
      return [parseFloat(property.coordinates.lat), parseFloat(property.coordinates.lng)];
    }
    
    return null;
  }, [property?.coordinates]);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
      // Track page view
      analytics.pageViewed('property_detail', { property_id: id });
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state before fetching
      const response = await fetch(`/api/properties/${propertyId}`);

      if (response.ok) {
        const propertyData = await response.json();
        setProperty(propertyData);

        // Track property view
        analytics.propertyViewed(
          propertyData.id,
          propertyData.type,
          propertyData.price,
          propertyData.location
        );
      } else {
        // Handle non-OK responses, e.g., 404 Not Found
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        setError(new Error(errorData.message || `Failed to fetch property with status: ${response.status}`));
        setProperty(null); // Ensure property is null if fetch fails
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err : new Error('An unexpected error occurred during fetch.'));
      setProperty(null); // Ensure property is null if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAgent = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowContactForm(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Error Loading Property</h2>
          <p className="text-neutral-600 mb-4">Could not retrieve property details.</p>
          <p className="text-red-600 mb-4 text-sm">{error.message}</p>
          <button 
            onClick={() => navigate('/properties')}
            className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // Render "Not Found" state if property is null and not loading/error
  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Property Not Found</h2>
          <p className="text-neutral-600 mb-4">The property you're looking for doesn't exist or couldn't be loaded.</p>
          <button 
            onClick={() => navigate('/properties')}
            className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
              >
                <Heart 
                  className={`w-5 h-5 ${isFavorite(property.id) ? 'text-red-500 fill-current' : 'text-neutral-400'}`} 
                />
              </button>
              <button className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all">
                <Share2 className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Property Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative h-32 md:h-40">
              <img
                src={images.length > 0 ? images[currentImageIndex] : '/api/placeholder/800/600'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                <p className="text-2xl font-bold text-beedab-blue mb-4">
                  P {property.price.toLocaleString()}
                </p>
                <div className="flex items-center text-neutral-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  {property.location}
                </div>

                {/* Property Features */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center">
                      <Bed className="w-5 h-5 mr-2 text-neutral-500" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 mr-2 text-neutral-500" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {property.area !== undefined && (
                    <div className="flex items-center">
                      <Square className="w-5 h-5 mr-2 text-neutral-500" />
                      <span>{property.area} m²</span>
                    </div>
                  )}
                  {property.parking && (
                    <div className="flex items-center">
                      <Car className="w-5 h-5 mr-2 text-neutral-500" />
                      <span>Parking</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-neutral-600 leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                {Array.isArray(property.features) && property.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-sm text-neutral-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                {/* Agent Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Listed By</h3>
                  {property.agent ? (
                    <>
                      <div className="flex items-center mb-4">
                        <img
                          src={property.agent.photo || '/api/placeholder/60/60'}
                          alt={property.agent.name || 'Agent'}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-neutral-900">{property.agent.name || 'Unknown Agent'}</h4>
                          {property.agent.verified && (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                              <span className="text-sm text-green-600">Verified Agent</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={handleContactAgent}
                          className="w-full bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Agent
                        </button>
                        {property.agent.phone && (
                          <a
                            href={`tel:${property.agent.phone}`}
                            className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-neutral-100 rounded-lg">
                      <p className="text-neutral-600">Agent information not available</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Mortgage Calculator
                  </button>
                  <button className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Viewing
                  </button>
                </div>
              </div>
            </div>
          </div>

          
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;