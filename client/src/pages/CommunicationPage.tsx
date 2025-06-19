import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Globe, 
  Users, 
  ArrowRight,
  Mic,
  FileText
} from 'lucide-react';

const CommunicationPage = () => {
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
      icon: MessageCircle,
      title: 'Multi-Language Messaging',
      description: 'Real-time messaging in English and Setswana with automatic translation features for seamless communication.',
      link: '/messaging'
    },
    {
      icon: Video,
      title: 'Video Consultations',
      description: 'High-quality video calls for property viewings, negotiations, and consultations with agents.',
      link: '/video-calls'
    },
    {
      icon: FileText,
      title: 'Document Collaboration',
      description: 'Share and collaborate on documents, contracts, and agreements in real-time with all parties.',
      link: '/document-sharing'
    },
    {
      icon: Users,
      title: 'Group Communications',
      description: 'Create communication groups for buyers, sellers, agents, and legal professionals.',
      link: '/group-chat'
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
              Instant Communication Platform
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Real-time messaging in English and Setswana, video calls, and collaboration tools for seamless property negotiations and communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/messaging"
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Messaging
              </Link>
              <Link
                to="/video-calls"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Video className="mr-2 h-5 w-5" />
                Schedule Video Call
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
              Comprehensive Communication Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to communicate effectively throughout your property journey.
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
                          <span className="text-sm font-medium">Try Feature</span>
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

      {/* Language Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Native Language Support
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Communicate naturally in your preferred language with built-in translation support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beedab-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-beedab-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">English & Setswana</h3>
                  <p className="text-gray-600">Full support for both English and Setswana with real-time translation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beedab-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="h-4 w-4 text-beedab-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Messages</h3>
                  <p className="text-gray-600">Send voice messages in your native language with automatic transcription.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beedab-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-beedab-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Translation</h3>
                  <p className="text-gray-600">Automatic translation of legal documents and contracts.</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-xl">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-beedab-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">A</div>
                    <span className="text-sm text-gray-600">Agent</span>
                  </div>
                  <p className="text-gray-900">Good morning! I have a property that matches your criteria.</p>
                  <p className="text-gray-500 text-sm mt-1">Dumelang! Ke na le polotlhomeso e e tsamaisanang le dilo tse o di batlang.</p>
                </div>
                <div className="bg-beedab-blue p-4 rounded-lg text-white ml-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-white text-beedab-blue rounded-full flex items-center justify-center text-sm font-semibold">Y</div>
                    <span className="text-sm text-beedab-lightblue">You</span>
                  </div>
                  <p>That's great! Can we schedule a viewing?</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Start Communicating Today
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Connect with agents, buyers, and sellers using our advanced communication platform.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default CommunicationPage;