
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Home, MapPin, DollarSign, Camera, FileText, Check } from 'lucide-react';
import PropertyLocationStep from '../components/properties/PropertyLocationStep';
import toast from 'react-hot-toast';
import { getToken } from '@/lib/storage';

interface RentalProperty {
  id?: number;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  district: string;
  ward: string;
  amenities: string[];
  images: string[];
  lease_terms: string;
  available_from: string;
  property_type: string;
  parking_spaces: number;
  furnished: boolean;
  pets_allowed: boolean;
  utilities_included: boolean;
}

const RentalListingWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<RentalProperty>({
    title: '',
    description: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    location: '',
    city: '',
    district: '',
    ward: '',
    amenities: [],
    images: [],
    lease_terms: '12 months',
    available_from: '',
    property_type: 'apartment',
    parking_spaces: 0,
    furnished: false,
    pets_allowed: false,
    utilities_included: false,
  });

  const [locationData, setLocationData] = useState<{
    area_text: string;
    place_name?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
    location_source: "user_pin" | "geocode";
  }>({
    area_text: '',
    location_source: 'geocode'
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: Home },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Location', icon: MapPin },
    { number: 4, title: 'Pricing', icon: DollarSign },
    { number: 5, title: 'Photos', icon: Camera },
    { number: 6, title: 'Review', icon: Check },
  ];

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`/api/rentals/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data);
        // Set location data if available
        if (data.data.location) {
          setLocationData(prev => ({
            ...prev,
            area_text: data.data.location
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RentalProperty, value: any) => {
    setProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!property.title || !property.price || !property.city || !property.district) {
        toast.error('Please fill in all required fields');
        return;
      }

      const endpoint = id ? `/api/rentals/${id}` : '/api/rentals';
      const method = id ? 'PUT' : 'POST';
      
      // Transform data to match backend schema
      const rentalData = {
        title: property.title,
        description: property.description,
        location: locationData.area_text || `${property.city}, ${property.district}`,
        address: locationData.area_text || `${property.city}, ${property.district}`,
        city: property.city,
        district: property.district,
        ward: property.ward || null,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_meters: property.area,
        monthly_rent: property.price,
        price: property.price, // For compatibility
        lease_duration: parseInt(property.lease_terms.split(' ')[0]) || 12,
        available_from: property.available_from,
        furnished: property.furnished,
        pets_allowed: property.pets_allowed,
        parking_spaces: property.parking_spaces,
        amenities: JSON.stringify(property.amenities),
        images: JSON.stringify(property.images),
        utilities_included: JSON.stringify(property.utilities_included ? ['utilities'] : []),
        // Location coordinates if available
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
        location_source: locationData.location_source || 'geocode',
        status: 'active'
      };

      const token = getToken();
      const authHeader = token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token || '';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(rentalData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(id ? 'Rental listing updated successfully!' : 'Rental listing created successfully!');
        navigate('/rent');
      } else {
        console.error('Server response:', data);
        toast.error(data.error || 'Failed to save rental listing');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save rental listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return property.title && property.property_type;
      case 2:
        return property.bedrooms && property.bathrooms && property.area;
      case 3:
        return property.city && property.district && locationData.area_text;
      case 4:
        return property.price && property.available_from;
      case 5:
        return true; // Photos are optional
      case 6:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="e.g., Modern 2BR Apartment in Gaborone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  value={property.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="room">Room</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={property.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                placeholder="Describe your property..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  min="0"
                  value={property.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  min="0"
                  value={property.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sqm) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={property.area}
                  onChange={(e) => handleInputChange('area', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  min="0"
                  value={property.parking_spaces}
                  onChange={(e) => handleInputChange('parking_spaces', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={property.furnished}
                  onChange={(e) => handleInputChange('furnished', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="furnished" className="text-sm font-medium text-gray-700">
                  Furnished
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pets_allowed"
                  checked={property.pets_allowed}
                  onChange={(e) => handleInputChange('pets_allowed', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="pets_allowed" className="text-sm font-medium text-gray-700">
                  Pets Allowed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="utilities_included"
                  checked={property.utilities_included}
                  onChange={(e) => handleInputChange('utilities_included', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="utilities_included" className="text-sm font-medium text-gray-700">
                  Utilities Included
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  value={property.district}
                  onChange={(e) => {
                    handleInputChange('district', e.target.value);
                    handleInputChange('city', ''); // Reset city when district changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  required
                >
                  <option value="">Select District</option>
                  <option value="South-East">South-East</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="Central">Central</option>
                  <option value="Kweneng">Kweneng</option>
                  <option value="Southern">Southern</option>
                  <option value="Kgatleng">Kgatleng</option>
                  <option value="Kgalagadi">Kgalagadi</option>
                  <option value="Chobe">Chobe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town *
                </label>
                <select
                  value={property.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  required
                  disabled={!property.district}
                >
                  <option value="">Select City/Town</option>
                  {property.district === 'South-East' && (
                    <>
                      <option value="Gaborone">Gaborone</option>
                      <option value="Lobatse">Lobatse</option>
                      <option value="Ramotswa">Ramotswa</option>
                      <option value="Kanye">Kanye</option>
                      <option value="Molepolole">Molepolole</option>
                      <option value="Mogoditshane">Mogoditshane</option>
                      <option value="Tlokweng">Tlokweng</option>
                      <option value="Gabane">Gabane</option>
                      <option value="Mmopane">Mmopane</option>
                      <option value="Kopong">Kopong</option>
                      <option value="Phakalane">Phakalane</option>
                      <option value="Broadhurst">Broadhurst</option>
                      <option value="Extension 2">Extension 2</option>
                      <option value="Extension 10">Extension 10</option>
                      <option value="Extension 12">Extension 12</option>
                      <option value="Extension 14">Extension 14</option>
                      <option value="Extension 15">Extension 15</option>
                      <option value="Block 3">Block 3</option>
                      <option value="Block 6">Block 6</option>
                      <option value="Block 7">Block 7</option>
                      <option value="Block 8">Block 8</option>
                      <option value="Block 9">Block 9</option>
                      <option value="Block 10">Block 10</option>
                      <option value="Village">Village</option>
                      <option value="CBD">CBD</option>
                      <option value="Old Naledi">Old Naledi</option>
                      <option value="New Canada">New Canada</option>
                      <option value="White City">White City</option>
                      <option value="Sebele">Sebele</option>
                      <option value="G-West">G-West</option>
                      <option value="Kgale">Kgale</option>
                      <option value="Riverwalk">Riverwalk</option>
                      <option value="Masa">Masa</option>
                      <option value="Thamaga">Thamaga</option>
                    </>
                  )}
                  {property.district === 'North-East' && (
                    <>
                      <option value="Francistown">Francistown</option>
                      <option value="Selebi-Phikwe">Selebi-Phikwe</option>
                      <option value="Tonota">Tonota</option>
                      <option value="Tutume">Tutume</option>
                      <option value="Nata">Nata</option>
                      <option value="Bobonong">Bobonong</option>
                    </>
                  )}
                  {property.district === 'North-West' && (
                    <>
                      <option value="Maun">Maun</option>
                      <option value="Kasane">Kasane</option>
                      <option value="Shakawe">Shakawe</option>
                      <option value="Gumare">Gumare</option>
                    </>
                  )}
                  {property.district === 'Central' && (
                    <>
                      <option value="Serowe">Serowe</option>
                      <option value="Palapye">Palapye</option>
                      <option value="Mahalapye">Mahalapye</option>
                      <option value="Shoshong">Shoshong</option>
                    </>
                  )}
                  {property.district === 'Kweneng' && (
                    <>
                      <option value="Molepolole">Molepolole</option>
                      <option value="Thamaga">Thamaga</option>
                      <option value="Kumakwane">Kumakwane</option>
                    </>
                  )}
                  {property.district === 'Southern' && (
                    <>
                      <option value="Kanye">Kanye</option>
                      <option value="Jwaneng">Jwaneng</option>
                      <option value="Tshabong">Tshabong</option>
                    </>
                  )}
                  {property.district === 'Kgatleng' && (
                    <>
                      <option value="Mochudi">Mochudi</option>
                      <option value="Artesia">Artesia</option>
                      <option value="Oodi">Oodi</option>
                    </>
                  )}
                  {property.district === 'Kgalagadi' && (
                    <>
                      <option value="Ghanzi">Ghanzi</option>
                      <option value="Tsabong">Tsabong</option>
                    </>
                  )}
                  {property.district === 'Chobe' && (
                    <>
                      <option value="Kasane">Kasane</option>
                      <option value="Kazungula">Kazungula</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Specific Location</h4>
              <PropertyLocationStep
                initialArea={locationData.area_text}
                initialCoords={locationData.latitude && locationData.longitude ? {
                  lat: locationData.latitude,
                  lng: locationData.longitude
                } : null}
                onChange={setLocationData}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pricing & Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (BWP) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={property.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Terms
                </label>
                <select
                  value={property.lease_terms}
                  onChange={(e) => handleInputChange('lease_terms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="24 months">24 months</option>
                  <option value="month-to-month">Month to month</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From *
              </label>
              <input
                type="date"
                value={property.available_from}
                onChange={(e) => handleInputChange('available_from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Photos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Upload photos of your property</p>
              <p className="text-sm text-gray-400 mt-2">Coming soon - Photo upload functionality</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Listing</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">{property.title}</h4>
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {property.property_type}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {property.city}, {property.district}
                </div>
                <div>
                  <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                </div>
                <div>
                  <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                </div>
                <div>
                  <span className="font-medium">Area:</span> {property.area} sqm
                </div>
                <div>
                  <span className="font-medium">Price:</span> BWP {property.price}/month
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Rental Listing' : 'Create Rental Listing'}
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-beedab-blue text-white' : 
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-beedab-blue' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-px mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="px-6 py-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStepContent()}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={!canProceedToNextStep()}
                className="px-4 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceedToNextStep()}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : id ? 'Update Listing' : 'Create Listing'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalListingWizard;
