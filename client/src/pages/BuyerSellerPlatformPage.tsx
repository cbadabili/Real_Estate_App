import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  FileText, 
  Shield, 
  Calculator, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Home,
  MessageSquare,
  Calendar,
  Video,
  Handshake,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Eye,
  TrendingUp
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