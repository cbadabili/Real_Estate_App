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

  const property = {
    id: 1,
    title: 'Luxury Safari Lodge - Maun',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c669?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Maun, Botswana',
    coordinates: { lat: -19.9827, lng: 23.4221 },
    rating: 4.9,
    reviews: 127,
    pricePerNight: 850,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    minStay: 2,
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    instantBook: true,
    description: 'Experience the ultimate safari adventure at our luxury lodge in Maun, the gateway to the Okavango Delta. This stunning property offers an authentic African experience with modern amenities, guided game drives, and breathtaking wildlife viewing opportunities.',
    amenities: [
      { name: 'Safari Tours', icon: '🦁' },
      { name: 'Pool', icon: '🏊‍♂️' },
      { name: 'Game Viewing', icon: '🔭' },
      { name: 'All Meals Included', icon: '🍽️' },
      { name: 'WiFi', icon: '📶' },
      { name: 'Air Conditioning', icon: '❄️' },
      { name: 'Airport Transfer', icon: '✈️' },
      { name: 'Laundry Service', icon: '👕' }
    ],
    rules: [
      'No smoking inside the lodge',
      'Respect wildlife and follow guide instructions',
      'Quiet hours: 10 PM - 6 AM',
      'No pets allowed',
      'Check-in after 3:00 PM, Check-out before 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation up to 14 days before check-in. 50% refund for cancellations 7-14 days before. No refund for cancellations within 7 days.',
    host: {
      name: 'Safari Adventures BW',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      isSuperhost: true,
      joinedDate: 'June 2019',
      responseRate: '98%',
      responseTime: 'Within an hour',
      bio: 'We are a family-owned safari company providing authentic Botswana experiences for over 15 years.'
    }
  };

  const reviews = [
    {
      id: 1,
      guestName: 'Sarah Johnson',
      guestAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b6b7867c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      date: 'March 2024',
      comment: 'Absolutely incredible experience! The safari tours were amazing and the lodge was luxurious. The staff went above and beyond to make our stay memorable.'
    },
    {
      id: 2,
      guestName: 'Michael Chen',
      guestAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      date: 'February 2024',
      comment: 'Perfect location for exploring the Okavango Delta. The game drives were exceptional and we saw the Big Five! Highly recommend.'
    }
  ];

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.pricePerNight;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{property.rating}</span>
                  <span>({property.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-beedab-blue' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Safari lodge hosted by {property.host.name}</h2>
                  <img
                    src={property.host.avatar}
                    alt={property.host.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span>{property.maxGuests} guests</span>
                  <span>{property.bedrooms} bedrooms</span>
                  <span>{property.bathrooms} bathrooms</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <span className="text-2xl">{amenity.icon}</span>
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {property.rating} · {property.reviews} reviews
                  </h3>
                </div>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.guestAvatar}
                          alt={review.guestName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{review.guestName}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-beedab-blue">
                    P {property.pricePerNight.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per night</div>
                  {property.instantBook && (
                    <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-beedab-blue text-white text-sm rounded">
                      <CheckCircle className="h-4 w-4" />
                      Instant Book
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    >
                      {[...Array(property.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} guest{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="border-t pt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>P {property.pricePerNight.toLocaleString()} × {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                      <span>P {calculateTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>P {Math.floor(calculateTotalPrice() * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>P {(calculateTotalPrice() + Math.floor(calculateTotalPrice() * 0.1)).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={!checkIn || !checkOut}
                  className="w-full bg-beedab-blue text-white py-3 rounded-lg font-semibold hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {property.instantBook ? 'Book Now' : 'Request to Book'}
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
              <div className="relative h-96">
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

      {/* Application Form Modal */}
      {showApplicationForm && (
        <RentalApplicationForm
          rentalId={property.id}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
};

export default RentalDetailsPage;