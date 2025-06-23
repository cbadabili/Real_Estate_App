import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProperty } from '../hooks/useProperties';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Camera, MapPin, DollarSign, Home, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(1, 'Price must be greater than 0'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  propertyType: z.enum(['house', 'condo', 'townhouse', 'apartment', 'commercial', 'land']),
  listingType: z.enum(['fsbo', 'agent', 'mls']),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().min(1).optional(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
  ownerId: z.number().min(1, 'Owner ID is required'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const CreatePropertyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const totalSteps = 4;

  const createProperty = useCreateProperty();

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
      ownerId: 1, // Default owner ID - in real app this would come from auth
      listingType: 'fsbo'
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

  const getFieldsForStep = (step: number): (keyof PropertyFormData)[] => {
    switch (step) {
      case 1:
        return ['title', 'description', 'propertyType', 'listingType'];
      case 2:
        return ['address', 'city', 'state', 'zipCode'];
      case 3:
        return ['price', 'bedrooms', 'bathrooms', 'squareFeet', 'yearBuilt'];
      case 4:
        return [];
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

  const onSubmit = (data: PropertyFormData) => {
    const propertyData = {
      ...data,
      features,
      images: [], // In real app, this would include uploaded images
      status: 'active'
    };

    createProperty.mutate(propertyData, {
      onSuccess: () => {
        toast.success('Property created successfully!');
        // In real app, redirect to property details or listings
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create property');
      }
    });
  };

  const stepTitles = [
    'Basic Information',
    'Location Details',
    'Property Specifications',
    'Features & Review'
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Property Listing</h1>
          <p className="text-neutral-600">Share your property details to reach potential buyers</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-700">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-sm text-neutral-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Beautiful Family Home in Suburbia"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your property's key features and highlights..."
                />
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
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                    <option value="farm">Farm</option>
                    <option value="land">Land/Lot</option>
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
                    <option value="fsbo">For Sale By Owner (FSBO)</option>
                    <option value="agent">List with Agent</option>
                    <option value="mls">MLS Listing</option>
                  </select>
                  {errors.listingType && (
                    <p className="mt-1 text-sm text-red-600">{errors.listingType.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Street Address *
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City *
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Austin"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    State *
                  </label>
                  <input
                    {...register('state')}
                    type="text"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="TX"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    {...register('zipCode')}
                    type="text"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="78701"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Property Specifications */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="650000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
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
                    Square Feet
                  </label>
                  <input
                    {...register('squareFeet', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Year Built
                  </label>
                  <input
                    {...register('yearBuilt', { valueAsNumber: true })}
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2010"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Features & Review */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Features
                </label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add a feature (e.g., Hardwood Floors)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Review Your Listing</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {watchedValues.title}</p>
                  <p><strong>Type:</strong> {watchedValues.propertyType} ({watchedValues.listingType})</p>
                  <p><strong>Location:</strong> {watchedValues.address}, {watchedValues.city}, {watchedValues.state} {watchedValues.zipCode}</p>
                  <p><strong>Price:</strong> ${watchedValues.price?.toLocaleString()}</p>
                  {watchedValues.bedrooms && <p><strong>Bedrooms:</strong> {watchedValues.bedrooms}</p>}
                  {watchedValues.bathrooms && <p><strong>Bathrooms:</strong> {watchedValues.bathrooms}</p>}
                  {watchedValues.squareFeet && <p><strong>Square Feet:</strong> {watchedValues.squareFeet.toLocaleString()}</p>}
                  {features.length > 0 && <p><strong>Features:</strong> {features.join(', ')}</p>}
                </div>
              </div>
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
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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