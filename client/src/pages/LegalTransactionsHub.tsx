
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, CreditCard, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalTransactionsHub = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'legal-docs', label: 'Legal Documents', icon: FileText },
    { id: 'transactions', label: 'Secure Transactions', icon: Shield },
    { id: 'transfer', label: 'Property Transfer', icon: CreditCard },
    { id: 'compliance', label: 'Legal Compliance', icon: CheckCircle }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Process Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Legal Documentation</h3>
          </div>
          <p className="text-gray-600 mb-4">Access templates and guides for all legal documents required in Botswana real estate transactions.</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Deed of Sale templates
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Rental agreements
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              REAC compliance documents
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Secure Transactions</h3>
          </div>
          <p className="text-gray-600 mb-4">Protected transaction management with escrow services and secure payment processing.</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Escrow services
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Payment protection
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Transaction monitoring
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Transfer Process</h3>
          </div>
          <p className="text-gray-600 mb-4">Step-by-step guidance through property transfer and ownership registration.</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Title deed transfer
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Registration assistance
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Legal compliance check
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/legal-document-templates"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium text-gray-900">Get Documents</span>
          </Link>
          <Link
            to="/secure-transactions"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Shield className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-gray-900">Start Transaction</span>
          </Link>
          <Link
            to="/transfer-process"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium text-gray-900">Transfer Property</span>
          </Link>
          <Link
            to="/legal-requirements"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <CheckCircle className="h-6 w-6 text-orange-600 mr-3" />
            <span className="font-medium text-gray-900">Check Compliance</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'legal-docs':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Document Templates</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Deed of Sale', type: 'Purchase Agreement', status: 'Available' },
                { name: 'Rental Agreement', type: 'Lease Contract', status: 'Available' },
                { name: 'Power of Attorney', type: 'Legal Authorization', status: 'Available' },
                { name: 'Property Inspection Form', type: 'Assessment Document', status: 'Available' }
              ].map((doc, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal & Transactions Hub</h1>
          <p className="text-gray-600">
            Comprehensive legal support and secure transaction management for Botswana real estate
          </p>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Sections">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeSection === section.id
                        ? 'border-beedab-blue text-beedab-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Section Content */}
        <div className="min-h-[600px]">
          {renderSectionContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default LegalTransactionsHub;
