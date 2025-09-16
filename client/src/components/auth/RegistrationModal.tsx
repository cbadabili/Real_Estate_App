
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Users, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  price_bwp: number;
  interval: string;
  features: Record<string, any>;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAction?: string; // e.g., "list_property", "contact_agent", "save_listing"
  plans: Plan[];
  preSelectedPlan?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  triggerAction = "get_started",
  plans,
  preSelectedPlan
}) => {
  const { login } = useAuth();
  const [step, setStep] = useState<'register' | 'payment'>('register');
  const [selectedPlan, setSelectedPlan] = useState<string>(preSelectedPlan || 'LISTER_FREE');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    userType: 'buyer'
  });
  const [loading, setLoading] = useState(false);

  const actionTitles = {
    list_property: "List Your Property",
    contact_agent: "Contact an Agent", 
    save_listing: "Save This Listing",
    schedule_viewing: "Schedule a Viewing",
    get_started: "Choose Your Plan & Get Started"
  };

  const actionDescriptions = {
    list_property: "To list your property, you'll need an account and a suitable plan.",
    contact_agent: "To contact agents and save your conversations, you'll need an account.",
    save_listing: "To save listings and get personalized recommendations, you'll need an account.",
    schedule_viewing: "To schedule viewings and manage your appointments, you'll need an account.",
    get_started: "Create your account and choose the perfect plan for your real estate journey."
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'LISTER_FREE': return Star;
      case 'LISTER_PRO': return Zap;
      case 'LISTER_PREMIUM': return Award;
      case 'BUSINESS': return Users;
      default: return Star;
    }
  };

  const formatFeature = (key: string, value: any) => {
    const featureNames: Record<string, string> = {
      LISTING_LIMIT: 'Property Listings',
      PHOTO_LIMIT: 'Photos per Listing',
      ANALYTICS: 'Analytics Dashboard',
      HERO_SLOTS: 'Hero Carousel Slots',
      PRIORITY_RANK: 'Priority Search Ranking',
      LEAD_MANAGER: 'Lead Management',
      DIRECTORY: 'Service Directory Listing',
      BOOKING: 'Booking Widget'
    };

    const name = featureNames[key] || key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    if (value === true || value === 'true') return name;
    if (value === false || value === 'false' || !value || value === '0') return null;
    if (value === 'unlimited' || value === -1) return `Unlimited ${name}`;
    
    const num = Number(value);
    if (!isNaN(num)) {
      if (num === 0) return null;
      if (num === -1) return `Unlimited ${name}`;
      return `${num} ${name}`;
    }

    return `${value} ${name}`;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!registerResponse.ok) {
        throw new Error('Registration failed');
      }

      const userData = await registerResponse.json();
      
      // Login the user
      await login(formData.email, formData.password);

      // Subscribe to selected plan
      const subscribeResponse = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.id}`
        },
        body: JSON.stringify({
          planCode: selectedPlan,
          paymentMethod: 'bank_transfer'
        }),
      });

      const subscribeData = await subscribeResponse.json();

      if (subscribeData.success) {
        if (subscribeData.data.plan.price_bwp === 0) {
          // Free plan - immediate access
          onClose();
          window.location.reload();
        } else {
          // Paid plan - show payment instructions
          setStep('payment');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {step === 'register' ? (
            <>
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {actionTitles[triggerAction as keyof typeof actionTitles]}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {actionDescriptions[triggerAction as keyof typeof actionDescriptions]}
                    </p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleRegistration} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Registration Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        I'm a *
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      >
                        <option value="buyer">Property Buyer/Investor</option>
                        <option value="seller">Property Seller</option>
                        <option value="agent">Real Estate Agent</option>
                        <option value="fsbo">FSBO (For Sale By Owner)</option>
                      </select>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
                    
                    <div className="space-y-3">
                      {plans.map((plan) => {
                        const Icon = getPlanIcon(plan.code);
                        const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;
                        const isSelected = selectedPlan === plan.code;
                        
                        return (
                          <div
                            key={plan.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-beedab-blue bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedPlan(plan.code)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`mt-1 w-4 h-4 rounded-full border-2 ${
                                isSelected ? 'bg-beedab-blue border-beedab-blue' : 'border-gray-300'
                              }`} />
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Icon className="w-4 h-4 text-beedab-blue" />
                                  <span className="font-semibold text-gray-900">{plan.name}</span>
                                  <span className="text-sm text-gray-600">
                                    {plan.price_bwp === 0 ? 'Free' : `BWP ${plan.price_bwp}/${plan.interval}`}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                                
                                <div className="space-y-1">
                                  {Object.entries(features).map(([key, value]) => {
                                    const feature = formatFeature(key, value);
                                    if (!feature) return null;
                                    
                                    return (
                                      <div key={key} className="flex items-center text-xs text-gray-600">
                                        <Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                        {feature}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-2 pt-4 border-t">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-beedab-darkblue transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating Account...' : 'Create Account & Continue'}
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-3">
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                      {plans.find(p => p.code === selectedPlan)?.price_bwp > 0 && 
                        " You'll be asked to complete payment after registration."
                      }
                    </p>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                <p className="text-gray-600 mb-6">
                  Please complete payment to activate your {plans.find(p => p.code === selectedPlan)?.name} plan.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-2">Payment Instructions:</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Transfer BWP {plans.find(p => p.code === selectedPlan)?.price_bwp} to:
                  </p>
                  <div className="text-sm">
                    <p><strong>Bank:</strong> First National Bank of Botswana</p>
                    <p><strong>Account:</strong> Beedab Properties Ltd</p>
                    <p><strong>Number:</strong> 12345678901</p>
                    <p><strong>Reference:</strong> Your email address</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="mt-6 bg-beedab-blue text-white py-2 px-6 rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
