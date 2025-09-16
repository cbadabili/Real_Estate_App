import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  X,
  Building
} from 'lucide-react';

const AgentNetworkPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const agents = [
    {
      id: 1,
      name: 'Thabo Mokwena',
      company: 'Mokwena Properties',
      location: 'Gaborone',
      rating: 4.8,
      reviews: 23,
      specialization: 'Residential Properties',
      verified: true,
      phone: '71234567',
      email: 'thabo@mokwenaproperties.co.bw',
      yearsExperience: 8,
      propertiesSold: 156,
      languages: ['English', 'Setswana'],
      certifications: ['Licensed Agent', 'Property Valuation'],
      about: 'Specializing in residential properties across Gaborone with over 8 years of experience.',
      recentSales: 12,
      responseTime: '< 2 hours',
      image: null
    },
    {
      id: 2,
      name: 'Keabetswe Setlhabi',
      company: 'Prime Estate Botswana',
      location: 'Francistown',
      rating: 4.6,
      reviews: 18,
      specialization: 'Commercial Properties',
      verified: true,
      phone: '72345678',
      email: 'keabetswe@primeestate.co.bw',
      yearsExperience: 6,
      propertiesSold: 89,
      languages: ['English', 'Setswana', 'Kalanga'],
      certifications: ['Licensed Agent', 'Commercial Real Estate'],
      about: 'Expert in commercial real estate with focus on retail and office spaces.',
      recentSales: 8,
      responseTime: '< 4 hours',
      image: null
    },
    {
      id: 3,
      name: 'Neo Seretse',
      company: 'Seretse Real Estate',
      location: 'Maun',
      rating: 4.9,
      reviews: 31,
      specialization: 'Land & Plots',
      verified: true,
      phone: '73456789',
      email: 'neo@seretse-realestate.co.bw',
      yearsExperience: 12,
      propertiesSold: 203,
      languages: ['English', 'Setswana'],
      certifications: ['Licensed Agent', 'Land Development', 'Agricultural Land'],
      about: 'Leading land specialist in Northern Botswana with extensive knowledge of plot development.',
      recentSales: 15,
      responseTime: '< 1 hour',
      image: null
    },
    {
      id: 4,
      name: 'Tumi Mphela',
      company: 'Capital City Properties',
      location: 'Gaborone',
      rating: 4.7,
      reviews: 28,
      specialization: 'Luxury Homes',
      verified: true,
      phone: '74567890',
      email: 'tumi@capitalcity.co.bw',
      yearsExperience: 10,
      propertiesSold: 134,
      languages: ['English', 'Setswana'],
      certifications: ['Licensed Agent', 'Luxury Property Specialist'],
      about: 'Luxury home specialist serving high-end residential market in Gaborone.',
      recentSales: 7,
      responseTime: '< 3 hours',
      image: null
    }
  ];

  const locations = ['All Locations', 'Gaborone', 'Francistown', 'Maun', 'Kasane', 'Palapye'];
  const specializations = ['All Specializations', 'Residential Properties', 'Commercial Properties', 'Land & Plots', 'Luxury Homes'];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' || agent.location === selectedLocation;
    const matchesSpecialization = !selectedSpecialization || selectedSpecialization === 'All Specializations' || agent.specialization === selectedSpecialization;
    
    return matchesSearch && matchesLocation && matchesSpecialization;
  });

  const handleContactAgent = (agent) => {
    setSelectedAgent(agent);
    setShowContactModal(true);
  };

  const handlePhoneCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/267${phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-beedab-darkblue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Agent Network</h1>
            <p className="text-xl text-beedab-lightblue mb-6 max-w-2xl mx-auto">
              Connect with professional real estate agents across Botswana and access quality real estate services
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search agents by name, location, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 ${showFilters ? 'bg-beedab-blue text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:bg-beedab-darkblue hover:text-white transition-colors flex items-center`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              Found {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
            </p>
            {(searchTerm || selectedLocation || selectedSpecialization) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                  setSelectedSpecialization('');
                }}
                className="text-sm text-beedab-blue hover:text-beedab-darkblue"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-beedab-blue to-beedab-darkblue rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        {agent.verified && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{agent.company}</p>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {agent.rating} ({agent.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {agent.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {agent.specialization}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      {agent.yearsExperience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {agent.propertiesSold} properties sold
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.certifications.slice(0, 2).map((cert, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button 
                      onClick={() => handleContactAgent(agent)}
                      className="bg-beedab-blue text-white px-3 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center text-sm"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </button>
                    <button 
                      onClick={() => handleWhatsApp(agent.phone)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </button>
                  </div>

                  <Link
                    to={`/agent/${agent.id}`}
                    className="block text-center text-beedab-blue hover:text-beedab-darkblue transition-colors text-sm font-medium"
                  >
                    View Full Profile →
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredAgents.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are You a Professional Real Estate Agent?
          </h2>
          <p className="text-xl text-beedab-lightblue mb-6">
            Join our network and connect with buyers and sellers across Botswana
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Choose Agent Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Contact {selectedAgent.name}</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-beedab-blue" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{selectedAgent.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-beedab-blue" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{selectedAgent.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-beedab-blue" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-gray-600">{selectedAgent.responseTime}</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <button 
                    onClick={() => handlePhoneCall(selectedAgent.phone)}
                    className="w-full bg-beedab-blue text-white py-3 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </button>
                  <button 
                    onClick={() => handleWhatsApp(selectedAgent.phone)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => handleEmail(selectedAgent.email)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Email Agent
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentNetworkPage;