
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, FileText, Camera, Save } from 'lucide-react';

interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  city: string;
  region: string;
  price: number;
  propertyType: 'house' | 'apartment' | 'townhouse' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  sqm: number;
  listingType: 'sale' | 'rent';
  // Rental-specific fields
  monthlyRent?: number;
  securityDeposit?: number;
  leaseTerm?: number;
  furnishedStatus?: 'furnished' | 'semi-furnished' | 'unfurnished';
  // Sale-specific fields
  salePrice?: number;
  priceNegotiable?: boolean;
}

interface UnifiedPropertyFormProps {
  mode: 'create' | 'edit';
  listingType: 'sale' | 'rent';
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => void;
  onCancel: () => void;
}

const UnifiedPropertyForm: React.FC<UnifiedPropertyFormProps> = ({
  mode,
  listingType,
  initialData = {},
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    address: '',
    city: '',
    region: '',
    price: 0,
    propertyType: 'house',
    sqm: 0,
    listingType,
    ...initialData
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          placeholder="e.g., Beautiful 3BR House in Gaborone West"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          value={formData.propertyType}
          onChange={(e) => updateFormData('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
        >
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="land">Land/Plot</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formData.propertyType !== 'land' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms || ''}
                onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size (sqm)
          </label>
          <input
            type="number"
            value={formData.sqm}
            onChange={(e) => updateFormData('sqm', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          placeholder="Describe your property in detail..."
        />
      </div>
    </div>
  );

  const renderLocationInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          placeholder="Plot 123, Block 8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City/Town
          </label>
          <select
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          >
            <option value="">Select City</option>
            <option value="Gaborone">Gaborone</option>
            <option value="Francistown">Francistown</option>
            <option value="Maun">Maun</option>
            <option value="Kasane">Kasane</option>
            <option value="Lobatse">Lobatse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={formData.region}
            onChange={(e) => updateFormData('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
          >
            <option value="">Select Region</option>
            <option value="South-East">South-East</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
            <option value="Southern">Southern</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPricingInfo = () => (
    <div className="space-y-6">
      {listingType === 'sale' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Price (Pula)
            </label>
            <input
              type="number"
              value={formData.salePrice || ''}
              onChange={(e) => updateFormData('salePrice', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              placeholder="2500000"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="negotiable"
              checked={formData.priceNegotiable || false}
              onChange={(e) => updateFormData('priceNegotiable', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="negotiable" className="text-sm text-gray-700">
              Price is negotiable
            </label>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent (Pula)
            </label>
            <input
              type="number"
              value={formData.monthlyRent || ''}
              onChange={(e) => updateFormData('monthlyRent', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              placeholder="15000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Deposit (Pula)
            </label>
            <input
              type="number"
              value={formData.securityDeposit || ''}
              onChange={(e) => updateFormData('securityDeposit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              placeholder="30000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Term (months)
              </label>
              <select
                value={formData.leaseTerm || ''}
                onChange={(e) => updateFormData('leaseTerm', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">Select term</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnished Status
              </label>
              <select
                value={formData.furnishedStatus || ''}
                onChange={(e) => updateFormData('furnishedStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">Select status</option>
                <option value="furnished">Fully Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPhotosAndReview = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Photos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop photos here, or click to select files
          </p>
          <button className="mt-2 bg-beedab-blue text-white px-4 py-2 rounded-md hover:bg-beedab-darkblue transition-colors">
            Choose Files
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Listing</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Title:</span> {formData.title}</p>
          <p><span className="font-medium">Type:</span> {formData.propertyType}</p>
          <p><span className="font-medium">Location:</span> {formData.address}, {formData.city}</p>
          <p><span className="font-medium">Size:</span> {formData.sqm} sqm</p>
          {listingType === 'sale' ? (
            <p><span className="font-medium">Price:</span> P {formData.salePrice?.toLocaleString()}</p>
          ) : (
            <p><span className="font-medium">Monthly Rent:</span> P {formData.monthlyRent?.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );

  const steps = [
    { title: 'Basic Info', icon: Home, component: renderBasicInfo },
    { title: 'Location', icon: MapPin, component: renderLocationInfo },
    { title: 'Pricing', icon: DollarSign, component: renderPricingInfo },
    { title: 'Photos & Review', icon: Camera, component: renderPhotosAndReview }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create' : 'Edit'} {listingType === 'sale' ? 'Sale' : 'Rental'} Listing
        </h1>
        
        {/* Progress Steps */}
        <div className="mt-4 flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-beedab-blue bg-beedab-blue text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 text-gray-400'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-beedab-blue' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-px mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {steps[currentStep - 1].component()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Listing' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default UnifiedPropertyForm;
