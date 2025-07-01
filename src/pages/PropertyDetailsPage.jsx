import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Star
} from 'lucide-react';
import MortgageCalculator from '../components/MortgageCalculator';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Sample property data - in a real app, this would be fetched based on the ID
  const property = {
    id: 1,
    title: 'Modern Family Home in Gaborone West',
    price: 1250000,
    location: 'Gaborone West',
    description: 'This stunning modern family home offers the perfect blend of comfort and style. Located in a quiet neighborhood with excellent schools nearby, this property features an open-concept design with high ceilings, hardwood floors throughout, and a gourmet kitchen with stainless steel appliances. The master suite includes a walk-in closet and spa-like bathroom. The backyard is perfect for entertaining with a large deck and mature landscaping.',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 223,
    yearBuilt: 2020,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Two-Car Garage', 'Solar Panels', 'Borehole', 'Security System', 'Garden'],
    agent: {
      name: 'Sarah Johnson',
      title: 'Licensed Real Estate Agent',
      rating: 4.9,
      reviews: 127,
      phone: '71234567',
      email: 'sarah@beedab.com',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-10 bg-gray-200 rounded-xl overflow-hidden">
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
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
                    <Heart className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
                    <Share2 className="h-5 w-5 text-gray-700" />
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
                        ? 'border-beedab-blue' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-beedab-blue">
                    P {property.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-4 gap-6 py-6 border-y border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-6 w-6 text-beedab-blue mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{property.bedrooms}</span>
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-6 w-6 text-beedab-blue mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{property.bathrooms}</span>
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-6 w-6 text-beedab-blue mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{property.sqft}</span>
                  </div>
                  <div className="text-sm text-gray-600">Sq Meters</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-beedab-blue mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{property.yearBuilt}</span>
                  </div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="py-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Property</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-beedab-blue/10 rounded-lg flex items-center justify-center">
                        <span className="text-beedab-blue">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Agent */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{property.agent.name}</h3>
                  <p className="text-gray-600 text-sm">{property.agent.title}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {property.agent.rating} ({property.agent.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Call {property.agent.phone}
                </button>
                <button className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Agent
                </button>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <form className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        placeholder="I'm interested in this property..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Mortgage Calculator */}
            <MortgageCalculator propertyPrice={property.price} />

            {/* Schedule Tour */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Tour</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors">
                  Schedule In-Person Tour
                </button>
                <button className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                  Virtual Tour Available
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;