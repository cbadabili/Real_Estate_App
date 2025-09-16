import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, Phone, Mail, Globe, Shield, Award, Package, Wrench, GraduationCap, UserPlus, Plus } from 'lucide-react';
import ServiceProviderCard from '../components/domain/marketplace/ServiceProviderCard';
import RegisterProvider from '../components/marketplace/RegisterProvider';
import { useLocation } from 'react-router-dom';
import PropertyMap from '../components/properties/PropertyMap';

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

interface MarketplacePageProps {}

const MarketplacePage: React.FC<MarketplacePageProps> = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();

  const sections = [
    { id: 'all', name: 'All Services', icon: Award, description: 'Browse all service providers' },
    { id: 'professionals', name: 'Professionals', icon: Award, description: 'Legal, valuation, and professional services' },
    { id: 'suppliers', name: 'Suppliers', icon: Package, description: 'Building materials and supplies' },
    { id: 'artisans', name: 'Artisans', icon: Wrench, description: 'Skilled trades and construction' },
    { id: 'training', name: 'Training', icon: GraduationCap, description: 'Professional development and training' }
  ];

  useEffect(() => {
    // Check for section and category filter in URL
    const params = new URLSearchParams(location.search);
    const sectionFilter = params.get('section');
    const categoryFilter = params.get('category');

    if (sectionFilter) {
      setActiveSection(sectionFilter);
    }
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }

    fetchMarketplaceData();
    fetchAllCategories();
  }, [activeSection, location]);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);

      if (activeSection === 'all') {
        // Fetch all services when "All Services" is selected
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();

        if (servicesData.success) {
          setServices(servicesData.data);
        }
      } else {
        // Fetch categories and services for the active section
        const [categoriesResponse, servicesResponse] = await Promise.all([
          fetch(`/api/categories?section=${activeSection}`),
          fetch(`/api/services?section=${activeSection}`)
        ]);

        const categoriesData = await categoriesResponse.json();
        const servicesData = await servicesResponse.json();

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        if (servicesData.success) {
          setServices(servicesData.data);
        }
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

  const handleRegisterProvider = (formData: any) => {
    console.log('Registering provider:', formData);
    // In a real app, this would make an API call to register the provider
    setShowRegisterModal(false);
    alert('Registration submitted successfully! You will be contacted within 24 hours.');
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.business_description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || 
                           service.business_description.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                           service.business_name.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Services Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Connect with trusted professionals, suppliers, and training providers 
              for all your real estate and construction needs.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 bg-beedab-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Join as Service Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'border-beedab-blue text-beedab-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Provider Map */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {!loading && filteredServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-beedab-blue" />
                  Service Provider Locations
                </h3>
                <PropertyMap
                  properties={filteredServices.map((service, index) => ({
                    id: service.id,
                    title: service.business_name,
                    price: service.hourly_rate,
                    latitude: -24.6282 + (index * 0.01), // Sample coordinates
                    longitude: 25.9231 + (index * 0.01),
                    bedrooms: service.years_experience,
                    bathrooms: Math.round(service.rating),
                    location: service.service_area,
                    city: service.service_area,
                    propertyType: 'service',
                    description: service.business_description
                  }))}
                  selectedProperty={null}
                  onPropertySelect={() => {}}
                  className="h-80 rounded-lg overflow-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue"></div>
          </div>
        ) : (
          <div>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory} Services` : 'All Providers'}
              </h2>
              <p className="text-gray-600">
                {filteredServices.length} provider{filteredServices.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-beedab-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {service.business_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.business_name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                            <span>({service.review_count} reviews)</span>
                          </div>
                        </div>
                      </div>
                      {service.verified && (
                        <Shield className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.business_description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{service.service_area}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{service.years_experience} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="font-semibold">BWP {service.hourly_rate}/hour</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContactProvider(service)}
                        className="flex-1 bg-beedab-blue text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Contact
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No providers found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Register Provider Modal */}
      {showRegisterModal && (
        <RegisterProvider
          onClose={() => setShowRegisterModal(false)}
          onSubmit={handleRegisterProvider}
        />
      )}
    </div>
  );
};

export default MarketplacePage;