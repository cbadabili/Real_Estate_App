import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, Globe, Calendar, Award, Users, TrendingUp, Home } from 'lucide-react';

const AgentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // This would normally fetch agent data from API
  const agent = {
    id: parseInt(id || '1'),
    name: 'Thabo Mogami',
    title: 'Senior Property Consultant',
    location: 'Gaborone',
    rating: 4.9,
    reviews: 127,
    specialties: ['Residential', 'Commercial', 'Investment'],
    languages: ['English', 'Setswana'],
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    phone: '+267 7123 4567',
    email: 'thabo@beedab.com',
    bio: 'Experienced property consultant with a passion for helping clients find their dream homes. Specializing in residential and commercial properties across Gaborone.',
    propertiesSold: 89,
    averageDaysOnMarket: 32,
    certifications: ['REAC Certified', 'Property Valuation License'],
    achievements: ['Top Performer 2023', 'Customer Choice Award']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-beedab-blue to-beedab-darkblue text-white p-8">
            <div className="flex items-center space-x-6">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <p className="text-xl text-beedab-lightblue">{agent.title}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{agent.rating}</span>
                    <span className="ml-1 text-sm">({agent.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5" />
                    <span className="ml-1">{agent.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate(`/rate-agent/${id}`)}
                className="flex items-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Rate This Agent
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About {agent.name}</h2>
                <p className="text-gray-600 mb-6">{agent.bio}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, index) => (
                        <span key={index} className="bg-beedab-blue/10 text-beedab-blue px-3 py-1 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((language, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-beedab-blue mr-3" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-beedab-blue mr-3" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Performance Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-beedab-blue">{agent.propertiesSold}</div>
                      <div className="text-sm text-gray-600">Properties Sold</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-beedab-blue">{agent.averageDaysOnMarket}</div>
                      <div className="text-sm text-gray-600">Avg Days on Market</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentProfilePage;