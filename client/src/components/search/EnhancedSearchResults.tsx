import React from 'react';
import { ExternalLink, MapPin, Bed, Bath, Square, Star, Calendar, DollarSign, Phone, Mail } from 'lucide-react';
import type { SearchResponse, Listing } from '../../types/real-estate-intel';

interface EnhancedSearchResultsProps {
  searchResults: SearchResponse | null;
  loading?: boolean;
  className?: string;
}

export const EnhancedSearchResults: React.FC<EnhancedSearchResultsProps> = ({
  searchResults,
  loading = false,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
          <span className="ml-2 text-gray-600">Searching properties...</span>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.results.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No properties found</div>
          <div className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</div>
        </div>
      </div>
    );
  }

  const localResults = searchResults.results.filter(result => result.source === 'local');
  const externalResults = searchResults.results.filter(result => result.source === 'external');

  return (
    <div className={`w-full ${className}`}>
      {/* Search Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">
              Found {searchResults.results.length} properties
            </h3>
            <p className="text-blue-700 text-sm">
              {localResults.length} from BeeDab • {externalResults.length} from external sources
            </p>
          </div>
          {searchResults.notes && (
            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Enhanced Search
            </div>
          )}
        </div>
      </div>

      {/* Local Results Section */}
      {localResults.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900">
              BeeDab Properties ({localResults.length})
            </h2>
            <div className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Local
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {localResults.map((listing, index) => (
              <PropertyCard key={`local-${index}`} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* External Results Section */}
      {externalResults.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900">
              External Properties ({externalResults.length})
            </h2>
            <div className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              External
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {externalResults.map((listing, index) => (
              <PropertyCard key={`external-${index}`} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination Info */}
      {searchResults.pagination.total && searchResults.pagination.total > searchResults.pagination.page_size && (
        <div className="mt-8 text-center text-gray-600">
          Showing {searchResults.results.length} of {searchResults.pagination.total} properties
        </div>
      )}
    </div>
  );
};

const PropertyCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return 'Price on request';
    const formattedPrice = new Intl.NumberFormat('en-BW').format(price);
    return `${currency || 'BWP'} ${formattedPrice}`;
  };

  const formatArea = (area: number | null, unit: string | null) => {
    if (!area) return null;
    return `${new Intl.NumberFormat('en-BW').format(area)} ${unit || 'sqft'}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3">
          <div className="h-48 md:h-full bg-gray-200 relative">
            {listing.media.cover ? (
              <img
                src={listing.media.cover}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {listing.property_type?.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
            )}
            
            {/* Source Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                listing.source === 'local' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {listing.source === 'local' ? 'BeeDab' : 'External'}
              </span>
            </div>

            {/* Property Type Badge */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded-full capitalize">
                {listing.property_type || 'Property'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6">
          {/* Title with Reference */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {listing.title} — <span className="text-gray-600 font-normal">Ref: {listing.reference}</span>
            </h3>
            {listing.subtitle && (
              <p className="text-gray-600 text-sm">{listing.subtitle}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-beedab-blue">
              {formatPrice(listing.price, listing.currency)}
            </span>
            {listing.price_period && listing.price_period !== 'total' && (
              <span className="text-gray-600 text-sm ml-1">/{listing.price_period.replace('per_', '')}</span>
            )}
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-4 mb-3 text-gray-600">
            {listing.beds && (
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span className="text-sm">{listing.beds} bed{listing.beds !== 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.baths && (
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4" />
                <span className="text-sm">{listing.baths} bath{listing.baths !== 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.area && (
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span className="text-sm">{formatArea(listing.area, listing.area_unit)}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 mb-3 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {[listing.neighborhood, listing.city, listing.state].filter(Boolean).join(', ')}
            </span>
          </div>

          {/* Highlights */}
          {listing.highlights.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {listing.highlights.slice(0, 4).map((highlight, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    • {highlight}
                  </span>
                ))}
                {listing.highlights.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{listing.highlights.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Agency Info */}
          {listing.agency.name && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{listing.agency.name}</div>
              {listing.agency.agent_name && (
                <div className="text-sm text-gray-600">{listing.agency.agent_name}</div>
              )}
              <div className="flex items-center space-x-4 mt-2">
                {listing.agency.phone && (
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{listing.agency.phone}</span>
                  </div>
                )}
                {listing.agency.email && (
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{listing.agency.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {listing.days_on_market && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{listing.days_on_market} days on market</span>
                </div>
              )}
              {listing.score && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Score: {Math.round(listing.score * 100)}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {listing.url && (
                <a
                  href={listing.url}
                  target={listing.source === 'external' ? '_blank' : '_self'}
                  rel={listing.source === 'external' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center px-4 py-2 bg-beedab-blue text-white text-sm font-medium rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  View Details
                  {listing.source === 'external' && <ExternalLink className="h-3 w-3 ml-1" />}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};