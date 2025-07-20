
import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, AlertTriangle } from 'lucide-react';

interface InvestmentAnalyzerProps {
  className?: string;
}

const InvestmentAnalyzer: React.FC<InvestmentAnalyzerProps> = ({ className }) => {
  const [propertyPrice, setPropertyPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [monthlyRent, setMonthlyRent] = useState(8500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000);

  const calculateMetrics = () => {
    const loanAmount = propertyPrice - downPayment;
    const monthlyMortgage = (loanAmount * 0.08) / 12; // Assuming 8% interest
    const netMonthlyIncome = monthlyRent - monthlyExpenses - monthlyMortgage;
    const annualROI = ((netMonthlyIncome * 12) / downPayment) * 100;
    const rentalYield = ((monthlyRent * 12) / propertyPrice) * 100;
    const cashOnCashReturn = ((netMonthlyIncome * 12) / downPayment) * 100;

    return {
      monthlyMortgage: Math.round(monthlyMortgage),
      netMonthlyIncome: Math.round(netMonthlyIncome),
      annualROI: Math.round(annualROI * 100) / 100,
      rentalYield: Math.round(rentalYield * 100) / 100,
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100
    };
  };

  const metrics = calculateMetrics();
  const formatCurrency = (amount: number) => `BWP ${amount.toLocaleString()}`;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Calculator className="h-5 w-5 mr-2 text-purple-600" />
        Investment Analyzer
      </h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Property Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Purchase Price (BWP)
            </label>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment (BWP)
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Monthly Rent (BWP)
            </label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Expenses (BWP)
            </label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Investment Metrics</h3>
          
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-gray-700">Net Monthly Income</span>
                </div>
                <span className={`font-bold text-lg ${metrics.netMonthlyIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.netMonthlyIncome)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">Annual ROI</span>
                </div>
                <span className={`font-bold text-lg ${metrics.annualROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.annualROI}%
                </span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700">Rental Yield</span>
                </div>
                <span className="font-bold text-lg text-green-600">
                  {metrics.rentalYield}%
                </span>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-gray-700">Cash-on-Cash Return</span>
                </div>
                <span className={`font-bold text-lg ${metrics.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.cashOnCashReturn}%
                </span>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          {metrics.netMonthlyIncome < 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Warning:</strong> This investment shows negative cash flow. 
                  Consider adjusting your parameters or exploring other opportunities.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalyzer;
