
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, School, ShoppingCart, Car, Zap, Droplets } from 'lucide-react';

const NeighborhoodAnalyticsPage = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('phakalane');

  const neighborhoodData = {
    phakalane: {
      name: 'Phakalane',
      averagePrice: 2500000,
      priceGrowth: 8.2,
      demographics: { families: 65, professionals: 25, retirees: 10 },
      amenities: {
        schools: 8,
        restaurants: 12,
        shopping: 5,
        hospitals: 2
      },
      infrastructure: {
        electricity: 95,
        water: 92,
        internet: 88,
        roads: 85
      },
      safety: 4.2,
      walkability: 3.8,
      publicTransport: 3.5
    },
    gaboroneWest: {
      name: 'Gaborone West',
      averagePrice: 1200000,
      priceGrowth: 5.1,
      demographics: { families: 70, professionals: 20, retirees: 10 },
      amenities: {
        schools: 15,
        restaurants: 8,
        shopping: 3,
        hospitals: 1
      },
      infrastructure: {
        electricity: 88,
        water: 85,
        internet: 75,
        roads: 70
      },
      safety: 3.8,
      walkability: 4.2,
      publicTransport: 4.5
    }
  };

  const data = neighborhoodData[selectedNeighborhood as keyof typeof neighborhoodData];
  const formatCurrency = (amount: number) => `BWP ${amount.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Neighborhood Analytics</h1>
          <p className="text-gray-600">
            Detailed insights on demographics, amenities, and growth potential by area
          </p>
        </div>

        {/* Neighborhood Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-700">Select Neighborhood:</span>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="phakalane">Phakalane</option>
              <option value="gaboroneWest">Gaborone West</option>
            </select>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{data.name} Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-beedab-blue mb-2">
                {formatCurrency(data.averagePrice)}
              </div>
              <div className="text-gray-600">Average Property Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                +{data.priceGrowth}%
              </div>
              <div className="text-gray-600">Annual Price Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {data.safety}/5
              </div>
              <div className="text-gray-600">Safety Rating</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demographics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Demographics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Families</span>
                  <span className="text-sm font-medium">{data.demographics.families}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${data.demographics.families}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Young Professionals</span>
                  <span className="text-sm font-medium">{data.demographics.professionals}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${data.demographics.professionals}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Retirees</span>
                  <span className="text-sm font-medium">{data.demographics.retirees}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${data.demographics.retirees}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Local Amenities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <School className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Schools</span>
                </div>
                <span className="font-medium">{data.amenities.schools}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Restaurants</span>
                </div>
                <span className="font-medium">{data.amenities.restaurants}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Shopping</span>
                </div>
                <span className="font-medium">{data.amenities.shopping}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Hospitals</span>
                </div>
                <span className="font-medium">{data.amenities.hospitals}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Infrastructure Quality
            </h3>
            <div className="space-y-4">
              {Object.entries(data.infrastructure).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        value >= 90 ? 'bg-green-500' : value >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle Scores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Scores</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Safety Rating</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{data.safety}/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 ${
                          star <= data.safety ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Walkability</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{data.walkability}/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 ${
                          star <= data.walkability ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Public Transport</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{data.publicTransport}/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 ${
                          star <= data.publicTransport ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeighborhoodAnalyticsPage;
