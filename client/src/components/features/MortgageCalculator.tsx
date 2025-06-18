import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMortgageCalculator } from '../../hooks/useMortgageCalculator';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Calculator, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface MortgageCalculatorProps {
  defaultLoanAmount?: number;
  className?: string;
}

export const MortgageCalculator = ({ defaultLoanAmount = 500000, className = '' }: MortgageCalculatorProps) => {
  const [formData, setFormData] = useState({
    loanAmount: defaultLoanAmount,
    interestRate: 6.5,
    loanTermYears: 30,
    downPayment: defaultLoanAmount * 0.2
  });

  const mortgageCalculation = useMortgageCalculator();

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    mortgageCalculation.mutate(formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-neutral-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calculator className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Mortgage Calculator</h3>
            <p className="text-neutral-600 text-sm">Calculate your monthly payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Loan Amount
            </label>
            <input
              type="number"
              value={formData.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.interestRate}
              onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="6.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Loan Term (Years)
            </label>
            <select
              value={formData.loanTermYears}
              onChange={(e) => handleInputChange('loanTermYears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={15}>15 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Down Payment
            </label>
            <input
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="100000"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={mortgageCalculation.isPending}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {mortgageCalculation.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Calculator className="h-5 w-5" />
              <span>Calculate Payment</span>
            </>
          )}
        </button>

        {mortgageCalculation.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Calculation Results
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Monthly Payment</p>
                  <p className="font-semibold text-green-800">
                    {formatCurrency(mortgageCalculation.data.monthlyPayment)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Total Interest</p>
                  <p className="font-semibold text-green-800">
                    {formatCurrency(mortgageCalculation.data.totalInterest)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {mortgageCalculation.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">
              Error: {mortgageCalculation.error.message}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};