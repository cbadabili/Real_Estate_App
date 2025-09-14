import OpenAI from "openai";
import { Router } from 'express';
import { storage } from './storage';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  city?: string;
  state?: string;
  features?: string[];
  listingType?: string;
  minSquareFeet?: number;
  maxSquareFeet?: number;
}

export interface AISearchResult {
  filters: SearchFilters;
  explanation: string;
  confidence: number;
}

interface SearchResult {
  query: string;
  filters: any;
  suggestions: string[];
  explanation: string;
  confidence: number;
  matchedProperties?: any[];
  autoSuggestions?: string[];
}

const router = Router();

// Add the AI search route
router.post('/search/ai', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query is required" });
    }

    const result = await parseNaturalLanguageSearch(query);
    res.json(result);
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

const aiSearchRoutes = router;
export { aiSearchRoutes };
export default router;

export async function parseNaturalLanguageSearch(query: string): Promise<SearchResult> {
  const lowercaseQuery = query.toLowerCase();

  // Initialize filters
  const filters: any = {};
  const suggestions: string[] = [];
  const autoSuggestions: string[] = [];
  let confidence = 0.7;

  // Enhanced property type detection
  const propertyTypeMap = {
    'house': ['house', 'home', 'villa', 'mansion', 'bungalow', 'cottage'],
    'apartment': ['apartment', 'flat', 'unit', 'condo', 'penthouse'],
    'townhouse': ['townhouse', 'townhome', 'duplex'],
    'commercial': ['commercial', 'office', 'shop', 'warehouse', 'retail', 'business'],
    'farm': ['farm', 'ranch', 'agricultural', 'farming'],
    'land': ['land', 'plot', 'stand', 'site', 'vacant', 'development'],
    'mmatseta': ['mmatseta']
  };

  for (const [type, keywords] of Object.entries(propertyTypeMap)) {
    if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      filters.propertyType = type;
      confidence += 0.15;
      break;
    }
  }

  // Enhanced price detection with Botswana currency
  const pricePatterns = [
    /p\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi, // P500,000
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*pula/gi, // 500,000 pula
    /(\d+(?:,\d{3})*(?:\.\d{2})?)/g // Plain numbers
  ];

  let priceMatches: number[] = [];
  for (const pattern of pricePatterns) {
    const matches = lowercaseQuery.match(pattern);
    if (matches) {
      priceMatches = matches.map(p => parseFloat(p.replace(/[p,pula\s]/gi, '')));
      break;
    }
  }

  if (priceMatches.length > 0) {
    if (priceMatches.length === 1) {
      const price = priceMatches[0];
      if (lowercaseQuery.includes('under') || lowercaseQuery.includes('below') || lowercaseQuery.includes('max')) {
        filters.maxPrice = price;
      } else if (lowercaseQuery.includes('over') || lowercaseQuery.includes('above') || lowercaseQuery.includes('min')) {
        filters.minPrice = price;
      } else if (lowercaseQuery.includes('around') || lowercaseQuery.includes('about')) {
        filters.minPrice = price * 0.85;
        filters.maxPrice = price * 1.15;
      } else {
        filters.maxPrice = price * 1.1;
        filters.minPrice = price * 0.9;
      }
    } else if (priceMatches.length >= 2) {
      filters.minPrice = Math.min(...priceMatches);
      filters.maxPrice = Math.max(...priceMatches);
    }
    confidence += 0.2;
  }

  // Enhanced bedroom/bathroom detection
  const bedroomPatterns = [
    /(\d+)\s*(?:bed|bedroom|br)/i,
    /(\d+)\s*(?:b|bd)/i
  ];

  for (const pattern of bedroomPatterns) {
    const match = lowercaseQuery.match(pattern);
    if (match) {
      filters.minBedrooms = parseInt(match[1]);
      confidence += 0.15;
      break;
    }
  }

  const bathroomPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba)/i,
    /(\d+(?:\.\d+)?)\s*(?:toilet)/i
  ];

  for (const pattern of bathroomPatterns) {
    const match = lowercaseQuery.match(pattern);
    if (match) {
      filters.minBathrooms = parseFloat(match[1]);
      confidence += 0.15;
      break;
    }
  }

  // Enhanced location detection for Botswana
  const locations = {
    // Major cities
    'gaborone': ['gaborone', 'gabs', 'cbd', 'city center'],
    'francistown': ['francistown', 'francistown city'],
    'maun': ['maun', 'okavango'],
    'kasane': ['kasane', 'chobe'],
    'palapye': ['palapye'],
    'serowe': ['serowe'],
    'kanye': ['kanye'],
    'mochudi': ['mochudi'],
    'lobatse': ['lobatse'],
    'jwaneng': ['jwaneng'],
    'selibe-phikwe': ['selibe-phikwe', 'phikwe'],
    'mahalapye': ['mahalapye'],
    'molepolole': ['molepolole'],
    'sowa': ['sowa'],
    'orapa': ['orapa'],
    // Districts/Areas
    'south-east': ['south east', 'south-east', 'southeast'],
    'north-east': ['north east', 'north-east', 'northeast'],
    'north-west': ['north west', 'north-west', 'northwest'],
    'southern': ['southern district'],
    'central': ['central district'],
    'kgatleng': ['kgatleng'],
    'kweneng': ['kweneng'],
    'kgalagadi': ['kgalagadi']
  };

  let locationFound = false;
  for (const [location, keywords] of Object.entries(locations)) {
    if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      if (location.includes('-') || location === 'central' || location === 'southern') {
        filters.state = location.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('-');
      } else {
        filters.city = location.charAt(0).toUpperCase() + location.slice(1);
      }
      confidence += 0.2;
      locationFound = true;
      break;
    }
  }

  // Size/area detection
  const sizeMatch = lowercaseQuery.match(/(\d+(?:,\d{3})*)\s*(?:sqm|square meters?|m2|sq m)/i);
  if (sizeMatch) {
    const size = parseInt(sizeMatch[1].replace(/,/g, ''));
    if (lowercaseQuery.includes('over') || lowercaseQuery.includes('above')) {
      filters.minSquareFeet = size;
    } else if (lowercaseQuery.includes('under') || lowercaseQuery.includes('below')) {
      filters.maxSquareFeet = size;
    } else {
      filters.minSquareFeet = size * 0.9;
      filters.maxSquareFeet = size * 1.1;
    }
    confidence += 0.1;
  }

  // Listing type detection
  if (lowercaseQuery.includes('fsbo') || lowercaseQuery.includes('owner') || lowercaseQuery.includes('by owner')) {
    filters.listingType = 'fsbo';
    confidence += 0.1;
  } else if (lowercaseQuery.includes('agent') || lowercaseQuery.includes('realtor')) {
    filters.listingType = 'agent';
    confidence += 0.1;
  } else if (lowercaseQuery.includes('auction') || lowercaseQuery.includes('bid')) {
    filters.listingType = 'auction';
    confidence += 0.1;
  }

  // Features detection
  const featuresList = [
    'pool', 'swimming pool', 'garage', 'parking', 'garden', 'yard', 'balcony',
    'patio', 'fireplace', 'air conditioning', 'security', 'fence', 'borehole'
  ];

  const foundFeatures = featuresList.filter(feature => lowercaseQuery.includes(feature));
  if (foundFeatures.length > 0) {
    filters.features = foundFeatures;
    confidence += foundFeatures.length * 0.05;
  }

  // Fetch matching properties
  let matchedProperties: any[] = [];
  try {
    matchedProperties = await storage.getProperties(filters);
  } catch (error) {
    console.error('Error fetching properties for AI search:', error);
  }

  // Generate auto-suggestions based on query and available properties
  if (matchedProperties.length === 0) {
    // No matches - suggest broader searches
    autoSuggestions.push(
      'houses in gaborone',
      'apartments under p500000',
      '3 bedroom houses',
      'properties in francistown',
      'land for sale'
    );
  } else {
    // Has matches - suggest refinements
    const propertyTypes = [...new Set(matchedProperties.map(p => p.propertyType))];
    const cities = [...new Set(matchedProperties.map(p => p.city))];

    propertyTypes.forEach(type => {
      if (type !== filters.propertyType) {
        autoSuggestions.push(`${type}s in ${filters.city || 'gaborone'}`);
      }
    });

    cities.forEach(city => {
      if (city !== filters.city) {
        autoSuggestions.push(`${filters.propertyType || 'properties'} in ${city.toLowerCase()}`);
      }
    });
  }

  // Generate suggestions for improving search
  if (!filters.propertyType) {
    suggestions.push('Try specifying a property type (house, apartment, townhouse, land, commercial, farm)');
  }

  if (!filters.city && !filters.state) {
    suggestions.push('Add a location (Gaborone, Francistown, Maun, etc.)');
  }

  if (!filters.minPrice && !filters.maxPrice) {
    suggestions.push('Include a price range (e.g., "under P500,000" or "P300,000 to P800,000")');
  }

  if (matchedProperties.length === 0 && confidence > 0.5) {
    suggestions.push('Try broadening your search criteria or check spelling');
  }

  const extractedFilters = {
    propertyType: filters.propertyType,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minBedrooms: filters.minBedrooms,
    minBathrooms: filters.minBathrooms,
    city: filters.city,
    state: filters.state,
    features: filters.features,
    listingType: filters.listingType,
    minSquareFeet: filters.minSquareFeet,
    maxSquareFeet: filters.maxSquareFeet,
  };

  const explanation = generateSearchExplanation(query, extractedFilters);

  return {
    query,
    filters: extractedFilters,
    suggestions,
    explanation,
    confidence,
    matchedProperties: matchedProperties.slice(0, 10), // Limit to top 10 matches
    autoSuggestions: autoSuggestions.slice(0, 5) // Limit to 5 suggestions
  };
}

