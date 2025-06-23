import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { useMortgageCalculator } from '../hooks/useMortgageCalculator';
import ContextualAd from './services/ContextualAd';

const MortgageCalculatorWithAd: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(850000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [downPayment, setDownPayment] = useState<number>(85000);
  const [showAd, setShowAd] = useState(false);

  const mortgageCalculator = useMortgageCalculator();

  const handleCalculate = () => {
    mortgageCalculator.mutate({
      loanAmount: loanAmount - downPayment,
      interestRate,
      loanTermYears,
      downPayment
    }, {
      onSuccess: () => {
        setShowAd(true);
      }
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-beedab-blue/10 rounded-full mb-4">
          <Calculator className="h-8 w-8 text-beedab-blue" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Mortgage Calculator</h3>
        <p className="text-gray-600">Calculate your monthly payments and see what you can afford</p>
      </div>

      <div className="space-y-6">
        {/* Property Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Value
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              placeholder="850000"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              placeholder="85000"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {((downPayment / loanAmount) * 100).toFixed(1)}% of property value
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                placeholder="8.5"
              />
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <input
              type="number"
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              placeholder="20"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={mortgageCalculator.isPending}
          className="w-full bg-beedab-blue text-white py-4 rounded-lg font-semibold hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {mortgageCalculator.isPending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Calculator className="h-5 w-5" />
              <span>Calculate Payment</span>
            </>
          )}
        </button>

        {/* Results */}
        {mortgageCalculator.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-6 space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-900">Calculation Results</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-beedab-blue">
                  {formatCurrency(mortgageCalculator.data.monthlyPayment)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(mortgageCalculator.data.totalInterest)}
                </p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Payment Over {loanTermYears} Years</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mortgageCalculator.data.totalPayment)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Contextual Ad */}
        {showAd && (
          <ContextualAd 
            trigger="after_mortgage_calculation"
            className="mt-6"
            onClose={() => setShowAd(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MortgageCalculatorWithAd;