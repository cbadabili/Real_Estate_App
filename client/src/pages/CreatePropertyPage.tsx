import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Upload, 
  Plus, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Home,
  Camera,
  FileText,
  DollarSign
} from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCreateProperty } from '../hooks/useProperties';
import ContextualAd from '../components/services/ContextualAd';
import GeographySelector from '../components/GeographySelector';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  ward: z.string().min(1, 'Ward is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  listingType: z.string().min(1, 'Listing type is required'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().min(1, 'Square feet is required'),
  yearBuilt: z.number().optional(),
  ownerId: z.number(),
  // Optional auction fields
  auctionDate: z.string().optional(),
  auctionTime: z.string().optional(),
  startingBid: z.number().optional(),
  reservePrice: z.number().optional(),
  auctionHouse: z.string().optional(),
  lotNumber: z.string().optional(),
  auctioneerContact: z.string().optional(),
  depositRequired: z.number().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const CreatePropertyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [showPhotoAd, setShowPhotoAd] = useState(false);
  const [showListingAd, setShowListingAd] = useState(false);
  const totalSteps = 4;

  const createProperty = useCreateProperty();
  
  const urlParams = new URLSearchParams(window.location.search);
  const initialListingType = urlParams.get('listingType') || 'owner';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      ownerId: 1,
      listingType: initialListingType as 'owner' | 'agent' | 'rental' | 'auction'
    }
  });

  const watchedValues = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['title', 'description', 'propertyType', 'listingType'];
      case 2:
        return ['price', 'address', 'city', 'state', 'ward'];
      case 3:
        return ['bedrooms', 'bathrooms', 'squareFeet'];
      default:
        return [];
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload success
    setTimeout(() => {
      setShowPhotoAd(true);
    }, 1000);
  };

  const onSubmit = (data: PropertyFormData) => {
    const propertyData = {
      ...data,
      features: features,
      images: [],
      status: 'active' as const
    };
    
    createProperty.mutate(propertyData, {
      onSuccess: () => {
        setShowListingAd(true);
      }
    });
  };

  const stepTitles = [
    'Property Details',
    'Location & Pricing',
    'Property Features',
    'Review & Submit'
  ];

  const stepIcons = [Home, MapPin, FileText, Check];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const Icon = stepIcons[index];

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                          ? 'bg-beedab-blue border-beedab-blue text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-beedab-blue' : 'text-gray-500'
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        currentStep > stepNumber ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
                <p className="text-gray-600">Tell us about your property</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Beautiful 3-bedroom house in Gaborone"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your property's key features, location benefits, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    {...register('propertyType')}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                    <option value="farm">Farm</option>
                    <option value="land">Land</option>
                  </select>
                  {errors.propertyType && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Listing Type *
                  </label>
                  <select
                    {...register('listingType')}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="owner">Owner Seller</option>
                    <option value="agent">List with Agent</option>
                    <option value="rental">Rental Property</option>
                    <option value="auction">Auction Property</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location & Pricing */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Pricing</h2>
                <p className="text-gray-600">Where is your property located and what's the price?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price (P) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="850000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Auction-specific fields */}
              {watchedValues.listingType === 'auction' && (
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-beedab-blue mb-4">Auction Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Auction Date *
                      </label>
                      <input
                        {...register('auctionDate')}
                        type="date"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Auction Time *
                      </label>
                      <input
                        {...register('auctionTime')}
                        type="time"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Starting Bid (P) *
                      </label>
                      <input
                        {...register('startingBid', { valueAsNumber: true })}
                        type="number"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="300000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Reserve Price (P)
                      </label>
                      <input
                        {...register('reservePrice', { valueAsNumber: true })}
                        type="number"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="400000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Auction House *
                      </label>
                      <input
                        {...register('auctionHouse')}
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., First National Bank, Standard Bank, Barclays"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Lot Number
                      </label>
                      <input
                        {...register('lotNumber')}
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="102"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Auctioneer Contact
                      </label>
                      <input
                        {...register('auctioneerContact')}
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="72192666 / 300 8293"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Deposit Required (%)
                      </label>
                      <input
                        {...register('depositRequired', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Street Address *
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Plot 123, Block 8"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              {/* Enhanced Geography Selector */}
              <GeographySelector
                onLocationChange={(location) => {
                  setValue('city', location.city);
                  setValue('state', location.state);
                  setValue('ward', location.ward || '');
                  trigger(['city', 'state', 'ward']);
                }}
                initialCity={watchedValues.city}
                initialState={watchedValues.state}
                initialWard={watchedValues.ward}
              />

              {/* Display any validation errors for geography fields */}
              {(errors.city || errors.state || errors.ward) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">
                    Please ensure all location fields are properly filled.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Property Features */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Features</h2>
                <p className="text-gray-600">Specify the details and features of your property</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    {...register('bedrooms', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    {...register('bathrooms', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Square Meters *
                  </label>
                  <input
                    {...register('squareFeet', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="150"
                  />
                  {errors.squareFeet && (
                    <p className="mt-1 text-sm text-red-600">{errors.squareFeet.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Year Built
                  </label>
                  <input
                    {...register('yearBuilt', { valueAsNumber: true })}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Swimming Pool, Garden, Garage"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload photos of your property</p>
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
                  >
                    Choose Photos
                  </button>
                </div>
                
                {/* Always show contextual ad for testing */}
                <ContextualAd 
                  trigger="post_photo_upload" 
                  className="mt-4"
                  onClose={() => setShowPhotoAd(false)}
                />
                
                {showPhotoAd && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">Photo upload completed! Consider professional photography services.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                <p className="text-gray-600">Carefully review all property details before submitting your listing</p>
              </div>

              {/* Comprehensive Property Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-beedab-blue" />
                  Property Summary
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium text-right">{watchedValues.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium capitalize">{watchedValues.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Type:</span>
                        <span className="font-medium capitalize">{watchedValues.listingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">P {watchedValues.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right">{watchedValues.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">City:</span>
                        <span className="font-medium">{watchedValues.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{watchedValues.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ward:</span>
                        <span className="font-medium">{watchedValues.ward}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Property Features</h4>
                    <div className="space-y-2 text-sm">
                      {watchedValues.bedrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedrooms:</span>
                          <span className="font-medium">{watchedValues.bedrooms}</span>
                        </div>
                      )}
                      {watchedValues.bathrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bathrooms:</span>
                          <span className="font-medium">{watchedValues.bathrooms}</span>
                        </div>
                      )}
                      {watchedValues.squareFeet && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{watchedValues.squareFeet.toLocaleString()} m²</span>
                        </div>
                      )}
                      {watchedValues.yearBuilt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built:</span>
                          <span className="font-medium">{watchedValues.yearBuilt}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Features */}
                  {features.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Additional Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Auction Details if applicable */}
                {watchedValues.listingType === 'auction' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-beedab-blue">Auction Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {watchedValues.auctionDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Auction Date:</span>
                          <span className="font-medium">{watchedValues.auctionDate}</span>
                        </div>
                      )}
                      {watchedValues.auctionTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Auction Time:</span>
                          <span className="font-medium">{watchedValues.auctionTime}</span>
                        </div>
                      )}
                      {watchedValues.startingBid && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Starting Bid:</span>
                          <span className="font-medium text-green-600">P {watchedValues.startingBid.toLocaleString()}</span>
                        </div>
                      )}
                      {watchedValues.reservePrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reserve Price:</span>
                          <span className="font-medium">P {watchedValues.reservePrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Before You Submit</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure all information provided is accurate and up-to-date</li>
                  <li>• Property photos and documents can be uploaded after submission</li>
                  <li>• Your listing will be reviewed before going live</li>
                  <li>• You can edit your listing anytime from your dashboard</li>
                </ul>
              </div>

              {/* Contextual Ad after submission */}
              {/* Always show legal services ad for testing */}
              <ContextualAd 
                trigger="property_listing_created" 
                className="mt-4"
                onClose={() => setShowListingAd(false)}
              />
              
              {showListingAd && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">Listing created successfully! Consider legal review services.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-8 border-t border-neutral-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={createProperty.isPending}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {createProperty.isPending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Create Listing</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyPage;