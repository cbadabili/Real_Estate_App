// Enhanced search API that combines BeeDab local properties with RealEstateIntel external search
import { Router } from 'express';
import type { SearchQuery, SearchResponse, Listing } from "../shared/real-estate-intel-types";
import { adaptBeeDabPropertyToListing, createSearchFiltersFromQuery } from "./real-estate-intel-adapter";
import { storage } from "./storage";

const router = Router();

// Utility: safe parse numbers
const parseNumber = (value: any): number | null => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Main search endpoint that prioritizes local properties, then external
router.get('/api/search/enhanced', async (req, res) => {
  try {
    // Parse search query from request
    const searchQuery: SearchQuery = {
      location: (req.query.location as string) || null,
      min_price: parseNumber(req.query.min_price),
      max_price: parseNumber(req.query.max_price),
      currency: (req.query.currency as string) || 'BWP',
      beds: parseNumber(req.query.beds),
      baths: parseNumber(req.query.baths),
      min_area: parseNumber(req.query.min_area),
      max_area: parseNumber(req.query.max_area),
      area_unit: ((req.query.area_unit as any) || 'sqft'),
      property_type: (req.query.property_type as string) || null,
      features: typeof req.query.features === 'string'
        ? (req.query.features as string).split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(req.query.features) ? (req.query.features as string[]) : [],
      status: (req.query.status as string) || null,
      sort: (req.query.sort as any) || 'relevance',
      page: parseNumber(req.query.page) || 1,
      page_size: parseNumber(req.query.page_size) || 10,
    };

    // Step 1: Search local BeeDab properties first
    const localFilters = createSearchFiltersFromQuery(searchQuery);
    const localProperties = await storage.getProperties(localFilters);
    
    // Convert BeeDab properties to RealEstateIntel format
    const localListings: Listing[] = localProperties.map(property => 
      adaptBeeDabPropertyToListing(property as any)
    );

    // Step 2: If we need more results, search external sources
    let externalListings: Listing[] = [];
    const remainingSlots = searchQuery.page_size - localListings.length;
    
    if (remainingSlots > 0) {
      // TODO: Integrate with actual RealEstateIntel API here
      // For now, create demo external results
      externalListings = createDemoExternalListings(searchQuery, remainingSlots);
    }

    // Step 3: Combine and sort results
    const allResults = [...localListings, ...externalListings];
    
    // Apply sorting if needed
    const sortedResults = sortListings(allResults, searchQuery.sort);
    
    // Apply pagination
    const start = (searchQuery.page - 1) * searchQuery.page_size;
    const paginatedResults = sortedResults.slice(start, start + searchQuery.page_size);

    const response: SearchResponse = {
      query: searchQuery,
      results: paginatedResults,
      pagination: {
        page: searchQuery.page,
        page_size: searchQuery.page_size,
        total: allResults.length
      },
      notes: `Found ${localListings.length} local properties and ${externalListings.length} external properties. Local properties shown first.`
    };

    res.json(response);
  } catch (error) {
    console.error('Enhanced search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo function to create external listings (replace with actual API integration)
function createDemoExternalListings(query: SearchQuery, count: number): Listing[] {
  const demoListings: Listing[] = [
    {
      reference: 'EXT-001',
      title: 'Modern Villa in Phakalane',
      subtitle: 'Luxury family home',
      address: 'Plot 123, Phakalane Estate',
      neighborhood: 'Phakalane',
      city: 'Gaborone',
      state: 'South East District',
      postal_code: 'Private Bag',
      country: 'Botswana',
      latitude: -24.6282,
      longitude: 25.9231,
      price: 2500000,
      currency: 'BWP',
      price_period: 'total',
      beds: 4,
      baths: 3,
      half_baths: 1,
      area: 2800,
      area_unit: 'sqft',
      lot_size: 5000,
      lot_unit: 'sqft',
      property_type: 'house',
      tenure: 'freehold',
      year_built: 2020,
      hoa_fees: null,
      cap_rate: null,
      days_on_market: 15,
      status: 'for_sale',
      url: 'https://external-realestate.bw/properties/001',
      media: {
        cover: '/api/placeholder/400/300',
        gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300']
      },
      agency: {
        name: 'Premium Properties Botswana',
        agent_name: 'John Mokwena',
        phone: '+267 71 234 567',
        email: 'john@premiumproperties.bw'
      },
      highlights: ['Swimming Pool', 'Double Garage', 'Garden', 'Security System'],
      score: 0.95,
      source: 'external'
    },
    {
      reference: 'EXT-002',
      title: 'Contemporary Apartment in CBD',
      subtitle: 'City center living',
      address: 'Block 6, CBD Tower',
      neighborhood: 'Central Business District',
      city: 'Gaborone',
      state: 'South East District',
      postal_code: 'Private Bag',
      country: 'Botswana',
      latitude: -24.6541,
      longitude: 25.9087,
      price: 1800000,
      currency: 'BWP',
      price_period: 'total',
      beds: 3,
      baths: 2,
      half_baths: 0,
      area: 1500,
      area_unit: 'sqft',
      lot_size: null,
      lot_unit: null,
      property_type: 'apartment',
      tenure: 'freehold',
      year_built: 2022,
      hoa_fees: 1200,
      cap_rate: null,
      days_on_market: 8,
      status: 'for_sale',
      url: 'https://external-realestate.bw/properties/002',
      media: {
        cover: '/api/placeholder/400/300',
        gallery: ['/api/placeholder/400/300']
      },
      agency: {
        name: 'City Estates',
        agent_name: 'Sarah Molefe',
        phone: '+267 72 345 678',
        email: 'sarah@cityestates.bw'
      },
      highlights: ['City Views', 'Covered Parking', 'Modern Finishes', 'Elevator Access'],
      score: 0.88,
      source: 'external'
    }
  ];

  // Filter demo listings based on query
  let filteredListings = demoListings;
  
  if (query.location) {
    const location = query.location.toLowerCase();
    filteredListings = filteredListings.filter(listing =>
      listing.city?.toLowerCase().includes(location) ||
      listing.neighborhood?.toLowerCase().includes(location) ||
      listing.state?.toLowerCase().includes(location)
    );
  }
  
  if (query.min_price) {
    filteredListings = filteredListings.filter(listing =>
      (listing.price || 0) >= query.min_price!
    );
  }
  
  if (query.max_price) {
    filteredListings = filteredListings.filter(listing =>
      (listing.price || Infinity) <= query.max_price!
    );
  }
  
  if (query.beds) {
    filteredListings = filteredListings.filter(listing =>
      (listing.beds || 0) >= query.beds!
    );
  }
  
  if (query.property_type) {
    filteredListings = filteredListings.filter(listing =>
      listing.property_type?.toLowerCase() === query.property_type!.toLowerCase()
    );
  }

  return filteredListings.slice(0, count);
}

// Sorting function for listings
function sortListings(listings: Listing[], sort: string): Listing[] {
  const sorted = [...listings];
  
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price_desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'size_desc':
      return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
    case 'newest':
      return sorted.sort((a, b) => (b.year_built || 0) - (a.year_built || 0));
    case 'days_on_market':
      return sorted.sort((a, b) => (a.days_on_market || 0) - (b.days_on_market || 0));
    case 'relevance':
    default:
      // Local properties first, then by score
      return sorted.sort((a, b) => {
        if (a.source === 'local' && b.source === 'external') return -1;
        if (a.source === 'external' && b.source === 'local') return 1;
        return (b.score || 0) - (a.score || 0);
      });
  }
}

export default router;