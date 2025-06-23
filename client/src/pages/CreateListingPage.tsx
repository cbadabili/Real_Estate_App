import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Upload, 
  MapPin, 
  Home, 
  Info, 
  Camera,
  X,
  Plus,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateListingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchedListingType = watch('listingType');
  const watchedPropertyType = watch('propertyType');

  const totalSteps = 5;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const propertyTypes = [
    { value: 'house', label: 'House', icon: '🏠' },
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { value: 'commercial', label: 'Commercial', icon: '🏪' },
    { value: 'farm', label: 'Farm', icon: '🚜' },
    { value: 'land', label: 'Land/Lot', icon: '🌳' }
  ];

  const listingTypes = [
    { 
      value: 'fsbo', 
      label: 'For Sale By Owner (FSBO)', 
      description: 'Sell directly without an agent',
      price: 'Starting at $99'
    },
    { 
      value: 'agent', 
      label: 'List with Agent', 
      description: 'Work with a certified agent',
      price: 'Commission based'
    }
  ];

  const amenities = [
    'Swimming Pool', 'Garage', 'Garden/Yard', 'Fireplace', 'Basement',
    'Balcony/Patio', 'Walk-in Closet', 'Laundry Room', 'Air Conditioning',
    'Hardwood Floors', 'Updated Kitchen', 'Master Suite', 'Home Office',
    'Gym/Fitness Room', 'Wine Cellar', 'Solar Panels'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    toast.success('Property listing created successfully!');
    // Here you would typically send the data to your backend
    // For now we'll just show success message
  };

  const stepTitles = [
    'Property Type & Listing Method',
    'Basic Property Information',
    'Property Details & Features',
    'Photos & Media',
    'Review & Publish'
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Create New Listing</h1>
          <p className="text-neutral-600">Follow the steps below to create your property listing</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-beedab-blue">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-neutral-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div 
              className="bg-beedab-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-neutral-600 mt-2 font-medium">{stepTitles[currentStep - 1]}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            {/* Step 1: Property Type & Listing Method */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Choose Your Listing Type</h2>
                  <p className="text-neutral-600 mb-6">Select how you'd like to list your property</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {listingTypes.map((type) => (
                      <label key={type.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          {...register('listingType', { required: 'Please select a listing type' })}
                          value={type.value}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-xl p-6 transition-colors ${
                          watchedListingType === type.value 
                            ? 'border-beedab-blue bg-beedab-blue/10' 
                            : 'border-neutral-200 hover:border-beedab-blue/50'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-neutral-900">{type.label}</h3>
                            <span className="text-sm font-medium text-primary-600">{type.price}</span>
                          </div>
                          <p className="text-neutral-600 mb-4">{type.description}</p>
                          <div className="flex items-center text-primary-600">
                            <Check className="h-5 w-5 mr-2 opacity-0 has-[:checked]:opacity-100" />
                            <span className="text-sm font-medium">Choose this option</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.listingType && (
                    <p className="text-error-600 text-sm mt-2">{errors.listingType.message as string}</p>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Property Type</h2>
                  <p className="text-neutral-600 mb-6">What type of property are you listing?</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {propertyTypes.map((type) => (
                      <label key={type.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          {...register('propertyType', { required: 'Please select a property type' })}
                          value={type.value}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-xl p-4 text-center transition-colors ${
                          watchedPropertyType === type.value 
                            ? 'border-beedab-blue bg-beedab-blue/10' 
                            : 'border-neutral-200 hover:border-beedab-blue/50'
                        }`}>
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <div className="text-sm font-medium text-neutral-900">{type.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.propertyType && (
                    <p className="text-error-600 text-sm mt-2">{errors.propertyType.message as string}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Basic Property Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Property Title *
                      </label>
                      <input
                        type="text"
                        {...register('title', { required: 'Property title is required' })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                        placeholder="e.g., Beautiful Family Home in Downtown"
                      />
                      {errors.title && (
                        <p className="text-error-600 text-sm mt-1">{errors.title.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 font-bold">P</span>
                        <input
                          type="number"
                          {...register('price', { required: 'Price is required', min: 1 })}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          placeholder="650000"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-error-600 text-sm mt-1">{errors.price.message as string}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <input
                          type="text"
                          {...register('address', { required: 'Address is required' })}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          placeholder="123 Main Street, Gaborone"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-error-600 text-sm mt-1">{errors.address.message as string}</p>
                      )}
                    </div>

                    {/* Plot Size - Show for Farm, House and Commercial */}
                    {(watchedPropertyType === 'farm' || watchedPropertyType === 'house' || watchedPropertyType === 'commercial') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Plot Size *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            {...register('plotSize', { required: 'Plot size is required', min: 1 })}
                            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                            placeholder="1000"
                          />
                          {watchedPropertyType === 'farm' && (
                            <select
                              {...register('plotUnit', { required: 'Plot unit is required' })}
                              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                            >
                              <option value="">Unit</option>
                              <option value="hectares">Hectares</option>
                              <option value="acres">Acres</option>
                              <option value="sqm">Square Meters</option>
                            </select>
                          )}
                          {(watchedPropertyType === 'house' || watchedPropertyType === 'commercial') && (
                            <span className="px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-600">
                              sqm
                            </span>
                          )}
                        </div>
                        {errors.plotSize && (
                          <p className="text-error-600 text-sm mt-1">{errors.plotSize.message as string}</p>
                        )}
                      </div>
                    )}

                    {/* Building Size - Show for House, Apartment, Townhouse and Commercial */}
                    {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse' || watchedPropertyType === 'commercial') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Building Size *
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            {...register('buildingSize', { required: 'Building size is required', min: 1 })}
                            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                            placeholder="150"
                          />
                          <span className="px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-600">
                            sqm
                          </span>
                        </div>
                        {errors.buildingSize && (
                          <p className="text-error-600 text-sm mt-1">{errors.buildingSize.message as string}</p>
                        )}
                      </div>
                    )}

                    {/* Bedrooms and Bathrooms - Show for House, Apartment and Townhouse */}
                    {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Bedrooms *
                          </label>
                          <select
                            {...register('bedrooms', { required: 'Number of bedrooms is required' })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select bedrooms</option>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>{num} bedroom{num !== 1 ? 's' : ''}</option>
                            ))}
                            <option value="7+">7+ bedrooms</option>
                          </select>
                          {errors.bedrooms && (
                            <p className="text-error-600 text-sm mt-1">{errors.bedrooms.message as string}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Bathrooms *
                          </label>
                          <select
                            {...register('bathrooms', { required: 'Number of bathrooms is required' })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select bathrooms</option>
                            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                              <option key={num} value={num}>{num} bathroom{num !== 1 ? 's' : ''}</option>
                            ))}
                            <option value="5.5+">5.5+ bathrooms</option>
                          </select>
                          {errors.bathrooms && (
                            <p className="text-error-600 text-sm mt-1">{errors.bathrooms.message as string}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Year Built - Show for House, Apartment and Townhouse */}
                    {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Year Built
                        </label>
                        <input
                          type="number"
                          {...register('yearBuilt', { min: 1800, max: new Date().getFullYear() })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          placeholder="2020"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details & Features */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Property Details & Features</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Property Description *
                      </label>
                      <textarea
                        {...register('description', { required: 'Property description is required' })}
                        rows={6}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                        placeholder="Describe your property... Include key features, recent updates, neighborhood highlights, etc."
                      />
                      {errors.description && (
                        <p className="text-error-600 text-sm mt-1">{errors.description.message as string}</p>
                      )}
                    </div>

                    {/* Amenities - Show for House, Apartment and Townhouse */}
                    {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-4">
                          Amenities & Features
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {amenities.map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register('amenities')}
                                value={amenity}
                                className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Commercial-specific fields */}
                    {watchedPropertyType === 'commercial' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Zoning Type
                          </label>
                          <select
                            {...register('zoningType')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select zoning type</option>
                            <option value="industrial">Industrial</option>
                            <option value="retail">Retail</option>
                            <option value="office">Office</option>
                            <option value="mixed-use">Mixed-Use</option>
                            <option value="warehouse">Warehouse</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Number of Units
                          </label>
                          <input
                            type="number"
                            {...register('numberOfUnits')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                            placeholder="e.g., 10 for shopping complex"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Commercial Amenities
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Parking Bays', 'Loading Docks', 'Elevators/Lifts', 'Security System', 'Generator Backup', 'Air Conditioning'].map((amenity) => (
                              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  {...register('commercialAmenities')}
                                  value={amenity}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                                />
                                <span className="text-sm text-neutral-700">{amenity}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Farm-specific fields */}
                    {watchedPropertyType === 'farm' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Farm Type
                          </label>
                          <select
                            {...register('farmType')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select farm type</option>
                            <option value="crop">Crop Farm</option>
                            <option value="livestock">Livestock Farm</option>
                            <option value="mixed">Mixed Farm</option>
                            <option value="dairy">Dairy Farm</option>
                            <option value="poultry">Poultry Farm</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Water Source
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Borehole', 'River Access', 'Municipal Water', 'Dam/Reservoir'].map((source) => (
                              <label key={source} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  {...register('waterSources')}
                                  value={source}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                                />
                                <span className="text-sm text-neutral-700">{source}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Photos & Media */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Photos & Media</h2>
                  <p className="text-neutral-600 mb-6">Add high-quality photos to showcase your property</p>
                  
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-4">
                        Property Photos *
                      </label>
                      
                      <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload Photos</h3>
                          <p className="text-neutral-600 mb-4">Drag and drop images here or click to browse</p>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Choose Files
                          </button>
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-neutral-700 mb-3">
                            Uploaded Photos ({uploadedImages.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 p-1 bg-error-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                                    Main Photo
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Publish */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Review Your Listing</h2>
                  <p className="text-neutral-600 mb-6">Please review all information before publishing</p>
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Listing Summary</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-2">Property Details</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          <li>Type: {watch('propertyType')}</li>
                          <li>Title: {watch('title')}</li>
                          <li>Price: P{parseInt(watch('price') || '0').toLocaleString()}</li>
                          <li>Address: {watch('address')}</li>
                          
                          {/* Plot Size - Show for Farm, House and Commercial */}
                          {(watchedPropertyType === 'farm' || watchedPropertyType === 'house' || watchedPropertyType === 'commercial') && watch('plotSize') && (
                            <li>Plot Size: {parseInt(watch('plotSize') || '0').toLocaleString()} {watchedPropertyType === 'farm' ? watch('plotUnit') : 'sqm'}</li>
                          )}
                          
                          {/* Building Size - Show for House, Apartment, Townhouse and Commercial */}
                          {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse' || watchedPropertyType === 'commercial') && watch('buildingSize') && (
                            <li>Building Size: {parseInt(watch('buildingSize') || '0').toLocaleString()} sqm</li>
                          )}
                          
                          {/* Bedrooms and Bathrooms - Show for House, Apartment and Townhouse */}
                          {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse') && watch('bedrooms') && (
                            <li>Bedrooms: {watch('bedrooms')}</li>
                          )}
                          {(watchedPropertyType === 'house' || watchedPropertyType === 'apartment' || watchedPropertyType === 'townhouse') && watch('bathrooms') && (
                            <li>Bathrooms: {watch('bathrooms')}</li>
                          )}
                          
                          {/* Commercial specific fields */}
                          {watchedPropertyType === 'commercial' && watch('zoningType') && (
                            <li>Zoning: {watch('zoningType')}</li>
                          )}
                          {watchedPropertyType === 'commercial' && watch('numberOfUnits') && (
                            <li>Units: {watch('numberOfUnits')}</li>
                          )}
                          
                          {/* Farm specific fields */}
                          {watchedPropertyType === 'farm' && watch('farmType') && (
                            <li>Farm Type: {watch('farmType')}</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-2">Listing Settings</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          <li>Listing Type: {watch('listingType')}</li>
                          <li>Photos: {uploadedImages.length} uploaded</li>
                          <li>Status: Ready to publish</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-neutral-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Publish Listing
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;