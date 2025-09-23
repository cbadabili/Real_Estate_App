// @ts-nocheck

import { useState, useEffect, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { X, Plus, User, Package, Wrench, GraduationCap } from 'lucide-react';

interface ProviderTypeConfig {
  type: string;
  name: string;
  icon: ComponentType<any>;
  description: string;
  categories: string[];
  fields: string[];
}

const RegisterProviderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const providerTypes: ProviderTypeConfig[] = [
    {
      type: 'professional',
      name: 'Professional',
      icon: User,
      description: 'Legal services, valuations, real estate agents, consultants',
      categories: ['Legal Services', 'Property Valuation', 'Real Estate Agent', 'Consulting'],
      fields: ['business_license', 'professional_certification', 'insurance']
    },
    {
      type: 'supplier',
      name: 'Supplier',
      icon: Package,
      description: 'Building materials, equipment, hardware supplies',
      categories: ['Building Materials', 'Hardware', 'Equipment Rental', 'Concrete Supply'],
      fields: ['supplier_license', 'product_catalog', 'delivery_areas']
    },
    {
      type: 'artisan',
      name: 'Artisan/Tradesperson',
      icon: Wrench,
      description: 'Skilled trades, contractors, builders, craftspeople',
      categories: ['Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Roofing'],
      fields: ['trade_certification', 'portfolio', 'safety_certification']
    },
    {
      type: 'trainer',
      name: 'Training Provider',
      icon: GraduationCap,
      description: 'Professional development, courses, certification programs',
      categories: ['Real Estate Training', 'Construction Training', 'Safety Training', 'Professional Development'],
      fields: ['training_certification', 'curriculum', 'accreditation']
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam && providerTypes.find(pt => pt.type === typeParam)) {
      setSelectedType(typeParam);
    }
  }, [location]);

  const selectedTypeConfig = providerTypes.find(pt => pt.type === selectedType);

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const formData = {
        ...data,
        provider_type: selectedType,
        specialties,
        registration_date: new Date().toISOString()
      };

      const response = await fetch('/api/marketplace/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration submitted successfully! You will be contacted within 24 hours.');
        navigate('/marketplace');
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Service Provider Network
            </h1>
            <p className="text-xl text-gray-600">
              Choose your provider type to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providerTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-beedab-blue transition-all text-left"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-beedab-blue rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {type.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.categories.slice(0, 3).map(category => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                    {type.categories.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{type.categories.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedTypeConfig && (
                <>
                  <selectedTypeConfig.icon className="h-6 w-6 text-beedab-blue" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Register as {selectedTypeConfig.name}
                  </h2>
                </>
              )}
            </div>
            <button
              onClick={() => setSelectedType('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  {...register('business_name', { required: 'Business name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="Enter your business name"
                />
                {errors.business_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.business_name?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  {...register('business_description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="Describe your business and services"
                />
                {errors.business_description && (
                  <p className="text-red-600 text-sm mt-1">{errors.business_description?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category *
                </label>
                <select
                  {...register('category_id', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                >
                  <option value="">Select a category</option>
                  {selectedTypeConfig?.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.category_id?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Area *
                </label>
                <input
                  {...register('service_area', { required: 'Service area is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="e.g., Gaborone, Francistown, Nationwide"
                />
                {errors.service_area && (
                  <p className="text-red-600 text-sm mt-1">{errors.service_area?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (Pula) *
                </label>
                <input
                  {...register('hourly_rate', { 
                    required: 'Hourly rate is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Please enter a valid rate'
                    }
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="0.00"
                />
                {errors.hourly_rate && (
                  <p className="text-red-600 text-sm mt-1">{errors.hourly_rate?.message}</p>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
              
              <div className="flex space-x-2">
                <input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="Add a specialty"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                    placeholder="+267 1234 5678"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                    placeholder="business@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  {...register('website')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-beedab-blue"
                  placeholder="https://www.yourwebsite.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => setSelectedType('')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterProviderPage;
