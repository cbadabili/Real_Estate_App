
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Shield, 
  CheckCircle, 
  Star, 
  Search,
  Filter,
  Eye,
  ArrowRight,
  Building,
  Home,
  Users,
  Gavel
} from 'lucide-react';

const LegalDocumentTemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const documentCategories = [
    { id: 'all', name: 'All Documents', icon: FileText },
    { id: 'sale', name: 'Sale Agreements', icon: Home },
    { id: 'rental', name: 'Rental Agreements', icon: Building },
    { id: 'disclosure', name: 'Disclosure Forms', icon: Shield },
    { id: 'transfer', name: 'Transfer Documents', icon: Gavel }
  ];

  const legalDocuments = [
    {
      id: 1,
      title: 'Property Sale Agreement',
      category: 'sale',
      description: 'Comprehensive sale agreement template compliant with Botswana property law',
      pages: 8,
      format: 'PDF',
      downloads: 1247,
      rating: 4.9,
      price: 'Free',
      features: ['REAC Compliant', 'Lawyer Reviewed', 'Customizable'],
      preview: true
    },
    {
      id: 2,
      title: 'Residential Lease Agreement',
      category: 'rental',
      description: 'Standard residential rental agreement for Botswana tenancies',
      pages: 6,
      format: 'PDF',
      downloads: 2156,
      rating: 4.8,
      price: 'Free',
      features: ['Tenant Rights Included', 'Dispute Resolution', 'Customizable'],
      preview: true
    },
    {
      id: 3,
      title: 'Property Disclosure Statement',
      category: 'disclosure',
      description: 'Required disclosure form for property defects and known issues',
      pages: 4,
      format: 'PDF',
      downloads: 892,
      rating: 4.7,
      price: 'Free',
      features: ['Legal Requirement', 'Comprehensive', 'Easy to Complete'],
      preview: true
    },
    {
      id: 4,
      title: 'Transfer Duty Declaration',
      category: 'transfer',
      description: 'BURS-compliant transfer duty declaration form',
      pages: 3,
      format: 'PDF',
      downloads: 1534,
      rating: 4.9,
      price: 'Free',
      features: ['BURS Approved', 'Auto-Calculate', 'Digital Signature'],
      preview: true
    },
    {
      id: 5,
      title: 'Commercial Lease Agreement',
      category: 'rental',
      description: 'Professional commercial property lease template',
      pages: 12,
      format: 'PDF',
      downloads: 456,
      rating: 4.8,
      price: 'P299',
      features: ['Business Law Compliant', 'Negotiation Terms', 'Customizable'],
      preview: true
    },
    {
      id: 6,
      title: 'Power of Attorney - Property',
      category: 'transfer',
      description: 'Legal power of attorney for property transactions',
      pages: 3,
      format: 'PDF',
      downloads: 723,
      rating: 4.6,
      price: 'P199',
      features: ['Notary Ready', 'Limited Scope', 'Revocable'],
      preview: true
    }
  ];

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : FileText;
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
              Legal Document Templates
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              Access Botswana-compliant legal documents including sale agreements, disclosure forms, and transfer documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <Download className="mr-2 h-5 w-5" />
                Browse Templates
              </button>
              <Link
                to="/services/legal"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Legal Help
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {documentCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-beedab-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocuments.map((document) => {
              const CategoryIcon = getCategoryIcon(document.category);
              return (
                <motion.div
                  key={document.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-beedab-blue/10 rounded-lg">
                          <CategoryIcon className="h-6 w-6 text-beedab-blue" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {documentCategories.find(cat => cat.id === document.category)?.name}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${document.price === 'Free' ? 'text-green-600' : 'text-beedab-blue'}`}>
                        {document.price}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{document.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>{document.pages} pages</span>
                      <span>{document.format}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{document.rating}</span>
                      </div>
                      <span>{document.downloads} downloads</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {document.features.map((feature, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      {document.preview && (
                        <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </button>
                      )}
                      <button className="flex-1 flex items-center justify-center px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 bg-yellow-50 border-t border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <Shield className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Legal Disclaimer</h3>
            <p className="text-yellow-800 max-w-3xl mx-auto">
              These templates are provided for informational purposes only and do not constitute legal advice. 
              We recommend consulting with a qualified legal professional before using any document for official transactions.
            </p>
            <Link
              to="/services/legal"
              className="inline-flex items-center mt-4 text-yellow-900 font-medium hover:text-yellow-700"
            >
              Find Legal Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default LegalDocumentTemplatesPage;
