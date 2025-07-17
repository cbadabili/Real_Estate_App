
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Building, 
  Home,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react';

const PropertyValuationToolsPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('instant');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const valuationTools = [
    {
      id: 'instant',
      title: 'Instant Property Valuation',
      description: 'Get an immediate property value estimate using local market data',
      icon: Calculator,
      features: ['AI-Powered Analysis', 'Local Market Data', 'Instant Results', 'Free'],
      accuracy: '± 8%',
      timeframe: 'Instant'
    },
    {
      id: 'comparative',
      title: 'Comparative Market Analysis',
      description: 'Detailed analysis based on recent comparable sales',
      icon: BarChart3,
      features: ['Recent Sales Data', 'Property Comparisons', 'Market Trends', 'Detailed Report'],
      accuracy: '± 5%',
      timeframe: '24 hours'
    },
    {
      id: 'professional',
      title: 'Professional Valuation',
      description: 'Certified valuation by qualified Botswana valuers',
      icon: Users,
      features: ['Certified Valuers', 'Bank Accepted', 'Legal Compliance', 'Site Inspection'],
      accuracy: '± 2%',
      timeframe: '3-5 days'
    }
  ];

  const marketInsights = [
    {
      area: 'Gaborone CBD',
      avgPrice: 'BWP 2,450,000',
      change: '+12.5%',
      trend: 'up',
      properties: 156
    },
    {
      area: 'Phakalane',
      avgPrice: 'BWP 1,850,000',
      change: '+8.2%',
      trend: 'up',
      properties: 89
    },
    {
      area: 'Block 8',
      avgPrice: 'BWP 950,000',
      change: '+5.1%',
      trend: 'up',
      properties: 234
    },
    {
      area: 'Mogoditshane',
      avgPrice: 'BWP 750,000',
      change: '+3.8%',
      trend: 'up',
      properties: 178
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Property Valuation Tools
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Get accurate property valuations using local market data and comparable sales in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Calculator className="mr-2 h-5 w-5" />
                Start Valuation
              </button>
              <Link
                to="/market-trends"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-700 transition-colors"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Market Trends
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valuation Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Valuation Method
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the valuation tool that best fits your needs and timeline.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valuationTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeCalculator === tool.id;
              
              return (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
                    isActive 
                      ? 'border-green-500 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setActiveCalculator(tool.id)}
                >
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${
                      isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">Accuracy:</span> {tool.accuracy}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {tool.timeframe}
                    </div>
                  </div>

                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {isActive ? 'Get Started' : 'Select This Option'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Market Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Current market trends and average property values in popular areas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketInsights.map((insight, index) => (
              <motion.div
                key={insight.area}
                variants={itemVariants}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{insight.area}</h3>
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900">{insight.avgPrice}</p>
                  <p className="text-sm text-gray-500">Average Price</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-1 ${
                    insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">{insight.change}</span>
                  </div>
                  <span className="text-sm text-gray-500">{insight.properties} properties</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation Form */}
      {activeCalculator && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {valuationTools.find(tool => tool.id === activeCalculator)?.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                    placeholder="Enter property address..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500">
                    <option>Residential House</option>
                    <option>Apartment</option>
                    <option>Townhouse</option>
                    <option>Plot/Land</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500">
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Size (m²)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Size (m²)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Age
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500">
                    <option>New (0-2 years)</option>
                    <option>Recent (3-5 years)</option>
                    <option>Established (6-10 years)</option>
                    <option>Older (10+ years)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                  <Calculator className="mr-2 h-5 w-5" />
                  Get Valuation
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-4">
              Need a Professional Valuation?
            </h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Get a certified property valuation from qualified Botswana valuers for mortgage, insurance, or legal purposes.
            </p>
            <Link
              to="/marketplace/professionals?category=Property%20Valuer"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Book Professional Valuation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PropertyValuationToolsPage;
