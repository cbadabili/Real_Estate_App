// Adapter to convert BeeDab properties to RealEstateIntel format
import type { BeeDabProperty, Listing, SearchQuery } from "../shared/real-estate-intel-types";

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
      if (parsed === null || parsed === undefined || parsed === "") {
        return [];
      }
      return [String(parsed)];
    } catch {
      return [trimmed];
    }
  }

  return [String(value)];
};

const normalizeNumber = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const direct = Number(value);
    if (Number.isFinite(direct)) {
      return direct;
    }
    const cleaned = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(cleaned) ? cleaned : null;
  }

  return null;
};

export function adaptBeeDabPropertyToListing(property: BeeDabProperty): Listing {
  const images = normalizeStringArray(property.images);
  const features = normalizeStringArray(property.features);

  const priceNumber = normalizeNumber(property.price);
  const bathsNumber = property.bathrooms ? normalizeNumber(property.bathrooms) : null;
  const lat = normalizeNumber(property.latitude);
  const lng = normalizeNumber(property.longitude);

  return {
    reference: `BD-${property.id}`, // BeeDab reference prefix
    title: property.title,
    subtitle: null,
    address: property.address,
    neighborhood: null,
    city: property.city,
    state: property.state,
    postal_code: property.zipCode,
    country: 'Botswana', // Default for BeeDab
    latitude: lat,
    longitude: lng,
    price: priceNumber,
    currency: 'BWP', // Botswana Pula
    price_period: property.listingType === 'rental' ? 'per_month' : 'total',
    beds: property.bedrooms,
    baths: bathsNumber,
    half_baths: 0, // Not tracked in BeeDab schema
    area: property.squareFeet || property.areaBuild,
    area_unit: 'sqft',
    lot_size: property.lotSize ? parseFloat(property.lotSize.replace(/[^\d.]/g, '')) : null,
    lot_unit: 'sqft',
    property_type: property.propertyType,
    tenure: property.listingType === 'owner' ? 'freehold' : null,
    year_built: property.yearBuilt,
    hoa_fees: property.hoaFees ? parseFloat(property.hoaFees.replace(/[^\d.]/g, '')) : null,
    cap_rate: null, // Not tracked in BeeDab
    days_on_market: property.daysOnMarket,
    status: property.status === 'active' ? 'for_sale' : property.status,
    url: `/properties/${property.id}`,
    media: {
      cover: images.length > 0 ? images[0] : null,
      gallery: images
    },
    agency: {
      name: 'BeeDab Real Estate',
      agent_name: null, // Could be populated with agent info if available
      phone: null,
      email: null
    },
    highlights: features.slice(0, 4), // Take first 4 features as highlights
    score: null,
    source: 'local' // Indicates this is from BeeDab platform
  };
}

export function createSearchFiltersFromQuery(query: SearchQuery): any {
  // Convert RealEstateIntel SearchQuery to BeeDab property filters
  return {
    minPrice: query.min_price,
    maxPrice: query.max_price,
    propertyType: query.property_type,
    minBedrooms: query.beds,
    minBathrooms: query.baths,
    minSquareFeet: query.min_area,
    maxSquareFeet: query.max_area,
    city: query.location, // Map location to city for now
    status: query.status === 'for_sale' ? 'active' : query.status,
    limit: query.page_size,
    offset: (query.page - 1) * query.page_size,
    sortBy: query.sort === 'price_asc' || query.sort === 'price_desc' ? 'price' : 
           query.sort === 'newest' ? 'date' : 
           query.sort === 'size_desc' ? 'size' : 'date',
    sortOrder: query.sort === 'price_desc' || query.sort === 'size_desc' ? 'desc' : 'asc'
  };
}