
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, MessageCircle, Clock, CheckCircle, XCircle, 
  TrendingUp, User, Calendar, FileText, AlertCircle, 
  ArrowUp, ArrowDown, Phone, Mail
} from 'lucide-react';

const HandleOffersPage = () => {
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);

  const offers = [
    {
      id: 1,
      property: 'Modern 3BR House in Phakalane',
      askingPrice: 1350000,
      offerAmount: 1250000,
      buyer: 'John Smith',
      buyerEmail: 'john@email.com',
      buyerPhone: '+267 7123 4567',
      submittedDate: '2024-01-10T10:00:00Z',
      expiryDate: '2024-01-15T17:00:00Z',
      status: 'pending',
      conditions: ['Subject to financing', 'Home inspection required', 'Appraisal contingency'],
      message: 'We love this property and are serious buyers. We can close within 30 days.',
      preApproved: true,
      cashBuyer: false,
      earnestMoney: 25000
    },
    {
      id: 2,
      property: 'Luxury Villa in Broadhurst',
      askingPrice: 3000000,
      offerAmount: 2800000,
      buyer: 'Sarah Johnson',
      buyerEmail: 'sarah@email.com',
      buyerPhone: '+267 7234 5678',
      submittedDate: '2024-01-08T14:30:00Z',
      expiryDate: '2024-01-12T17:00:00Z',
      status: 'countered',
      conditions: ['Subject to financing', 'Property inspection'],
      message: 'This is our dream home. We are flexible on closing date.',
      preApproved: true,
      cashBuyer: false,
      earnestMoney: 50000,
      counterOffer: 2900000,
      counterDate: '2024-01-11T16:00:00Z'
    },
    {
      id: 3,
      property: 'Family Home in Extension 15',
      askingPrice: 900000,
      offerAmount: 900000,
      buyer: 'Mike Brown',
      buyerEmail: 'mike@email.com',
      buyerPhone: '+267 7345 6789',
      submittedDate: '2024-01-05T11:00:00Z',
      expiryDate: '2024-01-10T17:00:00Z',
      status: 'accepted',
      conditions: ['Home inspection only'],
      message: 'Full asking price offer. Ready to proceed immediately.',
      preApproved: true,
      cashBuyer: true,
      earnestMoney: 45000,
      acceptedDate: '2024-01-06T09:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'countered': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'countered': return <TrendingUp className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const calculateDifference = (asking: number, offer: number) => {
    const diff = asking - offer;
    const percentage = (diff / asking) * 100;
    return { amount: diff, percentage };
  };

  const handleAcceptOffer = (offerId: number) => {
    // Implementation for accepting offer
    console.log(`Accepting offer ${offerId}`);
  };

  const handleRejectOffer = (offerId: number) => {
    // Implementation for rejecting offer
    console.log(`Rejecting offer ${offerId}`);
  };

  const handleCounterOffer = (offerId: number) => {
    setSelectedOffer(offerId);
    setShowCounterForm(true);
  };

  const submitCounterOffer = () => {
    // Implementation for submitting counter offer
    console.log(`Counter offer: ${counterOfferAmount}`);
    setShowCounterForm(false);
    setCounterOfferAmount('');
    setSelectedOffer(null);
  };

  const formatTimeRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Handle Offers</h1>
          <p className="text-neutral-600 mt-2">Review and manage property offers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Offers</p>
                <p className="text-2xl font-bold text-neutral-900">{offers.length}</p>
              </div>
              <FileText className="h-8 w-8 text-beedab-blue" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {offers.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Accepted</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {offers.filter(o => o.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg. Offer</p>
                <p className="text-2xl font-bold text-neutral-900">
                  P{Math.round(offers.reduce((sum, o) => sum + o.offerAmount, 0) / offers.length).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {offers.map((offer) => {
            const difference = calculateDifference(offer.askingPrice, offer.offerAmount);
            const isExpiringSoon = new Date(offer.expiryDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {offer.property}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Submitted: {new Date(offer.submittedDate).toLocaleDateString()}
                      </span>
                      <span className={`flex items-center ${isExpiringSoon ? 'text-red-600' : ''}`}>
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeRemaining(offer.expiryDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="ml-1 capitalize">{offer.status}</span>
                    </span>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-lg font-bold text-neutral-900">
                      P{offer.askingPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">Asking Price</div>
                  </div>
                  <div className="text-center p-4 bg-beedab-blue/10 rounded-lg">
                    <div className="text-lg font-bold text-beedab-blue">
                      P{offer.offerAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">Offer Amount</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600 flex items-center justify-center">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      P{difference.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {difference.percentage.toFixed(1)}% below asking
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">Buyer Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-neutral-600" />
                        <span className="text-neutral-700">{offer.buyer}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-neutral-600" />
                        <span className="text-neutral-700">{offer.buyerEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-neutral-600" />
                        <span className="text-neutral-700">{offer.buyerPhone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">Offer Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Pre-approved:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          offer.preApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.preApproved ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Cash Buyer:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          offer.cashBuyer ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {offer.cashBuyer ? 'Yes' : 'Financing'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Earnest Money:</span>
                        <span className="font-medium">P{offer.earnestMoney.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                {offer.conditions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-neutral-900 mb-3">Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.conditions.map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {offer.message && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Buyer's Message</h4>
                    <p className="text-blue-800 text-sm">{offer.message}</p>
                  </div>
                )}

                {/* Counter Offer Info */}
                {offer.counterOffer && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Your Counter Offer</h4>
                    <p className="text-orange-800">
                      <strong>Amount:</strong> P{offer.counterOffer.toLocaleString()}
                    </p>
                    <p className="text-orange-800 text-sm">
                      Sent on {new Date(offer.counterDate!).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {offer.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Offer
                      </button>
                      <button
                        onClick={() => handleCounterOffer(offer.id)}
                        className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Counter Offer
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  {offer.status === 'accepted' && (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Contract
                    </button>
                  )}
                  <button className="border border-neutral-300 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-50 transition-colors flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Buyer
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Counter Offer Modal */}
        {showCounterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Submit Counter Offer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Counter Offer Amount (P)
                  </label>
                  <input
                    type="number"
                    value={counterOfferAmount}
                    onChange={(e) => setCounterOfferAmount(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue"
                    placeholder="Enter counter offer amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue"
                    placeholder="Add a message to the buyer..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCounterForm(false)}
                    className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitCounterOffer}
                    className="flex-1 py-2 px-4 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Submit Counter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleOffersPage;
