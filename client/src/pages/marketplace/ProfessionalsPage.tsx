
import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';

const ProfessionalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = [
    { id: 'all', name: 'All Professionals' },
    { id: 'agents', name: 'Real Estate Agents' },
    { id: 'lawyers', name: 'Lawyers & Conveyancers' },
    { id: 'architects', name: 'Architects' },
    { id: 'valuers', name: 'Property Valuers' },
    { id: 'financial', name: 'Financial Advisors' },
    { id: 'consultants', name: 'Property Consultants' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'gaborone', name: 'Gaborone' },
    { id: 'francistown', name: 'Francistown' },
    { id: 'maun', name: 'Maun' },
    { id: 'kasane', name: 'Kasane' },
    { id: 'palapye', name: 'Palapye' }
  ];

  const professionals = [
    {
      id: 1,
      name: 'Thabo Molefi',
      profession: 'Real Estate Agent',
      company: 'Prime Properties Botswana',
      rating: 4.9,
      reviews: 127,
      location: 'Gaborone',
      verified: true,
      reacCertified: true,
      specialties: ['Residential Sales', 'Commercial Properties', 'Investment Properties'],
      experience: '8 years',
      languages: ['English', 'Setswana'],
      phone: '+267 71 234 567',
      email: 'thabo@primeproperties.co.bw',
      image: '/api/placeholder/150/150',
      description: 'Experienced real estate agent specializing in luxury residential and commercial properties in Gaborone.'
    },
    {
      id: 2,
      name: 'Sarah Mogale',
      profession: 'Conveyancer',
      company: 'Mogale & Associates',
      rating: 4.8,
      reviews: 89,
      location: 'Gaborone',
      verified: true,
      reacCertified: false,
      specialties: ['Property Transfers', 'Bond Registration', 'Property Law'],
      experience: '12 years',
      languages: ['English', 'Setswana'],
      phone: '+267 72 345 678',
      email: 'sarah@mogalelaw.co.bw',
      image: '/api/placeholder/150/150',
      description: 'Qualified conveyancer with extensive experience in property law and transfers.'
    },
    {
      id: 3,
      name: 'Michael Seretse',
      profession: 'Architect',
      company: 'Seretse Design Studio',
      rating: 4.7,
      reviews: 45,
      location: 'Francistown',
      verified: true,
      reacCertified: false,
      specialties: ['Residential Design', 'Commercial Architecture', 'Sustainable Building'],
      experience: '15 years',
      languages: ['English'],
      phone: '+267 73 456 789',
      email: 'michael@seretsedesign.co.bw',
      image: '/api/placeholder/150/150',
      description: 'Award-winning architect specializing in modern and sustainable building designs.'
    }
  ];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prof.profession.toLowerCase().includes(selectedCategory);
    const matchesLocation = selectedLocation === 'all' || prof.location.toLowerCase() === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="🏠 Find a Pro" 
        subtitle="Connect with verified real estate professionals across Botswana"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search professionals, companies, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredProfessionals.map(professional => (
            <div key={professional.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={professional.image} 
                    alt={professional.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                
                {/* Main Info */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-bold text-gray-900 mr-2">{professional.name}</h3>
                        {professional.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-600" title="Verified Professional" />
                        )}
                        {professional.reacCertified && (
                          <Award className="h-5 w-5 text-yellow-500 ml-1" title="REAC Certified" />
                        )}
                      </div>
                      <p className="text-lg text-gray-700 font-medium">{professional.profession}</p>
                      <p className="text-gray-600">{professional.company}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium">{professional.rating}</span>
                        <span className="text-gray-600 ml-1">({professional.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {professional.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{professional.description}</p>
                  
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Experience:</span> {professional.experience}
                    </div>
                    <div>
                      <span className="font-medium">Languages:</span> {professional.languages.join(', ')}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {professional.phone}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 flex-shrink-0">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Contact
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all professionals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsPage;
