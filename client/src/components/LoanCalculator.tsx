import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Percent, Calendar, TrendingUp, ExternalLink, Star } from 'lucide-react';

interface FinancialInstitution {
  id: string;
  name: string;
  logo: string;
  baseRate: number;
  maxLoanTerm: number;
  maxLTV: number;
  processingFee: number;
  rating: number;
  specialOffers: string[];
  website: string;
}

const partnerInstitutions: FinancialInstitution[] = [
  {
    id: 'fnb',
    name: 'FNB Botswana',
    logo: '/api/placeholder/100/50',
    baseRate: 11.5,
    maxLoanTerm: 30,
    maxLTV: 90,
    processingFee: 0.5,
    rating: 4.2,
    specialOffers: ['First-time buyer discount', 'Professional rate'],
    website: 'https://www.fnbbotswana.co.bw'
  },
  {
    id: 'stanbic',
    name: 'Stanbic Bank',
    logo: '/api/placeholder/100/50',
    baseRate: 12.0,
    maxLoanTerm: 25,
    maxLTV: 85,
    processingFee: 0.75,
    rating: 4.0,
    specialOffers: ['Low deposit options', 'Quick approval'],
    website: 'https://www.stanbicbank.co.bw'
  },
  {
    id: 'absa',
    name: 'ABSA Botswana',
    logo: '/api/placeholder/100/50',
    baseRate: 11.8,
    maxLoanTerm: 30,
    maxLTV: 95,
    processingFee: 0.6,
    rating: 4.1,
    specialOffers: ['Graduate program', 'Flexi payments'],
    website: 'https://www.absa.co.bw'
  },
  {
    id: 'standard',
    name: 'Standard Chartered',
    logo: '/api/placeholder/100/50',
    baseRate: 12.5,
    maxLoanTerm: 25,
    maxLTV: 80,
    processingFee: 1.0,
    rating: 3.9,
    specialOffers: ['Priority banking rates', 'International clients'],
    website: 'https://www.sc.com/bw'
  }
];

interface LoanCalculatorProps {
  propertyPrice?: number;
  onCalculationChange?: (calculation: any) => void;
}

export const LoanCalculator = ({ propertyPrice = 0, onCalculationChange }: LoanCalculatorProps) => {
  const [formData, setFormData] = useState({
    propertyPrice: propertyPrice.toString(),
    downPayment: '',
    loanTerm: '25',
    selectedBank: '',
    monthlyIncome: ''
  });

  const [calculations, setCalculations] = useState<any[]>([]);
  const [bestRate, setBestRate] = useState<FinancialInstitution | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(formData.propertyPrice) || 0;
    const downPaymentAmount = parseFloat(formData.downPayment) || 0;
    const loanAmount = price - downPaymentAmount;
    const termYears = parseInt(formData.loanTerm) || 25;
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;

    if (loanAmount <= 0) return;

    const results = partnerInstitutions.map(bank => {
      const ltv = (loanAmount / price) * 100;
      const isEligible = ltv <= bank.maxLTV && termYears <= bank.maxLoanTerm;

      let interestRate = bank.baseRate;

      // Adjust rate based on LTV
      if (ltv > 85) interestRate += 0.5;
      if (ltv > 90) interestRate += 0.25;

      // Apply special offers
      if (monthlyIncome > 50000 && bank.specialOffers.includes('Professional rate')) {
        interestRate -= 0.5;
      }

      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = termYears * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

      const processingFeeAmount = loanAmount * (bank.processingFee / 100);
      const totalInterest = (monthlyPayment * totalPayments) - loanAmount;
      const totalCost = loanAmount + totalInterest + processingFeeAmount;

      // Affordability check
      const maxAffordablePayment = monthlyIncome * 0.3;
      const isAffordable = monthlyPayment <= maxAffordablePayment;

      return {
        bank,
        loanAmount,
        interestRate,
        monthlyPayment,
        totalInterest,
        totalCost,
        processingFeeAmount,
        ltv,
        isEligible,
        isAffordable,
        affordabilityRatio: monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0
      };
    }).filter(calc => calc.isEligible).sort((a, b) => a.monthlyPayment - b.monthlyPayment);

    setCalculations(results);

    if (results.length > 0) {
      setBestRate(results[0].bank);
      onCalculationChange?.(results[0]);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (formData.propertyPrice && formData.downPayment && formData.loanTerm) {
      calculateLoan();
    }
  }, [formData]);

  useEffect(() => {
    if (propertyPrice > 0) {
      setFormData(prev => ({ ...prev, propertyPrice: propertyPrice.toString() }));
    }
  }, [propertyPrice]);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 text-beedab-blue mr-3" />
          <h2 className="text-2xl font-bold text-neutral-900">Loan Calculator</h2>
        </div>
        {bestRate && (
          <div className="text-sm text-green-600 font-medium">
            Best Rate: {bestRate.name} - {partnerInstitutions.find(b => b.id === bestRate.id)?.baseRate}%
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Property Price (P)
          </label>
          <input
            type="number"
            value={formData.propertyPrice}
            onChange={(e) => updateFormData('propertyPrice', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
            placeholder="500,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Down Payment (P)
          </label>
          <input
            type="number"
            value={formData.downPayment}
            onChange={(e) => updateFormData('downPayment', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
            placeholder="100,000"
          />
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
      </div>

      {/* Results */}
      {calculations.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-neutral-900">Loan Comparison</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculations.map((calc, index) => (
              <motion.div
                key={calc.bank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-6 ${
                  index === 0 ? 'border-green-500 bg-green-50' : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={calc.bank.logo}
                      alt={calc.bank.name}
                      className="w-12 h-6 object-contain"
                    />
                    <div>
                      <h4 className="font-semibold text-neutral-900">{calc.bank.name}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(calc.bank.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-neutral-600 ml-1">{calc.bank.rating}</span>
                      </div>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Best Rate
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Interest Rate</span>
                    <span className="font-semibold text-beedab-blue">{calc.interestRate.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Monthly Payment</span>
                    <span className="font-bold text-lg">P{calc.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Interest</span>
                    <span className="text-neutral-900">P{calc.totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Processing Fee</span>
                    <span className="text-neutral-900">P{calc.processingFeeAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <span className="text-neutral-600">Total Cost</span>
                    <span className="font-bold">P{calc.totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>

                  {/* Affordability indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Affordability</span>
                      <span className={calc.isAffordable ? 'text-green-600' : 'text-red-600'}>
                        {calc.affordabilityRatio.toFixed(1)}% of income
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          calc.isAffordable ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(calc.affordabilityRatio, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Special offers */}
                  {calc.bank.specialOffers.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-neutral-600 mb-1">Special Offers:</div>
                      {calc.bank.specialOffers.map((offer: any, i: number) => (
                        <div key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mr-1 mb-1">
                          {offer}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => window.open(calc.bank.website, '_blank')}
                      className="flex-1 bg-beedab-blue text-white py-2 px-3 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Apply Now
                    </button>
                    <button className="px-3 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {calculations.length === 0 && formData.propertyPrice && formData.downPayment && (
        <div className="text-center py-8 text-neutral-600">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
          <p>Enter your details above to see loan options from our partner banks.</p>
        </div>
      )}
    </div>
  );
};