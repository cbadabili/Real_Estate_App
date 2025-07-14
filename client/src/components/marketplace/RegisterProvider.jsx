
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, Plus } from 'lucide-react';

const RegisterProvider = ({ onClose, onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm();

  const categories = [
    { id: 'professional', name: 'Professional Services', type: 'professional' },
    { id: 'supplier', name: 'Building Suppliers', type: 'supplier' },
    { id: 'trade', name: 'Skilled Trades', type: 'trade' },
    { id: 'training', name: 'Training & Courses', type: 'training' }
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'profile') {
      setProfileImage(files[0]);
    } else {
      setPortfolioImages([...portfolioImages, ...files]);
    }
  };

  const removePortfolioImage = (index) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      category_id: selectedCategory,
      specialties,
      profile_image: profileImage,
      portfolio_images: portfolioImages
    };
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Register as Service Provider</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                {...register('business_name', { required: 'Business name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your business name"
              />
              {errors.business_name && (
                <p className="text-red-600 text-sm mt-1">{errors.business_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                {...register('business_description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your business and services"
              />
              {errors.business_description && (
                <p className="text-red-600 text-sm mt-1">{errors.business_description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area *
              </label>
              <input
                {...register('service_area', { required: 'Service area is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Gaborone, Francistown, Nationwide"
              />
              {errors.service_area && (
                <p className="text-red-600 text-sm mt-1">{errors.service_area.message}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              {errors.hourly_rate && (
                <p className="text-red-600 text-sm mt-1">{errors.hourly_rate.message}</p>
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+267 1234 5678"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="business@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                {...register('website')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.yourwebsite.com"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProvider;
