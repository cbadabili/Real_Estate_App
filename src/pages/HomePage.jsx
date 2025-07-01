import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home, Building, ArrowRight, Star, Shield, Users } from 'lucide-react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample featured properties
  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Family Home in Gaborone West',
      price: 'P1,250,000',
      location: 'Gaborone West',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 223,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Luxury Apartment in CBD',
      price: 'P850,000',
      location: 'Gaborone CBD',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 111,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Spacious Townhouse in Mogoditshane',
      price: 'P750,000',
      location: 'Mogoditshane',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 167,
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Property in
              <span className="block bg-gradient-to-r from-beedab-lightblue to-beedab-accent bg-clip-text text-transparent">
                Beautiful Botswana
              </span>
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Discover residential, commercial properties and plots across Botswana with our comprehensive real estate platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property type, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  />
                </div>
                <button className="bg-beedab-accent hover:bg-beedab-lightblue text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/properties" className="text-beedab-blue hover:text-beedab-darkblue flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-2xl font-bold text-beedab-blue mb-2">{property.price}</p>
                  <p className="text-gray-600 flex items-center mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft} sqm</span>
                  </div>
                  
                  <Link 
                    to={`/property/${property.id}`}
                    className="block mt-4 text-center bg-beedab-blue hover:bg-beedab-darkblue text-white py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BeeDaB?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets comprehensive real estate tools for the ultimate property discovery experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-6 w-6 text-beedab-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Buyer and Seller Platform</h3>
              <p className="text-gray-600">Complete For Sale By Owner tools including listing creation, legal documents, and transaction management for Batswana</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-6 w-6 text-beedab-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Transactions</h3>
              <p className="text-gray-600">REAC-compliant transaction processing and secure payment systems designed for Botswana real estate laws</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Building className="h-6 w-6 text-beedab-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Listings</h3>
              <p className="text-gray-600">Browse thousands of verified properties from direct sellers and professional agents across Botswana</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied Batswana who found their perfect home through BeeDaB
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
              to="/create-listing"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;