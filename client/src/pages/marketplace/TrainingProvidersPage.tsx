
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  MapPin,
  Phone,
  BookOpen,
  Users,
  Clock,
  Shield,
  GraduationCap,
  Award,
  Calendar,
  Plus
} from 'lucide-react';

interface TrainingProvider {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  email: string;
  courses: string[];
  verified: boolean;
  accreditation: string;
  duration: string;
  price: string;
}

const TrainingProvidersPage: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<TrainingProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<TrainingProvider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const handleRegisterProvider = () => {
    navigate('/marketplace/register-provider?type=trainer');
  };

  const categories = [
    { id: 'all', name: 'All Training', icon: GraduationCap },
    { id: 'professional-development', name: 'Professional Development', icon: BookOpen },
    { id: 'certification', name: 'Certification Programs', icon: Award },
    { id: 'skills-training', name: 'Skills Training', icon: Users }
  ];

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/marketplace/training-providers');
        if (response.ok) {
          const data = await response.json();
          setProviders(data.providers || []);
          setFilteredProviders(data.providers || []);
        } else {
          // Fallback data
          const sampleProviders: TrainingProvider[] = [
            {
              id: 1,
              name: 'Real Estate Academy Botswana',
              category: 'Professional Development',
              description: 'Comprehensive real estate training and certification programs',
              rating: 4.9,
              reviews: 234,
              location: 'Gaborone',
              phone: '+267 318 7000',
              email: 'info@reacademy.co.bw',
              courses: ['Real Estate Fundamentals', 'Property Valuation', 'Real Estate Law', 'Marketing & Sales'],
              verified: true,
              accreditation: 'REAC Certified',
              duration: '6 months',
              price: 'P8,500'
            },
            {
              id: 2,
              name: 'Property Management Institute',
              category: 'Certification Programs',
              description: 'Professional property management certification and ongoing education',
              rating: 4.7,
              reviews: 156,
              location: 'Francistown',
              phone: '+267 241 3456',
              email: 'training@pmi.bw',
              courses: ['Property Management Basics', 'Tenant Relations', 'Maintenance Management', 'Financial Management'],
              verified: true,
              accreditation: 'PMI Certified',
              duration: '3 months',
              price: 'P5,200'
            }
          ];
          setProviders(sampleProviders);
          setFilteredProviders(sampleProviders);
        }
      } catch (error) {
        console.error('Error fetching training providers:', error);
        setProviders([]);
        setFilteredProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    let filtered = providers;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => 
        provider.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProviders(filtered);
  }, [selectedCategory, searchTerm, providers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Training Providers
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Professional development and skills training for real estate professionals
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleRegisterProvider}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Register as Training Provider</span>
              </button>
            </div>
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
                placeholder="Search training providers and courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        ? 'bg-green-600 text-white'
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

      

      {/* Training Providers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading training providers...</span>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No training providers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <p className="text-sm text-gray-500">
                Are you a BQA or HRDC certified training provider? 
                <button
                  onClick={handleRegisterProvider}
                  className="text-green-600 hover:text-green-700 font-medium ml-1"
                >
                  Join our platform
                </button>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProviders.map((provider) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-green-600 font-medium">{provider.category}</p>
                        </div>
                      </div>
                      {provider.verified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{provider.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-sm text-gray-500">({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.accreditation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.duration}</span>
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Courses Offered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {provider.courses.slice(0, 3).map((course, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {course}
                          </span>
                        ))}
                        {provider.courses.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{provider.courses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{provider.phone}</span>
                      </div>
                      <span className="font-medium text-green-600">{provider.price}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.location.href = `tel:${provider.phone}`}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Call Now
                      </button>
                      <button 
                        onClick={() => window.location.href = `mailto:${provider.email}`}
                        className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                      >
                        Email
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Enroll
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Registration Button */}
      <button
        onClick={handleRegisterProvider}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center space-x-2"
        title="Register as Training Provider"
      >
        <Plus className="h-6 w-6" />
        <span className="hidden sm:inline">Register</span>
      </button>
    </div>
  );
};

export default TrainingProvidersPage;
