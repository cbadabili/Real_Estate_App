import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface ValuationData {
  currentValue: number;
  previousValue: number;
  confidence: number;
  pricePerSqm: number;
  marketTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastUpdated: Date;
  comparableProperties: number;
  marketActivity: 'high' | 'medium' | 'low';
}

interface ValuationCardProps {
  propertyId: string;
  address: string;
  squareMeters: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  className?: string;
}

/**
 * Feature: AI Property Valuation System
 * Addresses pain point: Lack of transparent, data-driven property pricing in Botswana
 * Provides automated property valuations based on market data and comparable sales
 */
export const ValuationCard: React.FC<ValuationCardProps> = ({
  propertyId,
  address,
  squareMeters,
  propertyType,
  bedrooms,
  bathrooms,
  className = ''
}) => {
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement actual API call to valuation service
  const fetchValuation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock valuation data based on property characteristics
      const basePrice = 850000; // Base price for Gaborone area
      const pricePerSqm = basePrice / squareMeters;
      
      const mockValuation: ValuationData = {
        currentValue: basePrice + (Math.random() * 200000 - 100000), // ±100k variation
        previousValue: basePrice * 0.95, // 5% lower than current
        confidence: 75 + Math.random() * 20, // 75-95% confidence
        pricePerSqm,
        marketTrend: Math.random() > 0.4 ? 'up' : 'down',
        trendPercentage: 2 + Math.random() * 8, // 2-10% trend
        lastUpdated: new Date(),
        comparableProperties: 15 + Math.floor(Math.random() * 10),
        marketActivity: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
      };

      setValuation(mockValuation);
    } catch (err) {
      setError('Failed to fetch valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  }, [propertyId]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMarketActivityColor = (activity: string): string => {
    switch (activity) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 border border-red-200 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchValuation}
            className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-beedab-blue to-beedab-darkblue text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">AI Property Valuation</h3>
            <div className="flex items-center text-blue-100 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{address}</span>
            </div>
          </div>
          <button
            onClick={fetchValuation}
            disabled={isLoading}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing market data...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        ) : valuation ? (
          <div className="space-y-6">
            {/* Current Valuation */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(valuation.currentValue)}
              </p>
              <div className="flex items-center justify-center mt-2">
                {valuation.marketTrend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  valuation.marketTrend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {valuation.trendPercentage.toFixed(1)}% from last month
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Price per m²</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(valuation.pricePerSqm)}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Confidence</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(valuation.confidence)}`}>
                  {valuation.confidence.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Property Type</span>
                <span className="font-medium text-gray-900 capitalize">{propertyType}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Size</span>
                <span className="font-medium text-gray-900">{squareMeters.toLocaleString()} m²</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Bedrooms</span>
                <span className="font-medium text-gray-900">{bedrooms}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Bathrooms</span>
                <span className="font-medium text-gray-900">{bathrooms}</span>
              </div>
            </div>

            {/* Market Activity */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Market Activity</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getMarketActivityColor(valuation.marketActivity)}`}>
                  {valuation.marketActivity}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Comparable Sales</span>
                <span className="font-medium text-gray-900">{valuation.comparableProperties} properties</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Updated {valuation.lastUpdated.toLocaleDateString()}</span>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Disclaimer:</strong> This valuation is an estimate based on available market data. 
                Actual property value may vary. Consult with a qualified property valuer for official assessments.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ValuationCard;