function generateSearchExplanation(query: string, filters: SearchFilters): string {
  let parts: string[] = [];

  if (filters.propertyType) {
    parts.push(`searching for ${filters.propertyType}`);
  } else {
    parts.push('searching for properties');
  }

  if (filters.city) {
    parts.push(`in ${filters.city}`);
  } else if (filters.state) {
    parts.push(`in ${filters.state}`);
  }

  if (filters.minBedrooms) {
    parts.push(`with at least ${filters.minBedrooms} bedroom${filters.minBedrooms > 1 ? 's' : ''}`);
  }

  if (filters.minBathrooms) {
    parts.push(`with at least ${filters.minBathrooms} bathroom${filters.minBathrooms > 1 ? 's' : ''}`);
  }

  if (filters.minPrice && filters.maxPrice) {
    parts.push(`between P${filters.minPrice.toLocaleString()} and P${filters.maxPrice.toLocaleString()}`);
  } else if (filters.minPrice) {
    parts.push(`above P${filters.minPrice.toLocaleString()}`);
  } else if (filters.maxPrice) {
    parts.push(`below P${filters.maxPrice.toLocaleString()}`);
  }

  if (filters.features && filters.features.length > 0) {
    parts.push(`with ${filters.features.join(', ')}`);
  }

  if (filters.listingType) {
    parts.push(`listed as ${filters.listingType}`);
  }

  if (filters.minSquareFeet || filters.maxSquareFeet) {
    let sizeDescription = 'with a size';
    if (filters.minSquareFeet && filters.maxSquareFeet) {
      sizeDescription += ` between ${filters.minSquareFeet} sqm and ${filters.maxSquareFeet} sqm`;
    } else if (filters.minSquareFeet) {
      sizeDescription += ` over ${filters.minSquareFeet} sqm`;
    } else if (filters.maxSquareFeet) {
      sizeDescription += ` under ${filters.maxSquareFeet} sqm`;
    }
    parts.push(sizeDescription);
  }


  return parts.join(', ') + '.';
}