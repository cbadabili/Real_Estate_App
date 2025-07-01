import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, MapPin, PlusCircle, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="BeeDaB Real Estate Platform" 
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-beedab-blue">BeeDaB</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-base">
            <Link to="/properties" className="text-neutral-600 hover:text-neutral-900">Properties</Link>
            <Link to="/plots" className="text-neutral-600 hover:text-neutral-900">Plots</Link>
            <Link to="/map-search" className="text-neutral-600 hover:text-neutral-900">Map Search</Link>
            <Link to="/create-listing" className="text-neutral-600 hover:text-neutral-900">Create Listing</Link>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button className="p-2 text-neutral-600 hover:text-neutral-900">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/login" className="bg-beedab-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-beedab-darkblue transition-colors">
              Sign In
            </Link>
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
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 py-2 space-y-1">
            <Link to="/properties" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
              Properties
            </Link>
            <Link to="/plots" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
              Plots
            </Link>
            <Link to="/map-search" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
              Map Search
            </Link>
            <Link to="/create-listing" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
              Create Listing
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;