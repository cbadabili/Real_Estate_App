import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, DollarSign, Calendar, Users, Shield, Camera } from 'lucide-react';
import { Link } from 'wouter';

const RentOutPage = () => {
  const [formStep, setFormStep] = useState(1);

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
      icon: DollarSign,
      title: 'Maximize Your Returns',
      description: 'Set competitive rental prices with our market analysis tools and earn more from your property investment.'
    },
    {
      icon: Shield,
      title: 'Secure Tenant Screening',
      description: 'Comprehensive background checks and credit verification to find reliable tenants for your property.'
    },
    {
      icon: Calendar,
      title: 'Automated Management',
      description: 'Handle rent collection, maintenance requests, and lease agreements through our digital platform.'
    },
    {
      icon: Users,
      title: 'Professional Support',
      description: 'Access to property management experts and legal support for landlords across Botswana.'
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
              Rent Out Your Property with Confidence
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Transform your property into a profitable rental income stream with beedab's comprehensive landlord platform designed for the Botswana market.
            </p>
            <Link
              to="/create-listing"
              className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              List Your Property
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose beedab for Rental Management?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and services to help you succeed as a landlord in Botswana's rental market
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your property listed and start earning rental income
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'List Your Property',
                description: 'Upload photos, set rental price, and add property details with our easy-to-use listing tools.'
              },
              {
                step: '02',
                title: 'Screen Tenants',
                description: 'Review applications, conduct background checks, and select the best tenants for your property.'
              },
              {
                step: '03',
                title: 'Manage & Earn',
                description: 'Collect rent payments, handle maintenance requests, and manage your rental business efficiently.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-beedab-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Start Earning Rental Income Today
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Join hundreds of successful landlords who trust beedab to manage their rental properties in Botswana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Camera className="mr-2 h-5 w-5" />
                List Property Now
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                Get Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default RentOutPage;