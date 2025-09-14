
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Award, Package, Wrench, GraduationCap } from 'lucide-react';
import ServiceProviderCard from '../../components/domain/marketplace/ServiceProviderCard';
import { PageHeader } from '../../components/layout/PageHeader';

const MarketplaceHub = () => {
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', icon: Award, count: 0 },
    { id: 'professionals', name: 'Professionals', icon: Award, count: 0 },
    { id: 'suppliers', name: 'Suppliers', icon: Package, count: 0 },
    { id: 'artisans', name: 'Artisans', icon: Wrench, count: 0 },
    { id: 'training', name: 'Training', icon: GraduationCap, count: 0 }
  ];

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, searchTerm]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'all') queryParams.set('category', selectedCategory);
      if (searchTerm) queryParams.set('search', searchTerm);

      const response = await fetch(`/api/services/providers?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = (provider: any) => {
    // Handle provider contact logic
    console.log('Contacting provider:', provider);
  };

  const headerActions = (
    <Link
      to="/marketplace/register"
      className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
    >
      <Plus className="h-4 w-4 mr-2" />
      Join as Provider
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Services Marketplace"
        subtitle="Connect with verified professionals for all your real estate needs"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-beedab-blue text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                onContact={handleContactProvider}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && providers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No providers found</div>
            <div className="text-gray-400 text-sm mt-1">
              Try adjusting your search criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceHub;
