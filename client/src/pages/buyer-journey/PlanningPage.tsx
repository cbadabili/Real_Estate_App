import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { BudgetCalculator } from '../../components/BudgetCalculator';
import { LoanCalculator } from '../../components/LoanCalculator';
import { Link } from 'react-router-dom';

const PlanningPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [budget, setBudget] = useState({
    income: '',
    expenses: '',
    downPayment: '',
    maxPrice: 0
  });

  const [activeTab, setActiveTab] = useState('budget');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const calculateAffordability = () => {
    const monthlyIncome = parseFloat(budget.income) || 0;
    const monthlyExpenses = parseFloat(budget.expenses) || 0;
    const downPayment = parseFloat(budget.downPayment) || 0;

    const maxMonthlyPayment = (monthlyIncome - monthlyExpenses) * 0.28;
    const maxLoanAmount = maxMonthlyPayment * 12 * 20;
    const maxPrice = maxLoanAmount + downPayment;

    setBudget(prev => ({ ...prev, maxPrice }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Planning Your Property Purchase
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Start your property journey with confidence. Get your finances in order and understand what you can afford.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('budget')}
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Budget
              </button>
              <Link
                to="/services/financing"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Get Pre-Approved
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Budget Calculator */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Affordability Calculator
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    <input
                      type="number"
                      value={budget.income}
                      onChange={(e) => setBudget(prev => ({...prev, income: e.target.value}))}
                      placeholder="15,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    <input
                      type="number"
                      value={budget.expenses}
                      onChange={(e) => setBudget(prev => ({...prev, expenses: e.target.value}))}
                      placeholder="8,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    <input
                      type="number"
                      value={budget.downPayment}
                      onChange={(e) => setBudget(prev => ({...prev, downPayment: e.target.value}))}
                      placeholder="100,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <button 
                  onClick={calculateAffordability}
                  className="w-full bg-beedab-blue text-white py-3 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                >
                  Calculate What I Can Afford
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Affordability</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maximum Property Price:</span>
                    <span className="font-bold text-2xl text-beedab-blue">
                      P {budget.maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <strong>Tip:</strong> Keep your total monthly debt payments below 28% of your gross income for healthy finances.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Property Search?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Now that you have your budget and plan, let's find your perfect property.
            </p>
            <Link
              to="/buyer-journey/searching"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start Property Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Legal Requirements Section */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Legal Requirements & Documentation</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Title Deeds</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Verify property ownership and ensure clean title transfer through the Deeds Registry.
                  </p>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Certificate of ownership</li>
                    <li>• Encumbrance verification</li>
                    <li>• Transfer documentation</li>
                  </ul>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">BURS Clearance</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Botswana Unified Revenue Service clearance for tax compliance.
                  </p>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Tax clearance certificate</li>
                    <li>• Property tax assessment</li>
                    <li>• Transfer duty payment</li>
                  </ul>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Council Approval</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Local council verification and compliance certificates.
                  </p>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Building plan approval</li>
                    <li>• Occupancy certificate</li>
                    <li>• Rates clearance</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Note:</h4>
                <p className="text-sm text-yellow-700">
                  All property transactions in Botswana require legal representation. Ensure you engage a qualified conveyancer or property lawyer to handle documentation and registration processes.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-blue-100 mb-6">
                Get personalized recommendations and connect with trusted professionals
              </p>
              <button 
                    onClick={() => navigate('/buyer-journey/planning')}
                    className="bg-beedab-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                  >
                    Start Planning Now
                  </button>
            </div>
      {/* Calculator Sections */}
      {activeSection === 'budget' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <BudgetCalculator />
        </motion.div>
      )}

      {activeSection === 'loan' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <LoanCalculator />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlanningPage;