
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, MapPin, Calendar, DollarSign } from 'lucide-react';

interface MarketData {
  location: string;
  averageRent: number;
  priceChange: number;
  vacancyRate: number;
  daysOnMarket: number;
  propertyTypes: {
    apartment: number;
    house: number;
    townhouse: number;
  };
}

const RentalMarketInsightsPage = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Gaborone');

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // Mock data for rental market insights
      const mockData: MarketData[] = [
        {
          location: 'Gaborone CBD',
          averageRent: 8500,
          priceChange: 5.2,
          vacancyRate: 12.5,
          daysOnMarket: 28,
          propertyTypes: { apartment: 7500, house: 12000, townhouse: 9500 }
        },
        {
          location: 'Phakalane',
          averageRent: 12000,
          priceChange: -2.1,
          vacancyRate: 8.3,
          daysOnMarket: 21,
          propertyTypes: { apartment: 9000, house: 15000, townhouse: 11000 }
        },
        {
          location: 'Extension 12',
          averageRent: 6500,
          priceChange: 3.8,
          vacancyRate: 15.2,
          daysOnMarket: 35,
          propertyTypes: { apartment: 5500, house: 8000, townhouse: 7000 }
        }
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedLocationData = marketData.find(data => data.location === selectedLocation) || marketData[0];

  const formatCurrency = (amount: number) => `BWP ${amount.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Market Insights</h1>
          <p className="text-gray-600">
            Real-time market data and trends for rental properties in Botswana
          </p>
        </div>

        {/* Location Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-700">Select Location:</span>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              {marketData.map((data) => (
                <option key={data.location} value={data.location}>
                  {data.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Average Rent</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(selectedLocationData.averageRent)}
                    </div>
                    <div className="flex items-center mt-1">
                      {selectedLocationData.priceChange > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${selectedLocationData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(selectedLocationData.priceChange)}% vs last year
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Vacancy Rate</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedLocationData.vacancyRate}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Available properties</div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Days on Market</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedLocationData.daysOnMarket}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Average time to rent</div>
                  </div>
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Market Activity</div>
                    <div className="text-2xl font-bold text-green-600">High</div>
                    <div className="text-sm text-gray-500 mt-1">Based on current trends</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Property Types Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Rent by Property Type</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Apartments</span>
                    <span className="font-semibold">{formatCurrency(selectedLocationData.propertyTypes.apartment)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Houses</span>
                    <span className="font-semibold">{formatCurrency(selectedLocationData.propertyTypes.house)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Townhouses</span>
                    <span className="font-semibold">{formatCurrency(selectedLocationData.propertyTypes.townhouse)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Rental demand increasing in {selectedLocation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New developments attracting tenants</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Average lease terms: 12-24 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Security deposits typically 2x monthly rent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Locations Comparison */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Location</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Avg. Rent</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Price Change</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Vacancy Rate</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Days on Market</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">{data.location}</td>
                        <td className="py-3 text-gray-600">{formatCurrency(data.averageRent)}</td>
                        <td className="py-3">
                          <span className={`flex items-center ${data.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.priceChange > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(data.priceChange)}%
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{data.vacancyRate}%</td>
                        <td className="py-3 text-gray-600">{data.daysOnMarket} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RentalMarketInsightsPage;
