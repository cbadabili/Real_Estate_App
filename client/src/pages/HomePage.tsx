import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { AISearchBar } from '../components/search/AISearchBar';
import { 
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Building2,
  Users,
  Star,
  ArrowRight,
  Shield,
  MessageCircle,
  TrendingUp,
  Calculator,
  Eye,
  MapPin,
  Heart,
  Sparkles,
  Smartphone,
  CheckCircle
} from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAgency, setCurrentAgency] = useState(0);
  const { data: apiProperties = [] } = useProperties();

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

  // Premium property slideshow data
  const premiumProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      location: 'Gaborone CBD',
      price: 'BWP 3,200,000',
      features: ['3 Bedrooms', '2 Bathrooms', 'City Views', 'Pool'],
      agent: {
        name: 'Thabo Mogami',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        phone: '+267 7123 4567',
        email: 'thabo@beedab.com'
      }
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      location: 'Francistown Heights',
      price: 'BWP 2,800,000',
      features: ['4 Bedrooms', '3 Bathrooms', 'Garden', 'Garage'],
      agent: {
        name: 'Neo Kgosana',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b6b7867c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        phone: '+267 7234 5678',
        email: 'neo@beedab.com'
      }
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
      location: 'Maun Safari Lodge',
      price: 'BWP 4,500,000',
      features: ['5 Bedrooms', '4 Bathrooms', 'Safari Views', 'Pool'],
      agent: {
        name: 'Mpho Setlhare',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        phone: '+267 7345 6789',
        email: 'mpho@beedab.com'
      }
    }
  ];

  // Featured agencies data
  const agencies = [
    {
      name: 'Prime Properties Botswana',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      tagline: 'Premium real estate solutions across Botswana',
      website: 'https://primeproperties.bw'
    },
    {
      name: 'Gaborone Realty Group',
      logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      tagline: 'Your trusted partner in property investment',
      website: 'https://gaboronerealty.co.bw'
    },
    {
      name: 'Delta Properties',
      logo: 'https://images.unsplash.com/photo-1560472354-a36ddbfaec0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      tagline: 'Connecting dreams with reality since 1995',
      website: 'https://deltaproperties.bw'
    },
    {
      name: 'Okavango Estates',
      logo: 'https://images.unsplash.com/photo-1560472355-a9e84a42d7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      tagline: 'Luxury properties in pristine locations',
      website: 'https://okavangoestates.com'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % premiumProperties.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [premiumProperties.length]);

  // Auto-advance agency carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAgency((prev) => (prev + 1) % agencies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [agencies.length]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section with Slideshow */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Property Slideshow Background */}
        <div className="absolute inset-0">
          {premiumProperties.map((property, index) => (
            <motion.div
              key={property.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={property.image}
                alt={property.location}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Property Details Overlay */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                <h3 className="text-base font-bold text-gray-900 mb-1">{property.location}</h3>
                <p className="text-lg font-bold text-beedab-blue mb-2">{property.price}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {property.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-beedab-blue/10 text-beedab-blue text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Agent Info */}
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{property.agent.name}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Phone className="h-2.5 w-2.5" />
                      <span>{property.agent.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slideshow Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + premiumProperties.length) % premiumProperties.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % premiumProperties.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Centered AI Search Bar */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pb-32">
          <div className="w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Find Your Perfect Property in
                <span className="block text-white">
                  Beautiful Botswana
                </span>
              </h1>
            </motion.div>

            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center text-beedab-blue px-2 sm:px-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium">AI Search</span>
                </div>
                <input
                  type="text"
                  placeholder="Describe your dream property..."
                  className="flex-1 px-2 sm:px-4 py-3 sm:py-4 text-sm sm:text-lg text-gray-700 placeholder-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value;
                      if (query.trim()) {
                        window.location.href = `/properties?search=${encodeURIComponent(query)}`;
                      }
                    }
                  }}
                />
                <button 
                  className="bg-beedab-blue text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-beedab-darkblue transition-colors"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input');
                    const query = input?.value;
                    if (query?.trim()) {
                      window.location.href = `/properties?search=${encodeURIComponent(query)}`;
                    }
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Agencies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Partner with Botswana's most reputable real estate agencies and developers
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentAgency * 100}%)` }}
              >
                {agencies.map((agency, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <motion.div
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mx-4 text-center hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => window.open(agency.website, '_self')}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                        <img
                          src={agency.logo}
                          alt={agency.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{agency.name}</h3>
                      <p className="text-gray-600 mb-4">{agency.tagline}</p>
                      <div className="flex items-center justify-center text-beedab-blue hover:text-beedab-darkblue transition-colors">
                        <Globe className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Visit Website</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Agency Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {agencies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAgency(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentAgency ? 'bg-beedab-blue' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
              <p className="text-gray-600">
                Discover premium properties handpicked by our experts
              </p>
            </div>
            <Link
              to="/properties"
              className="flex items-center text-beedab-blue hover:text-beedab-darkblue font-medium"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: 'Gaborone West',
                price: 'BWP 2,500,000',
                bedrooms: 3,
                bathrooms: 2,
                sqft: 1200,
                type: 'House'
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: 'Francistown',
                price: 'BWP 1,800,000',
                bedrooms: 2,
                bathrooms: 2,
                sqft: 900,
                type: 'Apartment'
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: 'Maun',
                price: 'BWP 3,200,000',
                bedrooms: 4,
                bathrooms: 3,
                sqft: 1800,
                type: 'Villa'
              }
            ].map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.location}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-sm font-medium text-beedab-blue">
                    {property.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.location}</h3>
                  <p className="text-2xl font-bold text-beedab-blue mb-4">{property.price}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} Bedrooms</span>
                    <span>{property.bathrooms} Bathrooms</span>
                    <span>{property.sqft} sqm</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose beedab?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets comprehensive real estate tools for the ultimate property discovery experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                {
                  icon: Users,
                  title: 'Buyer and Seller Platform',
                  description: 'Complete For Sale By Owner tools including listing creation, legal documents, and transaction management for Batswana',
                  link: '/buyer-seller-platform'
                },
                {
                  icon: TrendingUp,
                  title: 'Market Intelligence',
                  description: 'AI-powered property valuations, market trends, and investment analytics tailored for the Botswana property market',
                  link: '/market-intelligence'
                },
                {
                  icon: Shield,
                  title: 'Secure Transactions',
                  description: 'REAC-compliant transaction processing and secure payment systems designed for Botswana real estate laws',
                  link: '/secure-transactions'
                },
                {
                  icon: MessageCircle,
                  title: 'Instant Communication',
                  description: 'Real-time messaging in English and Setswana, video calls, and collaboration tools for seamless property negotiations',
                  link: '/communication'
                },
                {
                  icon: Users,
                  title: 'REAC Agent Network',
                  description: 'Connect with certified REAC agents across Botswana and access professional real estate services',
                  link: '/professional-support'
                },
                {
                  icon: Building2,
                  title: 'Comprehensive Listings',
                  description: 'Browse thousands of verified properties from direct sellers and professional agents across Botswana',
                  link: '/properties'
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow text-center cursor-pointer group"
                    onClick={() => window.location.href = feature.link}
                  >
                    <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-beedab-blue/20 transition-colors">
                      <Icon className="h-6 w-6 text-beedab-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-beedab-blue transition-colors">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="mt-4 flex items-center justify-center text-beedab-blue group-hover:text-beedab-darkblue transition-colors">
                      <Link 
                        to={
                          feature.title === 'Buyer and Seller Platform' ? '/buyer-seller-platform' :
                          feature.title === 'Market Intelligence' ? '/market-intelligence' :
                          feature.title === 'Secure Transactions' ? '/secure-transactions' :
                          feature.title === 'Instant Communication' ? '/communication' :
                          feature.title === 'REAC Agent Network' ? '/agent-network' :
                          feature.title === 'Comprehensive Listings' ? '/properties' :
                          '#'
                        }
                        className="text-sm font-medium flex items-center"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={containerVariants} className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Property Journey?
            </h2>
            <p className="text-xl text-beedab-lightblue max-w-2xl mx-auto">
              Join thousands of Batswana who have successfully bought and sold properties using our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Navigate to properties page with smooth scrolling
                  window.location.href = '/properties';
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
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