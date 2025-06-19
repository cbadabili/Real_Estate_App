import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Map, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  Building2,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Map Search', href: '/map-search', icon: Map },
    ...(user ? [
      { name: 'Create Listing', href: '/create-listing', icon: PlusCircle },
      ...(user.type === 'fsbo' ? [
        { name: 'FSBO Dashboard', href: '/fsbo-dashboard', icon: BarChart3 }
      ] : []),
      ...(user.type === 'agent' ? [
        { name: 'Agent Dashboard', href: '/agent-dashboard', icon: BarChart3 }
      ] : []),
      { name: 'Profile', href: '/profile', icon: User }
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="h-16 w-16 bg-gradient-to-br from-beedab-yellow to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-beedab-darkblue font-bold text-2xl">B</span>
                </div>
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-beedab-darkblue to-beedab-yellow bg-clip-text text-transparent">BeeDab</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'bg-beedab-lightblue text-beedab-darkblue'
                      : 'text-neutral-600 hover:text-beedab-darkblue hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {!user && (
              <div className="flex items-center space-x-3 ml-4">
                <button className="text-neutral-600 hover:text-beedab-darkblue px-4 py-2 text-sm font-medium">
                  Sign In
                </button>
                <button className="bg-beedab-blue hover:bg-beedab-darkblue text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Get Started
                </button>
              </div>
            )}
            
            {user && (
              <button
                onClick={logout}
                className="text-neutral-600 hover:text-error-600 px-4 py-2 text-sm font-medium ml-4"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-beedab-darkblue p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="md:hidden overflow-hidden bg-white border-t border-neutral-200"
      >
        <div className="px-4 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-beedab-lightblue text-beedab-darkblue'
                    : 'text-neutral-600 hover:text-beedab-darkblue hover:bg-neutral-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {!user && (
            <>
              <button className="w-full text-left px-3 py-3 text-sm font-medium text-neutral-600 hover:text-beedab-darkblue">
                Sign In
              </button>
              <button className="w-full text-left px-3 py-3 text-sm font-medium bg-beedab-blue text-white rounded-lg">
                Get Started
              </button>
            </>
          )}
          
          {user && (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-3 text-sm font-medium text-error-600"
            >
              Sign Out
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;