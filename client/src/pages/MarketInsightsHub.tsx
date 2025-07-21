
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Home, DollarSign, BarChart3, MapPin, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketTrendsChart from '../components/charts/MarketTrendsChart';
import InvestmentAnalyzer from '../components/analytics/InvestmentAnalyzer';
import NeighborhoodInsights from '../components/analytics/NeighborhoodInsights';
import PropertyValuationTool from '../components/valuation/PropertyValuationTool';

const MarketInsightsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: TrendingUp },
    { id: 'valuation', label: 'Property Valuation', icon: Home },
    { id: 'investment', label: 'Investment Analytics', icon: DollarSign },
    { id: 'neighborhoods', label: 'Neighborhood Insights', icon: MapPin },
    { id: 'trends', label: 'Market Trends', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing Guide', icon: Calculator }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Average Property Price', value: 'P 2.8M', change: '+5.2%', trend: 'up' },
          { label: 'Market Activity', value: '1,247', change: '+12.3%', trend: 'up' },
          { label: 'Days on Market', value: '45', change: '-8.1%', trend: 'down' },
          { label: 'Price per SQM', value: 'P 18,650', change: '+3.7%', trend: 'up' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className={`text-sm flex items-center ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Market Activity Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Activity Trends</h3>
        <MarketTrendsChart />
      </div>

      {/* Recent Market Insights */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Areas</h3>
          <div className="space-y-4">
            {[
              { area: 'Gaborone West', growth: '+15.2%', avgPrice: 'P 3.2M' },
              { area: 'Phakalane', growth: '+12.8%', avgPrice: 'P 4.1M' },
              { area: 'Francistown CBD', growth: '+8.5%', avgPrice: 'P 2.8M' },
              { area: 'Maun Safari Estates', growth: '+18.3%', avgPrice: 'P 5.2M' }
            ].map((area, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{area.area}</p>
                  <p className="text-sm text-gray-600">{area.avgPrice}</p>
                </div>
                <span className="text-green-600 font-medium">{area.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Opportunities</h3>
          <div className="space-y-4">
            {[
              { type: 'Rental Properties', roi: '12.5%', risk: 'Medium' },
              { type: 'Commercial Land', roi: '18.3%', risk: 'High' },
              { type: 'Residential Development', roi: '15.7%', risk: 'Medium' },
              { type: 'Tourism Properties', roi: '22.1%', risk: 'High' }
            ].map((opportunity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{opportunity.type}</p>
                  <p className="text-sm text-gray-600">Risk: {opportunity.risk}</p>
                </div>
                <span className="text-purple-600 font-medium">{opportunity.roi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'valuation':
        return <PropertyValuationTool />;
      case 'investment':
        return <InvestmentAnalyzer />;
      case 'neighborhoods':
        return <NeighborhoodInsights />;
      case 'trends':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends Analysis</h3>
            <MarketTrendsChart />
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Guidelines by Property Type</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { type: 'Houses', priceRange: 'P 1.5M - P 8M', avgSqm: 'P 15,000 - P 25,000' },
                  { type: 'Apartments', priceRange: 'P 800K - P 3.5M', avgSqm: 'P 12,000 - P 20,000' },
                  { type: 'Townhouses', priceRange: 'P 1.2M - P 4.5M', avgSqm: 'P 14,000 - P 22,000' },
                  { type: 'Land/Plots', priceRange: 'P 300K - P 2M', avgSqm: 'P 800 - P 5,000' },
                  { type: 'Commercial', priceRange: 'P 2M - P 15M', avgSqm: 'P 18,000 - P 35,000' },
                  { type: 'Industrial', priceRange: 'P 1.5M - P 12M', avgSqm: 'P 8,000 - P 18,000' }
                ].map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{category.type}</h4>
                    <p className="text-sm text-gray-600 mb-1">Price Range: {category.priceRange}</p>
                    <p className="text-sm text-gray-600">Per SQM: {category.avgSqm}</p>
                  </div>
                ))}
              </div>
              
              {/* Market Comparison Tool */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Price Comparison by Location</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { location: 'Gaborone CBD', avgPrice: 'P 25,000/sqm', trend: '+8.5%' },
                    { location: 'Phakalane', avgPrice: 'P 28,000/sqm', trend: '+12.3%' },
                    { location: 'Francistown', avgPrice: 'P 18,000/sqm', trend: '+5.2%' },
                    { location: 'Maun', avgPrice: 'P 22,000/sqm', trend: '+15.8%' }
                  ].map((area, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{area.location}</p>
                        <p className="text-sm text-gray-600">{area.avgPrice}</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{area.trend}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Market Intelligence Hub</h1>
          <p className="text-gray-600">
            Comprehensive market insights, property valuations, and investment analytics for Botswana's real estate market
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-beedab-blue text-beedab-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/property-valuation"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Get Property Valuation</p>
                <p className="text-sm text-gray-600">Free AI-powered estimates</p>
              </div>
            </Link>

            <Link
              to="/neighborhood-analytics"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MapPin className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Explore Neighborhoods</p>
                <p className="text-sm text-gray-600">Detailed area insights</p>
              </div>
            </Link>

            <Link
              to="/investment-analytics"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Investment Calculator</p>
                <p className="text-sm text-gray-600">ROI and cash flow analysis</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketInsightsHub;
