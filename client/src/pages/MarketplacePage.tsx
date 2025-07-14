
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Star, MapPin, Clock, Users, Award, Search, Filter } from 'lucide-react';

interface MarketplaceProvider {
  id: number;
  business_name: string;
  provider_type: string;
  description: string;
  rating: number;
  review_count: number;
  years_experience: number;
  service_areas: string[];
  phone: string;
  email: string;
  logo_url: string;
  is_verified: boolean;
  is_featured: boolean;
  specializations: string[];
  availability_status: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  journey_type: string;
  icon: string;
  description: string;
}

const MarketplacePage: React.FC = () => {
  const { segment } = useParams<{ segment: string }>();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<MarketplaceProvider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const getProviderType = (segment: string) => {
    switch (segment) {
      case 'professionals': return 'professional';
      case 'suppliers': return 'supplier';
      case 'trades': return 'artisan';
      case 'training': return 'trainer';
      default: return '';
    }
  };

  const getPageTitle = (segment: string) => {
    switch (segment) {
      case 'professionals': return '🏠 Find a Professional';
      case 'suppliers': return '🧱 Find a Supplier';
      case 'trades': return '🔨 Find a Trade';
      case 'training': return '🎓 Find a Course';
      default: return 'Marketplace';
    }
  };

  const getPageDescription = (segment: string) => {
    switch (segment) {
      case 'professionals': return 'Connect with verified real estate professionals, agents, and service providers';
      case 'suppliers': return 'Source quality building materials and supplies from trusted suppliers';
      case 'trades': return 'Find skilled tradespeople and artisans for your construction projects';
      case 'training': return 'Discover training programs and courses to enhance your skills';
      default: return 'Your comprehensive property ecosystem marketplace';
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, [segment, selectedCategory, selectedArea, minRating]);

  const fetchProviders = async () => {
    try {
      const params = new URLSearchParams();
      if (segment) params.append('provider_type', getProviderType(segment));
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedArea) params.append('service_area', selectedArea);
      if (minRating > 0) params.append('min_rating', minRating.toString());
      
      const response = await fetch(`/api/marketplace/providers?${params}`);
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/marketplace/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProviders();
      return;
    }

    try {
      const response = await fetch(`/api/marketplace/search?q=${encodeURIComponent(searchQuery)}&type=providers`);
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error searching providers:', error);
    }
  };

  const renderProviderCard = (provider: MarketplaceProvider) => (
    <Card key={provider.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {provider.logo_url && (
              <img 
                src={provider.logo_url} 
                alt={provider.business_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {provider.business_name}
                {provider.is_verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {provider.is_featured && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                  {provider.rating.toFixed(1)} ({provider.review_count} reviews)
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {provider.years_experience} years experience
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={provider.availability_status === 'available' ? 'default' : 'secondary'}
              className={provider.availability_status === 'available' ? 'bg-green-500' : 'bg-orange-500'}
            >
              {provider.availability_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{provider.description}</p>
        
        {provider.specializations && provider.specializations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Specializations:</h4>
            <div className="flex flex-wrap gap-2">
              {provider.specializations.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {provider.service_areas?.join(', ') || 'Service areas not specified'}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Contact
            </Button>
            <Button size="sm">
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getPageTitle(segment || '')}</h1>
        <p className="text-gray-600 text-lg">{getPageDescription(segment || '')}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search providers, services, or specializations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="md:w-auto">
            Search
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Service Area</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="All areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All areas</SelectItem>
                  <SelectItem value="Gaborone">Gaborone</SelectItem>
                  <SelectItem value="Francistown">Francistown</SelectItem>
                  <SelectItem value="Maun">Maun</SelectItem>
                  <SelectItem value="Kasane">Kasane</SelectItem>
                  <SelectItem value="Palapye">Palapye</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <Select value={minRating.toString()} onValueChange={(value) => setMinRating(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {providers.length} provider{providers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map(renderProviderCard)}
      </div>

      {/* Empty State */}
      {providers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {segment === 'professionals' ? '🏠' : segment === 'suppliers' ? '🧱' : segment === 'trades' ? '🔨' : '🎓'}
          </div>
          <h3 className="text-xl font-semibold mb-2">No providers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or check back later for new providers.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('');
            setSelectedArea('');
            setMinRating(0);
            fetchProviders();
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
