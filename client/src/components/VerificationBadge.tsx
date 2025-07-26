import React from 'react';
import { Shield, CheckCircle, AlertTriangle, User } from 'lucide-react';

interface VerificationBadgeProps {
  type: 'agent' | 'landlord' | 'listing' | 'service_provider';
  verified: boolean;
  level?: 'basic' | 'premium' | 'institutional';
  className?: string;
  showLabel?: boolean;
}

/**
 * Verification Badge Component
 * Implements Pillar 1: Engineering Trust & Safety
 * Displays verification status for agents, landlords, listings, and service providers
 * Addresses the core market problem of scam prevention
 */
export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  verified,
  level = 'basic',
  className = '',
  showLabel = true
}) => {
  const getBadgeConfig = () => {
    if (!verified) {
      return {
        icon: AlertTriangle,
        color: 'text-gray-400 bg-gray-100',
        label: 'Unverified',
        description: 'Not verified'
      };
    }

    const verificationConfigs = {
      agent: {
        basic: {
          icon: Shield,
          color: 'text-blue-600 bg-blue-100',
          label: 'Verified Agent',
          description: 'REAC registered agent'
        },
        premium: {
          icon: Shield,
          color: 'text-green-600 bg-green-100',
          label: 'Premium Agent',
          description: 'REAC registered + background checked'
        },
        institutional: {
          icon: Shield,
          color: 'text-purple-600 bg-purple-100',
          label: 'Institutional Agent',
          description: 'Major real estate company'
        }
      },
      landlord: {
        basic: {
          icon: CheckCircle,
          color: 'text-blue-600 bg-blue-100',
          label: 'Verified Landlord',
          description: 'ID and ownership verified'
        },
        premium: {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          label: 'Premium Landlord',
          description: 'Full documentation verified'
        }
      },
      listing: {
        basic: {
          icon: Shield,
          color: 'text-blue-600 bg-blue-100',
          label: 'Verified Listing',
          description: 'Property documents verified'
        },
        premium: {
          icon: Shield,
          color: 'text-green-600 bg-green-100',
          label: 'Premium Verified',
          description: 'On-site inspection completed'
        }
      },
      service_provider: {
        basic: {
          icon: User,
          color: 'text-blue-600 bg-blue-100',
          label: 'Verified Provider',
          description: 'Professional credentials verified'
        },
        premium: {
          icon: User,
          color: 'text-green-600 bg-green-100',
          label: 'Premium Provider',
          description: 'Top-rated professional'
        }
      }
    };

    const config = verificationConfigs[type as keyof typeof verificationConfigs];

    return config[level as keyof typeof config] || config.basic;
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};