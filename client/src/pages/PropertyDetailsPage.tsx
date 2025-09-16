import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, Phone, MessageCircle, 
  Calendar, Eye, Camera, Car, Shield, Wifi, Wind, Zap, 
  ChevronLeft, ChevronRight, User, Star, Clock, DollarSign,
  Gavel, ShoppingCart, AlertCircle, Calculator
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MortgageCalculator } from '../components/MortgageCalculator';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowContactForm(true);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Navigate to purchase flow
    navigate(`/purchase/${id}`);
  };

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowBidForm(true);
  };

  const submitBid = async () => {
    try {
      const response = await fetch(`/api/properties/${id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(bidAmount),
          userId: user?.id
        }),
      });

      if (response.ok) {
        alert('Bid placed successfully!');
        setShowBidForm(false);
        setBidAmount('');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-beedab-blue"></div>
          <p className="mt-4 text-neutral-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Property Not Found</h2>
          <p className="text-neutral-600 mb-4">The property you're looking for doesn't exist.</p>
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

  const images = property.images || ['/api/placeholder/600/400'];
  // Safely parse features data to ensure it's always an array
  let features: string[] = [];
  try {
    if (typeof property.features === 'string') {
      const parsed = JSON.parse(property.features);
      features = Array.isArray(parsed) ? parsed : [];
    } else if (Array.isArray(property.features)) {
      features = property.features;
    }
  } catch (error) {
    console.warn('Failed to parse features data:', error);
    features = [];
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] bg-neutral-900">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Camera className="h-4 w-4 mr-2" />
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="h-6 w-6" />
          </button>
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                  <p className="text-neutral-600 flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address || `${property.city}, ${property.state}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-beedab-blue mb-1">
                    P{parseFloat(property.price || '0').toLocaleString()}
                  </div>
                  {property.pricePerSqft && (
                    <div className="text-sm text-neutral-600">
                      P{property.pricePerSqft}/sqm
                    </div>
                  )}
                </div>
              </div>

              {/* Property specs */}
              <div className="flex flex-wrap gap-6 text-neutral-700 mb-4">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-beedab-blue" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="ml-1">bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-beedab-blue" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="ml-1">bathrooms</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-beedab-blue" />
                    <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                    <span className="ml-1">sqm</span>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-beedab-blue" />
                    <span className="font-medium">{property.lotSize}</span>
                    <span className="ml-1">lot size</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-beedab-blue" />
                  <span>{property.views || 0} views</span>
                </div>
              </div>

              {/* Listing type and status */}
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.listingType === 'fsbo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {property.listingType?.toUpperCase()}
                </span>

                {property.isAuction && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center">
                    <Gavel className="h-4 w-4 mr-1" />
                    Auction
                  </span>
                )}

                <span className="text-sm text-neutral-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Description</h2>
              <p className="text-neutral-700 leading-relaxed">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-neutral-700">
                      <div className="w-2 h-2 bg-beedab-blue rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Interested in this property?</h3>

              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Please register to view seller details and contact options
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now
                </button>

                {/* Bid Button (if auction) */}
                {property.isAuction && (
                  <button
                    onClick={handlePlaceBid}
                    className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center"
                  >
                    <Gavel className="h-5 w-5 mr-2" />
                    Place Bid
                  </button>
                )}

                {/* Contact Buttons */}
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat with {property.listingType === 'agent' ? 'Agent' : 'Owner'}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => window.open(`tel:${property.sellerPhone || '+267 12345678'}`, '_self')}
                    className="w-full bg-neutral-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-700 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call {property.listingType === 'agent' ? 'Agent' : 'Owner'}
                  </button>
                )}

                <button 
                  onClick={() => navigate(`/properties/${id}/schedule-viewing`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Seller/Agent Info (Only for authenticated users) */}
            {isAuthenticated ? (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  {property.listingType === 'agent' ? 'Listing Agent' : 'Property Owner'}
                </h3>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-neutral-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">
                      {property.sellerName || 'John Doe'}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`}
                        />
                      ))}
                      <span className="text-sm text-neutral-600 ml-2">4.8 (23 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{property.sellerPhone || '+267 1234 5678'}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>{property.sellerEmail || 'agent@beedab.com'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Please <button onClick={() => navigate('/login')} className="underline font-medium">register or login</button> to view contact details
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Mortgage Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Loan Amount</label>
                  <input
                    type="text"
                    value={`P${parseFloat(property.price || '0').toLocaleString()}`}
                    readOnly
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50"
                  />
                </div>
                <button 
                onClick={() => setShowMortgageCalculator(true)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Monthly Payment
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Place Your Bid</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Bid Amount (minimum: P{parseFloat(property.price || '0').toLocaleString()})
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="Enter your bid amount"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBidForm(false)}
                  className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBid}
                  disabled={!bidAmount || parseFloat(bidAmount) < parseFloat(property.price)}
                  className="flex-1 py-2 px-4 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Bid
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mortgage Calculator Modal */}
      {showMortgageCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Monthly Payment Calculator</h3>
              <button 
                onClick={() => setShowMortgageCalculator(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ×
              </button>
            </div>
            <MortgageCalculator propertyPrice={property.price} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
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
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProperty(id);
      // Track page view
      analytics.pageViewed('property_detail', { property_id: id });
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
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
        console.error('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!property) return;
    
    const whatsappNumber = property.agent.whatsapp || property.agent.phone;
    const message = `Hello! I'm interested in the property: ${property.title} (BWP ${property.price.toLocaleString()}). I'd like to schedule a viewing. Property ID: ${property.id}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Track contact initiation
    analytics.contactInitiated(property.id, 'whatsapp', property.agent.id);
    
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneCall = () => {
    if (!property) return;
    
    // Track contact initiation
    analytics.contactInitiated(property.id, 'phone', property.agent.id);
    
    window.location.href = `tel:${property.agent.phone}`;
  };

  const handleEmailContact = () => {
    if (!property) return;
    
    const subject = `Inquiry about ${property.title}`;
    const body = `Hello,\n\nI'm interested in viewing the property: ${property.title}\nPrice: BWP ${property.price.toLocaleString()}\nLocation: ${property.location}\n\nProperty ID: ${property.id}\n\nPlease let me know available viewing times.\n\nThank you!`;
    
    // Track contact initiation
    analytics.contactInitiated(property.id, 'email', property.agent.id);
    
    window.location.href = `mailto:${property.agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title || 'Property Listing',
      text: `Check out this property: ${property?.title} - BWP ${property?.price.toLocaleString()}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleScheduleViewing = () => {
    // Track viewing scheduling intent
    analytics.viewingScheduled(property?.id || '', 'form');
    
    // Open contact form or navigate to booking page
    setShowContactForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite(property.id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-96">
                <img
                  src={property.images[currentImageIndex] || '/api/placeholder/800/400'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? property.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === property.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {property.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-beedab-blue' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-beedab-blue">
                    BWP {property.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {property.type}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-4 mb-6">
                {property.bedrooms && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Bed className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Bath className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Square className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{property.area} sqm</span>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Car className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">Parking</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <img
                  src={property.agent.photo || '/api/placeholder/60/60'}
                  alt={property.agent.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {property.agent.name}
                    {property.agent.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">Property Agent</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* WhatsApp Contact */}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact on WhatsApp
                </button>

                {/* Schedule Viewing */}
                <button
                  onClick={handleScheduleViewing}
                  className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </button>

                {/* Alternative Contact Methods */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePhoneCall}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button
                    onClick={handleEmailContact}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Tools</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    analytics.calculatorUsed('mortgage', { property_price: property.price });
                    navigate(`/mortgage-calculator?price=${property.price}`);
                  }}
                  className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Mortgage Calculator
                </button>
                
                <button
                  onClick={() => {
                    analytics.featureUsed('neighborhood_insights', property.location);
                    navigate(`/neighborhood/${encodeURIComponent(property.location)}`);
                  }}
                  className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Neighborhood Insights
                </button>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.listingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-medium">{property.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium capitalize ${
                    property.status === 'available' ? 'text-green-600' :
                    property.status === 'sold' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {property.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
