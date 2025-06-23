import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Star, 
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Share2,
  Heart,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyPropertiesPage = () => {
  const [userType, setUserType] = useState<'owner' | 'agent'>('owner');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  const stats = [
    {
      label: 'Active Listings',
      value: 3,
      icon: Home,
      change: '+2 this month',
      color: 'text-beedab-blue bg-beedab-blue/10'
    },
    {
      label: 'Total Views',
      value: 1247,
      icon: Eye,
      change: '+15% this week',
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Inquiries',
      value: 23,
      icon: MessageSquare,
      change: '+5 this week',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Average Price',
      value: 'P1.2M',
      icon: TrendingUp,
      change: 'Market average',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const properties = [
    {
      id: 1,
      title: 'Modern Family Home in Gaborone West',
      price: 1250000,
      location: 'Gaborone West',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      status: 'active',
      views: 432,
      inquiries: 8,
      daysListed: 15,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
    },
    {
      id: 2,
      title: 'Luxury Apartment in CBD',
      price: 850000,
      location: 'Gaborone CBD',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      status: 'pending',
      views: 287,
      inquiries: 12,
      daysListed: 8,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    },
    {
      id: 3,
      title: 'Spacious Townhouse in Mogoditshane',
      price: 750000,
      location: 'Mogoditshane',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      status: 'active',
      views: 528,
      inquiries: 15,
      daysListed: 22,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-neutral-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Properties</h1>
            <p className="text-neutral-600">
              Manage your property listings and track performance
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'owner' | 'agent')}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
            >
              <option value="owner">Owner Seller</option>
              <option value="agent">Agent</option>
            </select>
            
            <Link
              to="/create-listing"
              className="inline-flex items-center px-6 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Properties List */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Property Listings</h2>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {properties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full lg:w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-neutral-600 flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms} bed
                          </span>
                          <span className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms} bath
                          </span>
                          <span className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.sqft.toLocaleString()} sqft
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-beedab-blue">
                          P{property.price.toLocaleString()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Stats */}
                  <div className="flex lg:flex-col lg:items-end space-x-6 lg:space-x-0 lg:space-y-2">
                    <div className="text-center lg:text-right">
                      <p className="text-sm font-medium text-neutral-900">{property.views}</p>
                      <p className="text-xs text-neutral-500">Views</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-sm font-medium text-neutral-900">{property.inquiries}</p>
                      <p className="text-xs text-neutral-500">Inquiries</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-sm font-medium text-neutral-900">{property.daysListed}</p>
                      <p className="text-xs text-neutral-500">Days Listed</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="p-2 text-neutral-600 hover:text-beedab-blue hover:bg-beedab-blue/10 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/create-listing"
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-beedab-blue/10 rounded-full">
                <Plus className="h-6 w-6 text-beedab-blue" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-neutral-900">Add New Property</h3>
                <p className="text-neutral-600">Create a new listing</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/agent-network"
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-neutral-900">Find an Agent</h3>
                <p className="text-neutral-600">Get professional help</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/services/legal"
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-neutral-900">Legal Services</h3>
                <p className="text-neutral-600">Documentation help</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyPropertiesPage;