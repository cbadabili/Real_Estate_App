import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Shield, 
  Lock, 
  FileCheck, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Scale,
  UserCheck
} from 'lucide-react';

const SecureTransactionsPage = () => {
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

  const features = [
    {
      icon: Scale,
      title: 'REAC Compliance',
      description: 'All transactions are fully compliant with Real Estate Advisory Council regulations and Botswana property laws.',
      link: '/reac-compliance'
    },
    {
      icon: Lock,
      title: 'Secure Escrow Services',
      description: 'Protected fund holding with verified financial institutions until all transaction conditions are met.',
      link: '/escrow-services'
    },
    {
      icon: FileCheck,
      title: 'Digital Documentation',
      description: 'Secure digital signing and storage of all legal documents with blockchain verification.',
      link: '/digital-docs'
    },
    {
      icon: UserCheck,
      title: 'Identity Verification',
      description: 'Multi-layer identity verification for all parties to prevent fraud and ensure legitimate transactions.',
      link: '/identity-verification'
    }
  ];

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
              Secure Transaction Platform
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              REAC-compliant transaction processing and secure payment systems designed specifically for Botswana real estate laws and regulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/escrow-services"
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Shield className="mr-2 h-5 w-5" />
                Start Secure Transaction
              </Link>
              <Link
                to="/reac-compliance"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Scale className="mr-2 h-5 w-5" />
                Learn About REAC
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Transaction Security
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every transaction is protected by multiple layers of security and compliance with Botswana real estate regulations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-beedab-blue/20 transition-colors">
                        <Icon className="h-6 w-6 text-beedab-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-beedab-blue transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex items-center text-beedab-blue group-hover:text-beedab-darkblue transition-colors">
                          <span className="text-sm font-medium">Learn More</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Secure Your Transaction
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Identity Verification',
                description: 'All parties undergo comprehensive identity verification using official Botswana documents.'
              },
              {
                step: '02',
                title: 'Document Review',
                description: 'Legal documents are reviewed by certified professionals for REAC compliance.'
              },
              {
                step: '03',
                title: 'Secure Escrow',
                description: 'Funds are held securely in verified escrow accounts until all conditions are met.'
              },
              {
                step: '04',
                title: 'Final Transfer',
                description: 'Property ownership and funds are transferred simultaneously with full legal protection.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-beedab-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                value: 'P847M+',
                label: 'Transactions Secured'
              },
              {
                icon: Shield,
                value: '100%',
                label: 'REAC Compliant'
              },
              {
                icon: CreditCard,
                value: '2,341',
                label: 'Successful Transfers'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready for a Secure Property Transaction?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Experience the most secure and compliant property transaction platform in Botswana.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start Secure Transaction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default SecureTransactionsPage;