
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Phone, Mail, Wrench, Briefcase, Truck, GraduationCap } from 'lucide-react';

const ServiceProviderDirectory = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Services', icon: Briefcase },
    { id: 'professionals', label: 'Professionals', icon: Briefcase },
    { id: 'artisans', label: 'Artisans', icon: Wrench },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'training', label: 'Training', icon: GraduationCap }
  ];

  const providers = [
    {
      id: 1,
      name: 'Botswana Legal Services',
      category: 'professionals',
      type: 'Legal Services',
      rating: 4.8,
      location: 'Gaborone CBD',
      phone: '+267 391 2345',
      email: 'info@bwlegal.co.bw',
      services: ['Property Law', 'Contract Drafting', 'Title Transfer'],
      description: 'Experienced property lawyers specializing in real estate transactions.'
    },
    {
      id: 2,
      name: 'Premium Builders',
      category: 'artisans',
      type: 'Construction',
      rating: 4.6,
      location: 'Francistown',
      phone: '+267 241 8765',
      email: 'contact@premiumbuilders.co.bw',
      services: ['Home Construction', 'Renovations', 'Extensions'],
      description: 'Quality construction services with 15+ years of experience.'
    },
    {
      id: 3,
      name: 'BuildMart Botswana',
      category: 'suppliers',
      type: 'Building Materials',
      rating: 4.4,
      location: 'Multiple Locations',
      phone: '+267 395 4321',
      email: 'sales@buildmart.co.bw',
      services: ['Cement & Concrete', 'Steel & Metal', 'Electrical Supplies'],
      description: 'Leading supplier of quality building materials across Botswana.'
    },
    {
      id: 4,
      name: 'Real Estate Academy',
      category: 'training',
      type: 'Education & Training',
      rating: 4.7,
      location: 'Gaborone',
      phone: '+267 390 1234',
      email: 'admin@reacademy.co.bw',
      services: ['Agent Training', 'Property Management', 'Investment Analysis'],
      description: 'Professional real estate training and certification programs.'
    }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = activeCategory === 'all' || provider.category === activeCategory;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Provider Directory</h1>
          <p className="text-gray-600">
            Connect with verified professionals, artisans, suppliers, and training providers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search providers or services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-beedab-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Provider Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.type}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{provider.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

              {/* Services */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                  {provider.services.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{provider.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {provider.location}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {provider.phone}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-beedab-blue text-white py-2 px-4 rounded-md hover:bg-beedab-darkblue transition-colors text-sm font-medium">
                  Contact
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Register as Provider CTA */}
        <div className="mt-12 bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Are you a service provider?</h2>
          <p className="text-blue-100 mb-6">
            Join our directory and connect with property owners and real estate professionals
          </p>
          <button className="bg-white text-beedab-blue px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Register as Provider
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceProviderDirectory;
