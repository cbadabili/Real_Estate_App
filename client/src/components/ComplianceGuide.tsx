import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building,
  Gavel,
  CreditCard
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  timeframe: string;
  authority: string;
  cost?: string;
  documents: string[];
  steps: string[];
}

interface ComplianceGuideProps {
  propertyType: 'residential' | 'commercial' | 'land';
  transactionType: 'buy' | 'sell' | 'rent';
  className?: string;
}

/**
 * Feature: Legal Compliance Guide
 * Addresses pain point: Complex legal requirements and compliance procedures in Botswana
 * Provides step-by-step guidance for property transactions and legal compliance
 */
export const ComplianceGuide: React.FC<ComplianceGuideProps> = ({
  propertyType,
  transactionType,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  // Mock compliance requirements based on Botswana property law
  const getComplianceItems = (): ComplianceItem[] => {
    const baseItems: ComplianceItem[] = [
      {
        id: 'title_verification',
        title: 'Title Deed Verification',
        description: 'Verify ownership and check for any encumbrances or restrictions',
        required: true,
        completed: false,
        timeframe: '5-10 business days',
        authority: 'Deeds Registry',
        cost: 'P50 - P200',
        documents: ['Original title deed', 'Identity document', 'Power of attorney (if applicable)'],
        steps: [
          'Obtain certified copy of title deed from Deeds Registry',
          'Verify seller\'s identity matches deed',
          'Check for any liens, mortgages, or restrictions',
          'Confirm property boundaries and description'
        ]
      },
      {
        id: 'tribal_clearance',
        title: 'Tribal Land Board Clearance',
        description: 'Required for customary land transactions',
        required: propertyType === 'land',
        completed: false,
        timeframe: '14-30 business days',
        authority: 'Tribal Land Board',
        cost: 'P100 - P500',
        documents: ['Application form', 'Identity document', 'Proof of citizenship', 'Site plan'],
        steps: [
          'Submit application to relevant Tribal Land Board',
          'Attend land board hearing if required',
          'Pay prescribed fees',
          'Obtain clearance certificate'
        ]
      },
      {
        id: 'planning_permission',
        title: 'Planning Permission Verification',
        description: 'Verify existing developments comply with planning regulations',
        required: true,
        completed: false,
        timeframe: '7-14 business days',
        authority: 'Local Council/Town Planning',
        cost: 'P200 - P1,000',
        documents: ['Building plans', 'Completion certificate', 'Occupation certificate'],
        steps: [
          'Check approved building plans with council',
          'Verify completion and occupation certificates',
          'Ensure no unauthorized developments',
          'Obtain planning compliance certificate'
        ]
      },
      {
        id: 'rate_clearance',
        title: 'Rates and Taxes Clearance',
        description: 'Ensure all municipal rates and taxes are paid',
        required: true,
        completed: false,
        timeframe: '3-5 business days',
        authority: 'Local Council',
        cost: 'Outstanding amount + P50',
        documents: ['Rate account', 'Proof of payment', 'Property valuation'],
        steps: [
          'Obtain current rates statement',
          'Pay all outstanding amounts',
          'Request rates clearance certificate',
          'Update property ownership records'
        ]
      }
    ];

    // Add transaction-specific items
    if (transactionType === 'buy') {
      baseItems.push({
        id: 'transfer_duty',
        title: 'Transfer Duty Assessment',
        description: 'Calculate and pay transfer duty to BURS',
        required: true,
        completed: false,
        timeframe: '5-7 business days',
        authority: 'Botswana Unified Revenue Service (BURS)',
        cost: '5% of property value',
        documents: ['Sale agreement', 'Property valuation', 'Transfer duty form'],
        steps: [
          'Complete transfer duty declaration form',
          'Submit to BURS with supporting documents',
          'Pay calculated transfer duty',
          'Obtain transfer duty receipt'
        ]
      });
    }

    if (transactionType === 'sell') {
      baseItems.push({
        id: 'capital_gains',
        title: 'Capital Gains Tax',
        description: 'Assess and pay capital gains tax if applicable',
        required: true,
        completed: false,
        timeframe: '30 days after sale',
        authority: 'BURS',
        cost: 'Varies based on gain',
        documents: ['Purchase records', 'Sale agreement', 'Improvement receipts'],
        steps: [
          'Calculate capital gains/loss',
          'Complete capital gains tax return',
          'Submit to BURS within 30 days',
          'Pay any tax due'
        ]
      });
    }

    if (propertyType === 'commercial') {
      baseItems.push({
        id: 'business_license',
        title: 'Business License Compliance',
        description: 'Ensure proper business licensing for commercial property',
        required: true,
        completed: false,
        timeframe: '10-14 business days',
        authority: 'Local Council/BURS',
        cost: 'P500 - P5,000',
        documents: ['Business license', 'Fire certificate', 'Health certificate'],
        steps: [
          'Verify current business license',
          'Check fire safety compliance',
          'Ensure health and safety certificates',
          'Update business registration if needed'
        ]
      });
    }

    return baseItems.filter(item => item.required);
  };

  const complianceItems = getComplianceItems();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleCompleted = (itemId: string) => {
    setCompletedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const completedCount = complianceItems.filter(item => 
    completedItems.includes(item.id)
  ).length;

  const progressPercentage = (completedCount / complianceItems.length) * 100;

  const getAuthorityIcon = (authority: string) => {
    if (authority.includes('Registry') || authority.includes('BURS')) return <Building className="h-4 w-4" />;
    if (authority.includes('Board') || authority.includes('Council')) return <Gavel className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6" />
          <div>
            <h3 className="text-lg font-semibold">Legal Compliance Guide</h3>
            <p className="text-green-100 text-sm capitalize">
              {transactionType} • {propertyType} Property
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Compliance Progress</span>
            <span>{completedCount}/{complianceItems.length} Complete</span>
          </div>
          <div className="bg-green-400 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {complianceItems.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const isCompleted = completedItems.includes(item.id);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Item Header */}
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCompleted(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="h-4 w-4" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        {item.required && !isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                      
                      {/* Quick Info */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getAuthorityIcon(item.authority)}
                          <span>{item.authority}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.timeframe}</span>
                        </div>
                        {item.cost && (
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-3 w-3" />
                            <span>{item.cost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-4 space-y-4">
                        {/* Required Documents */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            Required Documents
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.documents.map((doc, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Steps */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Process Steps</h5>
                          <ol className="text-sm text-gray-600 space-y-2">
                            {item.steps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center justify-center font-medium">
                                  {index + 1}
                                </span>
                                <span className="flex-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 mb-1">Need Legal Assistance?</h5>
              <p className="text-xs text-blue-800 mb-2">
                Complex property transactions may require professional legal advice. 
                Consider consulting with a qualified property lawyer.
              </p>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                <span>Find Legal Services</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceGuide;