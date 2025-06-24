import React, { useState } from 'react';
import { Shield, AlertTriangle, MessageSquare, Flag, Star, CheckCircle } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

interface TrustSafetyFeaturesProps {
  entityType: 'property' | 'agent' | 'landlord';
  entityId: string;
  verificationStatus: {
    verified: boolean;
    level?: 'basic' | 'premium' | 'institutional';
    documents?: string[];
    verifiedDate?: string;
  };
  className?: string;
}

/**
 * Trust & Safety Features Component
 * Implements comprehensive trust engineering system
 * Addresses the core market problem of scam prevention and user trust
 */
export const TrustSafetyFeatures: React.FC<TrustSafetyFeaturesProps> = ({
  entityType,
  entityId,
  verificationStatus,
  className = ''
}) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const handleReport = () => {
    // In real implementation, this would call the API
    console.log('Report submitted:', {
      entityType,
      entityId,
      reason: reportReason,
      details: reportDetails
    });
    
    setShowReportForm(false);
    setReportReason('');
    setReportDetails('');
    
    // Show success message
    alert('Report submitted successfully. Our team will review it within 24 hours.');
  };

  const reportReasons = [
    'Fake or misleading listing',
    'Suspected scam or fraud',
    'Unverified agent claiming verification',
    'Property does not exist',
    'Inappropriate content',
    'Duplicate listing',
    'Price manipulation',
    'Other safety concern'
  ];

  const getVerificationDetails = () => {
    const type = entityType === 'property' ? 'listing' : entityType;
    
    if (!verificationStatus.verified) {
      return {
        status: 'Unverified',
        description: `This ${entityType} has not been verified. Exercise caution and verify information independently.`,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: AlertTriangle
      };
    }

    const details = {
      listing: {
        status: 'Verified Property',
        description: 'Property documents and ownership have been verified by our team.',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: CheckCircle
      },
      agent: {
        status: 'Verified Agent',
        description: 'Agent is registered with REAC and identity has been verified.',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: Shield
      },
      landlord: {
        status: 'Verified Landlord',
        description: 'Landlord identity and property ownership have been verified.',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: CheckCircle
      }
    };

    return details[type] || details.listing;
  };

  const verificationDetails = getVerificationDetails();
  const StatusIcon = verificationDetails.icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Verification Status */}
      <div className={`border rounded-lg p-4 ${verificationDetails.color}`}>
        <div className="flex items-start gap-3">
          <StatusIcon className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{verificationDetails.status}</h4>
            <p className="text-sm mt-1">{verificationDetails.description}</p>
            
            {verificationStatus.verified && verificationStatus.verifiedDate && (
              <p className="text-xs mt-2 opacity-75">
                Verified on {verificationStatus.verifiedDate}
              </p>
            )}
          </div>
          
          <VerificationBadge
            type={entityType === 'property' ? 'listing' : entityType as any}
            verified={verificationStatus.verified}
            level={verificationStatus.level}
            showLabel={false}
          />
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Safety Guidelines
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Always verify property ownership before making payments</li>
          <li>• Meet in person and inspect the property before committing</li>
          <li>• Use our secure in-app messaging for initial communication</li>
          <li>• Report any suspicious activity immediately</li>
          <li>• Never send money before viewing the property</li>
        </ul>
      </div>

      {/* Communication Tools */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Secure Communication
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors">
            Start Secure Chat
          </button>
          <p className="text-xs text-gray-600">
            Use our monitored messaging system for safe communication. All messages are logged for your protection.
          </p>
        </div>
      </div>

      {/* Report Button */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowReportForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Flag className="h-4 w-4" />
          Report Issue
        </button>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Safety Concern</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="">Select a reason</option>
                  {reportReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  placeholder="Please provide specific details about the issue..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating System Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Community Reviews
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span>4.0 (12 reviews)</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Reviews from verified transactions help build trust in our community
        </p>
      </div>
    </div>
  );
};