
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, MapPin, Calendar } from 'lucide-react';

const MarketTrendsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedLocation, setSelectedLocation] = useState('gaborone');

  const marketData = {
    gaborone: {
      averagePrice: 2100000,
      priceChange: 5.2,
      salesVolume: 1247,
      volumeChange: 8.3,
      daysOnMarket: 42
    },
    francistown: {
      averagePrice: 850000,
      priceChange: 3.1,
      salesVolume: 324,
      volumeChange: -2.1,
      daysOnMarket: 38
    },
    maun: {
      averagePrice: 1200000,
      priceChange: 7.8,
      salesVolume: 156,
      volumeChange: 12.4,
      daysOnMarket: 51
    }
  };

  const data = marketData[selectedLocation as keyof typeof marketData];
  const formatCurrency = (amount: number) => `BWP ${amount.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Market Trends</h1>
          <p className="text-gray-600">
            Real-time market data and trends for properties across Botswana
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              >
                <option value="gaborone">Gaborone</option>
                <option value="francistown">Francistown</option>
                <option value="maun">Maun</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
                <option value="24months">Last 24 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(data.averagePrice)}
            </div>
            <div className={`flex items-center text-sm ${data.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.priceChange > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(data.priceChange)}% vs last year
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Sales Volume</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {data.salesVolume.toLocaleString()}
            </div>
            <div className={`flex items-center text-sm ${data.volumeChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.volumeChange > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(data.volumeChange)}% vs last year
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Days on Market</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {data.daysOnMarket}
            </div>
            <div className="text-sm text-gray-500">
              Average time to sell
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Market Activity</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Active
            </div>
            <div className="text-sm text-gray-500">
              High buyer interest
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Price trend chart will be displayed here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Volume</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Sales volume chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketTrendsPage;
