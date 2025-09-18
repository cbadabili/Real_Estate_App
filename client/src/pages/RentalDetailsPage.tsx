import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Car,
  Wifi,
  Star,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RentalApplicationForm from '../components/RentalApplicationForm';

interface RentalProperty {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  district: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  monthly_rent: number;
  deposit_amount: number;
  lease_duration: number;
  available_from: string;
  furnished: boolean;
  pets_allowed: boolean;
  parking_spaces: number;
  photos: string[];
  amenities: string[];
  utilities_included: string[];
  status: string;
  created_at: string;
  landlord_id: number;
}

const RentalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<RentalProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/rentals/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data);
      } else {
        navigate('/rent');
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      navigate('/rent');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = (applicationData: any) => {
    setApplicationSubmitted(true);
    setShowApplicationForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <button 
            onClick={() => navigate('/rent')}
            className="text-beedab-blue hover:text-beedab-darkblue"
          >
            Back to rentals
          </button>
        </div>
      </div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  const images = property.photos.length > 0 ? property.photos : defaultImages;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/rent')}
            className="flex items-center text-beedab-blue hover:text-beedab-darkblue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to rentals
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="relative h-64 md:h-80"></div>
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-beedab-blue' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}, {property.city}, {property.district}</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span>{property.square_meters}m²</span>
                </div>
                {property.parking_spaces > 0 && (
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    <span>{property.parking_spaces} parking</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                  {property.property_type}
                </span>
                {property.furnished && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                    Furnished
                  </span>
                )}
                {property.pets_allowed && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
                    Pets Allowed
                  </span>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Amenities & Utilities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h3>
              
              {property.amenities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.utilities_included.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Utilities Included</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.utilities_included.map((utility, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {utility}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-beedab-blue mb-1">
                  P{property.monthly_rent.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit:</span>
                  <span className="font-medium">P{property.deposit_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease Duration:</span>
                  <span className="font-medium">{property.lease_duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available From:</span>
                  <span className="font-medium">{new Date(property.available_from).toLocaleDateString()}</span>
                </div>
              </div>

              {user ? (
                applicationSubmitted ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Application Submitted!</p>
                    <p className="text-sm text-gray-500 mt-1">
                      The landlord will review your application and get back to you.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-beedab-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                  >
                    Apply Now
                  </button>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Sign in to apply for this rental</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-beedab-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 text-center">
                You won't be charged until your application is approved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal - Temporarily commented out */}
      {/* {showApplicationForm && (
        <RentalApplicationForm
          rentalId={property.id}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApplicationSubmit}
        />
      )} */}
    </div>
  );
};

export default RentalDetailsPage;