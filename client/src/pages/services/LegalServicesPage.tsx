import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  ShieldCheck, 
  Users, 
  Star, 
  Phone, 
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LegalServicesPage = () => {
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

  const lawyers = [
    {
      name: 'Motlatsi & Associates',
      specialization: 'Property Law & Conveyancing',
      rating: 4.9,
      cases: 247,
      location: 'Gaborone CBD',
      phone: '+267 318 4500',
      email: 'info@motlatsi.co.bw',
      services: ['Property Transfer', 'Contract Review', 'Title Deeds', 'REAC Compliance']
    },
    {
      name: 'Makwati Law Chambers',
      specialization: 'Real Estate & Development',
      rating: 4.8,
      cases: 189,
      location: 'Francistown',
      phone: '+267 241 2300',
      email: 'chambers@makwati.co.bw',
      services: ['Development Rights', 'Zoning Applications', 'Property Disputes', 'Commercial Leases']
    },
    {
      name: 'Dikgang Legal Services',
      specialization: 'Residential Property',
      rating: 4.7,
      cases: 312,
      location: 'Maun',
      phone: '+267 686 0150',
      email: 'legal@dikgang.co.bw',
      services: ['Home Purchases', 'Mortgage Documentation', 'Rental Agreements', 'Boundary Disputes']
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
              Legal Services for Property Transactions
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Connect with qualified lawyers and legal professionals specializing in Botswana property law and REAC compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Scale className="mr-2 h-5 w-5" />
                Book Consultation
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Legal Help
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lawyers Directory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Qualified Property Lawyers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with experienced lawyers specializing in Botswana property transactions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {lawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.name}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                    <p className="text-beedab-blue font-medium">{lawyer.specialization}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{lawyer.rating}</span>
                      <span className="text-sm text-gray-500">({lawyer.cases} cases)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {lawyer.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {lawyer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {lawyer.email}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.services.map((service, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-beedab-blue/10 text-beedab-blue text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open(`tel:${lawyer.phone}`, '_self')}
                    className="flex-1 bg-beedab-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-beedab-darkblue transition-colors"
                  >
                    Contact
                  </button>
                  <button className="flex-1 border border-beedab-blue text-beedab-blue py-2 rounded-lg text-sm font-medium hover:bg-beedab-blue hover:text-white transition-colors">
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LegalServicesPage;