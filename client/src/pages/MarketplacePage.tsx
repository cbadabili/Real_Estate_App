import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Wrench, 
  GraduationCap, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  ExternalLink,
  Shield,
  Clock,
  Search
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  service_count: number;
}

interface Service {
  id: number;
  business_name: string;
  business_description: string;
  service_area: string;
  hourly_rate: number;
  rating: number;
  review_count: number;
  contact_email: string;
  contact_phone: string;
  category_id: number;
  user_id: number;
  profile_image: string;
  verified: boolean;
  years_experience: number;
}

interface SectionContentProps {
  section: string;
  categories: Category[];
  services: Service[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onContactProvider: (service: Service) => void;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  categories,
  services,
  selectedCategory,
  onCategorySelect,
  onContactProvider
}) => {
  const filteredServices = selectedCategory 
    ? services.filter(service => service.category_id === selectedCategory)
    : services;

  return (
    <div className="space-y-8">
      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-beedab-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? 'border-beedab-blue bg-beedab-blue/5'
                  : 'border-gray-200 hover:border-beedab-blue/50'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-beedab-blue/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-beedab-blue rounded" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <span className="text-xs text-beedab-blue font-medium">
                    {category.service_count} providers
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.name} Providers`
              : 'All Providers'
            }
          </h3>
          <span className="text-sm text-gray-500">
            {filteredServices.length} provider{filteredServices.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onContact={() => onContactProvider(service)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  onContact: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src={service.profile_image} 
              alt={service.business_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/64/64';
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{service.business_name}</h4>
              {service.verified && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{service.rating}</span>
                <span>({service.review_count} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{service.years_experience}+ years</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{service.service_area}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {service.business_description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {service.hourly_rate > 0 ? (
              <span className="font-semibold text-beedab-blue">
                P{service.hourly_rate}/hour
              </span>
            ) : (
              <span className="text-gray-500">Contact for pricing</span>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onContact}
              className="px-4 py-2 bg-beedab-blue text-white text-sm rounded-lg hover:bg-beedab-blue/90 transition-colors"
            >
              Contact
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MarketplacePage = () => {
  const [activeSection, setActiveSection] = useState('professionals');
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'professionals',
      name: 'Find a Pro',
      icon: Users,
      description: 'Legal, valuation, and professional services'
    },
    {
      id: 'suppliers',
      name: 'Find a Supplier',
      icon: Package,
      description: 'Building materials and supplies'
    },
    {
      id: 'trades',
      name: 'Find a Trade',
      icon: Wrench,
      description: 'Skilled contractors and craftspeople'
    },
    {
      id: 'training',
      name: 'Find a Course',
      icon: GraduationCap,
      description: 'Professional development and training'
    }
  ];

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const categoriesResponse = await fetch(`/api/categories?section=${activeSection}`);
      const categoriesData = await categoriesResponse.json();

      // Fetch services
      const servicesResponse = await fetch(`/api/services?section=${activeSection}&limit=20`);
      const servicesData = await servicesResponse.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      if (servicesData.success) {
        setServices(servicesData.data);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSelectedCategory(null);
    setSearchTerm('');
  };

  const handleContactProvider = (service: Service) => {
    // In a real app, this would open a contact modal or navigate to contact page
    alert(`Contacting ${service.business_name}...`);
  };

  const filteredServices = services.filter(service =>
    service.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.business_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Services Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with trusted professionals, suppliers, and training providers 
              for all your real estate and construction needs.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'border-beedab-blue text-beedab-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue"></div>
          </div>
        ) : (
          <SectionContent
            section={activeSection}
            categories={categories}
            services={filteredServices}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onContactProvider={handleContactProvider}
          />
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;