
import React, { useState } from 'react';
import { MapPin, School, Shield, ShoppingCart, Car, Users, TrendingUp } from 'lucide-react';

interface NeighborhoodInsightsProps {
  className?: string;
}

interface NeighborhoodData {
  name: string;
  averagePrice: string;
  schools: number;
  safetyRating: 'Low' | 'Medium' | 'High';
  amenities: number;
  transportScore: number;
  demographics: {
    population: string;
    medianAge: number;
    familyFriendly: boolean;
  };
  marketTrend: 'rising' | 'stable' | 'declining';
  priceGrowth: number;
}

const NeighborhoodInsights: React.FC<NeighborhoodInsightsProps> = ({ className }) => {
  const [selectedArea, setSelectedArea] = useState<string>('gaborone-west');

  const neighborhoodData: Record<string, NeighborhoodData> = {
    'gaborone-west': {
      name: 'Gaborone West',
      averagePrice: 'P 2.8M',
      schools: 12,
      safetyRating: 'High',
      amenities: 45,
      transportScore: 8.2,
      demographics: {
        population: '65,000',
        medianAge: 32,
        familyFriendly: true
      },
      marketTrend: 'rising',
      priceGrowth: 5.2
    },
    'francistown': {
      name: 'Francistown',
      averagePrice: 'P 1.9M',
      schools: 8,
      safetyRating: 'Medium',
      amenities: 32,
      transportScore: 7.1,
      demographics: {
        population: '98,000',
        medianAge: 29,
        familyFriendly: true
      },
      marketTrend: 'stable',
      priceGrowth: 2.8
    },
    'maun': {
      name: 'Maun',
      averagePrice: 'P 2.1M',
      schools: 6,
      safetyRating: 'High',
      amenities: 28,
      transportScore: 6.8,
      demographics: {
        population: '70,000',
        medianAge: 31,
        familyFriendly: false
      },
      marketTrend: 'rising',
      priceGrowth: 4.1
    }
  };

  const currentData = neighborhoodData[selectedArea];

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
        Neighborhood Insights
      </h2>

      {/* Area Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Area
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="gaborone-west">Gaborone West</option>
          <option value="francistown">Francistown</option>
          <option value="maun">Maun</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Key Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Average Property Price</span>
              </div>
              <span className="font-semibold text-gray-900">{currentData.averagePrice}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <School className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Schools Nearby</span>
              </div>
              <span className="font-semibold text-gray-900">{currentData.schools}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Safety Rating</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(currentData.safetyRating)}`}>
                {currentData.safetyRating}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Amenities</span>
              </div>
              <span className="font-semibold text-gray-900">{currentData.amenities}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Car className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">Transport Score</span>
              </div>
              <span className="font-semibold text-gray-900">{currentData.transportScore}/10</span>
            </div>
          </div>
        </div>

        {/* Demographics & Trends */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Demographics & Trends</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Population Demographics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Population:</span>
                  <span className="font-medium">{currentData.demographics.population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Median Age:</span>
                  <span className="font-medium">{currentData.demographics.medianAge} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Family Friendly:</span>
                  <span className={`font-medium ${currentData.demographics.familyFriendly ? 'text-green-600' : 'text-orange-600'}`}>
                    {currentData.demographics.familyFriendly ? 'Yes' : 'Mixed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Trends
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Market Direction:</span>
                  <span className={`font-medium text-sm capitalize ${getTrendColor(currentData.marketTrend)}`}>
                    {currentData.marketTrend}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">12-Month Growth:</span>
                  <span className={`font-medium text-sm ${currentData.priceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentData.priceGrowth >= 0 ? '+' : ''}{currentData.priceGrowth}%
                  </span>
                </div>
              </div>
            </div>

            {/* Investment Recommendation */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Investment Score</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-purple-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (currentData.transportScore * 10) + (currentData.priceGrowth * 5))}%` 
                    }}
                  ></div>
                </div>
                <span className="text-purple-900 font-medium text-sm">
                  {Math.round((currentData.transportScore * 10) + (currentData.priceGrowth * 5))}%
                </span>
              </div>
              <p className="text-xs text-purple-800 mt-2">
                Based on transport, safety, amenities, and growth potential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodInsights;
