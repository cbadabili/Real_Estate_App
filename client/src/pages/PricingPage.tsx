
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Users, Award, Phone, Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegistrationModal } from '../components/auth/RegistrationModal';
import { apiRequest } from '../lib/queryClient';

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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [modalPlanCode, setModalPlanCode] = useState<string>('');
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
      setModalPlanCode(planCode);
      setShowRegistrationModal(true);
      return;
    }

    setSelectedPlan(planCode);

    try {
      const data = await apiRequest('/api/billing/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          planCode,
          paymentMethod: 'bank_transfer'
        }),
      });

      if (data.success) {
        if (data.data.plan.price_bwp === 0) {
          alert('Free trial activated successfully! Enjoy 30 days of Pro features.');
          window.location.reload();
        } else {
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

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'FREE_TRIAL': return Star;
      case 'PRO': return Zap;
      case 'BUSINESS': return Users;
      case 'PREMIUM': return Award;
      default: return Star;
    }
  };

  const getPlanColor = (planCode: string) => {
    switch (planCode) {
      case 'FREE_TRIAL': return 'bg-gray-50 border-gray-200';
      case 'PRO': return 'bg-blue-50 border-blue-200';
      case 'BUSINESS': return 'bg-green-50 border-green-200 ring-2 ring-green-500';
      case 'PREMIUM': return 'bg-purple-50 border-purple-200 ring-2 ring-purple-500';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getPlanBadge = (planCode: string) => {
    switch (planCode) {
      case 'BUSINESS': return { text: 'Best for Agents', color: 'bg-green-500' };
      case 'PREMIUM': return { text: 'Most Powerful', color: 'bg-purple-500' };
      default: return null;
    }
  };

  const getPlanStats = (planCode: string) => {
    switch (planCode) {
      case 'FREE_TRIAL': return 'Join 500+ sellers in Botswana';
      case 'PRO': return 'Most popular for individuals';
      case 'BUSINESS': return 'Trusted by 127 agents across Botswana';
      case 'PREMIUM': return 'Choice of top agencies • Limited availability';
      default: return '';
    }
  };

  const getVisibilityBoost = (planCode: string) => {
    switch (planCode) {
      case 'FREE_TRIAL': return 'Try Pro features free for 30 days!';
      case 'PRO': return '3x more visibility than free listings';
      case 'BUSINESS': return 'Average agents close 2-3 extra deals/month';
      case 'PREMIUM': return 'Generate 5x more leads than standard listings';
      default: return '';
    }
  };

  const formatFeature = (key: string, value: any) => {
    const featureNames: Record<string, string> = {
      LISTING_LIMIT: 'Property Listings',
      PHOTO_LIMIT: 'Photos per Listing',
      ANALYTICS: 'Analytics Dashboard',
      HERO_SLOTS: 'Hero Carousel Slots',
      PRIORITY_RANK: 'Priority Search Rankings',
      LEAD_MANAGER: 'Lead Management System',
      DIRECTORY: 'Service Directory Listing',
      BOOKING: 'Booking Widget Integration',
      FEATURED_SEARCH: 'Featured in Search Results',
      VERIFIED_BADGE: '"Verified Agent" Badge',
      SUPPORT_24H: '24-Hour Email Support',
      AGENCY_PROFILE: 'Featured Agency Profile Page',
      PREMIUM_BADGE: '"Premium Partner" Badge',
      MONTHLY_REPORTS: 'Monthly Performance Reports (PDF)',
      PRIORITY_SUPPORT: 'Priority WhatsApp/Phone Support',
      WHITE_LABEL: 'Remove BeeDab Branding',
      EARLY_ACCESS: 'First Access to New Features',
      ACCOUNT_MANAGER: 'Dedicated Account Manager',
      TRIAL_DAYS: null // Hide trial days from features list
    };

    const name = featureNames[key] || key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    // Skip features that should not be displayed
    if (name === null || !name) return null;

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

  const getButtonText = (planCode: string, isProcessing: boolean) => {
    if (isProcessing) return 'Processing...';
    
    switch (planCode) {
      case 'FREE_TRIAL': return 'Start Free Trial';
      case 'PRO': return 'Subscribe Now';
      case 'BUSINESS': return 'Go Professional';
      case 'PREMIUM': return 'Contact Sales';
      default: return 'Get Started';
    }
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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your real estate journey in Botswana. Start free, upgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.code);
            const colorClass = getPlanColor(plan.code);
            const badge = getPlanBadge(plan.code);
            const stats = getPlanStats(plan.code);
            const visibilityBoost = getVisibilityBoost(plan.code);

            const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * plan.id }}
                className={`relative bg-white rounded-lg border ${colorClass} p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full min-h-[600px]`}
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {badge.text}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-beedab-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="text-3xl font-bold text-gray-900">
                    BWP {plan.price_bwp}
                    {plan.price_bwp > 0 && (
                      <span className="text-base font-normal text-gray-500">
                        /{plan.interval}
                      </span>
                    )}
                    {plan.code === 'FREE_TRIAL' && (
                      <div className="text-sm font-normal text-gray-500 mt-1">
                        First month free
                      </div>
                    )}
                  </div>
                  {visibilityBoost && (
                    <p className="text-sm text-beedab-blue font-medium mt-2">
                      {visibilityBoost}
                    </p>
                  )}
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
                      plan.code === 'PREMIUM'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : plan.code === 'BUSINESS'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-beedab-blue text-white hover:bg-beedab-darkblue'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {selectedPlan === plan.code ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      getButtonText(plan.code, false)
                    )}
                  </button>
                  {stats && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {stats}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Solutions Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise & Bulk Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's grow together! We offer custom solutions for high-volume users, agencies, and specialized needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bulk Listing for Agencies */}
            <div className="bg-gradient-to-br from-blue-600 to-beedab-blue rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Agency Solutions</h3>
                </div>
                
                <p className="text-blue-100 mb-6 text-lg">
                  Perfect for real estate agencies, property developers, and institutional investors who need more than 100 listings.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Unlimited property listings with bulk discounts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Priority search ranking for all your properties</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Dedicated account manager & priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Custom integrations and API access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>White-label solutions available</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Enhanced analytics and reporting dashboard</span>
                  </li>
                </ul>

                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="text-xl font-semibold mb-4">Get Your Custom Quote</h4>
                  <div className="space-y-3">
                    <a 
                      href="mailto:agencies@beedab.co.bw?subject=Agency Bulk Listing Solutions" 
                      className="flex items-center p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">agencies@beedab.co.bw</div>
                        <div className="text-xs text-blue-100">Email for agency solutions</div>
                      </div>
                    </a>
                    
                    <a 
                      href="https://wa.me/26775123456?text=Hi%20BeeDab%2C%20I'm%20interested%20in%20agency%20bulk%20listing%20solutions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">WhatsApp Us</div>
                        <div className="text-xs text-blue-100">Quick chat about your needs</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            </div>

            {/* Auction Bulk Solutions */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <Award className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Auction Solutions</h3>
                </div>
                
                <p className="text-purple-100 mb-6 text-lg">
                  Specialized solutions for banks, auctioneers, and institutions with high-volume auction needs.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Bulk auction listings with live bidding support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Real-time auction management tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Automated bidder registration system</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Custom auction house branding</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Integrated payment processing</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>Compliance and legal documentation support</span>
                  </li>
                </ul>

                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="text-xl font-semibold mb-4">Schedule a Demo</h4>
                  <div className="space-y-3">
                    <a 
                      href="mailto:auctions@beedab.co.bw?subject=Auction Platform Solutions" 
                      className="flex items-center p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">auctions@beedab.co.bw</div>
                        <div className="text-xs text-purple-100">Email for auction solutions</div>
                      </div>
                    </a>
                    
                    <a 
                      href="tel:+26775654321" 
                      className="flex items-center p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Phone className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">+267 75 654 321</div>
                        <div className="text-xs text-purple-100">Direct auction solutions line</div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Auction listings count towards your plan's listing limit. 
                    Bulk solutions provide unlimited auction listings with custom pricing.
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-100 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Scale Your Business?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether you're a large agency needing bulk listings or an auction house requiring specialized tools, 
                we'll create a solution that grows with your business while maintaining priority visibility for your properties.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:enterprise@beedab.co.bw?subject=Enterprise Solutions Inquiry" 
                  className="bg-beedab-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                >
                  Get Started Today
                </a>
                <a 
                  href="tel:+26775123456" 
                  className="text-beedab-blue font-medium hover:underline"
                >
                  Or call us at +267 75 123 456
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens after my free trial ends?
              </h3>
              <p className="text-gray-600">
                After 30 days, your free trial will end. You can upgrade to Pro, Business, or Premium to continue enjoying enhanced features, or downgrade to our basic free tier with 1 listing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.
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
                Free trials are activated immediately. Paid plans are activated within 24 hours of payment verification by our admin team.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if I need more than 100 listings?
              </h3>
              <p className="text-gray-600">
                Our Premium plan includes 100 listings. For bulk listing needs above 100, we offer custom Enterprise solutions with unlimited listings, bulk discounts, and enhanced features. Contact us for a personalized quote.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          triggerAction="get_started"
          plans={plans}
          preSelectedPlan={modalPlanCode}
          planLocked={true}
        />
      </div>
    </div>
  );
};

export default PricingPage;
