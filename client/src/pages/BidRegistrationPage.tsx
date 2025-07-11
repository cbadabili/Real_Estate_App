
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Gavel, 
  User, 
  CreditCard, 
  FileText, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const BidRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const totalSteps = 3;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const auctionHouses = [
    'First National Bank of Botswana Limited',
    'Standard Bank Botswana',
    'Barclays Bank Botswana',
    'Bank Gaborone',
    'BancABC Botswana',
    'African Banking Corporation',
    'Standard Chartered Bank Botswana',
    'Independent Auctioneers'
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Registration successful! You can now bid on this auction.');
      navigate(`/bid/${id}`);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gavel className="h-8 w-8 text-beedab-blue mr-3" />
            <h1 className="text-3xl font-bold text-neutral-900">Auction Registration</h1>
          </div>
          <p className="text-neutral-600">Register to participate in this property auction</p>
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-beedab-blue mr-3" />
                  <h2 className="text-2xl font-semibold text-neutral-900">Personal Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        placeholder="+267 1234 5678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message as string}</p>
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
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        placeholder="123 Main Street, Gaborone"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address.message as string}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-beedab-blue mr-3" />
                  <h2 className="text-2xl font-semibold text-neutral-900">Financial Information</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Deposit Requirements</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    A deposit of 12.5% of your winning bid amount will be required on the auction date.
                    Please ensure you have adequate funds available.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Maximum Bid Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 font-bold">P</span>
                      <input
                        type="number"
                        {...register('maxBid', { required: 'Maximum bid amount is required', min: 1 })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        placeholder="500000"
                      />
                    </div>
                    {errors.maxBid && (
                      <p className="text-red-600 text-sm mt-1">{errors.maxBid.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bank/Financial Institution *
                    </label>
                    <select
                      {...register('bank', { required: 'Bank selection is required' })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    >
                      <option value="">Select your bank</option>
                      <option value="fnb">First National Bank</option>
                      <option value="standard">Standard Bank</option>
                      <option value="barclays">Barclays Bank</option>
                      <option value="absa">ABSA Bank</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.bank && (
                      <p className="text-red-600 text-sm mt-1">{errors.bank.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Proof of Funds Document
                    </label>
                    <input
                      type="file"
                      {...register('proofOfFunds')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                    <p className="text-sm text-neutral-600 mt-1">
                      Upload a bank statement or pre-approval letter (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Terms & Conditions */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <FileText className="h-6 w-6 text-beedab-blue mr-3" />
                  <h2 className="text-2xl font-semibold text-neutral-900">Terms & Conditions</h2>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-4">Auction Terms and Conditions</h3>
                  <div className="space-y-3 text-sm text-neutral-700">
                    <p>1. All bids are binding and irrevocable once submitted.</p>
                    <p>2. The highest bidder will be declared the successful bidder.</p>
                    <p>3. A deposit of 12.5% of the purchase price must be paid immediately after the auction.</p>
                    <p>4. The balance of the purchase price must be paid within 30 days of the auction date.</p>
                    <p>5. Properties are sold "as is" without any warranties or guarantees.</p>
                    <p>6. The auctioneer reserves the right to withdraw any lot from the auction.</p>
                    <p>7. All bidders must register and provide proof of identity and financial capacity.</p>
                    <p>8. The successful bidder will be responsible for all transfer costs and fees.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
                      className="mt-1 rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                    />
                    <span className="text-sm text-neutral-700">
                      I have read and agree to the auction terms and conditions
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-600 text-sm">{errors.acceptTerms.message as string}</p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('confirmFunds', { required: 'You must confirm availability of funds' })}
                      className="mt-1 rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue"
                    />
                    <span className="text-sm text-neutral-700">
                      I confirm that I have the necessary funds available to complete the purchase
                    </span>
                  </label>
                  {errors.confirmFunds && (
                    <p className="text-red-600 text-sm">{errors.confirmFunds.message as string}</p>
                  )}
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
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Registration
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

export default BidRegistrationPage;
