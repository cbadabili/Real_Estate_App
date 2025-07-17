
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calculator, DollarSign, PieChart, BarChart3 } from 'lucide-react';

const InvestmentAnalyticsPage = () => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Investment Analytics</h1>
          <p className="text-gray-600">
            ROI calculations, rental yield analysis, and investment opportunity scoring
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Calculator */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Investment Calculator
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Purchase Price
                </label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Monthly Rent
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses (maintenance, insurance, etc.)
                </label>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Investment Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Investment Metrics
            </h2>
            
            <div className="space-y-6">
              <div className="bg-beedab-blue/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Net Monthly Income</span>
                  <span className={`font-bold text-lg ${metrics.netMonthlyIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.netMonthlyIncome)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-beedab-blue mb-1">
                    {metrics.rentalYield}%
                  </div>
                  <div className="text-sm text-gray-600">Rental Yield</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {metrics.cashOnCashReturn}%
                  </div>
                  <div className="text-sm text-gray-600">Cash-on-Cash Return</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Monthly Mortgage Payment</span>
                  <span className="font-medium">{formatCurrency(metrics.monthlyMortgage)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Annual ROI</span>
                  <span className="font-medium text-green-600">{metrics.annualROI}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Investment Opportunities
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  location: 'Phakalane Estate',
                  price: 2200000,
                  yield: 6.8,
                  growth: 8.2,
                  score: 85
                },
                {
                  location: 'Extension 12',
                  price: 950000,
                  yield: 9.2,
                  growth: 5.1,
                  score: 78
                },
                {
                  location: 'Tlokweng',
                  price: 1100000,
                  yield: 7.5,
                  growth: 6.8,
                  score: 82
                }
              ].map((opportunity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{opportunity.location}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(opportunity.price)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      opportunity.score >= 80 ? 'bg-green-100 text-green-800' : 
                      opportunity.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      Score: {opportunity.score}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Rental Yield: </span>
                      <span className="font-medium">{opportunity.yield}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Growth Rate: </span>
                      <span className="font-medium">{opportunity.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Risk Analysis
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Market Risk</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                  Medium
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Liquidity Risk</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                  Low
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Vacancy Risk</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                  Medium
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Interest Rate Risk</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                  High
                </span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Recommendations</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Consider areas with strong population growth</li>
                <li>• Diversify across multiple properties</li>
                <li>• Keep 3-6 months expenses as reserves</li>
                <li>• Monitor interest rate trends closely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestmentAnalyticsPage;
