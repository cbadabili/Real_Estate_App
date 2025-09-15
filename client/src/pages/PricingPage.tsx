import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Users, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  price_bwp: number;
  interval: string;
  features: Record<string, any>;
  is_active: boolean;
}

const PricingPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/billing/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planCode: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setSelectedPlan(planCode);

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planCode,
          paymentMethod: 'bank_transfer'
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.plan.price_bwp === 0) {
          alert('Free plan activated successfully!');
          window.location.reload();
        } else {
          // Show payment instructions modal
          showPaymentModal(data.data.paymentInstructions);
        }
      } else {
        alert(`Subscription failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setSelectedPlan(null);
    }
  };

  const showPaymentModal = (instructions: any) => {
    const modalContent = `
      Payment Instructions:

      Amount: BWP ${instructions.amount}
      Reference: ${instructions.reference}

      Bank Details:
      ${instructions.details.bankName}
      Account: ${instructions.details.accountName}
      Number: ${instructions.details.accountNumber}
      Branch: ${instructions.details.branchCode}

      IMPORTANT: 
      1. Include the reference number in your payment
      2. After payment, our admin team will verify and approve your transaction
      3. Your subscription will be activated within 24 hours of approval
      4. You will receive email confirmation once activated

      For questions, contact support with your reference number.
    `;
    alert(modalContent);
  };

  const getUpdatedDescription = (planCode: string) => {
    switch (planCode) {
      case 'LISTER_FREE':
        return 'Perfect for first-time property listings';
      case 'LISTER_PRO':
        return 'For casual property listings with more exposure';
      case 'BUSINESS':
        return 'For contractors, artisans, and property service providers';
      case 'LISTER_PREMIUM':
        return 'For serious sellers and investors who want maximum visibility';
      default:
        return 'Select your plan';
    }
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

  const getPlanColor = (planCode: string) => {
    switch (planCode) {
      case 'LISTER_FREE': return 'bg-gray-100 border-gray-200';
      case 'LISTER_PRO': return 'bg-blue-50 border-blue-200';
      case 'LISTER_PREMIUM': return 'bg-purple-50 border-purple-200 ring-2 ring-purple-500';
      case 'BUSINESS': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
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

    // Handle boolean values
    if (value === true || value === 'true') {
      return name;
    }

    // Handle false or empty values
    if (value === false || value === 'false' || !value || value === '0') {
      return null;
    }

    // Handle unlimited
    if (value === 'unlimited' || value === -1) {
      return `Unlimited ${name}`;
    }

    // Handle numeric values
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const num = Number(value);
      if (num === 0) return null;
      if (num === -1) return `Unlimited ${name}`;
      return `${num} ${name}`;
    }

    return `${value} ${name}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your real estate needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.code);
            const colorClass = getPlanColor(plan.code);
            const isPopular = plan.code === 'LISTER_PREMIUM';
            const isBusiness = plan.code === 'BUSINESS';
            const isPremium = plan.code === 'LISTER_PREMIUM';
            
            // Parse features if they're stored as JSON string
            const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;

            // Get badge text based on plan
            const getBadge = () => {
              if (isPremium) return 'Best for visibility';
              if (isBusiness) return 'Best for teams & tools';
              return null;
            };

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * plan.id }}
                className={`relative bg-white rounded-lg border ${colorClass} p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full min-h-[600px]`}
              >
                {(isPopular || isBusiness) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${isPremium ? 'bg-purple-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {getBadge()}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-beedab-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                    {(plan.code === 'LISTER_FREE' || plan.code === 'LISTER_PRO' || plan.code === 'LISTER_PREMIUM') && ' (Plan)'}
                    {plan.code === 'BUSINESS' && ' (Agents & Providers)'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {getUpdatedDescription(plan.code)}
                  </p>
                  <div className="text-3xl font-bold text-gray-900">
                    BWP {plan.price_bwp}
                    {plan.price_bwp > 0 && (
                      <span className="text-base font-normal text-gray-500">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-grow">
                  {Object.entries(features).map(([key, value]) => {
                    const feature = formatFeature(key, value);
                    if (!feature) return null;

                    return (
                      <div key={key} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleSubscribe(plan.code)}
                    disabled={selectedPlan === plan.code}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isPopular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-beedab-blue text-white hover:bg-beedab-darkblue'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                  {selectedPlan === plan.code ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : plan.price_bwp === 0 ? (
                    'Get Started Free'
                  ) : (
                    'Subscribe Now'
                  )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept bank transfers and mobile money payments (Orange Money, Mascom MyZaka).
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does it take to activate my subscription?
              </h3>
              <p className="text-gray-600">
                Free plans are activated immediately. Paid plans are activated within 24 hours of payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;