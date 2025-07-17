
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Eye,
  ArrowRight,
  Building,
  Key,
  DollarSign,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const TransactionManagementPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const transactionSteps = [
    {
      id: 1,
      title: 'Initial Agreement',
      description: 'Property offer accepted and initial agreement signed',
      status: 'completed',
      date: '2024-01-15',
      documents: ['Sale Agreement', 'Property Disclosure'],
      nextAction: null
    },
    {
      id: 2,
      title: 'Due Diligence',
      description: 'Property inspection, title verification, and compliance checks',
      status: 'in-progress',
      date: '2024-01-18',
      documents: ['Title Deed', 'Inspection Report', 'Municipal Clearance'],
      nextAction: 'Schedule property inspection'
    },
    {
      id: 3,
      title: 'Financing Approval',
      description: 'Mortgage application and bank approval process',
      status: 'pending',
      date: '2024-01-25',
      documents: ['Bank Application', 'Income Verification', 'Credit Report'],
      nextAction: 'Submit bank application'
    },
    {
      id: 4,
      title: 'Legal Transfer',
      description: 'Property transfer process and deed registration',
      status: 'pending',
      date: '2024-02-01',
      documents: ['Transfer Forms', 'BURS Declaration', 'Legal Certificates'],
      nextAction: 'Await previous steps completion'
    },
    {
      id: 5,
      title: 'Completion',
      description: 'Final payment, key handover, and ownership transfer',
      status: 'pending',
      date: '2024-02-15',
      documents: ['Final Statement', 'Key Handover', 'Ownership Certificate'],
      nextAction: 'Await previous steps completion'
    }
  ];

  const serviceProviders = [
    {
      name: 'Kagiso Law Firm',
      role: 'Legal Representative',
      contact: '+267 391 2345',
      email: 'legal@kagiso.co.bw',
      status: 'active'
    },
    {
      name: 'First National Bank',
      role: 'Mortgage Provider',
      contact: '+267 368 4000',
      email: 'mortgage@fnb.co.bw',
      status: 'pending'
    },
    {
      name: 'Professional Inspections BW',
      role: 'Property Inspector',
      contact: '+267 392 1567',
      email: 'inspect@probw.co.bw',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'in-progress': return <Clock className="h-5 w-5" />;
      case 'pending': return <AlertTriangle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Transaction Management
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Secure escrow services and transaction tracking from listing to closing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Shield className="mr-2 h-5 w-5" />
                Start Transaction
              </button>
              <Link
                to="/secure-transactions"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition-colors"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Security Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Transaction Overview', icon: Building },
              { id: 'timeline', name: 'Progress Timeline', icon: Clock },
              { id: 'documents', name: 'Documents', icon: FileText },
              { id: 'team', name: 'Service Team', icon: Users }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Property Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Transaction</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Property</p>
                      <p className="font-medium">3 Bedroom House, Phakalane</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Purchase Price</p>
                      <p className="font-medium">P 1,850,000</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Key className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Expected Completion</p>
                      <p className="font-medium">February 15, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Due Diligence in Progress</p>
                      <p className="text-sm text-blue-700">Property inspection scheduled for tomorrow</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Step 2 of 5
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Transaction Timeline</h3>
              
              <div className="space-y-6">
                {transactionSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {getStatusIcon(step.status)}
                    </div>
                    
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                          {step.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{step.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{step.documents.length} documents</span>
                        </div>
                      </div>
                      
                      {step.nextAction && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-yellow-800">Next Action:</p>
                          <p className="text-sm text-yellow-700">{step.nextAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Transaction Documents</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transactionSteps.flatMap(step => 
                  step.documents.map((doc, index) => (
                    <div key={`${step.id}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc}</h4>
                          <p className="text-sm text-gray-500">{step.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          <Eye className="h-4 w-4 inline mr-1" />
                          View
                        </button>
                        <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Service Provider Team</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceProviders.map((provider, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{provider.role}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{provider.contact}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{provider.email}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Contact Provider
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-blue-50 border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-2">Secure Transaction Management</h3>
            <p className="text-blue-800 max-w-3xl mx-auto mb-6">
              Your transaction is protected with bank-level security, escrow services, and full compliance with Botswana financial regulations.
            </p>
            <Link
              to="/secure-transactions"
              className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700"
            >
              Learn About Security Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TransactionManagementPage;
