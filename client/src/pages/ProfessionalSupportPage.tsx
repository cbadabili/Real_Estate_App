import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Building,
  Gavel,
  Calculator,
  Home,
  Search,
  Filter
} from 'lucide-react';

const ProfessionalSupportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const professionalCategories = [
    { id: 'all', name: 'All Professionals', icon: Users },
    { id: 'legal', name: 'Legal Services', icon: Gavel },
    { id: 'financial', name: 'Financial Advisors', icon: Calculator },
    { id: 'agents', name: 'Real Estate Agents', icon: Home },
    { id: 'valuers', name: 'Property Valuers', icon: Building }
  ];

  // Fetch professionals from marketplace API
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch('/api/marketplace/professionals');
        if (response.ok) {
          const data = await response.json();
          // Transform marketplace data to match professional support format
          const transformedData = data.professionals.map(prof => ({
            id: prof.id,
            name: prof.business_name,
            category: getCategoryName(prof.category_id),
            specialization: prof.business_description,
            rating: prof.rating,
            reviews: prof.review_count,
            experience: `${prof.years_experience}+ years`,
            location: prof.service_area,
            phone: prof.contact_phone,
            email: prof.contact_email,
            hourlyRate: prof.hourly_rate > 0 ? `P${prof.hourly_rate}/hour` : 'Contact for pricing',
            availability: prof.verified ? 'Available' : 'Contact for availability',
            services: getServicesForCategory(prof.category_id),
            reacCertified: prof.verified,
            profileImage: prof.profile_image || '/avatars/default.jpg'
          }));
          setProfessionals(transformedData);
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
        // Fallback to static data if API fails
        setProfessionals([
          {
            id: 1,
            name: 'Advocate Kabo Mogapi',
            category: 'Legal Services',
            specialization: 'Property Law & Conveyancing',
            rating: 4.9,
            reviews: 156,
            experience: '15+ years',
            location: 'Gaborone CBD',
            phone: '+267 391 2345',
            email: 'kabo@mogapi.co.bw',
            hourlyRate: 'P800/hour',
            availability: 'Available',
            services: ['Property Transfer', 'Contract Review', 'Title Verification', 'REAC Compliance'],
            reacCertified: true
          },
          {
            id: 2,
            name: 'Thabo Setlhare',
            category: 'Financial Advisors',
            specialization: 'Mortgage & Property Finance',
            rating: 4.8,
            reviews: 203,
            experience: '12+ years',
            location: 'Gaborone',
            phone: '+267 395 8000',
            email: 'thabo.setlhare@fnb.co.bw',
            availability: 'Available',
            reacCertified: true,
            services: ['Mortgage Consultation', 'Investment Advice', 'Financial Planning', 'Loan Structuring'],
            hourlyRate: 'Free consultation',
            languages: ['English', 'Setswana']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const getCategoryName = (categoryId) => {
    const categories = {
      1: 'Legal Services',
      2: 'Property Valuers',
      3: 'Real Estate Agents',
      4: 'Financial Advisors',
      5: 'Property Managers'
    };
    return categories[categoryId] || 'Professional Services';
  };

  const getServicesForCategory = (categoryId) => {
    const services = {
      1: ['Property Transfer', 'Contract Review', 'Title Verification', 'REAC Compliance'],
      2: ['Property Valuation', 'Market Reports', 'Investment Analysis'],
      3: ['Property Sales', 'Market Analysis', 'Buyer Representation'],
      4: ['Mortgage Consultation', 'Investment Advice', 'Financial Planning'],
      5: ['Property Management', 'Tenant Relations', 'Maintenance Coordination']
    };
    return services[categoryId] || ['Professional Services'];
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesCategory = selectedCategory === 'all' || prof.category === selectedCategory;
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = professionalCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : Users;
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability === 'Available') return 'text-green-600 bg-green-100';
    if (availability.includes('Busy')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Professional Support
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Connect with certified REAC agents, lawyers, and financial advisors when needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-professionals" className="inline-flex items-center px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Users className="mr-2 h-5 w-5" />
                Find Professionals
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-700 transition-colors"
              >
                <Shield className="mr-2 h-5 w-5" />
                Choose Professional Plan
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search professionals by name, company, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {professionalCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Directory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Find the Right Professional</h2>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Categories */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Loading professionals...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProfessionals.map((professional) => {
                const CategoryIcon = getCategoryIcon(professional.category);
                return (
                  <motion.div
                    key={professional.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <CategoryIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{professional.name}</h3>
                            <p className="text-purple-600 font-medium">{professional.company}</p>
                            <p className="text-sm text-gray-600">{professional.specialization}</p>
                          </div>
                        </div>
                        {professional.reacCertified && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            <span>REAC Certified</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{professional.rating}</span>
                          <span className="text-sm text-gray-500">({professional.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{professional.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{professional.location}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(professional.availability)}`}>
                            {professional.availability}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {professional.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {service}
                            </span>
                          ))}
                          {professional.services.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{professional.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{professional.phone}</span>
                        </div>
                        <span className="font-medium text-purple-600">{professional.hourlyRate}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          onClick={() => window.location.href = `tel:${professional.phone}`}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Call Now
                        </button>
                        <button 
                          onClick={() => window.location.href = `mailto:${professional.email}`}
                          className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                        >
                          Email
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16 bg-purple-50 border-t border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              24/7 Emergency Support
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need immediate professional assistance? Our emergency support team connects you with available professionals.
            </p>
          </motion.div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency Professional Hotline</h3>
            <p className="text-red-700 mb-4">Available 24/7 for urgent property matters</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency Line
              </button>
              <Link
                to="/services/legal/emergency"
                className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Professional */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Professional Network
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Are you a certified real estate professional? Join our platform to connect with clients and grow your business.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              Choose Professional Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProfessionalSupportPage;