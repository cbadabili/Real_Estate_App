
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  Gavel,
  Calculator,
  Home,
  Building
} from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  category: string;
  specialization: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  phone: string;
  email: string;
  hourlyRate: string;
  availability: string;
  services: string[];
  verified: boolean;
  profileImage?: string;
}

const ProfessionalsPage: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Professionals', icon: Users },
    { id: 'legal', name: 'Legal Services', icon: Gavel },
    { id: 'financial', name: 'Financial Advisors', icon: Calculator },
    { id: 'agents', name: 'Real Estate Agents', icon: Home },
    { id: 'valuers', name: 'Property Valuers', icon: Building }
  ];

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch('/api/services?section=professionals');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProfessionals(data.data || []);
            setFilteredProfessionals(data.data || []);
          }
        } else {
          // Fallback data
          const sampleProfessionals: Professional[] = [
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
              verified: true
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
              verified: true,
              services: ['Mortgage Consultation', 'Investment Advice', 'Financial Planning', 'Loan Structuring'],
              hourlyRate: 'Free consultation'
            }
          ];
          setProfessionals(sampleProfessionals);
          setFilteredProfessionals(sampleProfessionals);
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
        setFilteredProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

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
        prof.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProfessionals(filtered);
  }, [selectedCategory, searchTerm, professionals]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Professional Services
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Connect with certified professionals for your real estate needs
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
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

      {/* Professionals Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Loading professionals...</span>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProfessionals.map((professional) => (
                <motion.div
                  key={professional.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{professional.name}</h3>
                          <p className="text-purple-600 font-medium">{professional.category}</p>
                          <p className="text-sm text-gray-600">{professional.specialization}</p>
                        </div>
                      </div>
                      {professional.verified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          <span>Verified</span>
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
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Register as Professional CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a Professional?</h2>
          <p className="text-purple-100 mb-6">
            Join our network of verified professionals and expand your business reach
          </p>
          <Link 
            to="/pricing"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors inline-block"
          >
            Register as Professional
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalsPage;
