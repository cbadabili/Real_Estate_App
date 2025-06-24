import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Ruler, Phone, MessageCircle, Camera, Plus, X } from 'lucide-react';

// Validation schema matching Facebook marketplace format
const sellerListingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  size: z.number().min(1, 'Plot size must be greater than 0'),
  sizeUnit: z.enum(['m²', 'hectares']),
  price: z.number().min(1, 'Price must be greater than 0'),
  currency: z.enum(['BWP', 'USD']).default('BWP'),
  plotType: z.enum(['residential', 'farm', 'commercial']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  contactPhone: z.string().min(8, 'Valid phone number required'),
  contactWhatsApp: z.string().optional(),
  sellerName: z.string().min(2, 'Seller name is required'),
  hasWater: z.boolean().default(false),
  hasElectricity: z.boolean().default(false),
  serviced: z.boolean().default(false)
});

type SellerListingFormData = z.infer<typeof sellerListingSchema>;

interface SellerListingFormProps {
  onSubmit: (data: SellerListingFormData & { images: string[] }) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Seller Direct-Listing Form Component
 * Matches common Facebook marketplace format with fields for:
 * Plot Size, Price, Location, Amenities, Description, Contact Number
 * Includes validation stubs and Botswana-specific formatting
 */
export const SellerListingForm: React.FC<SellerListingFormProps> = ({ 
  onSubmit, 
  onCancel, 
  className = "" 
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<SellerListingFormData>({
    resolver: zodResolver(sellerListingSchema),
    defaultValues: {
      currency: 'BWP',
      sizeUnit: 'm²',
      plotType: 'residential',
      hasWater: false,
      hasElectricity: false,
      serviced: false
    }
  });

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

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files) return;
      
      setUploading(true);
      // Simulate image upload - in real app, upload to cloud storage
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImageUrls]);
      setUploading(false);
    };
    
    input.click();
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: SellerListingFormData) => {
    onSubmit({ ...data, images });
  };

  const watchedValues = watch();

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">List Your Plot</h2>
        <p className="text-gray-600">Create a listing to sell your plot directly to buyers</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plot Title *
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Residential Plot in Mogoditshane Block 5 - 1000m²"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location *
          </label>
          <select
            {...register('location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          >
            <option value="">Select Location</option>
            {popularLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Plot Size & Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="inline h-4 w-4 mr-1" />
              Plot Size *
            </label>
            <input
              {...register('size', { valueAsNumber: true })}
              type="number"
              placeholder="900"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              {...register('sizeUnit')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="m²">m²</option>
              <option value="hectares">hectares</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plot Type *
            </label>
            <select
              {...register('plotType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="residential">Residential</option>
              <option value="farm">Farm Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              placeholder="150000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              {...register('currency')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="BWP">BWP (Pula)</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Amenities
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                {...register('hasWater')}
                type="checkbox"
                className="mr-3 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
              />
              <span className="text-sm">Water connection available</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('hasElectricity')}
                type="checkbox"
                className="mr-3 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
              />
              <span className="text-sm">Electricity connection available</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('serviced')}
                type="checkbox"
                className="mr-3 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
              />
              <span className="text-sm">Fully serviced plot (water, electricity, roads)</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe your plot - location details, nearby amenities, access roads, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              {...register('sellerName')}
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
            {errors.sellerName && (
              <p className="mt-1 text-sm text-red-600">{errors.sellerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </label>
            <input
              {...register('contactPhone')}
              type="tel"
              placeholder="71234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageCircle className="inline h-4 w-4 mr-1" />
            WhatsApp Number (Optional)
          </label>
          <input
            {...register('contactWhatsApp')}
            type="tel"
            placeholder="Same as phone number or different WhatsApp number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plot Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload photos of your plot</p>
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Choose Photos'}
            </button>
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Plot photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-beedab-blue text-white px-4 py-3 rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};