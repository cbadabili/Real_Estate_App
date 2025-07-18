
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle, Clock, AlertCircle, Download,
  Shield, Scale, Building, Users, Calendar, Phone,
  MessageCircle, Award, Key, DollarSign
} from 'lucide-react';

const TransferProcessPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [processStep, setProcessStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const properties = [
    {
      id: '1',
      title: 'Modern 3BR House in Phakalane',
      address: '123 Phakalane Drive',
      buyer: 'John Smith',
      saleDate: '2024-01-15',
      transferDate: '2024-02-15'
    },
    {
      id: '2',
      title: 'Family Home in Extension 15',
      address: '456 Extension 15',
      buyer: 'Mike Brown',
      saleDate: '2024-01-10',
      transferDate: '2024-02-10'
    }
  ];

  const transferSteps = [
    {
      title: 'Sale Agreement Execution',
      description: 'Finalize and execute the sale agreement with all parties',
      items: [
        'Sale agreement signed by all parties',
        'Purchase price confirmed',
        'Transfer date agreed upon',
        'Special conditions documented',
        'Deposit payment confirmed',
        'Estate agent commission agreed'
      ]
    },
    {
      title: 'Legal Documentation',
      description: 'Prepare and verify all legal documents for transfer',
      items: [
        'Title deed verification completed',
        'Rates clearance certificate obtained',
        'BURS transfer duty declaration',
        'Municipal clearance certificate',
        'Tribal Land Board consent (if applicable)',
        'Environmental clearance (if required)'
      ]
    },
    {
      title: 'Financial Arrangements',
      description: 'Complete all financial arrangements and approvals',
      items: [
        'Mortgage approval finalized',
        'Transfer duty calculated and paid',
        'Legal fees quoted and agreed',
        'Bank guarantee provided',
        'Insurance arranged',
        'Transfer costs budgeted'
      ]
    },
    {
      title: 'Registration Process',
      description: 'Submit documents to Deeds Registry for registration',
      items: [
        'Transfer documents submitted',
        'Deeds Registry fees paid',
        'Registration number obtained',
        'Transfer approved by Registrar',
        'New title deed issued',
        'Ownership officially transferred'
      ]
    },
    {
      title: 'Transfer Completion',
      description: 'Complete the legal transfer and final settlements',
      items: [
        'Purchase price paid in full',
        'Legal costs settled',
        'Keys and documents handed over',
        'Utility transfers completed',
        'Transfer certificate issued',
        'Post-transfer compliance completed'
      ]
    }
  ];

  const requiredDocuments = [
    {
      category: 'Property Documents',
      items: [
        'Original Title Deed',
        'Survey Diagram',
        'Municipal Clearance Certificate',
        'Rates Clearance Certificate',
        'Building Plans (if applicable)',
        'Environmental Clearance (if required)'
      ]
    },
    {
      category: 'Legal Documents',
      items: [
        'Sale Agreement',
        'Transfer Documents',
        'BURS Transfer Duty Declaration',
        'Power of Attorney (if applicable)',
        'Consent from Tribal Land Board (if applicable)',
        'Sectional Title Documents (if applicable)'
      ]
    },
    {
      category: 'Financial Documents',
      items: [
        'Bank Guarantee',
        'Mortgage Approval Letter',
        'Proof of Transfer Duty Payment',
        'Insurance Documents',
        'Financial Statements',
        'Proof of Source of Funds'
      ]
    },
    {
      category: 'Identification',
      items: [
        'Identity Documents (all parties)',
        'Marriage Certificates (if applicable)',
        'Company Registration (if company purchase)',
        'Tax Clearance Certificates',
        'Passport Photos',
        'Proof of Address'
      ]
    }
  ];

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getCompletionPercentage = () => {
    const totalItems = transferSteps.reduce((sum, step) => sum + step.items.length, 0);
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Property Transfer Process
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Navigate the legal transfer process with confidence and compliance
          </p>
        </div>

        {/* Property Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Select Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProperty === property.id
                    ? 'border-beedab-blue bg-beedab-blue/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <h3 className="font-semibold text-neutral-900 mb-2">{property.title}</h3>
                <p className="text-neutral-600 text-sm mb-2">{property.address}</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Buyer: {property.buyer}</span>
                  <span>Transfer: {property.transferDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProperty && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Transfer Progress */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900">Transfer Progress</h2>
                  <div className="text-sm text-neutral-600">
                    {Math.round(getCompletionPercentage())}% Complete
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-beedab-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {transferSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= processStep 
                            ? 'bg-beedab-blue text-white' 
                            : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {index < processStep ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                          <p className="text-neutral-600 text-sm mb-3">{step.description}</p>
                          <div className="space-y-2">
                            {step.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`step-${index}-item-${itemIndex}`}
                                  checked={checkedItems[`step-${index}-item-${itemIndex}`] || false}
                                  onChange={() => handleCheckItem(`step-${index}-item-${itemIndex}`)}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                                />
                                <label
                                  htmlFor={`step-${index}-item-${itemIndex}`}
                                  className="text-sm text-neutral-700 cursor-pointer"
                                >
                                  {item}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {index < transferSteps.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-8 bg-neutral-200"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setProcessStep(Math.max(0, processStep - 1))}
                    disabled={processStep === 0}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setProcessStep(Math.min(transferSteps.length - 1, processStep + 1))}
                    disabled={processStep === transferSteps.length - 1}
                    className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Required Documents</h2>
                
                <div className="space-y-6">
                  {requiredDocuments.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="font-semibold text-neutral-900 mb-3">{category.category}</h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${category.category}-${itemIndex}`}
                              checked={checkedItems[`${category.category}-${itemIndex}`] || false}
                              onChange={() => handleCheckItem(`${category.category}-${itemIndex}`)}
                              className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                            />
                            <label
                              htmlFor={`${category.category}-${itemIndex}`}
                              className="text-sm text-neutral-700 cursor-pointer"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Checklist
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Document Manager
                  </button>
                  <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Scale className="h-4 w-4 mr-2" />
                    Legal Support
                  </button>
                </div>
              </div>

              {/* Legal Team */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Legal Team</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-neutral-600" />
                    <span className="text-neutral-700">Kagiso Law Firm</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Lawyer
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Sale Agreement</span>
                    <span className="text-sm font-medium">Jan 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Transfer Date</span>
                    <span className="text-sm font-medium">Feb 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Registration</span>
                    <span className="text-sm font-medium text-orange-600">Pending</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Transfer Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Ensure all documents are certified copies</li>
                  <li>• Pay transfer duty before registration</li>
                  <li>• Keep original receipts for all payments</li>
                  <li>• Verify property boundaries with survey</li>
                  <li>• Check for any existing bonds or liens</li>
                  <li>• Confirm utility account transfers</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferProcessPage;
