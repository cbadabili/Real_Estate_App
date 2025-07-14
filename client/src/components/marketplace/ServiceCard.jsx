
import React from 'react';
import { Star, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const {
    id,
    businessName,
    businessDescription,
    serviceArea,
    hourlyRate,
    rating,
    reviewCount,
    contactInfo,
    specialties,
    isVerified,
    profileImage
  } = service;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {businessName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">{businessName}</h3>
            {isVerified && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {businessDescription}
      </p>

      {/* Specialties */}
      {specialties && specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{serviceArea}</span>
        </div>
        <div className="flex items-center text-sm text-gray-900 font-medium">
          <span>From P{hourlyRate}/hour</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          View Profile
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Phone className="h-4 w-4" />
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Mail className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
