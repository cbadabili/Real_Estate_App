
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Camera, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { botswanaDistricts, getAllCities } from '../data/botswanaGeography';
import GeographySelector from '../components/GeographySelector';

const RentalListingWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    property_type: '',
    bedrooms: 1,
    bathrooms: 1,
    square_meters: 50,
    monthly_rent: 1000,
    deposit_amount: 1000,
    lease_duration: 12,
    available_from: '',
    furnished: false,
    pets_allowed: false,
    parking_spaces: 0,
    photos: [],
    amenities: [],
    utilities_included: []
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: Home },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Pricing & Terms', icon: DollarSign },
    { id: 4, title: 'Photos & Features', icon: Camera },
    { id: 5, title: 'Review & Publish', icon: CheckCircle }
  ];

  const amenityOptions = [
    'WiFi', 'Air Conditioning', 'Balcony', 'Garden', 'Pool', 'Gym', 
    'Security', 'Laundry', 'Storage', 'Fireplace', 'Study Room', 'Garage'
  ];

  const utilityOptions = [
    'Water', 'Electricity', 'Gas', 'Internet', 'Satellite TV', 'Waste Collection'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchRentalData();
    }
  }, [id, isEditing]);

  const fetchRentalData = async () => {
    try {
      const response = await fetch(`/api/rentals/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching rental data:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const url = isEditing ? `/api/rentals/${id}` : '/api/rentals';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        alert('Rental listing created successfully!');
        // Navigate to the rental details page
        navigate(`/rental/${data.data.id}`);
      } else {
        alert('Failed to save rental listing: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving rental:', error);
      alert('Failed to save rental listing. Please try again.');
    } finally {
      setLoading(false);
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

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                placeholder="e.g., Modern 2BR Apartment in CBD"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                placeholder="Describe your property..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Size (sqm)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.square_meters}
                  onChange={(e) => setFormData(prev => ({ ...prev, square_meters: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                placeholder="e.g., Plot 123, Independence Avenue"
              />
            </div>
            
            <GeographySelector
              onLocationChange={(location) => {
                setFormData(prev => ({
                  ...prev,
                  city: location.city,
                  district: location.state,
                  ward: location.ward || ''
                }));
              }}
              initialCity={formData.city}
              initialState={formData.district}
              initialWard={formData.ward}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (P)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_rent: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (P)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Duration (months)
                </label>
                <select
                  required
                  value={formData.lease_duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, lease_duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  required
                  value={formData.available_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, available_from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.parking_spaces}
                  onChange={(e) => setFormData(prev => ({ ...prev, parking_spaces: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => setFormData(prev => ({ ...prev, furnished: e.target.checked }))}
                    className="mr-2"
                  />
                  Furnished
                </label>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.pets_allowed}
                    onChange={(e) => setFormData(prev => ({ ...prev, pets_allowed: e.target.checked }))}
                    className="mr-2"
                  />
                  Pets Allowed
                </label>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Photos
              </label>
              
              {/* Photography Services Button */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Professional Photography</h4>
                      <p className="text-sm text-blue-700">Get high-quality photos that sell faster</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/services?category=photography'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Find Photographers
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Upload property photos</p>
                <p className="text-sm text-gray-400 mt-2">
                  Include professional photography or take high-quality photos
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      // Handle file upload logic here
                      console.log('Photos uploaded:', files);
                    }}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue cursor-pointer inline-block"
                  >
                    Upload Photos
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Open camera functionality
                      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ video: true })
                          .then(() => alert('Camera functionality would open here'))
                          .catch(() => alert('Camera not available'));
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Take Photos
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG (Max 10MB each)
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                        } else {
                          setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                        }
                      }}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilities Included
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {utilityOptions.map(utility => (
                  <label key={utility} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.utilities_included.includes(utility)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, utilities_included: [...prev.utilities_included, utility] }));
                        } else {
                          setFormData(prev => ({ ...prev, utilities_included: prev.utilities_included.filter(u => u !== utility) }));
                        }
                      }}
                      className="mr-2"
                    />
                    {utility}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Review Your Listing</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{formData.title}</h4>
                  <p className="text-gray-600">{formData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Location:</span>
                    <p className="font-medium">{formData.address}, {formData.city}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <p className="font-medium">{formData.property_type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Monthly Rent:</span>
                    <p className="font-medium text-beedab-blue">P{formData.monthly_rent.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Deposit:</span>
                    <p className="font-medium">P{formData.deposit_amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Bedrooms:</span>
                    <p className="font-medium">{formData.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bathrooms:</span>
                    <p className="font-medium">{formData.bathrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Plot Size:</span>
                    <p className="font-medium">{formData.square_meters} sqm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/rent')}
            className="flex items-center text-beedab-blue hover:text-beedab-darkblue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rentals
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Rental Listing' : 'Create Rental Listing'}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-beedab-blue text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-beedab-blue' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 mx-6" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Listing'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RentalListingWizard;
