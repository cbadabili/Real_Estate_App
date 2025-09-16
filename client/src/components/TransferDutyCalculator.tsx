
import React, { useState } from 'react';
import { Calculator, Info, DollarSign } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface TransferDutyResult {
  propertyValue: number;
  transferDuty: number;
  stampDuty: number;
  registrationFees: number;
  legalFees: number;
  totalCosts: number;
  breakdown: {
    label: string;
    amount: number;
    description: string;
  }[];
}

const TransferDutyCalculator: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [citizenship, setCitizenship] = useState<'citizen' | 'non_citizen'>('citizen');
  const [firstTimeHomeBuyer, setFirstTimeHomeBuyer] = useState(false);
  const [result, setResult] = useState<TransferDutyResult | null>(null);

  const calculateTransferDuty = () => {
    const value = parseFloat(propertyValue);
    if (!value || value <= 0) return;

    let transferDuty = 0;
    let stampDuty = 0;
    let registrationFees = 0;
    let legalFees = 0;

    // Transfer Duty Calculation (as of 2024 Botswana rates)
    if (citizenship === 'citizen') {
      if (firstTimeHomeBuyer && value <= 1000000) {
        // First P1M exempt for first-time citizens
        transferDuty = 0;
      } else {
        const taxableAmount = firstTimeHomeBuyer ? Math.max(0, value - 1000000) : value;
        
        if (taxableAmount <= 1000000) {
          transferDuty = taxableAmount * 0.05; // 5%
        } else if (taxableAmount <= 2000000) {
          transferDuty = 50000 + (taxableAmount - 1000000) * 0.08; // 8% above P1M
        } else {
          transferDuty = 50000 + 80000 + (taxableAmount - 2000000) * 0.10; // 10% above P2M
        }
      }
    } else {
      // Non-citizens pay higher rates
      if (value <= 1000000) {
        transferDuty = value * 0.10; // 10%
      } else if (value <= 2000000) {
        transferDuty = 100000 + (value - 1000000) * 0.15; // 15% above P1M
      } else {
        transferDuty = 100000 + 150000 + (value - 2000000) * 0.20; // 20% above P2M
      }
    }

    // Stamp Duty (1% of property value)
    stampDuty = value * 0.01;

    // Registration Fees (approximately 0.1% of property value, minimum P200)
    registrationFees = Math.max(200, value * 0.001);

    // Legal Fees (estimated at 1-2% of property value)
    legalFees = value * 0.015;

    const totalCosts = transferDuty + stampDuty + registrationFees + legalFees;

    const breakdown = [
      {
        label: 'Transfer Duty',
        amount: transferDuty,
        description: citizenship === 'citizen' 
          ? (firstTimeHomeBuyer ? 'Citizen rates with first-time buyer exemption' : 'Citizen rates applied')
          : 'Non-citizen rates applied'
      },
      {
        label: 'Stamp Duty',
        amount: stampDuty,
        description: '1% of property value'
      },
      {
        label: 'Registration Fees',
        amount: registrationFees,
        description: 'Property registration with Deeds Office'
      },
      {
        label: 'Legal Fees (Est.)',
        amount: legalFees,
        description: 'Estimated conveyancing and legal costs'
      }
    ];

    const calculationResult: TransferDutyResult = {
      propertyValue: value,
      transferDuty,
      stampDuty,
      registrationFees,
      legalFees,
      totalCosts,
      breakdown
    };

    setResult(calculationResult);

    // Track analytics
    analytics.calculatorUsed('transfer_duty', {
      property_value: value,
      citizenship,
      first_time_buyer: firstTimeHomeBuyer,
      total_costs: totalCosts
    });
  };

  const handleReset = () => {
    setPropertyValue('');
    setCitizenship('citizen');
    setFirstTimeHomeBuyer(false);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <Calculator className="h-6 w-6 text-beedab-blue mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Transfer Duty Calculator</h2>
          </div>
          <p className="text-gray-600">
            Calculate transfer duty and associated costs for property purchases in Botswana
          </p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Value (BWP)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="e.g., 2500000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Citizenship Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="citizenship"
                      value="citizen"
                      checked={citizenship === 'citizen'}
                      onChange={(e) => setCitizenship(e.target.value as 'citizen' | 'non_citizen')}
                      className="text-beedab-blue focus:ring-beedab-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">Botswana Citizen</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="citizenship"
                      value="non_citizen"
                      checked={citizenship === 'non_citizen'}
                      onChange={(e) => setCitizenship(e.target.value as 'citizen' | 'non_citizen')}
                      className="text-beedab-blue focus:ring-beedab-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">Non-Citizen</span>
                  </label>
                </div>
              </div>

              {citizenship === 'citizen' && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={firstTimeHomeBuyer}
                      onChange={(e) => setFirstTimeHomeBuyer(e.target.checked)}
                      className="text-beedab-blue focus:ring-beedab-blue rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">First-time home buyer</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    First P1,000,000 exempt from transfer duty
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={calculateTransferDuty}
                  disabled={!propertyValue}
                  className="flex-1 bg-beedab-blue text-white py-3 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {result ? (
                <div className="space-y-6">
                  <div className="bg-beedab-blue/5 border border-beedab-blue/20 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Total Transfer Costs</h3>
                    <div className="text-3xl font-bold text-beedab-blue">
                      BWP {result.totalCosts.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      For property value of BWP {result.propertyValue.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Cost Breakdown</h4>
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{item.label}</span>
                          <span className="font-semibold text-gray-900">
                            BWP {item.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Important Notes:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Legal fees are estimates and may vary by law firm</li>
                          <li>• Additional costs may include property valuation and bond registration</li>
                          <li>• Rates are based on current Botswana tax legislation</li>
                          <li>• Consult with a qualified lawyer for accurate legal advice</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Enter property details to calculate transfer costs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferDutyCalculator;
