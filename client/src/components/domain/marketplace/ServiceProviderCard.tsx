// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Shield, Clock, Building2 } from 'lucide-react';

interface ServiceProviderCardProps {
  provider: {
    id: number;
    name: string;
    category: string;
    description: string;
    rating: number;
    reviewCount: number;
    location: string;
    responseTime: string;
    hourlyRate: number;
    verified: boolean;
    specialties: string[];
    phone: string;
    email: string;
  };
  onContact: (provider: any) => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onContact
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-beedab-blue rounded-full flex items-center justify-center">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-600">{provider.category}</p>
          </div>
        </div>
        {provider.verified && (
          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            <Shield className="h-3 w-3" />
            <span>Verified</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">{provider.description}</p>

      {/* Rating and Response Time */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-900">{provider.rating}</span>
          <span className="text-xs text-gray-600 ml-1">({provider.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Responds in {provider.responseTime}</span>
        </div>
      </div>

      {/* Location and Rate */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{provider.location}</span>
        </div>
        <div className="text-sm text-gray-900 font-medium">
          From P{provider.hourlyRate}/hour
        </div>
      </div>

      {/* Specialties */}
      {provider.specialties && provider.specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {specialty}
              </span>
            ))}
            {provider.specialties.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{provider.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contact Actions */}
      <div className="flex space-x-2">
        <Link 
          to={`/services/provider/${provider.id}`}
          className="flex-1 bg-beedab-blue text-white py-2 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center text-center"
        >
          View Profile
        </Link>
        <button 
          onClick={() => window.location.href = `tel:+267${provider.phoneNumber || provider.phone}`}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderCard;