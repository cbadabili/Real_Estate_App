The code modifications involve adding a "Property Selling Tools" section to the `BuyerSellerPlatformPage.tsx` component, including necessary imports, and placing it after the features section.
```
```replit_final_file
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Search, 
  FileText, 
  Calculator, 
  Shield, 
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  DollarSign,
  Calendar,
  Handshake
} from 'lucide-react';

const BuyerSellerPlatformPage = () => {
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
      icon: FileText,
      title: 'Legal Document Templates',
      description: 'Access Botswana-compliant legal documents including sale agreements, disclosure forms, and transfer documents.',
      link: '/legal-documents'
    },
    {
      icon: Calculator,
      title: 'Property Valuation Tools',
      description: 'Get accurate property valuations using local market data and comparable sales in your area.',
      link: '/property-valuation'
    },
    {
      icon: Shield,
      title: 'Transaction Management',
      description: 'Secure escrow services and transaction tracking from listing to closing.',
      link: '/transaction-management'
    },
    {
      icon: Users,
      title: 'Professional Support',
      description: 'Connect with certified REAC agents, lawyers, and financial advisors when needed.',
      link: '/professional-support'
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
              Complete Buyer & Seller Platform
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Comprehensive For Sale By Owner tools including listing creation, legal documents, and transaction management designed specifically for Batswana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/create-property"
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Home className="mr-2 h-5 w-5" />
                List Your Property
              </a>
              <a
                href="/properties"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                Browse Properties
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Buy or Sell Property
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and support you need for successful property transactions in Botswana.
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
                          <span className="text-sm font-medium">Learn More</span>
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

      {/* Property Selling Tools Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 mr-3 text-beedab-blue" />
              Property Selling Tools
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Everything you need to successfully sell your property in Botswana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-beedab-blue rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Pricing Guide</h3>
                  <p className="text-neutral-600 mb-4">Set competitive prices based on market analysis and comparable sales</p>
                  <button 
                    onClick={() => window.open('/pricing-guide', '_blank')}
                    className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Manage Showings</h3>
                  <p className="text-neutral-600 mb-4">Schedule and coordinate property viewings with potential buyers</p>
                  <button 
                    onClick={() => window.open('/manage-showings', '_blank')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Handle Offers</h3>
                  <p className="text-neutral-600 mb-4">Review, negotiate, and manage purchase offers efficiently</p>
                  <button 
                    onClick={() => window.open('/handle-offers', '_blank')}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Property Handover</h3>
                  <p className="text-neutral-600 mb-4">Complete the legal transfer of ownership to buyers</p>
                  <button 
                    onClick={() => window.open('/property-handover', '_blank')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Save Money',
                description: 'Avoid hefty agent commissions while still getting professional support when you need it.'
              },
              {
                icon: Shield,
                title: 'Legal Compliance',
                description: 'All documents and processes are fully compliant with Botswana real estate laws and REAC regulations.'
              },
              {
                icon: Users,
                title: 'Expert Guidance',
                description: 'Access to professional advice and support throughout your property transaction journey.'
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-beedab-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-beedab-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
              Ready to Start Your Property Journey?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Join thousands of Batswana who have successfully bought and sold properties using our platform.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default BuyerSellerPlatformPage;