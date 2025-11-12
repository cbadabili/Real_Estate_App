// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Truck,
  Package,
  Shield,
  Building2,
  Hammer,
  Paintbrush
} from 'lucide-react';

interface Supplier {
  id: number;
  business_name: string;
  name: string;
  category_id: number;
  business_description: string;
  rating: number;
  review_count: number;
  service_area: string;
  contact_phone: string;
  contact_email: string;
  services: string[];
  verified: boolean;
  deliveryArea: string;
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Suppliers', icon: Package },
    { id: 'building-materials', name: 'Building Materials', icon: Building2 },
    { id: 'construction', name: 'Construction Supplies', icon: Hammer },
    { id: 'home-improvement', name: 'Home Improvement', icon: Paintbrush }
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/services/providers?category=Construction,Moving,Cleaning');
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match Supplier interface
          const transformedData = data.map((provider: any) => ({
            id: provider.id,
            business_name: provider.companyName,
            name: provider.companyName,
            category_id: 6, // Default category
            business_description: provider.description || '',
            rating: provider.rating || 4.5,
            review_count: provider.reviewCount || 0,
            service_area: provider.city || 'Gaborone',
            contact_phone: provider.phoneNumber || '',
            contact_email: provider.email || '',
            services: [],
            verified: provider.verified || false,
            deliveryArea: provider.city || 'Nationwide'
          }));
          setSuppliers(transformedData);
          setFilteredSuppliers(transformedData);
        } else {
          // Fallback data
          const sampleSuppliers: Supplier[] = [
            {
              id: 1,
              business_name: 'Gaborone Building Supplies',
              name: 'Gaborone Building Supplies',
              category_id: 6,
              business_description: 'Complete range of building materials and construction supplies',
              rating: 4.7,
              review_count: 89,
              service_area: 'Gaborone Industrial',
              contact_phone: '+267 390 1234',
              contact_email: 'info@gbsupplies.co.bw',
              services: ['Cement', 'Steel', 'Roofing Materials', 'Tiles'],
              verified: true,
              deliveryArea: 'Greater Gaborone'
            },
            {
              id: 2,
              business_name: 'Modern Home Depot',
              name: 'Modern Home Depot',
              category_id: 8,
              business_description: 'Modern fixtures and fittings for contemporary homes',
              rating: 4.8,
              review_count: 156,
              service_area: 'Francistown',
              contact_phone: '+267 241 5678',
              contact_email: 'orders@modernhomedepot.bw',
              services: ['Kitchen Fittings', 'Bathroom Fixtures', 'Lighting', 'Hardware'],
              verified: true,
              deliveryArea: 'Northern Botswana'
            }
          ];
          setSuppliers(sampleSuppliers);
          setFilteredSuppliers(sampleSuppliers);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
        setFilteredSuppliers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    let filtered = suppliers;

    if (selectedCategory !== 'all') {
      // Map category IDs to category names for filtering
      const categoryMapping: { [key: string]: number[] } = {
        'building-materials': [6], // Hardware stores
        'construction': [7], // Concrete suppliers
        'home-improvement': [8, 9, 10] // Paint, timber, steel suppliers
      };
      
      const categoryIds = categoryMapping[selectedCategory] || [];
      filtered = filtered.filter(supplier => 
        categoryIds.includes(supplier.category_id)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.business_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSuppliers(filtered);
  }, [selectedCategory, searchTerm, suppliers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Are you a service Provider (Need Professional Services?)
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find quality building materials and supplies for your property projects
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
                placeholder="Search suppliers and materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        ? 'bg-blue-600 text-white'
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

      {/* Suppliers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading suppliers...</span>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {supplier.business_name}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">{
                          supplier.category_id === 6 ? 'Hardware Store' :
                          supplier.category_id === 7 ? 'Concrete Supplier' :
                          supplier.category_id === 8 ? 'Paint Supplier' :
                          supplier.category_id === 9 ? 'Timber Supplier' :
                          supplier.category_id === 10 ? 'Steel Supplier' :
                          'Building Supplier'
                        }</p>
                      </div>
                      {supplier.verified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{supplier.business_description}</p>

                    <div className="flex items-center text-yellow-500 mb-3">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {supplier.rating}
                      </span>
                      <span className="text-xs text-gray-600 ml-1">
                        ({supplier.review_count} reviews)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {supplier.service_area}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Truck className="h-4 w-4 mr-2" />
                        Delivers to: {supplier.deliveryArea}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Products:</h4>
                      <div className="flex flex-wrap gap-1">
                        {supplier.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {service}
                          </span>
                        ))}
                        {supplier.services.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{supplier.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `tel:${supplier.contact_phone.replace(/\s+/g, '')}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </button>
                      <button 
                        onClick={() => window.location.href = `mailto:${supplier.contact_email}`}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Register as Supplier CTA */}
      <div className="mt-12 bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Are you a Supplier?</h2>
        <p className="text-blue-100 mb-6">
          Join our network of verified suppliers and reach more customers
        </p>
        <Link 
          to="/pricing"
          className="bg-white text-beedab-blue px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors inline-block"
        >
          Register as Supplier
        </Link>
      </div>

    </div>
  );
};

export default SuppliersPage;