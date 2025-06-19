import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Calculator, 
  Target, 
  ArrowRight,
  Activity,
  PieChart
} from 'lucide-react';

const MarketIntelligencePage = () => {
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

  const features = [
    {
      icon: TrendingUp,
      title: 'AI Property Valuations',
      description: 'Get accurate property valuations powered by machine learning and local market data.',
      link: '/property-valuation'
    },
    {
      icon: BarChart3,
      title: 'Market Trends',
      description: 'Access real-time market trends and price movements across Botswana regions.',
      link: '/market-trends'
    },
    {
      icon: MapPin,
      title: 'Neighborhood Analytics',
      description: 'Detailed insights on demographics, amenities, and growth potential by area.',
      link: '/neighborhood-analytics'
    },
    {
      icon: Target,
      title: 'Investment Analytics',
      description: 'ROI calculations, rental yield analysis, and investment opportunity scoring.',
      link: '/investment-analytics'
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
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Market Intelligence Platform
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              AI-powered property valuations, market trends, and investment analytics tailored specifically for the Botswana property market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/property-valuation"
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Value My Property
              </Link>
              <Link
                to="/market-trends"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Activity className="mr-2 h-5 w-5" />
                View Market Trends
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Market Intelligence Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make informed property decisions with our advanced analytics and market intelligence platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-beedab-blue/20 transition-colors">
                        <Icon className="h-6 w-6 text-beedab-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-beedab-blue transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex items-center text-beedab-blue group-hover:text-beedab-darkblue transition-colors">
                          <span className="text-sm font-medium">Explore Tool</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Botswana Property Market Overview
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: PieChart,
                value: 'P2.1M',
                label: 'Average Property Price',
                change: '+5.2%'
              },
              {
                icon: TrendingUp,
                value: '12.8%',
                label: 'Annual Growth Rate',
                change: '+2.1%'
              },
              {
                icon: BarChart3,
                value: '2,847',
                label: 'Properties Sold',
                change: '+15.3%'
              },
              {
                icon: Activity,
                value: '89 days',
                label: 'Average Time on Market',
                change: '-7 days'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center bg-gray-50 p-6 rounded-xl"
                >
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
                  <div className="text-green-600 text-xs font-medium">{stat.change}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Make Data-Driven Property Decisions?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Access our comprehensive market intelligence tools and stay ahead of the Botswana property market.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default MarketIntelligencePage;