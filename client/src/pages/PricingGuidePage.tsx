
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Home, MapPin, Calculator, DollarSign, 
  BarChart3, Target, Zap, ArrowRight, Info
} from 'lucide-react';

const PricingGuidePage = () => {
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const calculatePrice = () => {
    // Mock calculation based on inputs
    const basePrice = 800000;
    const locationMultiplier = location === 'gaborone' ? 1.5 : location === 'francistown' ? 1.2 : 1.0;
    const sizeMultiplier = parseInt(size) ? parseInt(size) / 1000 : 1;
    const bedroomMultiplier = parseInt(bedrooms) ? parseInt(bedrooms) * 0.2 + 0.8 : 1;
    
    const calculated = basePrice * locationMultiplier * sizeMultiplier * bedroomMultiplier;
    setSuggestedPrice(calculated);
  };

  const marketTrends = [
    {
      area: 'Gaborone CBD',
      trend: 'up',
      change: '+8.5%',
      avgPrice: 'P1,200,000',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      area: 'Phakalane',
      trend: 'up',
      change: '+5.2%',
      avgPrice: 'P2,800,000',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      area: 'Mogoditshane',
      trend: 'stable',
      change: '+1.8%',
      avgPrice: 'P750,000',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      area: 'Francistown',
      trend: 'up',
      change: '+3.1%',
      avgPrice: 'P650,000',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const pricingFactors = [
    {
      factor: 'Location',
      impact: 'High',
      description: 'Proximity to CBD, schools, and amenities',
      weight: '35%'
    },
    {
      factor: 'Property Size',
      impact: 'High',
      description: 'Plot size and building area',
      weight: '25%'
    },
    {
      factor: 'Property Condition',
      impact: 'Medium',
      description: 'Age, maintenance, and renovations',
      weight: '20%'
    },
    {
      factor: 'Market Demand',
      impact: 'Medium',
      description: 'Current buyer interest in the area',
      weight: '20%'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Property Pricing Guide
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Get accurate property valuations and market insights to price your property competitively
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <Calculator className="h-6 w-6 mr-2 text-beedab-blue" />
                Property Valuation Calculator
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                  >
                    <option value="">Select property type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                  >
                    <option value="">Select location</option>
                    <option value="gaborone">Gaborone</option>
                    <option value="francistown">Francistown</option>
                    <option value="maun">Maun</option>
                    <option value="kasane">Kasane</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Size (sqm)
                  </label>
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                    placeholder="Enter size in square meters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-beedab-blue"
                  >
                    <option value="">Select bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculatePrice}
                className="w-full bg-beedab-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
              >
                <Target className="h-5 w-5 mr-2" />
                Calculate Property Value
              </button>

              {suggestedPrice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Suggested Price Range
                  </h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    P{Math.round(suggestedPrice * 0.9).toLocaleString()} - P{Math.round(suggestedPrice * 1.1).toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">
                    Based on current market conditions and comparable properties
                  </p>
                </motion.div>
              )}
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Market Trends</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-900">{trend.area}</h3>
                      <trend.icon className={`h-5 w-5 ${trend.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">
                      {trend.avgPrice}
                    </div>
                    <div className={`text-sm ${trend.color} font-medium`}>
                      {trend.change} this quarter
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Factors */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Pricing Factors</h2>

              <div className="space-y-4">
                {pricingFactors.map((factor, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-900">{factor.factor}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                        factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                    <p className="text-neutral-600 text-sm mb-2">{factor.description}</p>
                    <div className="text-sm font-medium text-beedab-blue">
                      Weight: {factor.weight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Professional Valuation */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Professional Valuation
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                Get an accurate valuation from certified property valuers
              </p>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Book Valuation
              </button>
            </div>

            {/* Market Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Market Reports
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Q4 2024 Report</span>
                  <button className="text-beedab-blue text-sm hover:underline">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Annual Trends</span>
                  <button className="text-beedab-blue text-sm hover:underline">
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Area Analysis</span>
                  <button className="text-beedab-blue text-sm hover:underline">
                    Explore
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Pricing Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Research comparable properties in your area</li>
                <li>• Consider current market conditions</li>
                <li>• Account for property condition and features</li>
                <li>• Be flexible with pricing strategy</li>
                <li>• Monitor market response and adjust accordingly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingGuidePage;
