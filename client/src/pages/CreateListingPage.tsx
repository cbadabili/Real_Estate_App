import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  Home, 
  Info, 
  Camera,
  X,
  Plus,
  Check,
  Building2,
  Store,
  Tractor,
  Mountain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import PropertyLocationStep from '../components/properties/PropertyLocationStep';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchedListingType = watch('listingType');
  const watchedPropertyType = watch('propertyType');
  const [formData, setFormData] = useState({
    city: '',
    state: '',
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

  const totalSteps = 5;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const propertyTypes = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'townhouse', label: 'Townhouse', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Store },
    { value: 'farm', label: 'Farm', icon: Tractor },
    { value: 'land_plot', label: 'Land/Plot', icon: Mountain }
  ];

  const listingTypes = [
    { 
      value: 'fsbo', 
      label: 'Owner Seller', 
      description: 'Sell directly without an agent'
    },
    { 
      value: 'agent', 
      label: 'List with Agent', 
      description: 'Work with a certified agent'
    },
    { 
      value: 'auction', 
      label: 'Auction Listing', 
      description: 'List property for auction sale'
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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const startCamera = async () => {
    try {
      setIsCapturingPhoto(true);

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';

      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += 'Please check your camera settings.';
      }

      toast.error(errorMessage);
      setIsCapturingPhoto(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setUploadedImages(prev => [...prev, imageData]);
        stopCamera();
        toast.success('Photo captured successfully!');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturingPhoto(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (currentImageIndex >= newImages.length && newImages.length > 0) {
        setCurrentImageIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentImageIndex(0);
      }
      return newImages;
    });
  };

  const nextImage = () => {
    if (uploadedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % uploadedImages.length);
    }
  };

  const prevImage = () => {
    if (uploadedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + uploadedImages.length) % uploadedImages.length);
    }
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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', data);

      // Transform form data to match backend schema
      const propertyData = {
        title: data.title,
        description: data.description,
        price: data.price ? data.price.toString() : '0', // Convert to string to match schema
        address: locationData.area_text || `${formData.city || 'Gaborone'}, ${formData.state || 'South-East'}`,
        city: formData.city || 'Gaborone',
        state: formData.state || 'South-East',
        zipCode: data.zipCode || '00000',
        // New location fields
        areaText: locationData.area_text || null,
        placeName: locationData.place_name || null,
        placeId: locationData.place_id || null,
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
        locationSource: locationData.location_source || 'geocode',
        propertyType: data.propertyType,
        listingType: data.listingType === 'fsbo' ? 'owner' : (data.listingType === 'agent' ? 'agent' : data.listingType),
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? data.bathrooms.toString() : null,
        squareFeet: data.buildingSize ? parseInt(data.buildingSize) : (data.plotSize ? parseInt(data.plotSize) : null),
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        ownerId: 1, // Default owner ID - in real app this would come from auth
        features: data.amenities ? data.amenities : null,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        // Auction-specific fields
        auctionHouse: data.auctionHouse || null,
        // Additional fields that may be expected
        status: 'active'
      };

      console.log('Transformed property data:', propertyData);

      const token = localStorage.getItem('token');
      
      // Ensure proper token format
      if (!token) {
        throw new Error('No authentication token available');
      }

      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Property creation failed:', response.status, errorData);

        if (response.status === 401) {
          throw new Error('Please log in to create a property listing');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to create property listings');
        } else {
          throw new Error(`Failed to create property listing: ${response.status}`);
        }
      }

      const createdProperty = await response.json();
      console.log('Property created:', createdProperty);

      // Show success message using toast instead of alert
      toast.success('Property listing created successfully!');

      // Navigate to the created property page, fallback to properties list
      const propertyId = createdProperty.id || createdProperty.data?.id || createdProperty.insertId;
      if (propertyId) {
        navigate(`/properties/${propertyId}`);
      } else {
        // If no ID is returned, navigate to properties page to see the listing
        navigate('/properties');
      }

    } catch (error) {
      console.error('Error creating property:', error);

      if (error.message.includes('log in')) {
        toast.error('Please log in to create a property listing');
      } else if (error.message.includes('permission')) {
        toast.error('You do not have permission to create property listings');
      } else if (error.message.includes('401')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error(error.message || 'Failed to create property listing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
                        <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                          watchedListingType === type.value 
                            ? 'border-beedab-blue bg-beedab-blue shadow-md' 
                            : 'border-beedab-blue/30 hover:border-beedab-blue hover:bg-beedab-blue/5'
                        }`}>
                          <div className="mb-4">
                            <h3 className={`text-lg font-semibold ${
                              watchedListingType === type.value 
                                ? 'text-white' 
                                : 'text-neutral-900'
                            }`}>{type.label}</h3>
                          </div>
                          <p className={`mb-4 ${
                            watchedListingType === type.value 
                              ? 'text-white/80' 
                              : 'text-neutral-600'
                          }`}>{type.description}</p>
                          <div className={`flex items-center ${
                            watchedListingType === type.value 
                              ? 'text-white' 
                              : 'text-beedab-blue'
                          }`}>
                            <Check className={`h-5 w-5 mr-2 transition-opacity ${
                              watchedListingType === type.value ? 'opacity-100' : 'opacity-0'
                            }`} />
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
                        <div className={`border-2 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 ${
                          watchedPropertyType === type.value 
                            ? 'border-beedab-blue bg-beedab-blue shadow-md' 
                            : 'border-beedab-blue/30 hover:border-beedab-blue hover:bg-beedab-blue/5 shadow-sm'
                        }`}>
                          <type.icon className={`w-8 h-8 mx-auto mb-3 ${
                            watchedPropertyType === type.value 
                              ? 'text-white' 
                              : 'text-beedab-blue'
                          }`} />
                          <div className={`text-sm font-medium ${
                            watchedPropertyType === type.value 
                              ? 'text-white' 
                              : 'text-neutral-900'
                          }`}>{type.label}</div>
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
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Property Location</h3>
                      <PropertyLocationStep
                        initialArea={locationData.area_text}
                        initialCoords={locationData.latitude && locationData.longitude ? {
                          lat: locationData.latitude,
                          lng: locationData.longitude
                        } : null}
                        onChange={setLocationData}
                      />
                    </div>
                     <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    District
                  </label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, state: e.target.value, city: '' });
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City/Town
                  </label>
                  <select
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select City/Town</option>
                    {formData.state === 'South-East' && (
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
                    {formData.state === 'North-East' && (
                      <>
                        <option value="Francistown">Francistown</option>
                        <option value="Selebi-Phikwe">Selebi-Phikwe</option>
                        <option value="Tonota">Tonota</option>
                        <option value="Tutume">Tutume</option>
                        <option value="Nata">Nata</option>
                        <option value="Bobonong">Bobonong</option>
                        <option value="Tati">Tati</option>
                        <option value="Dukwi">Dukwi</option>
                        <option value="Jackalas">Jackalas</option>
                        <option value="Monarch">Monarch</option>
                        <option value="Sua Pan">Sua Pan</option>
                        <option value="Ramokgwebana">Ramokgwebana</option>
                        <option value="Mathangwane">Mathangwane</option>
                        <option value="Chadibe">Chadibe</option>
                        <option value="Sebina">Sebina</option>
                        <option value="Semolale">Semolale</option>
                        <option value="Gerald Estate">Gerald Estate</option>
                        <option value="Block 1">Block 1</option>
                        <option value="Block 2">Block 2</option>
                        <option value="Block 3">Block 3</option>
                        <option value="Block 4">Block 4</option>
                        <option value="Block 5">Block 5</option>
                        <option value="Block 6">Block 6</option>
                        <option value="Block 7">Block 7</option>
                        <option value="Block 8">Block 8</option>
                        <option value="Block 9">Block 9</option>
                        <option value="Block 10">Block 10</option>
                        <option value="Nyangabwe">Nyangabwe</option>
                        <option value="Blue Jacket">Blue Jacket</option>
                        <option value="Satellite">Satellite</option>
                      </>
                    )}
                    {formData.state === 'North-West' && (
                      <>
                        <option value="Maun">Maun</option>
                        <option value="Kasane">Kasane</option>
                        <option value="Shakawe">Shakawe</option>
                        <option value="Gumare">Gumare</option>
                        <option value="Nokaneng">Nokaneng</option>
                        <option value="Seronga">Seronga</option>
                        <option value="Tsau">Tsau</option>
                      </>
                    )}
                    {formData.state === 'Central' && (
                      <>
                        <option value="Serowe">Serowe</option>
                        <option value="Palapye">Palapye</option>
                        <option value="Mahalapye">Mahalapye</option>
                        <option value="Shoshong">Shoshong</option>
                        <option value="Boteti">Boteti</option>
                        <option value="Orapa">Orapa</option>
                        <option value="Letlhakane">Letlhakane</option>
                      </>
                    )}
                    {formData.state === 'Kweneng' && (
                      <>
                        <option value="Molepolole">Molepolole</option>
                        <option value="Thamaga">Thamaga</option>
                        <option value="Kumakwane">Kumakwane</option>
                        <option value="Letlhakeng">Letlhakeng</option>
                        <option value="Mokatse">Mokatse</option>
                      </>
                    )}
                    {formData.state === 'Southern' && (
                      <>
                        <option value="Kanye">Kanye</option>
                        <option value="Jwaneng">Jwaneng</option>
                        <option value="Tshabong">Tshabong</option>
                        <option value="Goodhope">Goodhope</option>
                        <option value="Kang">Kang</option>
                        <option value="Hukuntsi">Hukuntsi</option>
                      </>
                    )}
                    {formData.state === 'Kgatleng' && (
                      <>
                        <option value="Mochudi">Mochudi</option>
                        <option value="Artesia">Artesia</option>
                        <option value="Oodi">Oodi</option>
                      </>
                    )}
                    {formData.state === 'Kgalagadi' && (
                      <>
                        <option value="Ghanzi">Ghanzi</option>
                        <option value="Tsabong">Tsabong</option>
                        <option value="Hukuntsi">Hukuntsi</option>
                        <option value="Kang">Kang</option>
                      </>
                    )}
                    {formData.state === 'Chobe' && (
                      <>
                        <option value="Kasane">Kasane</option>
                        <option value="Kazungula">Kazungula</option>
                        <option value="Pandamatenga">Pandamatenga</option>
                      </>
                    )}
                  </select>
                </div>

                    {/* Plot Size - Show for Farm, House, Commercial and Land */}
                    {(watchedPropertyType === 'farm' || watchedPropertyType === 'house' || watchedPropertyType === 'commercial' || watchedPropertyType === 'land_plot') && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {(watchedPropertyType === 'farm' || watchedPropertyType === 'land_plot') ? 'Land Size *' : 'Land Size *'}
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            {...register('plotSize', { required: 'Plot size is required', min: 1 })}
                            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                            placeholder="1000"
                          />
                          {(watchedPropertyType === 'farm' || watchedPropertyType === 'land_plot') && (
                            <select
                              {...register('plotUnit', { required: 'Plot unit is required' })}
                              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                            >
                              <option value="">Unit</option>
                              <option value="hectares">Hectares (ha)</option>
                              <option value="sqm">Square Meters (sqm)</option>
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
                          Building Size
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            {...register('buildingSize', { min: 1 })}
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

                    {/* Auction House - Show for auction listings */}
                    {watchedListingType === 'auction' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Auction House *
                        </label>
                        <select
                          {...register('auctionHouse', { required: 'Auction house is required for auction listings' })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                        >
                          <option value="">Select auction house</option>
                          <option value="First National Bank of Botswana Limited">First National Bank of Botswana Limited</option>
                          <option value="Standard Bank Botswana">Standard Bank Botswana</option>
                          <option value="Barclays Bank Botswana">Barclays Bank Botswana</option>
                          <option value="Bank Gaborone">Bank Gaborone</option>
                          <option value="BancABC Botswana">BancABC Botswana</option>
                          <option value="African Banking Corporation">African Banking Corporation</option>
                          <option value="Standard Chartered Bank Botswana">Standard Chartered Bank Botswana</option>
                          <option value="Independent Auctioneers">Independent Auctioneers</option>
                        </select>
                        {errors.auctionHouse && (
                          <p className="text-error-600 text-sm mt-1">{errors.auctionHouse.message as string}</p>
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
                            <option value="">Select farm type (optional)</option>
                            <option value="crop">Crop Farm</option>
                            <option value="livestock">Livestock</option>
                            <option value="mixed-use">Mixed-Use</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Water Access
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Borehole', 'River', 'Dam', 'Irrigation'].map((water) => (
                              <label key={water} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  {...register('waterAccess')}
                                  value={water}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                                />
                                <span className="text-sm text-neutral-700">{water}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Fencing
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('fencing')}
                                value="yes"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('fencing')}
                                value="no"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Buildings/Structures
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Barns', 'Housing', 'Storage', 'Equipment Shed', 'Greenhouse', 'Processing Facility'].map((building) => (
                              <label key={building} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  {...register('farmBuildings')}
                                  value={building}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                                />
                                <span className="text-sm text-neutral-700">{building}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Land-specific fields */}
                    {watchedPropertyType === 'land_plot' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Zoning/Use Type
                          </label>
                          <select
                            {...register('zoningType')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select zoning type (optional)</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="agricultural">Agricultural</option>
                            <option value="industrial">Industrial</option>
                            <option value="mixed-use">Mixed-Use</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Fenced
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('fenced')}
                                value="yes"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('fenced')}
                                value="no"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Serviced (Utilities Connected)
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('serviced')}
                                value="yes"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                {...register('serviced')}
                                value="no"
                                className="text-beedab-blue focus:ring-beedab-blue"
                              />
                              <span className="text-sm text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Topography
                          </label>
                          <select
                            {...register('topography')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select topography (optional)</option>
                            <option value="flat">Flat</option>
                            <option value="sloped">Sloped</option>
                            <option value="rocky">Rocky</option>
                            <option value="hilly">Hilly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Road Access
                          </label>
                          <select
                            {...register('roadAccess')}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent transition-all"
                          >
                            <option value="">Select road access (optional)</option>
                            <option value="tarred">Tarred Road</option>
                            <option value="gravel">Gravel Road</option>
                            <option value="none">No Road Access</option>
                          </select>
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
                    {/* Professional Photography Services */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Professional Photos?</h3>
                      <p className="text-blue-700 text-sm mb-3">
                        Professional photography can increase your property's appeal and help it sell faster.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.href = '/services?category=photography'}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Book Professional Photography
                      </button>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-4">
                        Property Photos *
                      </label>

                      {!isCapturingPhoto ? (
                        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-beedab-blue transition-colors">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload Photos</h3>
                          <p className="text-neutral-600 mb-4">Drag and drop images here, click to browse, or take photos</p>
                          <div className="flex justify-center space-x-3 flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center px-4 py-2 bg-beedab-blue hover:bg-beedab-darkblue text-white rounded-lg font-medium transition-colors"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Choose Files
                            </button>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Take Photo
                            </button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-3">
                            Supported formats: JPG, PNG, WebP (Max 10MB each)
                          </p>
                        </div>
                      ) : (
                        <div className="bg-black rounded-xl p-4">
                          <div className="relative">
                            <video
                              ref={videoRef}
                              className="w-full h-64 object-cover rounded-lg"
                              playsInline
                              muted
                            />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                              <button
                                type="button"
                                onClick={capturePhoto}
                                className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Camera className="h-6 w-6" />
                              </button>
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                              >
                                <X className="h-6 w-6" />
                              </button>
                            </div>
                          </div>
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      )}

                      {uploadedImages.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-neutral-700 mb-3">
                            Uploaded Photos ({uploadedImages.length})
                          </h4>

                          {/* Main Image Carousel */}
                          <div className="relative mb-4">
                            <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded-lg overflow-hidden">
                              <img
                                src={uploadedImages[currentImageIndex]}
                                alt={`Property ${currentImageIndex + 1}`}
                                className="w-full h-64 object-cover"
                              />
                            </div>

                            {/* Navigation arrows */}
                            {uploadedImages.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={prevImage}
                                  className="absolute inset-y-0 left-0 flex items-center justify-center w-12 bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all"
                                >
                                  <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                  type="button"
                                  onClick={nextImage}
                                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all"
                                >
                                  <ChevronRight className="h-6 w-6" />
                                </button>
                              </>
                            )}

                            {/* Image counter */}
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                              {currentImageIndex + 1} / {uploadedImages.length}
                            </div>

                            {/* Main photo indicator */}
                            {currentImageIndex === 0 && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-beedab-blue text-white text-xs rounded">
                                Main Photo
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Grid */}
                          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Property ${index + 1}`}
                                  className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                                    currentImageIndex === index 
                                      ? 'ring-2 ring-beedab-blue opacity-100' 
                                      : 'hover:opacity-75'
                                  }`}
                                  onClick={() => setCurrentImageIndex(index)}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-beedab-blue text-white text-xs text-center py-1 rounded-b">
                                    Main
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

                          {/* Plot Size - Show for Farm, House, Commercial and Land */}
                          {(watchedPropertyType === 'farm' || watchedPropertyType === 'house' || watchedPropertyType === 'commercial' || watchedPropertyType === 'land_plot') && watch('plotSize') && (
                            <li>{(watchedPropertyType === 'farm' || watchedPropertyType === 'land_plot') ? 'Land Size' : 'Land Size'}: {parseInt(watch('plotSize') || '0').toLocaleString()} {(watchedPropertyType === 'farm' || watchedPropertyType === 'land_plot') ? watch('plotUnit') : 'sqm'}</li>
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
                          {watchedPropertyType === 'farm' && watch('fencing') && (
                            <li>Fencing: {watch('fencing') === 'yes' ? 'Yes' : 'No'}</li>
                          )}
                          {watchedPropertyType === 'farm' && watch('waterAccess') && Array.isArray(watch('waterAccess')) && watch('waterAccess').length > 0 && (
                            <li>Water Access: {watch('waterAccess').join(', ')}</li>
                          )}
                          {watchedPropertyType === 'farm' && watch('farmBuildings') && Array.isArray(watch('farmBuildings')) && watch('farmBuildings').length > 0 && (
                            <li>Buildings: {watch('farmBuildings').join(', ')}</li>
                          )}

                          {/* Land specific fields */}
                          {watchedPropertyType === 'land_plot' && watch('zoningType') && (
                            <li>Zoning: {watch('zoningType')}</li>
                          )}
                          {watchedPropertyType === 'land_plot' && watch('fenced') && (
                            <li>Fenced: {watch('fenced') === 'yes' ? 'Yes' : 'No'}</li>
                          )}
                          {watchedPropertyType === 'land_plot' && watch('serviced') && (
                            <li>Serviced: {watch('serviced') === 'yes' ? 'Yes' : 'No'}</li>
                          )}
                          {watchedPropertyType === 'land_plot' && watch('topography') && (
                            <li>Topography: {watch('topography')}</li>
                          )}
                          {watchedPropertyType === 'land_plot' && watch('roadAccess') && (
                            <li>Road Access: {watch('roadAccess')}</li>
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
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Publish Listing
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

export default CreateListingPage;