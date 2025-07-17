
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Calculator, 
  Target, 
  ArrowRight,
  Activity,
  PieChart,
  Home,
  DollarSign,
  Users,
  Shield,
  CheckCircle,
  X,
  Phone,
  Mail,
  Calendar,
  Search,
  Star,
  ChevronRight,
  LineChart,
  Building,
  Percent
} from 'lucide-react';

const MarketIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [mortgageData, setMortgageData] = useState({
    propertyValue: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTerm: 30
  });

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

  // Sample market data
  const marketData = {
    totalProperties: 15420,
    averagePrice: 2100000,
    priceGrowth: 12.8,
    marketActivity: 'High',
    topAreas: ['Gaborone CBD', 'Francistown Heights', 'Maun Safari', 'Palapye Central']
  };

  const properties = [
    {
      id: 1,
      title: 'Modern Family Home',
      location: 'Gaborone CBD',
      price: 3200000,
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      type: 'House',
      status: 'For Sale',
      agent: 'Thabo Mogami',
      views: 245,
      daysOnMarket: 14
    },
    {
      id: 2,
      title: 'Luxury Apartment',
      location: 'Francistown Heights',
      price: 2800000,
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      type: 'Apartment',
      status: 'For Sale',
      agent: 'Neo Kgosana',
      views: 189,
      daysOnMarket: 7
    },
    {
      id: 3,
      title: 'Commercial Space',
      location: 'Maun Safari',
      price: 4500000,
      bedrooms: 5,
      bathrooms: 4,
      area: 320,
      type: 'Villa',
      status: 'For Sale',
      agent: 'Mpho Setlhare',
      views: 156,
      daysOnMarket: 21
    }
  ];

  const whyChooseBeedab = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      title: 'AI Property Valuations',
      description: 'Get accurate property valuations powered by machine learning and local market data.',
      features: ['Real-time price predictions', 'Comparative market analysis', 'Investment potential scoring', 'Historical trend analysis'],
      link: '/property-valuation'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: 'Market Trends',
      description: 'Access real-time market trends and price movements across Botswana regions.',
      features: ['Live market data', 'Regional comparisons', 'Growth projections', 'Market timing insights'],
      link: '/market-trends'
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-500" />,
      title: 'Neighborhood Analytics',
      description: 'Detailed insights on demographics, amenities, and growth potential by area.',
      features: ['Demographics data', 'Amenity scoring', 'Safety ratings', 'Future development plans'],
      link: '/neighborhood-analytics'
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: 'Investment Analytics',
      description: 'ROI calculations, rental yield analysis, and investment opportunity scoring.',
      features: ['ROI calculations', 'Rental yield analysis', 'Risk assessment', 'Portfolio optimization'],
      link: '/investment-analytics'
    }
  ];

  const services = [
    {
      title: 'Property Valuation',
      description: 'AI-powered property valuations with detailed market insights',
      icon: <Calculator className="w-6 h-6" />,
      price: 'Free',
      action: () => openModal('valuation')
    },
    {
      title: 'Market Analysis Report',
      description: 'Comprehensive market reports for specific areas',
      icon: <BarChart3 className="w-6 h-6" />,
      price: 'P500',
      action: () => openModal('analysis')
    },
    {
      title: 'Investment Consulting',
      description: 'Expert investment advice and portfolio planning',
      icon: <TrendingUp className="w-6 h-6" />,
      price: 'P1,500',
      action: () => openModal('consulting')
    }
  ];

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect to properties page with search query
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setActiveTab('property-details');
  };

  const calculateMortgage = () => {
    const { propertyValue, downPayment, interestRate, loanTerm } = mortgageData;
    const loanAmount = propertyValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (loanAmount <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return { monthlyPayment: '0', totalPayment: '0', totalInterest: '0' };
    }
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return {
      monthlyPayment: monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      totalPayment: (monthlyPayment * numPayments).toLocaleString('en-US', { maximumFractionDigits: 2 }),
      totalInterest: (monthlyPayment * numPayments - loanAmount).toLocaleString('en-US', { maximumFractionDigits: 2 })
    };
  };

  const scheduleViewing = (property) => {
    alert(`Scheduling viewing for ${property.title}. You will be contacted within 24 hours.`);
  };

  const contactAgent = (agent) => {
    alert(`Contacting ${agent}. They will reach out to you shortly.`);
  };

  const saveProperty = (property) => {
    alert(`${property.title} has been saved to your favorites.`);
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-beedab-blue text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const FeatureCard = ({ feature, index }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    >
      <div className="flex items-center mb-4">
        {feature.icon}
        <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{feature.description}</p>
      <div className="space-y-2 mb-4">
        {feature.features.map((item, idx) => (
          <div key={idx} className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            {item}
          </div>
        ))}
      </div>
      <Link href={feature.link}>
        <button className="w-full bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center">
          Explore Tool <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </Link>
    </motion.div>
  );

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gradient-to-r from-beedab-blue to-beedab-darkblue flex items-center justify-center">
        <Building className="w-16 h-16 text-white" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{property.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.status === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {property.location}
        </div>
        <div className="text-2xl font-bold text-beedab-blue mb-3">
          P{property.price.toLocaleString()}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.area}m²</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{property.views} views</span>
          <span>{property.daysOnMarket} days on market</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handlePropertyClick(property)}
            className="flex-1 bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={() => saveProperty(property)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );

  const Modal = ({ isOpen, onClose, type }) => {
    if (!isOpen) return null;

    const getModalContent = () => {
      switch(type) {
        case 'valuation':
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Property Valuation</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Property address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Property size (m²)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent">
                  <option>Select property type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Commercial</option>
                </select>
                <Link href="/property-valuation">
                  <button className="w-full bg-beedab-blue text-white py-3 rounded-lg hover:bg-beedab-darkblue transition-colors">
                    Get Free Valuation
                  </button>
                </Link>
              </div>
            </div>
          );
        case 'analysis':
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
              <p className="text-gray-600 mb-4">
                Get comprehensive market insights for your area of interest.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Location or area"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent">
                  <option>Analysis type</option>
                  <option>Residential Market</option>
                  <option>Commercial Market</option>
                  <option>Investment Analysis</option>
                </select>
                <Link href="/market-trends">
                  <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
                    Order Analysis - P500
                  </button>
                </Link>
              </div>
            </div>
          );
        case 'consulting':
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Investment Consulting</h2>
              <p className="text-gray-600 mb-4">
                Book a consultation with our real estate investment experts.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <textarea
                  placeholder="Tell us about your investment goals"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                />
                <Link href="/investment-analytics">
                  <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
                    Book Consultation - P1,500
                  </button>
                </Link>
              </div>
            </div>
          );
        default:
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Feature Details</h2>
              <p className="text-gray-600 mb-4">
                This feature is fully functional and ready to use. Contact our team for more information.
              </p>
              <button 
                onClick={() => contactAgent('Support Team')}
                className="bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors"
              >
                Contact Support
              </button>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {getModalContent()}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Market Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold">{marketData.totalProperties.toLocaleString()}</p>
                  </div>
                  <Home className="w-8 h-8 text-beedab-blue" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Average Price</p>
                    <p className="text-2xl font-bold">P{marketData.averagePrice.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Price Growth</p>
                    <p className="text-2xl font-bold">{marketData.priceGrowth}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Market Activity</p>
                    <p className="text-2xl font-bold">{marketData.marketActivity}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </motion.div>
            </div>

            {/* Why Choose Beedab */}
            <div>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8">
                Why Choose BeeDaB?
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyChooseBeedab.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8">
                Our Services
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center mb-4">
                      {service.icon}
                      <h3 className="text-xl font-semibold ml-3">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-beedab-blue">{service.price}</span>
                      <button 
                        onClick={service.action}
                        className="bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors"
                      >
                        Get Started
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-beedab-blue text-white py-3 px-6 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Market Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Interactive Chart</span>
                </div>
                <Link href="/market-trends">
                  <button className="mt-4 w-full bg-beedab-blue text-white py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                    View Detailed Trends
                  </button>
                </Link>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Property Distribution</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-16 h-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Interactive Chart</span>
                </div>
                <Link href="/neighborhood-analytics">
                  <button className="mt-4 w-full bg-beedab-blue text-white py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                    View Analytics
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Top Performing Areas</h3>
              <div className="space-y-4">
                {marketData.topAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">{area}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-500">+{(Math.random() * 15 + 5).toFixed(1)}%</span>
                      <Link href={`/neighborhood-analytics?area=${encodeURIComponent(area)}`}>
                        <button className="text-beedab-blue hover:text-beedab-darkblue">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'calculator':
        const mortgage = calculateMortgage();
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Mortgage Calculator</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Value (P)</label>
                  <input
                    type="number"
                    value={mortgageData.propertyValue}
                    onChange={(e) => setMortgageData({...mortgageData, propertyValue: Number(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Down Payment (P)</label>
                  <input
                    type="number"
                    value={mortgageData.downPayment}
                    onChange={(e) => setMortgageData({...mortgageData, downPayment: Number(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mortgageData.interestRate}
                    onChange={(e) => setMortgageData({...mortgageData, interestRate: Number(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Term (years)</label>
                  <input
                    type="number"
                    value={mortgageData.loanTerm}
                    onChange={(e) => setMortgageData({...mortgageData, loanTerm: Number(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Payment:</span>
                    <span className="font-bold text-beedab-blue">P{mortgage.monthlyPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Payment:</span>
                    <span className="font-bold">P{mortgage.totalPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="font-bold text-red-600">P{mortgage.totalInterest}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => alert('Pre-approval application started. You will be redirected to our partner bank.')}
                  className="flex-1 bg-beedab-blue text-white py-3 rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  Apply for Pre-approval
                </button>
                <button 
                  onClick={() => alert('Connecting you with our mortgage specialists. They will contact you within 2 hours.')}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Talk to Specialist
                </button>
              </div>
            </div>
          </div>
        );

      case 'property-details':
        if (!selectedProperty) return (
          <div className="text-center py-12">
            <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Select a property to view details</p>
          </div>
        );
        
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-beedab-blue to-beedab-darkblue flex items-center justify-center">
                <Building className="w-24 h-24 text-white" />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedProperty.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      {selectedProperty.location}
                    </div>
                    <div className="text-3xl font-bold text-beedab-blue mb-4">
                      P{selectedProperty.price.toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedProperty.status === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedProperty.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-beedab-blue">{selectedProperty.bedrooms}</div>
                    <div className="text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-beedab-blue">{selectedProperty.bathrooms}</div>
                    <div className="text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-beedab-blue">{selectedProperty.area}</div>
                    <div className="text-gray-600">Square Meters</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => scheduleViewing(selectedProperty)}
                    className="bg-beedab-blue text-white py-3 px-6 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Viewing
                  </button>
                  <button 
                    onClick={() => contactAgent(selectedProperty.agent)}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Agent
                  </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Market Insights</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Property values in this area have increased 12% this year</li>
                    <li>• Average time on market: {selectedProperty.daysOnMarket} days</li>
                    <li>• High demand for this property type</li>
                    <li>• Good investment potential with projected 8% annual growth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
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
      <section className="relative py-16 bg-gradient-to-r from-beedab-darkblue to-beedab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Market Intelligence Platform
            </h1>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-3xl mx-auto">
              AI-powered property valuations, market trends, and investment analytics tailored specifically for the Botswana property market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal('valuation')}
                className="inline-flex items-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Value My Property
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                <Activity className="mr-2 h-5 w-5" />
                View Market Trends
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="properties" label="Properties" isActive={activeTab === 'properties'} onClick={setActiveTab} />
            <TabButton id="analytics" label="Analytics" isActive={activeTab === 'analytics'} onClick={setActiveTab} />
            <TabButton id="calculator" label="Calculator" isActive={activeTab === 'calculator'} onClick={setActiveTab} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-beedab-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Make Data-Driven Property Decisions?
            </h2>
            <p className="text-xl text-beedab-lightblue mb-8 max-w-2xl mx-auto">
              Access our comprehensive market intelligence tools and stay ahead of the Botswana property market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-beedab-darkblue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => openModal('consulting')}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-beedab-darkblue transition-colors"
              >
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={closeModal} type={modalType} />
    </motion.div>
  );
};

export default MarketIntelligencePage;
