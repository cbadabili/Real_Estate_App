import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Users,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeValueAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareMeters: '',
    yearBuilt: '',
    condition: ''
  });

  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAutomatedValue = () => {
    setIsCalculating(true);

    // Automated valuation algorithm based on property data
    setTimeout(() => {
      const baseValue = {
        'house': 800000,
        'apartment': 500000,
        'townhouse': 650000,
        'plot': 150000
      }[formData.propertyType] || 600000;

      const bedroomMultiplier = parseInt(formData.bedrooms) * 80000;
      const bathroomMultiplier = parseInt(formData.bathrooms) * 50000;
      const sizeMultiplier = parseInt(formData.squareMeters) * 2000;

      const ageAdjustment = formData.yearBuilt ? 
        (2024 - parseInt(formData.yearBuilt)) * -5000 : 0;

      const conditionMultiplier = {
        'excellent': 1.2,
        'good': 1.0,
        'fair': 0.85,
        'poor': 0.7
      }[formData.condition] || 1.0;

      const calculatedValue = Math.round(
        (baseValue + bedroomMultiplier + bathroomMultiplier + sizeMultiplier + ageAdjustment) * conditionMultiplier
      );

      setEstimatedValue(calculatedValue);
      setShowResults(true);
      setIsCalculating(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAutomatedValue();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-500 hover:text-beedab-blue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Value Assessment</h1>
              <p className="text-gray-600">Get your property valued by professional assessors</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                placeholder="Enter your property address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Bedrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Bathrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Meters
                </label>
                <input
                  type="number"
                  name="squareMeters"
                  value={formData.squareMeters}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Enter size in sqm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Enter year built"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select Condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-beedab-blue text-white font-semibold rounded-lg hover:bg-beedab-darkblue transition-colors"
                disabled={isCalculating}
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isCalculating ? 'Calculating...' : 'Get Valuation'}
              </button>
            </div>
          </form>

          {showResults && estimatedValue !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-gray-100 rounded-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Estimated Property Value:
              </h2>
              <p className="text-2xl font-bold text-beedab-blue">
                ${estimatedValue.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">
                This is an automated estimate. For a precise valuation, contact our service providers.
              </p>
              <Link to="/service-providers" className="mt-4 inline-block px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                  Contact Valuers
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeValueAssessmentPage;