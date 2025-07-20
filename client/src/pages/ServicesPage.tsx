import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, Filter, Search, MessageCircle, Phone, Camera, Gavel, Home, Wrench, Calculator, Shield, Award, Users, FileCheck, ArrowRight, CheckCircle, FileText, Truck } from 'lucide-react';
import ServiceProviderRegistration from '../components/ServiceProviderRegistration';

interface Professional {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  responseTime: string;
  description: string;
  priceRange: string;
  image: string;
  specialties: string[];
  verified: boolean;
}

const ServicesPage: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, []);

  // Sample data for professionals
  const sampleProfessionals: Professional[] = [
    {
      id: 1,
      name: "Thabo Mogale Legal Services",
      category: "legal",
      rating: 4.9,
      reviews: 87,
      location: "Gaborone",
      responseTime: "2 hours",
      description: "Specialized in property law, conveyancing, and real estate transactions with over 15 years of experience.",
      priceRange: "P500 - P2,000",
      image: "/api/placeholder/80/80",
      specialties: ["Property Law", "Conveyancing", "Contract Review"],
      verified: true
    },
    {
      id: 2,
      name: "Bokamoso Photography",
      category: "photography",
      rating: 4.8,
      reviews: 156,
      location: "Francistown",
      responseTime: "1 hour",
      description: "Professional real estate photography and virtual tours. High-quality images that sell properties faster.",
      priceRange: "P300 - P1,500",
      image: "/api/placeholder/80/80",
      specialties: ["Real Estate Photography", "Virtual Tours", "Drone Photography"],
      verified: true
    },
    {
      id: 3,
      name: "Reliable Property Inspectors",
      category: "property-inspection",
      rating: 4.7,
      reviews: 203,
      location: "Gaborone",
      responseTime: "4 hours",
      description: "Comprehensive property inspections covering structural, electrical, and plumbing systems.",
      priceRange: "P400 - P1,200",
      image: "/api/placeholder/80/80",
      specialties: ["Structural Inspection", "Electrical Systems", "Plumbing"],
      verified: true
    },
    {
      id: 4,
      name: "BotswanaHome Finance Advisors",
      category: "finance",
      rating: 4.6,
      reviews: 134,
      location: "Maun",
      responseTime: "3 hours",
      description: "Mortgage and home loan specialists helping you secure the best financing options.",
      priceRange: "P200 - P800",
      image: "/api/placeholder/80/80",
      specialties: ["Mortgage Advice", "Loan Processing", "Credit Assessment"],
      verified: true
    },
    {
      id: 5,
      name: "Premier Property Insurance",
      category: "insurance",
      rating: 4.5,
      reviews: 98,
      location: "Gaborone",
      responseTime: "2 hours",
      description: "Comprehensive property insurance solutions for homeowners and investors.",
      priceRange: "P150 - P600",
      image: "/api/placeholder/80/80",
      specialties: ["Home Insurance", "Investment Property", "Claims Support"],
      verified: true
    },
    {
      id: 6,
      name: "Elite Construction Botswana",
      category: "construction",
      rating: 4.7,
      reviews: 145,
      location: "Gaborone",
      responseTime: "3 hours",
      description: "Full-service construction company specializing in residential and commercial projects.",
      priceRange: "P2,000 - P15,000",
      image: "/api/placeholder/80/80",
      specialties: ["HVAC Systems", "Electrical Work", "Plumbing"],
      verified: true
    },
    {
      id: 7,
      name: "Swift Movers Botswana",
      category: "moving",
      rating: 4.6,
      reviews: 89,
      location: "Francistown",
      responseTime: "1 hour",
      description: "Professional moving services with full insurance coverage across Botswana.",
      priceRange: "P800 - P3,500",
      image: "/api/placeholder/80/80",
      specialties: ["Residential Moving", "Office Relocation", "Packing Services"],
      verified: true
    },
    {
      id: 8,
      name: "Sparkle Clean Services",
      category: "cleaning",
      rating: 4.8,
      reviews: 76,
      location: "Gaborone",
      responseTime: "2 hours",
      description: "Professional cleaning services for move-in, move-out, and deep cleaning needs.",
      priceRange: "P200 - P800",
      image: "/api/placeholder/80/80",
      specialties: ["Deep Cleaning", "Post-Construction", "Move-Out Cleaning"],
      verified: true
    },
    {
      id: 9,
      name: "ProFix Maintenance",
      category: "maintenance",
      rating: 4.5,
      reviews: 112,
      location: "Maun",
      responseTime: "4 hours",
      description: "Comprehensive property maintenance including garden, pool, and security services.",
      priceRange: "P300 - P1,200",
      image: "/api/placeholder/80/80",
      specialties: ["Garden Maintenance", "Pool Services", "Security Systems"],
      verified: true
    }
  ];

  useEffect(() => {
    setProfessionals(sampleProfessionals);
    setFilteredProfessionals(sampleProfessionals);
  }, []);

  // Filter professionals based on category and search term
  useEffect(() => {
    let filtered = professionals;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prof => 
        prof.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProfessionals(filtered);
  }, [selectedCategory, searchTerm, professionals]);

  const categories = [
    { id: 'all', name: 'All Services', icon: Home },
    { id: 'legal', name: 'Legal Services', icon: Gavel },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'property-inspection', name: 'Property Inspection', icon: Shield },
    { id: 'finance', name: 'Finance & Loans', icon: Calculator },
    { id: 'insurance', name: 'Insurance', icon: Award },
    { id: 'construction', name: 'Construction', icon: Wrench },
    { id: 'moving', name: 'Moving', icon: Truck },
    { id: 'cleaning', name: 'Cleaning', icon: Home },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
  ];

  const serviceCategories = [
    { name: 'Legal Services', icon: '⚖️', description: 'Property lawyers and legal services' },
    { name: 'Photography', icon: '📸', description: 'Property photography services' },
    { name: 'Property Inspection', icon: '🔍', description: 'Professional property inspections' },
    { name: 'Finance & Loans', icon: '💰', description: 'Mortgage brokers and financing' },
    { name: 'Insurance', icon: '🛡️', description: 'Property and home insurance' },
    { name: 'Construction', icon: '🏗️', description: 'General construction and specialized trades' },
    { name: 'Moving', icon: '🚚', description: 'Professional moving and relocation services' },
    { name: 'Cleaning', icon: '🧹', description: 'Move-in, move-out, and deep cleaning' },
    { name: 'Maintenance', icon: '🔧', description: 'Property maintenance and repair services' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Professional Services
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Connect with verified professionals for every step of your real estate journey
          </p>

        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-neutral-600 mr-2" />
            <span className="font-medium text-neutral-900">Service Categories</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-beedab-blue text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search professionals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProfessionals.map((professional) => (
            <motion.div
              key={professional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {professional.name}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-neutral-900">
                      {professional.rating}
                    </span>
                    <span className="text-xs text-neutral-600 ml-1">
                      ({professional.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-neutral-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{professional.location}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Responds in {professional.responseTime}</span>
                </div>

                <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
                  {professional.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {professional.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  {professional.specialties.length > 2 && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                      +{professional.specialties.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {professional.priceRange}
                  </span>
                  {professional.verified && (
                    <span className="flex items-center text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900 mb-2">No professionals found</h3>
            <p className="text-neutral-600">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Professional Services?</h2>
          <p className="text-blue-100 mb-6">
            Join our network of verified professionals and grow your business
          </p>
          <button 
            className="bg-white text-beedab-blue px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            onClick={() => setShowRegistration(true)}
          >
            Register as Professional
          </button>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <ServiceProviderRegistration 
            onClose={() => setShowRegistration(false)}
            onSuccess={() => {
              setShowRegistration(false);
              // Optionally refresh the professionals list
              console.log('Service provider registered successfully!');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesPage;