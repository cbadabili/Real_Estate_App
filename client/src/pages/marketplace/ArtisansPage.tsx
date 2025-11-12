// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Wrench, Shield, CheckCircle } from 'lucide-react';
import ServiceProviderCard from '../../components/domain/marketplace/ServiceProviderCard';
import RegisterProvider from '../../components/shared/RegisterProvider';

interface Artisan {
  id: number;
  business_name: string;
  business_description: string;
  service_area: string;
  hourly_rate: number;
  rating: number;
  review_count: number;
  contact_email: string;
  contact_phone: string;
  verified: boolean;
  specialties: string[];
  years_experience: number;
}

const ArtisansPage: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [showRegistration, setShowRegistration] = useState(false);

  const artisanSpecialties = [
    'Construction', 'Plumbing', 'Electrical', 'Carpentry', 
    'Painting', 'Roofing', 'Tiling', 'Welding', 'Masonry'
  ];

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      const response = await fetch('/api/services/providers?category=Maintenance,Construction');
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match Artisan interface
        const transformedData = data.map((provider: any) => ({
          id: provider.id,
          business_name: provider.companyName,
          business_description: provider.description || '',
          service_area: provider.city || 'Gaborone',
          hourly_rate: 500,
          rating: provider.rating || 4.5,
          review_count: provider.reviewCount || 0,
          contact_email: provider.email || '',
          contact_phone: provider.phoneNumber || '',
          verified: provider.verified || false,
          specialties: [],
          years_experience: 10
        }));
        setArtisans(transformedData);
      }
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artisan.business_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || 
                            artisan.specialties?.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Wrench className="h-16 w-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Skilled Artisans & Tradespeople
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Connect with verified skilled artisans and tradespeople for all your construction, 
              renovation, and maintenance needs across Botswana.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center text-orange-100">
                <Shield className="h-5 w-5 mr-2" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center text-orange-100">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search artisans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {artisanSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Artisans Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading artisans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredArtisans.map(artisan => (
              <ServiceProviderCard key={artisan.id} provider={artisan} />
            ))}
          </div>
        )}

        {filteredArtisans.length === 0 && !loading && (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No artisans found matching your criteria.</p>
          </div>
        )}

        {/* Register as Artisan CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a Skilled Artisan?</h2>
          <p className="text-orange-100 mb-6">
            Join our network of verified artisans and expand your business reach
          </p>
          <Link 
            to="/pricing"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors inline-block"
          >
            Register as Artisan
          </Link>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <RegisterProvider 
            type="artisan"
            onClose={() => setShowRegistration(false)}
            onSuccess={() => {
              setShowRegistration(false);
              fetchArtisans();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ArtisansPage;
