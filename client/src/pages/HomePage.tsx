import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
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
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAgency, setCurrentAgency] = useState(0);

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
      price: 'P3,200,000',
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
      price: 'P2,800,000',
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
      price: 'P4,500,000',
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
      <section className="relative h-screen overflow-hidden">
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
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.location}</h3>
                <p className="text-2xl font-bold text-beedab-blue mb-3">{property.price}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-beedab-blue/10 text-beedab-blue text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Agent Info */}
                <div className="flex items-center space-x-3 pt-3 border-t">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{property.agent.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Phone className="h-3 w-3" />
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
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Find Your Perfect Property in
                <span className="block bg-gradient-to-r from-beedab-lightblue to-beedab-accent bg-clip-text text-transparent">
                  Beautiful Botswana
                </span>
              </h1>
            </motion.div>
            
            <AISearchBar 
              onSearch={(query: string) => {
                window.location.href = `/properties?search=${encodeURIComponent(query)}`;
              }}
              className="backdrop-blur-sm"
            />
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
                      onClick={() => window.open(agency.website, '_blank')}
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

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose beedab?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets comprehensive real estate tools for the ultimate property discovery experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Comprehensive Listings',
                description: 'Browse thousands of verified properties from FSBO sellers and professional agents'
              },
              {
                icon: Users,
                title: 'Expert Agents',
                description: 'Connect with trusted real estate professionals across Botswana'
              },
              {
                icon: Star,
                title: 'Premium Service',
                description: 'Experience world-class service with local market expertise'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
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
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-beedab-lightblue max-w-2xl mx-auto">
              Join thousands of satisfied Batswana who found their perfect home through beedab
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Start Your Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/create-property"
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