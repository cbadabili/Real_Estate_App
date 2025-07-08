
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, Phone, MessageCircle, 
  Calendar, Eye, Camera, Car, Shield, Wifi, Wind, Zap, 
  ChevronLeft, ChevronRight, User, Star, Clock, DollarSign,
  Gavel, ShoppingCart, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
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
  const features = typeof property.features === 'string' ? JSON.parse(property.features) : property.features || [];

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
              </div>
            </div>

            {/* Seller/Agent Info (Only for authenticated users) */}
            {isAuthenticated && (
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
                <button className="w-full bg-beedab-lightblue text-beedab-darkblue py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
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
    </div>
  );
};

export default PropertyDetailsPage;
