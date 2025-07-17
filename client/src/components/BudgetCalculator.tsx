
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, PieChart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface BudgetCalculatorProps {
  onBudgetCalculated?: (budget: any) => void;
}

export const BudgetCalculator = ({ onBudgetCalculated }: BudgetCalculatorProps) => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    existingSavings: '',
    downPaymentPercentage: '20',
    desiredPropertyPrice: '',
    loanTerm: '25',
    interestRate: '12.5',
    otherDebts: ''
  });

  const [calculatedBudget, setCalculatedBudget] = useState<any>(null);
  const [affordabilityScore, setAffordabilityScore] = useState(0);

  const calculateBudget = () => {
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
    const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 0;
    const existingSavings = parseFloat(formData.existingSavings) || 0;
    const otherDebts = parseFloat(formData.otherDebts) || 0;
    const downPaymentPercent = parseFloat(formData.downPaymentPercentage) || 20;
    const interestRate = parseFloat(formData.interestRate) || 12.5;
    const loanTermYears = parseFloat(formData.loanTerm) || 25;

    // Calculate disposable income
    const disposableIncome = monthlyIncome - monthlyExpenses - otherDebts;
    
    // Maximum monthly payment (30% of gross income or 40% of disposable income, whichever is lower)
    const maxMonthlyPayment = Math.min(
      monthlyIncome * 0.3,
      disposableIncome * 0.4
    );

    // Calculate maximum loan amount based on monthly payment capacity
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;
    const maxLoanAmount = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate);

    // Calculate total budget (loan + down payment from savings)
    const availableForDownPayment = existingSavings * 0.8; // Keep 20% as emergency fund
    const maxPropertyPrice = maxLoanAmount + availableForDownPayment;

    // If user specified desired property price, calculate for that
    const targetPropertyPrice = parseFloat(formData.desiredPropertyPrice) || maxPropertyPrice;
    const requiredDownPayment = targetPropertyPrice * (downPaymentPercent / 100);
    const loanAmount = targetPropertyPrice - requiredDownPayment;
    
    // Calculate monthly payment for target property
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Calculate additional costs
    const transferCosts = targetPropertyPrice * 0.08; // 8% for transfer duties, legal fees, etc.
    const totalCashNeeded = requiredDownPayment + transferCosts;

    // Affordability score (0-100)
    const incomeScore = Math.min((disposableIncome / (monthlyPayment + 2000)) * 25, 25);
    const savingsScore = Math.min((existingSavings / totalCashNeeded) * 25, 25);
    const debtScore = Math.max(25 - (otherDebts / monthlyIncome) * 50, 0);
    const paymentScore = Math.max(25 - ((monthlyPayment / disposableIncome) * 50), 0);
    
    const score = Math.round(incomeScore + savingsScore + debtScore + paymentScore);

    const budget = {
      maxPropertyPrice,
      maxMonthlyPayment,
      targetPropertyPrice,
      monthlyPayment,
      requiredDownPayment,
      transferCosts,
      totalCashNeeded,
      loanAmount,
      affordabilityScore: score,
      recommendations: generateRecommendations(score, disposableIncome, existingSavings, totalCashNeeded)
    };

    setCalculatedBudget(budget);
    setAffordabilityScore(score);
    onBudgetCalculated?.(budget);
  };

  const generateRecommendations = (score: number, disposableIncome: number, savings: number, cashNeeded: number) => {
    const recommendations = [];

    if (score < 50) {
      recommendations.push({
        type: 'warning',
        title: 'Improve Financial Position',
        message: 'Consider increasing income or reducing expenses before purchasing.'
      });
    }

    if (savings < cashNeeded) {
      recommendations.push({
        type: 'info',
        title: 'Increase Savings',
        message: `You need an additional P${(cashNeeded - savings).toLocaleString()} for this purchase.`
      });
    }

    if (score >= 75) {
      recommendations.push({
        type: 'success',
        title: 'Strong Financial Position',
        message: 'You appear to be in a good position to purchase this property.'
      });
    }

    return recommendations;
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (Object.values(formData).some(value => value !== '')) {
      calculateBudget();
    }
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-beedab-blue mr-3" />
        <h2 className="text-2xl font-bold text-neutral-900">Budget Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Income (P)
              </label>
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                placeholder="25,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Expenses (P)
              </label>
              <input
                type="number"
                value={formData.monthlyExpenses}
                onChange={(e) => updateFormData('monthlyExpenses', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                placeholder="15,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Current Savings (P)
              </label>
              <input
                type="number"
                value={formData.existingSavings}
                onChange={(e) => updateFormData('existingSavings', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                placeholder="100,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Other Monthly Debts (P)
              </label>
              <input
                type="number"
                value={formData.otherDebts}
                onChange={(e) => updateFormData('otherDebts', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                placeholder="2,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Down Payment %
              </label>
              <select
                value={formData.downPaymentPercentage}
                onChange={(e) => updateFormData('downPaymentPercentage', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Loan Term (Years)
              </label>
              <select
                value={formData.loanTerm}
                onChange={(e) => updateFormData('loanTerm', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Desired Property Price (P) - Optional
            </label>
            <input
              type="number"
              value={formData.desiredPropertyPrice}
              onChange={(e) => updateFormData('desiredPropertyPrice', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              placeholder="500,000"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {calculatedBudget && (
            <>
              {/* Affordability Score */}
              <div className="bg-gradient-to-r from-beedab-lightblue to-blue-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Affordability Score</h3>
                  <div className={`text-3xl font-bold ${
                    affordabilityScore >= 75 ? 'text-green-600' : 
                    affordabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {affordabilityScore}/100
                  </div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      affordabilityScore >= 75 ? 'bg-green-500' : 
                      affordabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${affordabilityScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-beedab-blue" />
                  Budget Breakdown
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-neutral-700">Maximum Property Price</span>
                    <span className="font-bold text-green-600">P{calculatedBudget.maxPropertyPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-neutral-700">Maximum Monthly Payment</span>
                    <span className="font-bold text-blue-600">P{calculatedBudget.maxMonthlyPayment.toLocaleString()}</span>
                  </div>

                  {formData.desiredPropertyPrice && (
                    <>
                      <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-neutral-700">Required Down Payment</span>
                        <span className="font-bold text-yellow-600">P{calculatedBudget.requiredDownPayment.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-neutral-700">Transfer Costs (8%)</span>
                        <span className="font-bold text-purple-600">P{calculatedBudget.transferCosts.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-neutral-50 rounded-lg border-2 border-neutral-300">
                        <span className="text-neutral-700 font-medium">Total Cash Needed</span>
                        <span className="font-bold text-neutral-900">P{calculatedBudget.totalCashNeeded.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {calculatedBudget.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-900">Recommendations</h3>
                  {calculatedBudget.recommendations.map((rec: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      rec.type === 'success' ? 'bg-green-50 border-green-500' :
                      rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex items-start">
                        {rec.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium text-neutral-900">{rec.title}</h4>
                          <p className="text-sm text-neutral-600">{rec.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
