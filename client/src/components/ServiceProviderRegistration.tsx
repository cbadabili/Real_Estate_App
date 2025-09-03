import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  FileText,
  Star,
  Shield,
  Award,
  Camera,
  Scale,
  Truck,
  Calculator,
  Home,
  X,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Trees,
  Waves,
  Lock,
  Layers
} from 'lucide-react';

const serviceProviderSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  serviceCategory: z.string().min(1, 'Please select a service category'),
  subCategory: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  phoneNumber: z.string().min(8, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  websiteUrl: z.string().url('Valid website URL is required').optional().or(z.literal('')),
  description: z.string(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  reacCertified: z.boolean().default(false),
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface ServiceProviderRegistrationProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ServiceProviderRegistration: React.FC<ServiceProviderRegistrationProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categoryIcons: { [key: string]: any } = {
    'Photography': Camera,
    'Legal': Scale,
    'Moving': Truck,
    'Finance': Calculator,
    'Insurance': Shield,
    'Cleaning': Home,
    'Construction': Building,
    'Maintenance': Wrench,
    'HVAC': Zap,
    'Plumbing': Wrench,
    'Electrical': Zap,
    'Garden': Trees,
    'Pool': Waves,
    'Security': Lock,
    'Roofing': Hammer,
    'Flooring': Layers,
    'Painting': Paintbrush
  };

  const mainCategories = {
    'Legal Services': [],
    'Photography': [],
    'Property Inspection': [],
    'Finance & Loans': [],
    'Insurance': [],
    'Construction': ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Flooring', 'Painting'],
    'Moving': [],
    'Cleaning': [],
    'Maintenance': ['Garden', 'Pool', 'Security']
  };

  const getAllCategories = () => {
    const allCategories: any[] = [];
    Object.entries(mainCategories).forEach(([main, subs]) => {
      allCategories.push(main);
      allCategories.push(...subs);
    });
    return allCategories;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      reacCertified: false,
      websiteUrl: ''
    }
  });

  const selectedCategory = watch('serviceCategory');
  const selectedSubCategory = watch('subCategory');

  const onSubmit = async (data: ServiceProviderFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/services/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          serviceCategory: data.subCategory || data.serviceCategory,
          logoUrl: '/api/placeholder/100/100',
          rating: 0,
          reviewCount: 0,
          verified: false,
          featured: false,
          priceRange: 'Contact for pricing',
          email: data.email,
          phone: data.phoneNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register service provider');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to register service provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Register as Service Provider</h2>
            <p className="text-gray-600 mt-1">Join our network of trusted professionals</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Building className="h-5 w-5 text-beedab-blue" />
              <span>Company Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  {...register('companyName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="text-red-600 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Service Category *
                  </label>
                  <select
                    {...register('serviceCategory')}
                    onChange={(e) => {
                      setValue('serviceCategory', e.target.value);
                      setValue('subCategory', ''); // Reset subcategory when main category changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    <option value="">Select main category</option>
                    {Object.keys(mainCategories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.serviceCategory && (
                    <p className="text-red-600 text-sm mt-1">{errors.serviceCategory.message}</p>
                  )}
                </div>

                {selectedCategory && mainCategories[selectedCategory as keyof typeof mainCategories]?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization (Optional)
                    </label>
                    <select
                      {...register('subCategory')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    >
                      <option value="">General {selectedCategory}</option>
                      {mainCategories[selectedCategory as keyof typeof mainCategories].map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                placeholder="Describe your services, experience, and what makes your business unique..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Briefly describe your services</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User className="h-5 w-5 text-beedab-blue" />
              <span>Contact Information</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  {...register('contactPerson')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Primary contact name"
                />
                {errors.contactPerson && (
                  <p className="text-red-600 text-sm mt-1">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  {...register('phoneNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="e.g., 72123456"
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="contact@yourcompany.bw"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  {...register('websiteUrl')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="https://yourcompany.bw"
                />
                {errors.websiteUrl && (
                  <p className="text-red-600 text-sm mt-1">{errors.websiteUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-beedab-blue" />
              <span>Location</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  {...register('address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">Select city</option>
                  <option value="Gaborone">Gaborone</option>
                  <option value="Francistown">Francistown</option>
                  <option value="Molepolole">Molepolole</option>
                  <option value="Serowe">Serowe</option>
                  <option value="Selibe Phikwe">Selibe Phikwe</option>
                  <option value="Maun">Maun</option>
                  <option value="Kanye">Kanye</option>
                  <option value="Mochudi">Mochudi</option>
                </select>
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Award className="h-5 w-5 text-beedab-blue" />
              <span>Certifications</span>
            </h3>

            <div className="flex items-center space-x-3">
              <input
                {...register('reacCertified')}
                type="checkbox"
                id="reacCertified"
                className="h-4 w-4 text-beedab-blue focus:ring-beedab-blue border-gray-300 rounded"
              />
              <label htmlFor="reacCertified" className="text-sm text-gray-700">
                I am REAC (Real Estate Advisory Council) certified
              </label>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Registering...' : 'Register Service Provider'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceProviderRegistration;