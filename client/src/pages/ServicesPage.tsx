import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, Calculator, Camera, Truck, Hammer, ClipboardCheck,
  Shield, Users, Award, Star, Phone, MessageCircle, Filter,
  MapPin, Clock, DollarSign, CheckCircle
} from 'lucide-react';
import { ServicesShowcase } from '../components/ServicesShowcase';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Users },
    { id: 'legal', name: 'Legal & Conveyancing', icon: Scale },
    { id: 'finance', name: 'Financial Services', icon: Calculator },
    { id: 'valuation', name: 'Property Valuation', icon: ClipboardCheck },
    { id: 'insurance', name: 'Insurance', icon: Shield },
    { id: 'inspection', name: 'Building Inspections', icon: ClipboardCheck },
    { id: 'architecture', name: 'Architecture & Construction', icon: Hammer },
    { id: 'utilities', name: 'Utilities Setup', icon: Truck },
    { id: 'moving', name: 'Moving & Relocation', icon: Truck },
    { id: 'interior', name: 'Interior Design', icon: Camera },
    { id: 'management', name: 'Property Management', icon: Users },
    { id: 'surveying', name: 'Land Surveying', icon: MapPin },
    { id: 'photography', name: 'Photography', icon: Camera }
  ];

  const professionals = [
    // Legal & Conveyancing
    {
      id: 1,
      name: "Mogapi & Associates",
      category: "legal",
      rating: 4.9,
      reviews: 156,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Leading property law firm specializing in conveyancing and real estate transactions.",
      services: ["Property Transfer", "Conveyancing", "Contract Review", "Legal Due Diligence", "Title Services"],
      priceRange: "P2,500 - P15,000",
      responseTime: "2 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["planning", "viewing", "negotiating", "closing"]
    },
    
    // Financial Services
    {
      id: 2,
      name: "BotsBond Mortgage Brokers",
      category: "finance",
      rating: 4.8,
      reviews: 234,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Leading mortgage brokers helping secure the best home loan rates.",
      services: ["Mortgage Brokerage", "Loan Pre-approval", "Financial Planning", "Credit Assessment"],
      priceRange: "P1,500 - P8,000",
      responseTime: "1 hour",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["planning", "financing"]
    },

    // Property Valuation & Appraisal
    {
      id: 3,
      name: "Botswana Property Valuers",
      category: "valuation",
      rating: 4.7,
      reviews: 89,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Certified property valuers providing accurate market assessments for mortgage approval and investment planning.",
      services: ["Property Valuation", "Market Appraisal", "Investment Analysis", "Insurance Valuation"],
      priceRange: "P800 - P3,500",
      responseTime: "3 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["planning", "financing", "closing"]
    },

    // Insurance
    {
      id: 4,
      name: "Sechaba Insurance Brokers",
      category: "insurance",
      rating: 4.6,
      reviews: 112,
      location: "Gaborone",
      verified: true,
      reacCertified: false,
      description: "Comprehensive insurance solutions for homeowners, contents coverage, and liability policies.",
      services: ["Homeowner's Insurance", "Contents Coverage", "Liability Insurance", "Building Insurance"],
      priceRange: "P150 - P800/month",
      responseTime: "1 hour",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["closing", "post-purchase"]
    },

    // Building Inspections
    {
      id: 5,
      name: "Elite Building Inspectors",
      category: "inspection",
      rating: 4.8,
      reviews: 67,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Certified building inspectors identifying structural, electrical, plumbing, and other issues before sale.",
      services: ["Structural Surveys", "Electrical Inspections", "Plumbing Assessments", "Building Reports"],
      priceRange: "P1,200 - P4,500",
      responseTime: "4 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["viewing", "negotiating"]
    },

    // Architecture & Construction
    {
      id: 6,
      name: "Kgolo Architects & Builders",
      category: "architecture",
      rating: 4.5,
      reviews: 134,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Professional architects and contractors for renovation, extensions, and custom home construction.",
      services: ["Architectural Design", "Home Extensions", "Renovations", "Custom Construction"],
      priceRange: "P5,000 - P50,000+",
      responseTime: "24 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["post-purchase"]
    },

    // Utilities Setup
    {
      id: 7,
      name: "ConnectBots Utilities",
      category: "utilities",
      rating: 4.3,
      reviews: 45,
      location: "Gaborone",
      verified: true,
      reacCertified: false,
      description: "Assistance connecting essential utilities including electricity, water, telecommunications, and internet.",
      services: ["Electricity Connection", "Water Setup", "Internet Installation", "Telecom Services"],
      priceRange: "P200 - P1,500",
      responseTime: "6 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["closing", "post-purchase"]
    },

    // Moving & Relocation
    {
      id: 8,
      name: "Diamond Movers",
      category: "moving",
      rating: 4.5,
      reviews: 78,
      location: "Francistown",
      verified: true,
      reacCertified: false,
      description: "Professional moving services with packing, transport, and storage solutions.",
      services: ["Local Moving", "Long Distance", "Packing Services", "Storage Solutions"],
      priceRange: "P1,200 - P8,000",
      responseTime: "6 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["closing", "moving"]
    },

    // Interior Design
    {
      id: 9,
      name: "Motswana Interiors",
      category: "interior",
      rating: 4.7,
      reviews: 92,
      location: "Gaborone",
      verified: true,
      reacCertified: false,
      description: "Interior designers and furniture suppliers for turnkey home furnishing solutions.",
      services: ["Interior Design", "Furniture Supply", "Space Planning", "Decoration Services"],
      priceRange: "P3,000 - P25,000+",
      responseTime: "8 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["post-purchase"]
    },

    // Property Management
    {
      id: 10,
      name: "Gabs Property Management",
      category: "management",
      rating: 4.4,
      reviews: 156,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Professional property managers for maintenance, rentals, and general upkeep of investment properties.",
      services: ["Property Management", "Tenant Screening", "Maintenance Services", "Rental Management"],
      priceRange: "5% - 12% of rental",
      responseTime: "2 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["post-purchase", "investment"]
    },

    // Land Surveying
    {
      id: 11,
      name: "Precision Land Surveyors",
      category: "surveying",
      rating: 4.6,
      reviews: 34,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Licensed land surveyors for boundary clarification and municipal planning compliance.",
      services: ["Boundary Surveys", "Topographical Surveys", "Site Planning", "Cadastral Surveys"],
      priceRange: "P2,000 - P8,000",
      responseTime: "12 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["planning", "closing"]
    },

    // Photography
    {
      id: 12,
      name: "Motswana Visuals",
      category: "photography",
      rating: 4.8,
      reviews: 47,
      location: "Gaborone",
      verified: true,
      reacCertified: true,
      description: "Professional property photography and virtual tours across Botswana.",
      services: ["Property Photography", "Virtual Tours", "Drone Photography", "Floor Plans"],
      priceRange: "P800 - P3,500",
      responseTime: "4 hours",
      image: "/api/placeholder/300/200",
      buyerJourneySteps: ["viewing", "marketing"]
    }
  ];

  const filteredProfessionals = professionals.filter(pro => {
    const categoryMatch = selectedCategory === 'all' || pro.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || pro.location === selectedLocation;
    return categoryMatch && locationMatch;
  });

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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-neutral-600 mr-2" />
            <span className="font-medium text-neutral-900">Filter Services</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Service Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-beedab-blue"
              >
                {serviceCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="all">All Locations</option>
                <option value="Gaborone">Gaborone</option>
                <option value="Francistown">Francistown</option>
                <option value="Maun">Maun</option>
                <option value="Kasane">Kasane</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {serviceCategories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isActive 
                    ? 'border-beedab-blue bg-beedab-blue text-white' 
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-beedab-blue'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-xs font-medium text-center block">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map(professional => (
            <motion.div
              key={professional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img 
                  src={professional.image} 
                  alt={professional.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {professional.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                  {professional.reacCertified && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      REAC Certified
                    </span>
                  )}
                </div>
              </div>

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

                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {professional.priceRange}
                  </span>
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

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Professional Services?</h2>
          <p className="text-blue-100 mb-6">
            Join our network of verified professionals and grow your business
          </p>
          <button className="bg-white text-beedab-blue px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
            Register as Professional
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;