// @ts-nocheck

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, MapPin, Home, DollarSign } from 'lucide-react';
import { MortgageCalculator } from '../components/MortgageCalculator';

const PropertyValuationPage = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    yearBuilt: ''
  });

  const [valuation, setValuation] = useState(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock valuation calculation
    const baseValue = Math.random() * 2000000 + 500000;
    setValuation({
      estimatedValue: Math.round(baseValue),
      lowRange: Math.round(baseValue * 0.9),
      highRange: Math.round(baseValue * 1.1),
      confidenceLevel: 85
    });
  };

  const formatCurrency = (amount: number) => `BWP ${amount.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Valuation
          </h1>
          <p className="text-gray-600 mb-4">
            Get an instant property valuation powered by machine learning and local market data
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Disclaimer
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  This valuation is indicative only and should not be relied upon for financial decisions. 
                  For accurate property valuations, please consult with a certified property valuer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Property Details Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  value={propertyDetails.address}
                  onChange={(e) => setPropertyDetails({...propertyDetails, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Enter property address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyDetails.propertyType}
                  onChange={(e) => setPropertyDetails({...propertyDetails, propertyType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land_plot">Land/Plot</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={propertyDetails.bedrooms}
                    onChange={(e) => setPropertyDetails({...propertyDetails, bedrooms: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={propertyDetails.bathrooms}
                    onChange={(e) => setPropertyDetails({...propertyDetails, bathrooms: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (sqm)
                </label>
                <input
                  type="number"
                  value={propertyDetails.size}
                  onChange={(e) => setPropertyDetails({...propertyDetails, size: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  value={propertyDetails.yearBuilt}
                  onChange={(e) => setPropertyDetails({...propertyDetails, yearBuilt: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="2020"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Get Valuation
              </button>
            </form>
          </div>

          {/* Valuation Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Valuation Results</h2>
            
            {valuation ? (
              <div className="space-y-6">
                <div className="text-center bg-beedab-blue/10 rounded-lg p-6">
                  <Home className="h-12 w-12 text-beedab-blue mx-auto mb-4" />
                  <div className="text-3xl font-bold text-beedab-blue mb-2">
                    {formatCurrency(valuation.estimatedValue)}
                  </div>
                  <div className="text-gray-600">Estimated Market Value</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Value Range</span>
                    <span className="font-semibold">
                      {formatCurrency(valuation.lowRange)} - {formatCurrency(valuation.highRange)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Confidence Level</span>
                    <span className="font-semibold text-green-600">{valuation.confidenceLevel}%</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Market Insights</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Property values in this area have increased 12% this year</li>
                    <li>• Average time on market: 45 days</li>
                    <li>• High demand for this property type</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Home className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter property details to get your valuation</p>
              </div>
            )}
          </div>
        </div>

        {/* Mortgage Calculator Integration */}
        {valuation && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Mortgage Calculator</h2>
              <MortgageCalculator 
                propertyPrice={valuation.estimatedValue}
                onCalculationChange={(calculation) => {
                  console.log('Mortgage calculation updated:', calculation);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyValuationPage;
