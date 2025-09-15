
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Shield, 
  Award,
  CheckCircle,
  MessageCircle,
  Calendar,
  User,
  Building,
  Camera,
  ArrowLeft
} from 'lucide-react';

interface ServiceProvider {
  id: number;
  companyName: string;
  serviceCategory: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  address: string;
  city: string;
  rating: number;
  verified: boolean;
  featured: boolean;
  reacCertified: boolean;
  dateJoined: string;
}

interface Review {
  id: number;
  rating: number;
  review: string;
  reviewerName: string;
  reviewerAvatar?: string;
  verified: boolean;
  createdAt: string;
}

const ServiceProviderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProviderDetails();
      fetchProviderReviews();
    }
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      const response = await fetch(`/api/services/providers/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProvider(data);
      }
    } catch (error) {
      console.error('Failed to fetch provider details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`/api/services/providers/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleContact = (method: 'phone' | 'email' | 'message') => {
    if (!provider) return;

    switch (method) {
      case 'phone':
        window.location.href = `tel:+267${provider.phoneNumber}`;
        break;
      case 'email':
        window.location.href = `mailto:${provider.email}`;
        break;
      case 'message':
        setShowContactForm(true);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
          <p className="text-gray-600 mb-4">The service provider you're looking for doesn't exist.</p>
          <Link to="/services" className="text-beedab-blue hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/services"
            className="inline-flex items-center text-beedab-blue hover:text-beedab-darkblue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>

          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {provider.logoUrl ? (
                <img 
                  src={provider.logoUrl} 
                  alt={provider.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-beedab-blue flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {provider.companyName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{provider.companyName}</h1>
                {provider.verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                )}
                {provider.featured && (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              <p className="text-lg text-beedab-blue font-medium mb-2">{provider.serviceCategory}</p>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{provider.rating}</span>
                  <span>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.city}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{provider.contactPerson}</span>
                </div>
              </div>

              {provider.reacCertified && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg inline-flex">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">REAC Certified</span>
                </div>
              )}
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleContact('phone')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </button>
              <button
                onClick={() => handleContact('email')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => handleContact('message')}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {provider.companyName}</h2>
              <p className="text-gray-700 leading-relaxed">{provider.description}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reviews ({reviews.length})
              </h2>
              
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-beedab-blue"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          {review.reviewerAvatar ? (
                            <img 
                              src={review.reviewerAvatar} 
                              alt={review.reviewerName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-beedab-blue flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {review.reviewerName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{review.reviewerName}</span>
                            {review.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">+267 {provider.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{provider.email}</span>
                </div>
                {provider.websiteUrl && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a 
                      href={provider.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-beedab-blue hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{provider.address}, {provider.city}</span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Service Category</span>
                  <p className="text-gray-900">{provider.serviceCategory}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Member Since</span>
                  <p className="text-gray-900">
                    {new Date(provider.dateJoined).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-gray-900">{provider.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetailsPage;
