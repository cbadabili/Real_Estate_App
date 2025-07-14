import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Star } from 'lucide-react';

interface ContextualAdProps {
  trigger: string;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface AdData {
  id: number;
  adTitle: string;
  adCopy: string;
  adImageUrl?: string;
  ctaText: string;
  ctaUrl?: string;
  provider: {
    id: number;
    companyName: string;
    rating: string;
    reviewCount: number;
    verified: boolean;
    reacCertified: boolean;
  };
}

export const ContextualAd: React.FC<ContextualAdProps> = ({ 
  trigger, 
  className = '', 
  onClose, 
  showCloseButton = true 
}) => {
  const [ad, setAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // For testing, don't check session storage initially
    const fetchAd = async () => {
      try {
        console.log('Fetching ad for trigger:', trigger);
        const response = await fetch(`/api/ads/contextual/${trigger}`);
        console.log('Ad response status:', response.status);
        if (response.ok) {
          const adData = await response.json();
          console.log('Ad data received:', adData);
          setAd(adData);
          setIsVisible(true);

          // Mark this ad as shown
          const updatedShownAds = [...shownAds, trigger];
          sessionStorage.setItem('shownContextualAds', JSON.stringify(updatedShownAds));
          setHasBeenShown(true);
        }
      } catch (error) {
        console.error('Failed to fetch contextual ad:', error);
      }
    };

    fetchAd();
  }, [trigger]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCTAClick = async () => {
    if (ad) {
      // Track click
      try {
        await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to track ad click:', error);
      }

      // Navigate to CTA URL or provider page
      const url = ad.ctaUrl || `/services/provider/${ad.provider.id}`;
      window.open(url, '_blank');
    }
  };

  if (!ad || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`bg-white border border-beedab-blue/20 rounded-lg shadow-lg p-4 relative ${className}`}
      >
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-start space-x-4">
          {ad.adImageUrl && (
            <img
              src={ad.adImageUrl}
              alt={ad.adTitle}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {ad.adTitle}
              </h4>
              {ad.provider.verified && (
                <span className="text-beedab-blue text-xs">✓</span>
              )}
              {ad.provider.reacCertified && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-1 rounded">
                  REAC
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {ad.adCopy}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{ad.provider.companyName}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{ad.provider.rating}</span>
                  <span>({ad.provider.reviewCount})</span>
                </div>
              </div>

              <button
                onClick={handleCTAClick}
                className="bg-beedab-blue text-white px-3 py-1 rounded text-sm font-medium hover:bg-beedab-darkblue transition-colors flex items-center space-x-1"
              >
                <span>{ad.ctaText}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextualAd;