import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

const AgentNetworkPage = () => {
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
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-beedab-darkblue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">REAC Agent Network</h1>
            <p className="text-xl text-beedab-lightblue mb-6 max-w-2xl mx-auto">
              Connect with certified REAC agents across Botswana and access professional real estate services
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search agents by name, location, or specialization..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-600" />
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
                  <p className="text-sm text-gray-600">
                    <strong>Specialization:</strong> {agent.specialization}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center text-sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </button>
                </div>

                <Link
                  to={`/agent/${agent.id}`}
                  className="block mt-3 text-center text-beedab-blue hover:text-beedab-darkblue transition-colors text-sm font-medium"
                >
                  View Full Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are You a REAC Certified Agent?
          </h2>
          <p className="text-xl text-beedab-lightblue mb-6">
            Join our network and connect with buyers and sellers across Botswana
          </p>
          <Link
            to="/agent-registration"
            className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Register as Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AgentNetworkPage;