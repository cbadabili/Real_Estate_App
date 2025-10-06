// RealEstateIntel AI Search Integration Types
// Based on the provided RealEstateIntel schema

export type AreaUnit = 'sqft' | 'sqm';
export type Sort = 
  | 'relevance' | 'price_asc' | 'price_desc'
  | 'newest' | 'days_on_market' | 'size_desc';

export interface SearchQuery {
  location: string | null;
  min_price: number | null;
  max_price: number | null;
  currency: string | null;      // default: 'USD'
  beds: number | null;
  baths: number | null;
  min_area: number | null;
  max_area: number | null;
  area_unit: AreaUnit | null;   // default: 'sqft'
  property_type: string | null; // house|condo|apartment|...
  features: string[];           // ['pool','parking',...]
  status: string | null;        // for_sale|for_rent|...
  sort: Sort;                   // default: 'relevance'
  page: number;                 // default: 1
  page_size: number;            // default: 10
}

export interface Listing {
  reference: string;
  title: string;
  subtitle: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  currency: string | null;
  price_period: 'total' | 'per_month' | 'per_week' | null; // rentals
  beds: number | null;
  baths: number | null;
  half_baths: number | null;
  area: number | null;
  area_unit: AreaUnit | null;
  lot_size: number | null;
  lot_unit: 'sqft' | 'sqm' | 'acre' | 'hectare' | null;
  property_type: string | null;
  tenure: string | null;
  year_built: number | null;
  hoa_fees: number | null;
  cap_rate: number | null;
  days_on_market: number | null;
  status: string | null;
  url: string | null;
  media: { cover: string | null; gallery: string[] };
  agency: { name: string | null; agent_name: string | null; phone: string | null; email: string | null };
  highlights: string[];
  score: number | null; // 0–1
  source: 'local' | 'external'; // Indicates if from BeeDab or external search
}

export interface SearchResponse {
  query: SearchQuery;
  results: Listing[];
  pagination: { page: number; page_size: number; total: number | null };
  notes: string | null;
}

// BeeDab to RealEstateIntel mapping interface
export interface BeeDabProperty {
  id: number;
  title: string;
  description: string | null;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string | null;
  longitude: string | null;
  propertyType: string;
  listingType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  areaBuild: number | null;
  lotSize: string | null;
  yearBuilt: number | null;
  status: string;
  images: string | null; // JSON string
  features: string | null; // JSON string
  virtualTourUrl: string | null;
  videoUrl: string | null;
  propertyTaxes: string | null;
  hoaFees: string | null;
  ownerId: number | null;
  agentId: number | null;
  views: number | null;
  daysOnMarket: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}