import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AISearchBar } from '../components/search/AISearchBar';
import { 
  Search, 
  Map, 
  Home, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  Star,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';
import PropertyCard from '../components/properties/PropertyCard';
import { sampleProperties } from '../data/sampleData';

const HomePage = () => {
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
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const features = [
    {
      icon: Map,
      title: 'Interactive Map Search',
      description: 'Discover properties across Botswana with our advanced map interface featuring neighborhood insights and property metadata overlays.'
    },
    {
      icon: Home,
      title: 'FSBO Platform',
      description: 'Complete For Sale By Owner tools including listing creation, legal documents, and transaction management for Batswana.'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'AI-powered property valuations, market trends, and investment analytics tailored for the Botswana property market.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'REAC-compliant transaction processing and secure payment systems designed for Botswana real estate laws.'
    },
    {
      icon: Zap,
      title: 'Instant Communication',
      description: 'Real-time messaging in English and Setswana, video calls, and collaboration tools for seamless property negotiations.'
    },
    {
      icon: Users,
      title: 'REAC Agent Network',
      description: 'Connect with certified REAC agents across Botswana and access professional real estate services.'
    }
  ];

  const stats = [
    { label: 'Active Listings', value: '2,500+', icon: Home },
    { label: 'Happy Clients', value: '5,000+', icon: Users },
    { label: 'Cities Covered', value: '15+', icon: MapPin },
    { label: 'Properties Sold', value: 'P500M+', icon: DollarSign }
  ];

  const featuredProperties = sampleProperties.slice(0, 3);

  return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen"
      >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-beedab-darkblue via-primary-800 to-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold leading-tight"
                  variants={itemVariants}
                >
                  Find Your Perfect Property in
                  <span className="block bg-gradient-to-r from-beedab-blue to-beedab-lightblue bg-clip-text text-transparent">
                    Beautiful Botswana
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-primary-100 leading-relaxed max-w-xl"
                  variants={itemVariants}
                >
                  Discover properties from Gaborone to Francistown through interactive maps, AI-powered recommendations, and comprehensive FSBO tools. Built for Batswana, by Batswana.
                </motion.p>
              </div>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/map-search"
                  className="inline-flex items-center justify-center px-8 py-4 bg-beedab-blue hover:bg-beedab-darkblue text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Map className="mr-2 h-5 w-5" />
                  Explore Botswana Map
                </Link>
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 border border-white/20"
                >
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="text-center"
                      >
                        <Icon className="h-8 w-8 text-beedab-lightblue mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-primary-200">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-beedab-blue/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-pulse-slow delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose BeeDab?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with comprehensive real estate tools to deliver an unmatched property discovery experience across Botswana.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="bg-neutral-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group hover:bg-white border border-neutral-200"
                >
                  <div className="bg-beedab-lightblue w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-beedab-blue transition-colors">
                    <Icon className="h-6 w-6 text-beedab-darkblue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-neutral-600">
                Discover handpicked properties across Botswana's prime locations
              </p>
            </div>
            <Link
              to="/properties"
              className="hidden sm:inline-flex items-center text-beedab-darkblue hover:text-beedab-blue font-semibold"
            >
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                custom={index}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-beedab-blue hover:bg-beedab-darkblue text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Explore All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-beedab-darkblue to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Find Your Dream Property in Botswana?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of satisfied Batswana who found their perfect home through BeeDab's advanced platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/map-search"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-neutral-100 transition-all duration-200 transform hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Link>
              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-all duration-200"
              >
                List Your Property
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;