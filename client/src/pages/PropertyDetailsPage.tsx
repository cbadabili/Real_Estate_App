import React, { useState } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Shield,
  Car,
  Wifi,
  TreePine,
  Zap
} from 'lucide-react';
import { sampleProperties } from '../data/sampleData';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // In a real app, this would fetch the property by ID
  const property = sampleProperties[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const features = [
    { icon: Car, label: 'Two-Car Garage' },
    { icon: Wifi, label: 'High-Speed Internet' },
    { icon: TreePine, label: 'Landscaped Yard' },
    { icon: Zap, label: 'Solar Panels' },
    { icon: Shield, label: 'Security System' }
  ];

  const agent = {
    name: 'Sarah Johnson',
    title: 'Licensed Real Estate Agent',
    rating: 4.9,
    reviews: 127,
    phone: '(555) 123-4567',
    email: 'sarah@propertyhub.com',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-10 bg-neutral-200 rounded-xl overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-neutral-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-neutral-700" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
                    <Heart className="h-5 w-5 text-neutral-700" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
                
                    <Share2 className="h-5 w-5 text-neutral-700" />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary-500' 
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.listingType === 'fsbo' 
                        ? 'bg-accent-100 text-accent-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {property.listingType.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                      New Listing
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                  <p className="text-neutral-600 flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary-600">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="text-neutral-500">
                    ${property.pricePerSqft}/sqft
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-4 gap-6 py-6 border-y border-neutral-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-6 w-6 text-primary-600 mr-2" />
                    <span className="text-2xl font-bold text-neutral-900">{property.bedrooms}</span>
                  </div>
                  <div className="text-sm text-neutral-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-6 w-6 text-primary-600 mr-2" />
                    <span className="text-2xl font-bold text-neutral-900">{property.bathrooms}</span>
                  </div>
                  <div className="text-sm text-neutral-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-6 w-6 text-primary-600 mr-2" />
                    <span className="text-2xl font-bold text-neutral-900">{property.sqft.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-neutral-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-primary-600 mr-2" />
                    <span className="text-2xl font-bold text-neutral-900">2020</span>
                  </div>
                  <div className="text-sm text-neutral-600">Year Built</div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center justify-between pt-6 text-sm text-neutral-500">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {property.views} views
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {property.daysOnMarket} days on market
                  </div>
                  <div className="flex items-center text-success-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Price reduced $10,000
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">About This Property</h2>
              <p className="text-neutral-700 leading-relaxed mb-6">
                This stunning modern family home offers the perfect blend of comfort and style. Located in a quiet neighborhood with excellent schools nearby, this property features an open-concept design with high ceilings, hardwood floors throughout, and a gourmet kitchen with stainless steel appliances. The master suite includes a walk-in closet and spa-like bathroom. The backyard is perfect for entertaining with a large deck and mature landscaping.
              </p>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="text-neutral-700">{feature.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Neighborhood Info */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Neighborhood</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 mb-1">9.2</div>
                  <div className="text-sm text-neutral-600">Walk Score</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600 mb-1">A+</div>
                  <div className="text-sm text-neutral-600">School Rating</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600 mb-1">8.5</div>
                  <div className="text-sm text-neutral-600">Transit Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Agent */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 sticky top-24">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{agent.name}</h3>
                  <p className="text-neutral-600 text-sm">{agent.title}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-warning-500 fill-current" />
                    <span className="text-sm text-neutral-600 ml-1">
                      {agent.rating} ({agent.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Call {agent.phone}
                </button>
                <button className="w-full py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Agent
                </button>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-neutral-200"
                >
                  <form className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        placeholder="I'm interested in this property..."
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Schedule Tour */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Schedule a Tour</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors">
                  Schedule In-Person Tour
                </button>
                <button className="w-full py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors">
                  Virtual Tour Available
                </button>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Mortgage Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    placeholder="65000"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="6.5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Loan Term (years)
                  </label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                    <option>30</option>
                    <option>15</option>
                    <option>20</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Monthly Payment:</span>
                    <span className="text-lg font-bold text-primary-600">$3,247</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;