
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ServiceProvider {
  name: string;
  email: string;
  phone: string;
  category: string;
  specialization: string;
  experience: string;
  description: string;
  location: string;
  portfolio: File[];
  certifications: File[];
  insurance: File[];
}

interface RegisterProviderProps {
  onSubmit?: (data: ServiceProvider) => void;
  variant?: 'modal' | 'page';
}

export const RegisterProvider: React.FC<RegisterProviderProps> = ({
  onSubmit,
  variant = 'page'
}) => {
  const [formData, setFormData] = useState<Partial<ServiceProvider>>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Real Estate Agent',
    'Property Manager',
    'Contractor',
    'Architect',
    'Legal Services',
    'Financial Services',
    'Home Inspector',
    'Appraiser',
    'Interior Designer',
    'Landscaper'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit?.(formData as ServiceProvider);
      setStep(4); // Success step
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ServiceProvider, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => updateFormData('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            placeholder="City, Botswana"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Professional Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Category *
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => updateFormData('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <select
            value={formData.experience || ''}
            onChange={(e) => updateFormData('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            required
          >
            <option value="">Select Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <input
            type="text"
            value={formData.specialization || ''}
            onChange={(e) => updateFormData('specialization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            placeholder="e.g., Residential sales, Commercial leasing"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beedab-blue"
            placeholder="Describe your services and experience..."
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Documents & Portfolio</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio/Work Samples
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Upload images of your work (max 10 files)
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="portfolio-upload"
            />
            <label
              htmlFor="portfolio-upload"
              className="mt-2 inline-block bg-beedab-blue text-white px-4 py-2 rounded-md hover:bg-beedab-darkblue cursor-pointer"
            >
              Choose Files
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications & Licenses
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Upload relevant certifications
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="cert-upload"
            />
            <label
              htmlFor="cert-upload"
              className="mt-2 inline-block bg-beedab-blue text-white px-4 py-2 rounded-md hover:bg-beedab-darkblue cursor-pointer"
            >
              Choose Files
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h3 className="text-2xl font-semibold text-gray-900">Application Submitted!</h3>
      <p className="text-gray-600">
        Thank you for your application. We'll review your information and get back to you within 2-3 business days.
      </p>
    </div>
  );

  const containerClass = variant === 'modal' 
    ? 'max-w-2xl mx-auto'
    : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8';

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Join Our Service Provider Network</h2>
          <p className="text-gray-600 mt-2">Help property buyers and sellers in Botswana</p>
        </div>

        {step < 4 && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-beedab-blue text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-24 h-1 mx-2 ${
                      step > stepNum ? 'bg-beedab-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${
                  step === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterProvider;
