import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Shield,
  Award,
  Camera,
  Scale,
  Truck,
  Calculator,
  Home,
  Building,
  Plus
} from 'lucide-react';
import ServiceProviderRegistration from '../components/ServiceProviderRegistration';

interface ServiceProvider {
  id: number;
  companyName: string;
  serviceCategory: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  reacCertified: boolean;
  address: string;
  city: string;
  rating: string;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
}

const ServicesPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  // Category icons mapping
  const categoryIcons: { [key: string]: any } = {
    'Photography': Camera,
    'Legal': Scale,
    'Moving': Truck,
    'Finance': Calculator,
    'Insurance': Shield,
    'Cleaning': Home,
    'Construction': Building,
    'Maintenance': Building,
    'HVAC Maintenance': Building,
    'Plumbing Maintenance': Building,
    'Electrical Maintenance': Building,
    'Garden Maintenance': Building,
    'Pool Maintenance': Building,
    'Security Maintenance': Shield
  };

  const categoryStructure = {
    'Photography': {
      icon: Camera,
      description: 'Professional property and lifestyle photography',
      subcategories: []
    },
    'Legal': {
      icon: Scale,
      description: 'Lawyers, conveyancers, and legal advisory services',
      subcategories: []
    },
    'Moving': {
      icon: Truck,
      description: 'Relocation and moving services across Botswana',
      subcategories: []
    },
    'Finance': {
      icon: Calculator,
      description: 'Mortgage brokers, financial advisors, and lending',
      subcategories: []
    },
    'Insurance': {
      icon: Shield,
      description: 'Property, life, and comprehensive insurance coverage',
      subcategories: []
    },
    'Cleaning': {
      icon: Home,
      description: 'Move-in, move-out, and regular cleaning services',
      subcategories: []
    },
    'Construction': {
      icon: Building,
      description: 'Home renovation, building, and construction',
      subcategories: []
    },
    'Maintenance': {
      icon: Building,
      description: 'Property maintenance and repair services',
      subcategories: [
        'HVAC Maintenance',
        'Plumbing Maintenance', 
        'Electrical Maintenance',
        'Garden Maintenance',
        'Pool Maintenance',
        'Security Maintenance'
      ]
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/services/categories');
      if (response.ok) {
        const data = await response.json();
        console.log('Categories fetched:', data);
        setCategories(['all', ...data]);
      } else {
        console.error('Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/services/providers');
      if (response.ok) {
        const data = await response.json();
        console.log('Providers fetched:', data.length, 'providers');
        setProviders(data);
      } else {
        console.error('Failed to fetch providers:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = providers;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.serviceCategory === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort: featured first, then by rating
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return parseFloat(b.rating) - parseFloat(a.rating);
    });
    
    setFilteredProviders(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProviderContact = (provider: ServiceProvider, method: 'phone' | 'email' | 'website') => {
    switch (method) {
      case 'phone':
        window.open(`tel:${provider.phoneNumber}`);
        break;
      case 'email':
        window.open(`mailto:${provider.email}`);
        break;
      case 'website':
        window.open(provider.websiteUrl, '_blank');
        break;
    }
  };

  const handleRegistrationSuccess = () => {
    // Refresh the providers list
    setLoading(true);
    fetchProviders();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Services Directory
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Connect with verified service providers across Botswana. 
              From legal services to photography, find trusted professionals for your property needs.
            </p>

            {/* Register Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-beedab-blue text-white px-6 py-3 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Register as Service Provider</span>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => {
              const categoryData = categoryStructure[category as keyof typeof categoryStructure];
              const Icon = categoryData?.icon || categoryIcons[category] || Building;
              const isSelected = selectedCategory === category;
              const hasSubcategories = categoryData?.subcategories && categoryData.subcategories.length > 0;
              
              return (
                <div key={category} className="relative group">
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? 'border-beedab-blue bg-beedab-blue text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-beedab-blue hover:text-beedab-blue'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium capitalize">
                      {category === 'all' ? 'All Services' : category}
                    </span>
                    {hasSubcategories && (
                      <div className="text-xs text-gray-500 mt-1">
                        {categoryData.subcategories.length} specializations
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Subcategory Pills for Selected Category */}
          {selectedCategory && categoryStructure[selectedCategory as keyof typeof categoryStructure]?.subcategories?.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-3">
                {selectedCategory} Specializations:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect(selectedCategory)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory && !categoryStructure[selectedCategory as keyof typeof categoryStructure].subcategories.includes(selectedCategory)
                      ? 'bg-beedab-blue text-white'
                      : 'bg-white text-beedab-blue border border-beedab-blue hover:bg-beedab-blue hover:text-white'
                  }`}
                >
                  All {selectedCategory}
                </button>
                {categoryStructure[selectedCategory as keyof typeof categoryStructure].subcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => handleCategorySelect(subcat)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === subcat
                        ? 'bg-beedab-blue text-white'
                        : 'bg-white text-beedab-blue border border-beedab-blue hover:bg-beedab-blue hover:text-white'
                    }`}
                  >
                    {subcat.replace(' Maintenance', '')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Service Providers' : `${selectedCategory} Services`}
            <span className="text-gray-500 font-normal ml-2">
              ({filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'})
            </span>
          </h3>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <p>Categories: {categories.length} | Providers: {providers.length} | Filtered: {filteredProviders.length}</p>
          <p>Selected Category: {selectedCategory} | Search: "{searchTerm}"</p>
        </div>

        {/* Service Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filteredProviders.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Building className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or category filter.'
                  : 'Service providers will appear here once they are added.'}
              </p>
              <button 
                onClick={() => {
                  setLoading(true);
                  fetchProviders();
                }} 
                className="mt-4 bg-beedab-blue text-white px-4 py-2 rounded-lg"
              >
                Reload Services
              </button>
            </div>
          )}
          
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={provider.companyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-beedab-blue/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-beedab-blue" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {provider.companyName}
                    </h4>
                    <p className="text-sm text-gray-600">{provider.serviceCategory}</p>
                  </div>
                </div>
                
                {provider.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-2 mb-3">
                {provider.verified && (
                  <span className="flex items-center space-x-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                )}
                {provider.reacCertified && (
                  <span className="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    <Award className="h-3 w-3" />
                    <span>REAC Certified</span>
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{provider.rating}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  ({provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {provider.description}
              </p>

              {/* Location */}
              {provider.city && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.city}</span>
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex items-center space-x-2">
                {provider.phoneNumber && (
                  <button
                    onClick={() => handleProviderContact(provider, 'phone')}
                    className="flex-1 bg-beedab-blue text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-beedab-darkblue transition-colors flex items-center justify-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                )}
                
                {provider.email && (
                  <button
                    onClick={() => handleProviderContact(provider, 'email')}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                )}
                
                {provider.websiteUrl && (
                  <button
                    onClick={() => handleProviderContact(provider, 'website')}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-beedab-blue hover:border-beedab-blue transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">
              Try adjusting your search or category filter to find more results.
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <ServiceProviderRegistration
          onClose={() => setShowRegistration(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default ServicesPage;