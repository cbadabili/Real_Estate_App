
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Building2, 
  MapPin, 
  Gavel, 
  User, 
  Menu, 
  X,
  UserCheck,
  Wrench,
  ShoppingBag,
  GraduationCap,
  ChevronDown
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMarketplaceDropdown, setShowMarketplaceDropdown] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const marketplaceItems = [
    { 
      title: 'Find a Pro', 
      description: 'Professional Services',
      path: '/marketplace/professionals',
      icon: UserCheck 
    },
    { 
      title: 'Find a Supplier', 
      description: 'Building Materials',
      path: '/marketplace/suppliers',
      icon: ShoppingBag 
    },
    { 
      title: 'Find a Trade', 
      description: 'Skilled Labor',
      path: '/marketplace/trades',
      icon: Wrench 
    },
    { 
      title: 'Find a Course', 
      description: 'Training & Upskilling',
      path: '/marketplace/courses',
      icon: GraduationCap 
    }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.png" 
                alt="BeeDab" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-beedab-blue">BeeDab</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>

            <Link
              to="/properties"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/properties') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <Building2 className="h-4 w-4 mr-1" />
              Properties
            </Link>

            <Link
              to="/plots"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/plots') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Plots
            </Link>

            <Link
              to="/rent"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/rent') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <Search className="h-4 w-4 mr-1" />
              Rent
            </Link>

            {/* Marketplace Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMarketplaceDropdown(true)}
              onMouseLeave={() => setShowMarketplaceDropdown(false)}
            >
              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname.startsWith('/marketplace')
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Marketplace
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>

              {showMarketplaceDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Find Services
                  </div>
                  {marketplaceItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <IconComponent className="h-5 w-5 text-beedab-blue mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/auctions"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/auctions') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <Gavel className="h-4 w-4 mr-1" />
              Auctions
            </Link>

            <Link
              to="/profile"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/profile') 
                  ? 'text-beedab-blue bg-beedab-blue/10' 
                  : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-beedab-blue p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>

              <Link
                to="/properties"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/properties') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="h-5 w-5 mr-2" />
                Properties
              </Link>

              <Link
                to="/plots"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/plots') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Plots
              </Link>

              <Link
                to="/rent"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/rent') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Search className="h-5 w-5 mr-2" />
                Rent
              </Link>

              {/* Mobile Marketplace */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-900 mb-2">Marketplace</div>
                {marketplaceItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-2 py-2 text-sm text-gray-600 hover:text-beedab-blue hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/auctions"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/auctions') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Gavel className="h-5 w-5 mr-2" />
                Auctions
              </Link>

              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/profile') 
                    ? 'text-beedab-blue bg-beedab-blue/10' 
                    : 'text-gray-700 hover:text-beedab-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
