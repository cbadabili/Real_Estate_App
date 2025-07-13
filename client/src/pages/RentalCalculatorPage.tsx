
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Home,
  PieChart,
  FileText,
  Info
} from 'lucide-react';

const RentalCalculatorPage = () => {
  const [formData, setFormData] = useState({
    propertyValue: '',
    monthlyRent: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    monthlyExpenses: {
      management: '',
      maintenance: '',
      insurance: '',
      taxes: '',
      other: ''
    }
  });

  const [results, setResults] = useState<any>(null);

  const calculateRentalYield = () => {
    const propertyValue = parseFloat(formData.propertyValue) || 0;
    const monthlyRent = parseFloat(formData.monthlyRent) || 0;
    const annualRent = monthlyRent * 12;
    
    const totalMonthlyExpenses = Object.values(formData.monthlyExpenses)
      .reduce((sum, expense) => sum + (parseFloat(expense) || 0), 0);
    const annualExpenses = totalMonthlyExpenses * 12;
    
    const grossYield = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0;
    const netYield = propertyValue > 0 ? ((annualRent - annualExpenses) / propertyValue) * 100 : 0;
    
    const monthlyMortgage = calculateMortgage();
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses - monthlyMortgage;
    const annualCashFlow = monthlyCashFlow * 12;
    
    const capRate = propertyValue > 0 ? ((annualRent - annualExpenses) / propertyValue) * 100 : 0;
    
    setResults({
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      monthlyCashFlow: monthlyCashFlow.toFixed(2),
      annualCashFlow: annualCashFlow.toFixed(2),
      capRate: capRate.toFixed(2),
      monthlyMortgage: monthlyMortgage.toFixed(2),
      annualRent: annualRent.toFixed(2),
      annualExpenses: annualExpenses.toFixed(2)
    });
  };

  const calculateMortgage = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const monthlyRate = (parseFloat(formData.interestRate) || 0) / 100 / 12;
    const numberOfPayments = (parseFloat(formData.loanTerm) || 0) * 12;
    
    if (principal === 0 || monthlyRate === 0 || numberOfPayments === 0) return 0;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExpenseChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [field]: value
      }
    }));
  };

  const getYieldColor = (yield: number) => {
    if (yield >= 8) return 'text-green-600';
    if (yield >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Property Calculator</h1>
          <p className="text-gray-600">
            Calculate rental yields, cash flow, and investment returns for your property
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
            
            <div className="space-y-6">
              {/* Basic Property Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Value (P)
                    </label>
                    <input
                      type="number"
                      value={formData.propertyValue}
                      onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="2,500,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Rent (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="15,000"
                    />
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment (P)
                    </label>
                    <input
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="500,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount (P)
                    </label>
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="2,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="11.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term (years)
                    </label>
                    <input
                      type="number"
                      value={formData.loanTerm}
                      onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Management (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses.management}
                      onChange={(e) => handleExpenseChange('management', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="1,500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance & Repairs (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses.maintenance}
                      onChange={(e) => handleExpenseChange('maintenance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="1,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses.insurance}
                      onChange={(e) => handleExpenseChange('insurance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Taxes (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses.taxes}
                      onChange={(e) => handleExpenseChange('taxes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Expenses (P)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses.other}
                      onChange={(e) => handleExpenseChange('other', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculateRentalYield}
                className="w-full bg-beedab-blue text-white py-3 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="h-5 w-5" />
                Calculate Returns
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Key Metrics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Analysis</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getYieldColor(parseFloat(results.grossYield))}`}>
                        {results.grossYield}%
                      </div>
                      <div className="text-sm text-gray-600">Gross Yield</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getYieldColor(parseFloat(results.netYield))}`}>
                        {results.netYield}%
                      </div>
                      <div className="text-sm text-gray-600">Net Yield</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Monthly Cash Flow</span>
                      <span className={`font-semibold ${parseFloat(results.monthlyCashFlow) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P {results.monthlyCashFlow}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Annual Cash Flow</span>
                      <span className={`font-semibold ${parseFloat(results.annualCashFlow) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P {results.annualCashFlow}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Cap Rate</span>
                      <span className="font-semibold text-beedab-blue">{results.capRate}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Monthly Mortgage</span>
                      <span className="font-semibold text-gray-900">P {results.monthlyMortgage}</span>
                    </div>
                  </div>
                </div>

                {/* Income vs Expenses */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Rental Income</span>
                      <span className="font-semibold text-green-600">P {results.annualRent}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Expenses</span>
                      <span className="font-semibold text-red-600">P {results.annualExpenses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Mortgage Payments</span>
                      <span className="font-semibold text-red-600">P {(parseFloat(results.monthlyMortgage) * 12).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Net Annual Income</span>
                        <span className={`font-bold ${parseFloat(results.annualCashFlow) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          P {results.annualCashFlow}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Tips */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Investment Guidelines</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Gross yield above 8% is considered good in Botswana</li>
                        <li>• Positive cash flow indicates a profitable investment</li>
                        <li>• Cap rate above 6% suggests strong returns</li>
                        <li>• Consider location, property condition, and market trends</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calculate Your Returns</h3>
                <p className="text-gray-600">
                  Fill in the property details to see your potential rental yields and cash flow analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalCalculatorPage;
