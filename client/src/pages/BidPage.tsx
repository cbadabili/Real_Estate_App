
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gavel, ShoppingCart, Clock, DollarSign, AlertCircle, 
  User, Star, Phone, MessageCircle, ArrowLeft, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BidPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentBids, setCurrentBids] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showBuyNow, setShowBuyNow] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
          setShowBuyNow(data.allowBuyNow || false);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/properties/${id}/bids`);
        if (response.ok) {
          const data = await response.json();
          setCurrentBids(data);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchProperty();
    fetchBids();
  }, [id, isAuthenticated, navigate]);

  const placeBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) return;

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
        setBidAmount('');
        // Refresh bids
        const bidsResponse = await fetch(`/api/properties/${id}/bids`);
        if (bidsResponse.ok) {
          const data = await bidsResponse.json();
          setCurrentBids(data);
        }
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const buyNow = async () => {
    try {
      const response = await fetch(`/api/properties/${id}/buy-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id
        }),
      });

      if (response.ok) {
        navigate(`/purchase/${id}?type=buy-now`);
      }
    } catch (error) {
      console.error('Error buying now:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-beedab-blue"></div>
          <p className="mt-4 text-neutral-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Auction Not Found</h2>
          <p className="text-neutral-600 mb-4">The auction you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/auctions')}
            className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const highestBid = currentBids.length > 0 ? Math.max(...currentBids.map(bid => bid.amount)) : property.startingPrice || property.price;
  const minimumBid = highestBid + (property.bidIncrement || 1000);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Gavel className="h-4 w-4 mr-1" />
              Live Auction
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft || 'Ending Soon'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">{property.title}</h1>
              
              {property.images?.[0] && (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-beedab-blue">
                    P{highestBid.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Current Highest Bid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">
                    {currentBids.length}
                  </div>
                  <div className="text-sm text-neutral-600">Total Bids</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    P{minimumBid.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Next Minimum Bid</div>
                </div>
              </div>

              <p className="text-neutral-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-beedab-blue" />
                Bid History
              </h3>
              
              {currentBids.length === 0 ? (
                <p className="text-neutral-600 text-center py-8">No bids yet. Be the first to bid!</p>
              ) : (
                <div className="space-y-3">
                  {currentBids.slice(0, 10).map((bid, index) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-neutral-600" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900">
                            {bid.bidderName || 'Anonymous Bidder'}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {new Date(bid.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-beedab-blue">
                        P{bid.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bidding Panel */}
          <div className="lg:col-span-1">
            {/* Place Bid */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Place Your Bid</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bid Amount (minimum: P{minimumBid.toLocaleString()})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">P</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={minimumBid}
                      className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue"
                      placeholder={minimumBid.toString()}
                    />
                  </div>
                </div>

                <button
                  onClick={placeBid}
                  disabled={!bidAmount || parseFloat(bidAmount) < minimumBid}
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Gavel className="h-5 w-5 mr-2" />
                  Place Bid
                </button>

                {showBuyNow && (
                  <>
                    <div className="text-center text-neutral-500 text-sm">or</div>
                    <button
                      onClick={buyNow}
                      className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Buy Now - P{property.buyNowPrice?.toLocaleString() || property.price.toLocaleString()}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Auction Terms */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Auction Terms</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All bids are binding</li>
                <li>• Minimum bid increment: P{property.bidIncrement?.toLocaleString() || '1,000'}</li>
                <li>• Buyer's premium may apply</li>
                <li>• Payment required within 48 hours</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Questions?</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Auctioneer
                </button>
                <button className="w-full bg-neutral-600 text-white py-2 px-4 rounded-lg hover:bg-neutral-700 transition-colors flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call for Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidPage;
