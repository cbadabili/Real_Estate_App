
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  CheckCircle, 
  Camera, 
  Paintbrush, 
  Wrench, 
  Leaf,
  ArrowRight,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';

const PrepareHomePage = () => {
  const [activeTab, setActiveTab] = useState('staging');

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

  const preparationSteps = [
    {
      id: 'staging',
      title: 'Home Staging',
      icon: Home,
      description: 'Professional home staging to maximize appeal',
      services: [
        {
          name: 'Interior Staging',
          provider: 'Botswana Home Staging Co.',
          price: 'P2,500 - P8,000',
          duration: '1-2 days',
          link: '/services/interior-staging'
        },
        {
          name: 'Furniture Rental',
          provider: 'Gaborone Furniture Hire',
          price: 'P1,500/month',
          duration: 'Flexible',
          link: '/services/furniture-rental'
        }
      ]
    },
    {
      id: 'photography',
      title: 'Professional Photography',
      icon: Camera,
      description: 'High-quality photos that sell your property',
      services: [
        {
          name: 'Property Photography',
          provider: 'Kalahari Real Estate Photos',
          price: 'P800 - P2,500',
          duration: '2-4 hours',
          link: '/services/property-photography'
        },
        {
          name: 'Drone Photography',
          provider: 'SkyView Botswana',
          price: 'P1,200 - P3,000',
          duration: '1-2 hours',
          link: '/services/drone-photography'
        }
      ]
    },
    {
      id: 'repairs',
      title: 'Repairs & Maintenance',
      icon: Wrench,
      description: 'Essential repairs to increase property value',
      services: [
        {
          name: 'General Handyman',
          provider: 'Botswana Handyman Services',
          price: 'P150/hour',
          duration: 'Variable',
          link: '/services/handyman'
        },
        {
          name: 'Electrical Work',
          provider: 'Power Solutions BW',
          price: 'P200/hour',
          duration: 'Variable',
          link: '/services/electrical'
        },
        {
          name: 'Plumbing',
          provider: 'Kalahari Plumbers',
          price: 'P180/hour',
          duration: 'Variable',
          link: '/services/plumbing'
        }
      ]
    },
    {
      id: 'painting',
      title: 'Painting & Decoration',
      icon: Paintbrush,
      description: 'Fresh paint and decoration services',
      services: [
        {
          name: 'Interior Painting',
          provider: 'Gaborone Paint Masters',
          price: 'P15/m²',
          duration: '3-5 days',
          link: '/services/interior-painting'
        },
        {
          name: 'Exterior Painting',
          provider: 'Botswana Exterior Painters',
          price: 'P20/m²',
          duration: '5-7 days',
          link: '/services/exterior-painting'
        }
      ]
    },
    {
      id: 'landscaping',
      title: 'Landscaping',
      icon: Leaf,
      description: 'Garden and outdoor space improvement',
      services: [
        {
          name: 'Garden Design',
          provider: 'Kalahari Gardens',
          price: 'P3,000 - P15,000',
          duration: '1-2 weeks',
          link: '/services/garden-design'
        },
        {
          name: 'Lawn Maintenance',
          provider: 'Green Spaces Botswana',
          price: 'P500/visit',
          duration: '2-3 hours',
          link: '/services/lawn-maintenance'
        }
      ]
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
              Prepare Your Home for Sale
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Professional preparation services to maximize your property's appeal and value. Connect with trusted service providers across Botswana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Preparation Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our network of certified service providers to get your home market-ready.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
            {preparationSteps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === step.id
                      ? 'border-beedab-blue text-beedab-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          {preparationSteps.map((step) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className={`${activeTab === step.id ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-full flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {step.services.map((service, index) => (
                    <motion.div
                      key={service.name}
                      variants={itemVariants}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h4>
                      <p className="text-gray-600 mb-4">{service.provider}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{service.price}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      <Link
                        to={service.link}
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors text-sm font-medium"
                      >
                        Contact Provider
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Connect with our network of professional service providers and get your home market-ready.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PrepareHomePage;
