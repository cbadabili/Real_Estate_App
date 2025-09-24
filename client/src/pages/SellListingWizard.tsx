import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Camera, FileText, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/storage';

interface SellProperty {
  id?: number;
  title: string;
  description: string;
  price: number;
  property_type: string;
  size: number;
  sizeUnit: string;
  location: string;
  city: string;
  images: string[];
  contact_phone: string;
  contact_whatsapp?: string;
  seller_name: string;
  has_water: boolean;
  has_electricity: boolean;
  serviced: boolean;
  features: string[];
}

const SellListingWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<SellProperty>({
    title: '',
    description: '',
    price: 0,
    property_type: 'house',
    size: 0,
    sizeUnit: 'm²',
    location: '',
    city: '',
    images: [],
    contact_phone: '',
    contact_whatsapp: '',
    seller_name: '',
    has_water: false,
    has_electricity: false,
    serviced: false,
    features: [],
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: Home },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Location', icon: MapPin },
    { number: 4, title: 'Pricing', icon: DollarSign },
    { number: 5, title: 'Photos', icon: Camera },
    { number: 6, title: 'Review', icon: Check },
  ];

  const popularLocations = [
    'Mogoditshane Block 5',
    'Manyana Plateau', 
    'Mahalapye',
    'Pitsane',
    'Gaborone',
    'Francistown',
    'Lobatse',
    'Kanye',
    'Serowe',
    'Maun'
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
      const response = await fetch(`/api/properties/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SellProperty, value: any) => {
    setProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const endpoint = id ? `/api/properties/${id}` : '/api/properties';
      const method = id ? 'PUT' : 'POST';
      const token = getToken();

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...property,
          listing_type: 'for-sale',
          status: 'active',
          square_feet: property.size,
          bedrooms: 0, // Will be updated based on property type
          bathrooms: '0'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/properties');
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
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
                  Property Title
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="e.g., Modern Family Home in Gaborone West"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={property.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={property.size}
                  onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Unit
                </label>
                <select
                  value={property.sizeUnit}
                  onChange={(e) => handleInputChange('sizeUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="m²">m²</option>
                  <option value="hectares">hectares</option>
                  <option value="sqft">sq ft</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Property Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_water"
                    checked={property.has_water}
                    onChange={(e) => handleInputChange('has_water', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has_water" className="text-sm font-medium text-gray-700">
                    Water Connection
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_electricity"
                    checked={property.has_electricity}
                    onChange={(e) => handleInputChange('has_electricity', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has_electricity" className="text-sm font-medium text-gray-700">
                    Electricity
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="serviced"
                    checked={property.serviced}
                    onChange={(e) => handleInputChange('serviced', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="serviced" className="text-sm font-medium text-gray-700">
                    Serviced Plot
                  </label>
                </div>
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
                  Location/Area
                </label>
                <select
                  value={property.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="">Select Location</option>
                  {popularLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={property.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="e.g., Gaborone"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pricing & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (BWP)
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
                  Seller Name
                </label>
                <input
                  type="text"
                  value={property.seller_name}
                  onChange={(e) => handleInputChange('seller_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="Your full name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={property.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="+267 71 234 567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={property.contact_whatsapp || ''}
                  onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
                  placeholder="+267 71 234 567"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Photos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Upload photos of your property</p>
              <button
                type="button"
                className="bg-beedab-blue text-white px-4 py-2 rounded-md hover:bg-beedab-darkblue transition-colors"
                onClick={() => {
                  // Simulate image upload
                  const defaultImages = [
                    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
                  ];
                  handleInputChange('images', defaultImages);
                }}
              >
                Choose Photos
              </button>
              {property.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((image, index) => (
                    <img key={index} src={image} alt={`Property ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                  ))}
                </div>
              )}
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
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Property Type:</span>
                  <p className="font-medium">{property.property_type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Size:</span>
                  <p className="font-medium">{property.size} {property.sizeUnit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location:</span>
                  <p className="font-medium">{property.location}, {property.city}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Price:</span>
                  <p className="font-medium text-beedab-blue">P {property.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500">Contact:</span>
                <p className="font-medium">{property.seller_name} - {property.contact_phone}</p>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500">Features:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {property.has_water && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Water</span>}
                  {property.has_electricity && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Electricity</span>}
                  {property.serviced && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Serviced</span>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return property.title && property.property_type && property.description;
      case 2:
        return property.size > 0;
      case 3:
        return property.location && property.city;
      case 4:
        return property.price > 0 && property.seller_name && property.contact_phone;
      case 5:
        return true; // Photos are optional
      case 6:
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-beedab-blue" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {id ? 'Edit Property Listing' : 'List Your Property for Sale'}
          </h1>
          <p className="text-gray-600">
            Create a compelling listing to attract potential buyers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              const Icon = step.icon;

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? 'bg-beedab-blue text-white border-beedab-blue'
                        : isCompleted
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-beedab-blue' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-16 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceed()
                  ? 'bg-beedab-blue text-white hover:bg-beedab-darkblue'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceed() && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Publish Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellListingWizard;