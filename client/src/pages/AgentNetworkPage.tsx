import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';

const AgentNetworkPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);

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

  const agents = [
    {
      id: 1,
      name: 'Thabo Mogami',
      location: 'Gaborone',
      specialization: 'Residential Properties',
      rating: 4.9,
      deals: 127,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      phone: '+267 7123 4567',
      email: 'thabo@beedab.com'
    },
    {
      id: 2,
      name: 'Neo Kgosana',
      location: 'Francistown',
      specialization: 'Commercial Properties',
      rating: 4.8,
      deals: 89,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b6b7867c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      phone: '+267 7234 5678',
      email: 'neo@beedab.com'
    },
    {
      id: 3,
      name: 'Mpho Setlhare',
      location: 'Maun',
      specialization: 'Luxury Properties',
      rating: 5.0,
      deals: 156,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      phone: '+267 7345 6789',
      email: 'mpho@beedab.com'
    }
  ];

  // Filter agents based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredAgents(agents);
  }, []);

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
              REAC Agent Network
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Connect with certified REAC agents across Botswana and access professional real estate services from trusted experts in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search agents by name, location, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-beedab-blue focus:border-transparent bg-white text-gray-900"
                />
                <button className="absolute right-2 top-2 p-2 text-gray-500 hover:text-beedab-blue">
                  <Users className="h-5 w-5" />
                </button>
              </div>
              <Link
                to="/agent-registration"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Award className="mr-2 h-5 w-5" />
                Join Our Network
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured REAC Certified Agents
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our top-performing agents who are ready to help you with your property needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{agent.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{agent.rating}</span>
                        <span className="text-sm text-gray-500">({agent.deals} deals)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-beedab-blue/10 text-beedab-blue text-sm rounded-full">
                      {agent.specialization}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{agent.phone}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/agent-profile/${agent.id}`}
                      className="flex-1 bg-beedab-blue text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-beedab-darkblue transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/contact-agent/${agent.id}`}
                      className="flex-1 border border-beedab-blue text-beedab-blue text-center py-2 rounded-lg text-sm font-medium hover:bg-beedab-blue hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Agent Network?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'REAC Certified',
                description: 'All agents are certified by the Real Estate Advisory Council of Botswana.'
              },
              {
                icon: CheckCircle,
                title: 'Verified Professionals',
                description: 'Thorough background checks and professional verification for all network members.'
              },
              {
                icon: Star,
                title: 'Top Performance',
                description: 'Only agents with proven track records and excellent client satisfaction ratings.'
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

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Network Statistics
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                value: '247',
                label: 'Certified Agents'
              },
              {
                value: '12',
                label: 'Cities Covered'
              },
              {
                value: '4.8',
                label: 'Average Rating'
              },
              {
                value: '1,847',
                label: 'Successful Deals'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="text-3xl font-bold text-beedab-blue mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
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
              Ready to Work with a Professional Agent?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Connect with certified REAC agents in your area and get expert assistance with your property needs.
            </p>
            <Link
              to="/find-agent"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Find Your Agent
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AgentNetworkPage;