import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Calculator, 
  Target,
  ArrowRight,
  Building,
  MapPin,
  DollarSign,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load individual components for better performance
const PropertyValuationTool = lazy(() => import('../components/valuation/PropertyValuationTool'));
const MarketTrendsChart = lazy(() => import('../components/charts/MarketTrendsChart'));
const InvestmentAnalyzer = lazy(() => import('../components/analytics/InvestmentAnalyzer'));
const NeighborhoodInsights = lazy(() => import('../components/analytics/NeighborhoodInsights'));

const MarketIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const marketData = {
    averagePrice: 2450000,
    monthlyGrowth: 3.2,
    totalListings: 847,
    averageDaysOnMarket: 45,
    priceChangeRate: -2.1,
    inventoryMonths: 3.2
  };

  const tabConfig = [
    { 
      key: 'overview', 
      label: 'Market Overview', 
      icon: BarChart3,
      description: 'Real-time market statistics and regional performance'
    },
    { 
      key: 'valuation', 
      label: 'Property Valuation', 
      icon: Calculator,
      description: 'AI-powered property valuations and pricing tools'
    },
    { 
      key: 'trends', 
      label: 'Market Trends', 
      icon: TrendingUp,
      description: 'Historical data and predictive market analysis'
    },
    { 
      key: 'neighborhood', 
      label: 'Neighborhood Analytics', 
      icon: MapPin,
      description: 'Detailed area insights and demographic data'
    },
    { 
      key: 'investment', 
      label: 'Investment Analytics', 
      icon: Target,
      description: 'ROI calculators and investment opportunity analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Market Intelligence Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
              Comprehensive insights into Botswana's real estate market with AI-powered analytics, 
              property valuations, neighborhood data, and investment guidance.
            </p>
            <div className="flex justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Activity className="h-4 w-4 mr-1" />
                Real-time Data
              </span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-xs font-bold text-beedab-blue">BWP</span>
            </div>
            <div className="text-xs text-gray-600">Avg Price</div>
            <div className="text-lg font-bold text-gray-900">
              {(marketData.averagePrice / 1000000).toFixed(1)}M
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="text-green-600 text-xs">↑ {marketData.monthlyGrowth}%</span>
            </div>
            <div className="text-xs text-gray-600">Monthly Growth</div>
            <div className="text-lg font-bold text-gray-900">
              {marketData.monthlyGrowth}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-xs text-gray-600">Active Listings</div>
            <div className="text-lg font-bold text-gray-900">
              {marketData.totalListings}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-xs text-gray-600">Days on Market</div>
            <div className="text-lg font-bold text-gray-900">
              {marketData.averageDaysOnMarket}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <PieChart className="h-6 w-6 text-red-600" />
              <span className="text-red-600 text-xs">↓ {Math.abs(marketData.priceChangeRate)}%</span>
            </div>
            <div className="text-xs text-gray-600">Price Changes</div>
            <div className="text-lg font-bold text-gray-900">
              {Math.abs(marketData.priceChangeRate)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-xs text-gray-600">Inventory</div>
            <div className="text-lg font-bold text-gray-900">
              {marketData.inventoryMonths}mo
            </div>
          </motion.div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white p-1 rounded-xl shadow-sm border">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-beedab-blue text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Tab Content with Error Boundaries */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-2 border-b border-gray-100">
            <div className="text-sm text-gray-600">
              {tabConfig.find(t => t.key === activeTab)?.description}
            </div>
          </div>

          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
                <span className="ml-2 text-gray-600">Loading analytics...</span>
              </div>
            }>
              {activeTab === 'overview' && <MarketOverviewTab marketData={marketData} />}
              {activeTab === 'valuation' && <PropertyValuationTab />}
              {activeTab === 'trends' && <MarketTrendsTab />}
              {activeTab === 'neighborhood' && <NeighborhoodAnalyticsTab />}
              {activeTab === 'investment' && <InvestmentAnalyticsTab />}
            </Suspense>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            to="/properties"
            className="group flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg hover:border-beedab-blue transition-all"
          >
            <div>
              <div className="font-semibold text-gray-900 group-hover:text-beedab-blue">Browse Properties</div>
              <div className="text-sm text-gray-600">Explore {marketData.totalListings} active listings</div>
            </div>
            <ArrowRight className="h-5 w-5 text-beedab-blue group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/property-valuation"
            className="group flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg hover:border-beedab-blue transition-all"
          >
            <div>
              <div className="font-semibold text-gray-900 group-hover:text-beedab-blue">Value My Property</div>
              <div className="text-sm text-gray-600">Get instant AI valuation</div>
            </div>
            <Calculator className="h-5 w-5 text-beedab-blue group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            to="/agent-network"
            className="group flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg hover:border-beedab-blue transition-all"
          >
            <div>
              <div className="font-semibold text-gray-900 group-hover:text-beedab-blue">Get Professional Help</div>
              <div className="text-sm text-gray-600">Connect with REAC agents</div>
            </div>
            <ArrowRight className="h-5 w-5 text-beedab-blue group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Individual Tab Components
const MarketOverviewTab = ({ marketData }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h2>
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
        <div className="space-y-4">
          {[
            { area: 'Gaborone CBD', price: 'P 3.2M', growth: '+5.2%', trend: 'up' },
            { area: 'Francistown', price: 'P 1.8M', growth: '+2.8%', trend: 'up' },
            { area: 'Maun', price: 'P 2.1M', growth: '+4.1%', trend: 'up' },
            { area: 'Kasane', price: 'P 1.9M', growth: '-0.5%', trend: 'down' }
          ].map((area) => (
            <div key={area.area} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <div className="font-medium text-gray-900">{area.area}</div>
                <div className="text-sm text-gray-600">Average: {area.price}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${area.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {area.growth}
                </div>
                <div className="text-xs text-gray-500">vs last month</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Properties sold this month</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-sm text-gray-600">New listings this week</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">12%</div>
            <div className="text-sm text-gray-600">Price reduction rate</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">List-to-sale ratio</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PropertyValuationTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Valuation Tools</h2>
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <div className="bg-beedab-blue/5 border border-beedab-blue/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-beedab-blue mr-2" />
            Instant AI Valuation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
              <input
                type="text"
                placeholder="Enter property address in Botswana"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue">
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue">
                  <option value="">Select</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land/Plot</option>
                </select>
              </div>
            </div>
            <Link 
              to="/property-valuation"
              className="w-full bg-beedab-blue text-white py-3 px-4 rounded-md hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Get Detailed Valuation
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Market Activity</h3>
        <div className="space-y-4">
          {[
            { address: 'Plot 123, Gaborone West', estimate: 'P 2.8M', change: '+5.2%', date: '2 days ago' },
            { address: 'Block 9, Francistown', estimate: 'P 1.9M', change: '+2.1%', date: '1 week ago' },
            { address: 'Maun Safari Estate', estimate: 'P 3.5M', change: '+8.7%', date: '2 weeks ago' }
          ].map((activity, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{activity.address}</div>
                <div className="text-sm text-green-600 font-medium">{activity.change}</div>
              </div>
              <div className="text-lg font-bold text-beedab-blue">{activity.estimate}</div>
              <div className="text-sm text-gray-500">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MarketTrendsTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Trends & Analysis</h2>
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends by Region</h3>
        <div className="bg-gray-50 p-12 rounded-lg text-center">
          <BarChart3 className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Interactive market trend charts</p>
          <p className="text-gray-500 text-sm mt-2">Real-time data visualization coming soon</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Indicators</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">Seller's Market</div>
            <div className="text-sm text-gray-600 mt-2">High demand, low inventory</div>
            <div className="text-xs text-gray-500 mt-1">Based on supply/demand ratio</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">6.2%</div>
            <div className="text-sm text-gray-600 mt-2">Annual appreciation rate</div>
            <div className="text-xs text-gray-500 mt-1">12-month rolling average</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">3.2 months</div>
            <div className="text-sm text-gray-600 mt-2">Inventory supply</div>
            <div className="text-xs text-gray-500 mt-1">Current absorption rate</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NeighborhoodAnalyticsTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Neighborhood Analytics</h2>
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Comparison Tool</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Select first area</option>
            <option>Gaborone West</option>
            <option>Francistown</option>
            <option>Maun</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Select second area</option>
            <option>Gaborone CBD</option>
            <option>Kasane</option>
            <option>Lobatse</option>
          </select>
        </div>
        <Link 
          to="/neighborhood-analytics"
          className="mt-4 inline-flex items-center text-beedab-blue hover:text-beedab-darkblue"
        >
          View Detailed Comparison 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { area: 'Gaborone West', avgPrice: 'P 2.8M', schools: 12, crime: 'Low' },
          { area: 'Francistown', avgPrice: 'P 1.9M', schools: 8, crime: 'Medium' },
          { area: 'Maun', avgPrice: 'P 2.1M', schools: 6, crime: 'Low' }
        ].map((neighborhood) => (
          <div key={neighborhood.area} className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{neighborhood.area}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Price:</span>
                <span className="font-medium">{neighborhood.avgPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schools:</span>
                <span className="font-medium">{neighborhood.schools}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Safety:</span>
                <span className={`font-medium ${neighborhood.crime === 'Low' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {neighborhood.crime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InvestmentAnalyticsTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Analytics</h2>
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 text-purple-600 mr-2" />
            ROI Calculator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price (Pula)</label>
              <input
                type="number"
                placeholder="2,500,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Rental Income (P/month)</label>
              <input
                type="number"
                placeholder="15,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Appreciation (%)</label>
              <input
                type="number"
                placeholder="6.2"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Link
              to="/investment-analytics"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <Target className="h-4 w-4 mr-2" />
              Analyze Investment
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Hotspots</h3>
        <div className="space-y-4">
          {[
            { area: 'Gaborone West', roi: '12.5%', risk: 'Low', growth: 'High', trend: 'rising' },
            { area: 'Maun Tourism Zone', roi: '15.8%', risk: 'Medium', growth: 'Very High', trend: 'rising' },
            { area: 'Francistown Industrial', roi: '10.2%', risk: 'Low', growth: 'Stable', trend: 'stable' },
            { area: 'Kasane Riverfront', roi: '18.3%', risk: 'High', growth: 'Exceptional', trend: 'rising' }
          ].map((hotspot, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">{hotspot.area}</div>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="text-gray-600">Risk: <span className="font-medium">{hotspot.risk}</span></span>
                    <span className="text-gray-600">Growth: <span className="font-medium">{hotspot.growth}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{hotspot.roi}</div>
                  <div className={`text-xs ${hotspot.trend === 'rising' ? 'text-green-600' : 'text-gray-600'}`}>
                    {hotspot.trend === 'rising' ? '↗ Rising' : '→ Stable'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MarketIntelligencePage;