import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  MapPin, 
  PlusCircle, 
  User, 
  Settings,
  Building2,
  ChevronDown,
  LogOut,
  Home as HomeIcon,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AISearchBar } from '../search/AISearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([100000, 2000000]);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Map Search', href: '/map-search', icon: MapPin },
  ];

  const postDropdownNavigation = [
    { name: 'My Properties', href: '/dashboard', icon: Building },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="beedab Real Estate Platform" 
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* AI Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            <AISearchBar 
              onSearch={(query, filters) => {
                console.log('Search:', query, filters);
                // Handle search logic here
              }}
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Buy Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setBuyDropdownOpen(true)}
              onMouseLeave={() => setBuyDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <Building2 className="h-4 w-4" />
                <span>Buy</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {buyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Property Types</div>
                      <Link
                        to="/properties?type=developed"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Developed Properties</div>
                            <div className="text-xs text-gray-500">Ready to move in homes & buildings</div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/properties?type=land"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Land for Development</div>
                            <div className="text-xs text-gray-500">Build your dream property</div>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Buyer Journey</div>
                      
                      <Link
                        to="/buyer-journey/planning"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-green-500" />
                          <div>
                            <div className="font-medium">Planning & Budgeting</div>
                            <div className="text-xs text-gray-500">Calculate affordability & get pre-approved</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/buyer-journey/searching"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <div>
                            <div className="font-medium">Property Search</div>
                            <div className="text-xs text-gray-500">Find your perfect home with AI assistance</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/buyer-journey/viewing"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-purple-500" />
                          <div>
                            <div className="font-medium">Viewing & Evaluation</div>
                            <div className="text-xs text-gray-500">Schedule viewings & neighborhood insights</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/buyer-journey/offers"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-orange-500" />
                          <div>
                            <div className="font-medium">Making Offers</div>
                            <div className="text-xs text-gray-500">Negotiate & secure your property</div>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Professional Services</div>
                      
                      <Link
                        to="/services/legal"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
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
                        onClick={() => setSellDropdownOpen(false)}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navigation.map((item) => {
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
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Sell Dropdown with Seller's Emotional Journey */}
            <div 
              className="relative"
              onMouseEnter={() => setSellDropdownOpen(true)}
              onMouseLeave={() => setSellDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <span className="text-beedab-blue font-bold text-xs">BWP</span>
                <span>Sell</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {sellDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Seller's Emotional Journey</div>
                      
                      <Link
                        to="/seller-journey/contemplation"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-yellow-500" />
                          <div>
                            <div className="font-medium">Contemplating the Sale</div>
                            <div className="text-xs text-gray-500">Life changes, downsizing, or investment opportunities</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/emotional-attachment"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-red-500" />
                          <div>
                            <div className="font-medium">Emotional Attachment</div>
                            <div className="text-xs text-gray-500">Letting go of memories and sentimental value</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/preparation"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-green-500" />
                          <div>
                            <div className="font-medium">Preparing for Market</div>
                            <div className="text-xs text-gray-500">Property valuation, staging, and improvements</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/anxiety"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-orange-500" />
                          <div>
                            <div className="font-medium">Market Anxiety</div>
                            <div className="text-xs text-gray-500">Pricing concerns and market timing fears</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/marketing"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-500" />
                          <div>
                            <div className="font-medium">Active Marketing</div>
                            <div className="text-xs text-gray-500">Showings, open houses, and buyer feedback</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/negotiation"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-purple-500" />
                          <div>
                            <div className="font-medium">Negotiation Stress</div>
                            <div className="text-xs text-gray-500">Offers, counteroffers, and deal uncertainty</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/seller-journey/relief"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-teal-500" />
                          <div>
                            <div className="font-medium">Sale Completion</div>
                            <div className="text-xs text-gray-500">Relief, closure, and new beginnings</div>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Selling Support</div>
                      
                      <Link
                        to="/create-listing"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">List with Agent</div>
                            <div className="text-xs text-gray-500">Professional emotional & marketing support</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/create-property"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setSellDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-beedab-blue" />
                          <div>
                            <div className="font-medium">Sell Yourself (FSBO)</div>
                            <div className="text-xs text-gray-500">Take control of your selling journey</div>
                          </div>
                        </div>
                      </Link>
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
                <HomeIcon className="h-4 w-4" />
                <span>Rent</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {rentDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">For Tenants</div>
                      <Link
                        to="/rent/search"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-2 text-blue-500" />
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
                          <User className="h-4 w-4 mr-2 text-green-500" />
                          <div>
                            <div className="font-medium">Tenant Support</div>
                            <div className="text-xs text-gray-500">Rights, agreements & advice</div>
                          </div>
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">For Landlords</div>
                      <Link
                        to="/rent/list-property"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                        onClick={() => setRentDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-purple-500" />
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
                          <Building className="h-4 w-4 mr-2 text-orange-500" />
                          <div>
                            <div className="font-medium">Property Management</div>
                            <div className="text-xs text-gray-500">Full-service rental management</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post-dropdown Navigation */}
            {postDropdownNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
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
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="h-10 w-10 bg-beedab-blue rounded-full flex items-center justify-center text-white font-semibold hover:bg-beedab-darkblue transition-colors"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-50"
                    >
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 border-t border-neutral-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
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
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
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
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Post-dropdown Navigation for Mobile */}
              {postDropdownNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
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
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="px-3 py-2 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 mb-2">SELL</p>
                <Link
                  to="/create-property"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  Agent Listing
                </Link>
                <Link
                  to="/create-listing"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                >
                  Direct Sellers
                </Link>
              </div>
              
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
                  to="/rent-out"
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
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
                  >
                    Account Settings
                  </Link>
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;