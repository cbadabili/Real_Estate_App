
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  Shield, 
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Users,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

const LegalRequirementsPage = () => {
  const [activeSection, setActiveSection] = useState('buying');

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

  const legalServices = {
    buying: [
      {
        title: 'Property Title Verification',
        description: 'Verify ownership and check for encumbrances',
        requirements: ['Original title deed', 'Identity documents', 'Power of attorney if applicable'],
        cost: 'P1,500 - P3,000',
        timeframe: '5-10 business days',
        providers: [
          {
            name: 'Maitlamo & Associates',
            rating: 4.8,
            specialization: 'Property Law',
            link: '/services/legal/title-verification/maitlamo'
          },
          {
            name: 'Botswana Legal Chambers',
            rating: 4.9,
            specialization: 'Real Estate Law',
            link: '/services/legal/title-verification/blc'
          }
        ]
      },
      {
        title: 'Transfer of Property',
        description: 'Legal transfer process and deed registration',
        requirements: ['Sale agreement', 'Transfer forms', 'Compliance certificates'],
        cost: 'P3,000 - P8,000',
        timeframe: '14-21 business days',
        providers: [
          {
            name: 'Kagiso Law Firm',
            rating: 4.7,
            specialization: 'Property Transfers',
            link: '/services/legal/property-transfer/kagiso'
          },
          {
            name: 'Setlhabi Legal Services',
            rating: 4.6,
            specialization: 'Conveyancing',
            link: '/services/legal/property-transfer/setlhabi'
          }
        ]
      },
      {
        title: 'Due Diligence',
        description: 'Comprehensive property and legal checks',
        requirements: ['Property inspection report', 'Financial statements', 'Municipal clearances'],
        cost: 'P2,500 - P5,000',
        timeframe: '7-14 business days',
        providers: [
          {
            name: 'Gaborone Legal Advisory',
            rating: 4.8,
            specialization: 'Due Diligence',
            link: '/services/legal/due-diligence/gla'
          }
        ]
      }
    ],
    selling: [
      {
        title: 'Sales Agreement Preparation',
        description: 'Drafting legally compliant sale agreements',
        requirements: ['Property details', 'Sale conditions', 'Disclosure statements'],
        cost: 'P1,200 - P2,500',
        timeframe: '2-5 business days',
        providers: [
          {
            name: 'Francistown Legal Partners',
            rating: 4.7,
            specialization: 'Contract Law',
            link: '/services/legal/sales-agreement/flp'
          }
        ]
      },
      {
        title: 'Compliance Certification',
        description: 'Ensure property meets all legal requirements',
        requirements: ['Building plans approval', 'Municipal compliance', 'Environmental clearance'],
        cost: 'P800 - P2,000',
        timeframe: '10-15 business days',
        providers: [
          {
            name: 'Compliance Solutions BW',
            rating: 4.5,
            specialization: 'Regulatory Compliance',
            link: '/services/legal/compliance/csbw'
          }
        ]
      }
    ],
    renting: [
      {
        title: 'Lease Agreement Drafting',
        description: 'Comprehensive rental agreements',
        requirements: ['Property details', 'Rental terms', 'Tenant requirements'],
        cost: 'P500 - P1,500',
        timeframe: '1-3 business days',
        providers: [
          {
            name: 'Rental Law Specialists',
            rating: 4.6,
            specialization: 'Tenancy Law',
            link: '/services/legal/lease-agreement/rls'
          }
        ]
      },
      {
        title: 'Tenant Rights & Obligations',
        description: 'Legal consultation on rental rights',
        requirements: ['Lease agreement', 'Rental history', 'Dispute documentation'],
        cost: 'P300 - P800',
        timeframe: '1-2 business days',
        providers: [
          {
            name: 'Tenant Advisory Services',
            rating: 4.4,
            specialization: 'Tenant Rights',
            link: '/services/legal/tenant-rights/tas'
          }
        ]
      }
    ]
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Legal Requirements & Services
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Navigate Botswana property law with confidence. Connect with certified legal professionals for all your real estate needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            {[
              { key: 'buying', label: 'Buying Property', icon: Scale },
              { key: 'selling', label: 'Selling Property', icon: FileText },
              { key: 'renting', label: 'Rental Properties', icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-beedab-blue text-white'
                    : 'text-gray-600 hover:text-beedab-blue hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Services Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {legalServices[activeSection as keyof typeof legalServices].map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Cost Range</p>
                            <p className="font-medium">{service.cost}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Timeframe</p>
                            <p className="font-medium">{service.timeframe}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Providers</p>
                            <p className="font-medium">{service.providers.length} Available</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Required Documents:</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {service.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Available Legal Providers:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {service.providers.map((provider, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{provider.name}</h5>
                            <div className="flex items-center space-x-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <CheckCircle 
                                    key={i} 
                                    className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{provider.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{provider.specialization}</p>
                          <Link
                            to={provider.link}
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors text-sm font-medium"
                          >
                            Contact Provider
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Legal Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Emergency Legal Support
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need immediate legal assistance? Our emergency legal support team is available 24/7.
            </p>
          </motion.div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency Legal Hotline</h3>
            <p className="text-red-700 mb-4">Available 24/7 for urgent property legal matters</p>
            <Link
              to="/services/legal/emergency"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Contact Emergency Legal Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LegalRequirementsPage;
