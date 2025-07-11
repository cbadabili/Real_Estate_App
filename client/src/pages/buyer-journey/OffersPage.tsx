import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, FileText, Clock, CheckCircle, XCircle, 
  AlertCircle, TrendingUp, Calculator, MessageCircle,
  Phone, Download, Upload, User, Calendar
} from 'lucide-react';

const OffersPage = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerConditions, setOfferConditions] = useState({
    financing: false,
    inspection: false,
    appraisal: false,
    saleOfCurrentHome: false
  });

  const myOffers = [
    {
      id: 1,
      property: "Modern 3BR House in Phakalane",
      offerAmount: 1250000,
      askingPrice: 1350000,
      status: "pending",
      submittedDate: "2024-01-10",
      responseDeadline: "2024-01-15",
      conditions: ["Financing", "Inspection"],
      counterOffer: null
    },
    {
      id: 2,
      property: "Luxury Villa in Broadhurst",
      offerAmount: 2800000,
      askingPrice: 3000000,
      status: "countered",
      submittedDate: "2024-01-08",
      responseDeadline: "2024-01-12",
      conditions: ["Financing", "Appraisal"],
      counterOffer: 2900000
    },
    {
      id: 3,
      property: "Family Home in Extension 15",
      offerAmount: 850000,
      askingPrice: 900000,
      status: "accepted",
      submittedDate: "2024-01-05",
      responseDeadline: "2024-01-10",
      conditions: ["Inspection"],
      counterOffer: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'countered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'countered': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Making Offers
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Submit competitive offers and negotiate the best deal for your dream property
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Offers */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">My Offers</h2>

              <div className="space-y-6">
                {myOffers.map(offer => (
                  <div key={offer.id} className="border border-neutral-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          {offer.property}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Submitted: {offer.submittedDate}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Deadline: {offer.responseDeadline}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(offer.status)}`}>
                        {getStatusIcon(offer.status)}
                        <span className="ml-1 capitalize">{offer.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-neutral-50 rounded-lg">
                        <div className="text-lg font-bold text-neutral-900">
                          P{offer.askingPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-600">Asking Price</div>
                      </div>
                      <div className="text-center p-3 bg-beedab-blue/10 rounded-lg">
                        <div className="text-lg font-bold text-beedab-blue">
                          P{offer.offerAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-600">Your Offer</div>
                      </div>
                      {offer.counterOffer && (
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-700">
                            P{offer.counterOffer.toLocaleString()}
                          </div>
                          <div className="text-sm text-neutral-600">Counter Offer</div>
                        </div>
                      )}
                    </div>

                    {offer.conditions.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-neutral-900">Conditions:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {offer.conditions.map((condition, index) => (
                            <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {offer.status === 'countered' && (
                        <>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                            Accept Counter
                          </button>
                          <button className="bg-beedab-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors">
                            Counter Again
                          </button>
                        </>
                      )}
                      {offer.status === 'accepted' && (
                        <button className="bg-beedab-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors">
                          Proceed to Contract
                        </button>
                      )}
                      <button className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                        View Details
                      </button>
                      <button className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Make New Offer */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Make New Offer</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Property
                  </label>
                  <select className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue">
                    <option value="">Choose a property...</option>
                    <option value="1">Modern 4BR House in Gaborone West</option>
                    <option value="2">Luxury Apartment in CBD</option>
                    <option value="3">Family Home in Mogoditshane</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Offer Amount (P)
                    </label>
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                      placeholder="Enter your offer amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Response Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Offer Conditions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(offerConditions).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setOfferConditions(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                        />
                        <span className="text-neutral-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Additional Terms
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                    placeholder="Enter any additional terms or conditions..."
                  />
                </div>

                <button 
                      onClick={() => window.open('/services?category=legal', '_blank')}
                      className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                    >
                      Draft Offer
                    </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Offer Calculator */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-beedab-blue" />
                Offer Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Property Value
                  </label>
                  <input
                    type="number"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                    placeholder="P 1,500,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Offer Percentage
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    defaultValue="85"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>70%</span>
                    <span>85%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="bg-beedab-blue/10 p-3 rounded-lg">
                  <div className="text-sm text-neutral-600">Suggested Offer</div>
                  <div className="text-lg font-bold text-beedab-blue">P 1,275,000</div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Market Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Average Days on Market</span>
                  <span className="text-sm font-medium">45 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Price Reductions</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Seller Motivation</span>
                  <span className="text-sm font-medium text-green-600">High</span>
                </div>
              </div>
            </div>

            {/* Professional Help */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button 
                      onClick={() => window.open('/services?category=legal', '_blank')}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Get Negotiation Help
                    </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Legal Consultation
                </button>
                <button className="w-full border border-neutral-300 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Offer Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;