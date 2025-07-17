import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { MapPin, Ruler, Phone, MessageCircle, Zap, Droplets, CheckCircle } from 'lucide-react';

interface PlotListingCardProps {
  plot: PlotListing;
  onContact: (contactInfo: ContactInfo) => void;
  className?: string;
}

export interface PlotListing {
  id: string;
  title: string;
  location: string;
  size: number;
  sizeUnit: 'm²' | 'hectares';
  price: number;
  currency: 'BWP' | 'USD';
  plotType: 'residential' | 'farm' | 'commercial';
  hasWater: boolean;
  hasElectricity: boolean;
  serviced: boolean;
  description: string;
  contactPhone: string;
  contactWhatsApp?: string;
  sellerName: string;
  images: string[];
  postedDate: string;
  featured?: boolean;
}

export interface ContactInfo {
  phone: string;
  whatsapp?: string;
  sellerName: string;
  plotTitle: string;
}

/**
 * Plot Listing Card Component
 * Displays key details matching Facebook marketplace format:
 * Location, Size, Price, Amenities, Contact info with WhatsApp integration
 * Visual badges for "Serviced" or "Unserviced" status
 */
export const PlotListingCard: React.FC<PlotListingCardProps> = ({
  plot,
  onContact,
  className = ""
}) => {
  const { t } = useTranslation();
  
  const getPlotTypeColor = (type: string) => {
    switch (type) {
      case 'residential':
        return 'bg-blue-100 text-blue-800';
      case 'commercial':
        return 'bg-purple-100 text-purple-800';
      case 'farm':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  const formatSize = (size: number, unit: string) => {
    return `${size.toLocaleString()} ${unit}`;
  };

  const handlePhoneCall = () => {
    window.open(`tel:${plot.contactPhone}`, '_self');
    onContact({
      phone: plot.contactPhone,
      whatsapp: plot.contactWhatsApp,
      sellerName: plot.sellerName,
      plotTitle: plot.title
    });
  };

  const handleWhatsApp = () => {
    const message = `Hi ${plot.sellerName}, I'm interested in your plot: ${plot.title} in ${plot.location}. Price: ${formatPrice(plot.price, plot.currency)}`;
    const whatsappNumber = plot.contactWhatsApp || plot.contactPhone;
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/267${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    onContact({
      phone: plot.contactPhone,
      whatsapp: plot.contactWhatsApp,
      sellerName: plot.sellerName,
      plotTitle: plot.title
    });
  };

  const getPlotTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-blue-100 text-blue-800';
      case 'farm': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border ${plot.featured ? 'border-beedab-blue border-2' : 'border-gray-200'} ${className}`}>
      {/* Featured Badge */}
      {plot.featured && (
        <div className="bg-beedab-blue text-white px-3 py-1 text-xs font-medium rounded-t-lg">
          Featured Listing
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{plot.title}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{plot.location}</span>
            </div>
          </div>
          
          {/* Service Status Badge */}
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              plot.serviced
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {plot.serviced ? t('plot_status.serviced') : t('plot_status.unserviced')}
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Ruler className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">
              {formatSize(plot.size, plot.sizeUnit)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-beedab-blue">
              {formatPrice(plot.price, plot.currency)}
            </span>
          </div>
        </div>

        {/* Plot Type & Amenities */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPlotTypeColor(plot.plotType)}`}>
            {t(`plot_types.${plot.plotType}`) || plot.plotType}
          </span>
          
          {plot.hasWater && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center">
              <Droplets className="h-3 w-3 mr-1" />
              {t('amenities.water')}
            </span>
          )}
          
          {plot.hasElectricity && (
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {t('amenities.electricity')}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {plot.description}
        </p>

        {/* Seller Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Posted by {plot.sellerName}</span>
          <span>{plot.postedDate}</span>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handlePhoneCall}
            className="flex-1 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            {t('common.call_seller')}
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            {t('common.whatsapp')}
          </button>
        </div>
      </div>
    </div>
  );
};