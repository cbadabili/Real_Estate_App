import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '../ui/NotificationCenter';
import { RoleBasedComponent } from '../auth/ProtectedRoute';
import {
  Home,
  Search,
  MapPin,
  Gavel,
  User,
  ChevronDown,
  Menu,
  X,
  FileText,
  TrendingUp,
  Wrench,
  Building,
  Key,
  Users,
  Shield,
  Award,
  Package,
  GraduationCap,
  Handshake,
  Building2,
  FileCheck,
  PlusCircle,
  Calendar,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AISearchBar } from '../search/AISearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([100000, 2000000]);
  const location = useLocation();
  const { user, logout, isAdmin, isModerator } = useAuth();

  const postDropdownNavigation = [
    { name: 'Map Search', href: '/map-search', icon: MapPin },
    { name: 'Auctions', href: '/auctions', icon: Handshake },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="beedab Real Estate Platform"
                className="h-8 w-auto sm:h-9 md:h-10 lg:h-12 xl:h-13 flex-shrink-0"
                style={{ display: 'block' }}
                onError={(e) => {
                  console.error('Logo failed to load from /logo.png');
                  const target = e.target as HTMLImageElement;
                  // Try fallback to text
                  target.style.display = 'none';
                  const fallbackText = document.createElement('span');
                  fallbackText.textContent = 'beedab';
                  fallbackText.className = 'text-2xl font-bold text-beedab-blue';
                  target.parentNode?.appendChild(fallbackText);
                }}
              />
            </Link>
          </div>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 text-lg ml-8">
            {/* Buy Dropdown - Available to all users */}
            <div
              className="relative"
              onMouseEnter={() => setBuyDropdownOpen(true)}
              onMouseLeave={() => setBuyDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <Building2 className="h-4 w-4 text-beedab-blue" />
                <span>Buy</span>
                <ChevronDown className="h-3 w-3 text-beedab-blue" />
              </button>

              <AnimatePresence>
                {buyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-md shadow-lg border border-neutral-200 z-[9999]"
                  >
                    <div className="p-3 flex">
                      {/* Left Column - Property Types */}
                      <div className="w-1/2 pr-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Property Types</div>
                        <div className="px-1 py-1">
                        <Link
                          to="/properties"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded border-b border-gray-100 mb-1"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">All Properties</div>
                              <div className="text-xs text-gray-500">View all available properties</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=house"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Houses</div>
                              <div className="text-xs text-gray-500">Family homes & residential properties</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=apartment"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Apartments</div>
                              <div className="text-xs text-gray-500">Flats & apartment units</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=townhouse"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Townhouses</div>
                              <div className="text-xs text-gray-500">Multi-level attached homes</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=commercial"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Commercial</div>
                              <div className="text-xs text-gray-500">Offices, retail & industrial</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=farm"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Farms</div>
                              <div className="text-xs text-gray-500">Agricultural & farming properties</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/properties?type=land_plot"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Land/Plot</div>
                              <div className="text-xs text-gray-500">Build your dream property</div>
                            </div>
                          </div>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>

                        <Link
                          to="/auctions"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Handshake className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Property Auctions</div>
                              <div className="text-xs text-gray-500">Bank auctions & foreclosure sales</div>
                            </div>
                          </div>
                        </Link>
                        </div>
                      </div>

                      {/* Right Column - Buyer Journey & Professional Services */}
                      <div className="w-1/2 pl-3 border-l border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Buyer Journey</div>

                        <Link
                          to="/buyer-journey/planning"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Planning & Budgeting</div>
                              <div className="text-xs text-gray-500">Calculate affordability & get pre-approved</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/buyer-journey/searching"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Property Search</div>
                              <div className="text-xs text-gray-500">Find your perfect home with AI assistance</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/buyer-journey/viewing"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Viewing & Evaluation</div>
                              <div className="text-xs text-gray-500">Schedule viewings & neighborhood insights</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/buyer-journey/offers"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Making Offers</div>
                              <div className="text-xs text-gray-500">Negotiate & secure your property</div>
                            </div>
                          </div>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Professional Services</div>

                        <Link
                          to="/services?category=legal"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Legal Services</div>
                              <div className="text-xs text-gray-500">Lawyers & conveyancing experts</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/services/financing"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-medium">Financing Options</div>
                              <div className="text-xs text-gray-500">Banks & mortgage advisors</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            {/* Sell Dropdown - Available to all users for testing */}
            <div
              className="relative"
              onMouseEnter={() => setSellDropdownOpen(true)}
              onMouseLeave={() => setSellDropdownOpen(false)}
            >
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                  <span className="text-beedab-blue font-bold text-xs">BWP</span>
                  <span>Sell</span>
                  <ChevronDown className="h-3 w-3 text-beedab-blue" />
                </button>

              <AnimatePresence>
                {sellDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-md shadow-lg border border-neutral-200 z-[9999]"
                  >
                    <div className="p-3 flex">
                      {/* Left Column - Selling Options */}
                      <div className="w-1/2 pr-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Selling Options</div>

                        <Link
                          to="/create-listing"
                          className="block px-4 py-3 text-sm text-neutral-700 hover:bg-beedab-blue/5 rounded border border-beedab-blue/20 mb-2"
                          onClick={() => setSellDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2 text-beedab-blue" />
                            <div>
                              <div className="font-semibold">Create Listing</div>
                              <div className="text-xs text-gray-500">List your property</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/agent-network"
                          className="block px-4 py-3 text-sm text-neutral-700 hover:bg-gray-50 rounded border border-gray-200 mb-3"
                          onClick={() => setSellDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-600" />
                            <div>
                              <div className="font-semibold">Sell with Agent</div>
                              <div className="text-xs text-gray-500">Professional assistance</div>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Right Column - Seller Journey & Tools */}
                      <div className="w-1/2 pl-3 border-l border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Preparation Tools</div>

                      <Link
                        to="/market-intelligence?tab=valuation"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Home Value Assessment</div>
                            <div className="text-xs text-gray-500">Get your property valued</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/prepare-home"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Prepare Your Home</div>
                            <div className="text-xs text-gray-500">Staging and improvements</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/legal-requirements"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Legal Requirements</div>
                            <div className="text-xs text-gray-500">Documents and compliance</div>
                          </div>
                        </div>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Marketing & Sales</div>

                      <Link
                        to="/pricing-guide"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="font-bold text-base mr-2 text-beedab-blue">P</span>
                          <div>
                            <div className="font-medium">Pricing Guide</div>
                            <div className="text-xs text-gray-500">Set competitive prices</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/manage-showings"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Manage Showings</div>
                            <div className="text-xs text-gray-500">Schedule viewings</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/handle-offers"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Handshake className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Handle Offers</div>
                            <div className="text-xs text-gray-500">Review and negotiate</div>
                          </div>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Closing Process</div>

                      <Link
                        to="/transfer-process"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Transfer Process</div>
                            <div className="text-xs text-gray-500">Complete the sale</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/property-handover"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Property Handover</div>
                            <div className="text-xs text-gray-500">Transfer ownership</div>
                          </div>
                        </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rent Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setRentDropdownOpen(true)}
              onMouseLeave={() => setRentDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <Home className="h-4 w-4 text-beedab-blue" />
                <span>Rent</span>
                <ChevronDown className="h-3 w-3 text-beedab-blue" />
              </button>

              <AnimatePresence>
                {rentDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-neutral-200 z-[9999]"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">For Landlords</div>
                      <Link
                        to="/rental-listing-wizard"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">List Your Property</div>
                            <div className="text-xs text-gray-500">Rent out your property</div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/services/property-management"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Property Management</div>
                            <div className="text-xs text-gray-500">Full-service rental management</div>
                          </div>
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">For Tenants</div>
                      <Link
                        to="/rent"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Find Rental Property</div>
                            <div className="text-xs text-gray-500">Browse available rentals</div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/services/tenant-support"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Tenant Support</div>
                            <div className="text-xs text-gray-500">Rights, agreements & advice</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <Wrench className="h-4 w-4 text-beedab-blue" />
                <span>Services</span>
                <ChevronDown className="h-3 w-3 text-beedab-blue" />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-neutral-200 z-[9999]"
                  >
                    <div className="p-3 w-72">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1 mb-3">Service Categories</div>

                      <Link
                        to="/services"
                        className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 rounded mb-2"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Award className="h-5 w-5 mr-3 text-beedab-blue" />
                          <div>
                            <div className="font-semibold">Professional Services</div>
                            <div className="text-xs text-gray-500">Legal, photography, inspection, finance & insurance</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/marketplace/suppliers"
                        className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 rounded mb-2"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Package className="h-5 w-5 mr-3 text-beedab-blue" />
                          <div>
                            <div className="font-semibold">Suppliers</div>
                            <div className="text-xs text-gray-500">Building materials and supplies</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/marketplace/artisans"
                        className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 rounded mb-2"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Wrench className="h-5 w-5 mr-3 text-beedab-blue" />
                          <div>
                            <div className="font-semibold">Artisans</div>
                            <div className="text-xs text-gray-500">Skilled trades and construction</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/marketplace/training-providers"
                        className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 rounded mb-3"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 mr-3 text-beedab-blue" />
                          <div>
                            <div className="font-semibold">Training Providers</div>
                            <div className="text-xs text-gray-500">Professional development and skills training</div>
                          </div>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 pt-3">
                        <Link
                          to="/marketplace"
                          className="block px-4 py-2 text-center bg-beedab-blue text-white rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
                          onClick={() => setServicesDropdownOpen(false)}
                        >
                          Join as Service Provider
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post-dropdown Navigation */}
            {postDropdownNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-beedab-blue/10 text-beedab-blue'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-4 w-4 text-beedab-blue" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="h-10 w-10 bg-beedab-blue rounded-full flex items-center justify-center text-white font-semibold hover:bg-beedab-darkblue transition-colors"
                >
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-[9999]" style={{ zIndex: 9999 }}>
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                        <p className="text-xs text-neutral-400 capitalize">
                          {user.userType} • {user.role}
                        </p>
                      </div>
                      {/* Role-based navigation items */}
                      <RoleBasedComponent allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          My Dashboard
                        </Link>
                      </RoleBasedComponent>

                      <RoleBasedComponent allowedRoles={['seller', 'agent', 'fsbo']}>
                        <Link
                          to="/my-properties"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          My Properties
                        </Link>
                      </RoleBasedComponent>

                      <RoleBasedComponent allowedRoles={['agent']}>
                        <Link
                          to="/agent-dashboard"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <UserCheck className="h-4 w-4 mr-2 text-beedab-blue" />
                          Agent Tools
                        </Link>
                      </RoleBasedComponent>

                      <RoleBasedComponent requireModerator>
                        <Link
                          to="/moderation"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Shield className="h-4 w-4 mr-2 text-beedab-blue" />
                          Moderation
                        </Link>
                      </RoleBasedComponent>

                      <RoleBasedComponent requireAdmin>
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Gavel className="h-4 w-4 mr-2 text-beedab-blue" />
                          Admin Panel
                        </Link>
                      </RoleBasedComponent>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2 text-beedab-blue" />
                        Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 border-t border-neutral-100"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-beedab-blue" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-beedab-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-beedab-darkblue transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-neutral-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-2 space-y-1">
              {/* Post-dropdown Navigation for Mobile */}
              {postDropdownNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-beedab-blue/10 text-beedab-blue'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-beedab-blue" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Sell Section - Available to all users for testing */}
              <div className="px-3 py-2 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 mb-2">SELL</p>
                <Link
                  to="/create-listing"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  List Your Property
                </Link>
                <Link
                  to="/create-listing"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  Direct Sellers
                </Link>
              </div>

              {/* Mobile Rent Section - Available to all authenticated users */}
              <div className="px-3 py-2 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 mb-2">RENT</p>
                <Link
                  to="/rent"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  Find Rental
                </Link>
                <Link
                  to="/rental-listing-wizard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  Rent Out Property
                </Link>
              </div>

              {user ? (
                <div className="px-3 py-2 border-t border-neutral-100">
                  <p className="text-xs font-medium text-neutral-500 mb-2">ACCOUNT</p>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                  >
                    My Properties
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                  >
                    Account Settings
                  </Link>

                  {/* Admin Panel - Role-based access */}
                  <RoleBasedComponent allowedRoles={['admin', 'super_admin']}>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                    >
                      Admin Panel
                    </Link>
                  </RoleBasedComponent>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-neutral-100 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm font-medium bg-beedab-blue text-white rounded hover:bg-beedab-darkblue"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-neutral-900 mb-2">Services</div>
              <div className="space-y-1 ml-4">
                <Link
                  to="/services?section=professionals"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  👔 Find Professionals
                </Link>
                <Link
                  to="/services?section=suppliers"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🧱 Find a Supplier
                </Link>
                <Link
                  to="/services?section=artisans"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🔧 Find Artisans
                </Link>
                <Link
                  to="/services?section=training"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🎓 Training Providers
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;