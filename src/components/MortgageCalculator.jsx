import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Info } from 'lucide-react';

const MortgageCalculator = ({ propertyPrice = 0, className = '' }) => {
  const [inputs, setInputs] = useState({
    propertyPrice: propertyPrice,
    downPayment: propertyPrice * 0.1, // 10% default
    interestRate: 11.75, // Current Bank of Botswana prime rate
    loanTerm: 20, // Years
    monthlyIncome: 0,
    monthlyExpenses: 0
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalAmount: 0,
    affordablePrice: 0
  });

  const [activeTab, setActiveTab] = useState('calculate');

  // Botswana bank interest rates (current market rates)
  const bankRates = [
    { bank: 'First National Bank Botswana', rate: 11.75, type: 'Prime' },
    { bank: 'Stanbic Bank Botswana', rate: 12.25, type: 'Home Loan' },
    { bank: 'Absa Bank Botswana', rate: 11.95, type: 'Home Loan' },
    { bank: 'Standard Chartered', rate: 12.50, type: 'Home Loan' },
    { bank: 'BancABC Botswana', rate: 12.00, type: 'Home Loan' }
  ];

  useEffect(() => {
    if (propertyPrice !== inputs.propertyPrice) {
      setInputs(prev => ({
        ...prev,
        propertyPrice: propertyPrice,
        downPayment: propertyPrice * 0.1
      }));
    }
  }, [propertyPrice]);

  useEffect(() => {
    calculateMortgage();
    calculateAffordability();
  }, [inputs]);

  const calculateMortgage = () => {
    const { propertyPrice, downPayment, interestRate, loanTerm } = inputs;
    
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (loanAmount <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      setResults(prev => ({
        ...prev,
        monthlyPayment: 0,
        totalInterest: 0,
        totalAmount: 0
      }));
      return;
    }

    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalAmount = monthlyPayment * numPayments;
    const totalInterest = totalAmount - loanAmount;

    setResults(prev => ({
      ...prev,
      monthlyPayment,
      totalInterest,
      totalAmount
    }));
  };

  const calculateAffordability = () => {
    const { monthlyIncome, monthlyExpenses, interestRate, loanTerm } = inputs;
    
    // Conservative approach: 30% of net income for housing
    const netIncome = monthlyIncome - monthlyExpenses;
    const maxMonthlyPayment = netIncome * 0.3;
    
    if (maxMonthlyPayment <= 0) {
      setResults(prev => ({ ...prev, affordablePrice: 0 }));
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    // Calculate maximum loan amount
    const maxLoanAmount = maxMonthlyPayment * 
      (Math.pow(1 + monthlyRate, numPayments) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    
    // Add 10% down payment to get total affordable price
    const affordablePrice = maxLoanAmount / 0.9;
    
    setResults(prev => ({ ...prev, affordablePrice }));
  };

  const updateInput = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return `BWP ${amount.toLocaleString('en-BW', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-beedab-blue text-white p-6">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6" />
          <div>
            <h3 className="text-xl font-semibold">Mortgage Calculator</h3>
            <p className="text-blue-100 text-sm">Calculate your monthly payments and affordability</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setActiveTab('calculate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'calculate'
                ? 'bg-white text-beedab-blue'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Calculate Payment
          </button>
          <button
            onClick={() => setActiveTab('afford')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'afford'
                ? 'bg-white text-beedab-blue'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            What Can I Afford?
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'calculate' && (
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Price (BWP)
                </label>
                <input
                  type="number"
                  value={inputs.propertyPrice || ''}
                  onChange={(e) => updateInput('propertyPrice', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="850000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment (BWP)
                </label>
                <input
                  type="number"
                  value={inputs.downPayment || ''}
                  onChange={(e) => updateInput('downPayment', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="85000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {((inputs.downPayment / inputs.propertyPrice) * 100 || 0).toFixed(1)}% of property price
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <select
                  value={inputs.interestRate}
                  onChange={(e) => updateInput('interestRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                >
                  {bankRates.map(rate => (
                    <option key={rate.bank} value={rate.rate}>
                      {rate.rate}% - {rate.bank}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (Years)
                </label>
                <select
                  value={inputs.loanTerm}
                  onChange={(e) => updateInput('loanTerm', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-beedab-blue">
                    {formatCurrency(results.monthlyPayment)}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Payment</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatCurrency(results.totalInterest)}
                  </div>
                  <div className="text-sm text-gray-600">Total Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatCurrency(results.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'afford' && (
          <div className="space-y-6">
            {/* Income & Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (BWP)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyIncome || ''}
                  onChange={(e) => updateInput('monthlyIncome', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="15000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses (BWP)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyExpenses || ''}
                  onChange={(e) => updateInput('monthlyExpenses', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="8000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include all monthly expenses (food, transport, insurance, etc.)
                </p>
              </div>
            </div>

            {/* Affordability Results */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Affordability Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(results.affordablePrice)}
                  </div>
                  <div className="text-sm text-gray-600">Maximum Affordable Price</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatCurrency((inputs.monthlyIncome - inputs.monthlyExpenses) * 0.3)}
                  </div>
                  <div className="text-sm text-gray-600">Recommended Monthly Payment</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Calculation basis:</strong> We recommend spending no more than 30% of your net income on housing. 
                    This includes mortgage payment, property taxes, and insurance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Contact Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Ready to Apply?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors">
              <DollarSign className="h-4 w-4" />
              Get Pre-Approval
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp className="h-4 w-4" />
              Contact Loan Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;