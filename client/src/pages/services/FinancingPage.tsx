import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, CheckCircle, Phone, ArrowLeft } from 'lucide-react';

const FinancingPage = () => {
  const navigate = useNavigate();
  const [propertyPrice, setPropertyPrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTerm, setLoanTerm] = useState(25);

  const calculateMortgage = () => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;
    
    if (principal <= 0 || monthlyRate <= 0) {
      return { monthlyPayment: 0, totalInterest: 0 };
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalInterest = (monthlyPayment * numPayments) - principal;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  const mortgageCalculation = calculateMortgage();

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

  const banks = [
    {
      name: 'First National Bank Botswana',
      type: 'Commercial Bank',
      mortgageRate: '10.5%',
      maxLTV: '90%',
      location: 'Multiple Branches',
      phone: '+267 370 4000',
      email: 'mortgages@fnbbotswana.co.bw',
      features: ['First-time buyer programs', 'Construction loans', 'Refinancing options', 'Fast pre-approval']
    },
    {
      name: 'Standard Chartered Bank',
      type: 'International Bank',
      mortgageRate: '10.25%',
      maxLTV: '85%',
      location: 'Gaborone & Major Centers',
      phone: '+267 360 1200',
      email: 'home.loans@sc.com',
      features: ['Expatriate financing', 'Premium banking rates', 'Flexible terms', 'Investment property loans']
    },
    {
      name: 'BBS Limited',
      type: 'Building Society',
      mortgageRate: '9.75%',
      maxLTV: '95%',
      location: 'Nationwide',
      phone: '+267 395 3000',
      email: 'info@bbs.co.bw',
      features: ['High LTV ratios', 'Government employee rates', 'Rural property financing', 'Savings-linked mortgages']
    }
  ];

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
          {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-beedab-blue hover:text-beedab-darkblue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Previous Page
          </button>
        </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Property Financing Solutions
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Connect with leading banks and financial institutions in Botswana for home loans, construction financing, and investment property funding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Calculator className="mr-2 h-5 w-5" />
                Loan Calculator
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors">
                <CheckCircle className="mr-2 h-5 w-5" />
                Get Pre-Approved
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Mortgage Calculator
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    <input
                      type="number"
                      placeholder="500,000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    <input
                      type="number"
                      placeholder="50,000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="10.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 10.5)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={25}>25 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">P {(propertyPrice - downPayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-semibold text-beedab-blue">P {mortgageCalculation.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium">P {mortgageCalculation.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payment:</span>
                    <span className="font-medium">P {(mortgageCalculation.monthlyPayment * loanTerm * 12).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banks Directory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partner Financial Institutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Work with trusted banks and lenders across Botswana.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {banks.map((bank) => (
              <motion.div
                key={bank.name}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{bank.name}</h3>
                  <p className="text-beedab-blue font-medium">{bank.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-beedab-blue">{bank.mortgageRate}</div>
                    <div className="text-xs text-gray-600">Interest Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-beedab-blue">{bank.maxLTV}</div>
                    <div className="text-xs text-gray-600">Max LTV</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {bank.phone}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-beedab-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-beedab-darkblue transition-colors">
                    Apply Now
                  </button>
                  <button className="flex-1 border border-beedab-blue text-beedab-blue py-2 rounded-lg text-sm font-medium hover:bg-beedab-blue hover:text-white transition-colors">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default FinancingPage;