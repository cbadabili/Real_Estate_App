import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Star, Filter, Grid3X3, List, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const RentalsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 5000],
    propertyType: '',
    amenities: []
  });

  const rentalProperties = [
    {
      id: 1,
      title: 'Luxury Safari Lodge - Maun',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Maun, Botswana',
      rating: 4.9,
      reviews: 127,
      pricePerNight: 850,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Safari Tours', 'Pool', 'Game Viewing', 'All Meals Included'],
      host: {
        name: 'Safari Adventures BW',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        isSuperhost: true
      },
      instantBook: true
    },
    {
      id: 2,
      title: 'Modern Apartment - Gaborone CBD',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Gaborone Central, Botswana',
      rating: 4.7,
      reviews: 89,
      pricePerNight: 320,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'City Views'],
      host: {
        name: 'Thabo Mogami',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        isSuperhost: false
      },
      instantBook: false
    },
    {
      id: 3,
      title: 'Traditional Thatched House - Serowe',
      images: [
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Serowe, Botswana',
      rating: 4.8,
      reviews: 156,
      pricePerNight: 180,
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 2,
      amenities: ['Traditional Architecture', 'Garden', 'Cultural Experience', 'Local Guide'],
      host: {
        name: 'Neo Kgosana',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6b7867c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        isSuperhost: true
      },
      instantBook: true
    }
  ];

  const amenityOptions = [
    'WiFi', 'Kitchen', 'Parking', 'Pool', 'Air Conditioning', 'Washer/Dryer',
    'Safari Tours', 'Game Viewing', 'Cultural Experience', 'Local Guide'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rentals in Botswana</h1>
              <p className="text-gray-600">Discover unique places to stay</p>
            </div>
            
            {/* Search Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-48">
                <input
                  type="text"
                  placeholder="Where to?"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => setFilters(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => setFilters(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
              <select
                value={filters.guests}
                onChange={(e) => setFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <span className="text-gray-600">{rentalProperties.length} properties found</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-beedab-blue text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-beedab-blue text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {rentalProperties.map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className={`object-cover ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                  }`}
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                {property.instantBook && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-beedab-blue text-white text-xs font-medium rounded">
                    Instant Book
                  </div>
                )}
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex justify-between h-full' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex-1 pr-6' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{property.maxGuests} guests</span>
                      <span>{property.bedrooms} bedrooms</span>
                      <span>{property.bathrooms} bathrooms</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={property.host.avatar}
                          alt={property.host.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{property.host.name}</p>
                          {property.host.isSuperhost && (
                            <p className="text-xs text-beedab-blue">Superhost</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-gray-500">({property.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-beedab-blue">
                        P {property.pricePerNight.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                      <Link
                        to={`/rental/${property.id}`}
                        className="inline-block mt-4 px-6 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
                
                {viewMode === 'grid' && (
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-beedab-blue">
                        P {property.pricePerNight.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                    <Link
                      to={`/rental/${property.id}`}
                      className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RentalsPage;