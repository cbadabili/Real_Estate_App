
import type { Request, Response } from "express";
import { db } from "./db";
import { properties } from "../shared/schema";
import { and, desc, gte, ilike, or, sql } from "drizzle-orm";
import fetch from "node-fetch";

// ---- CONFIG ----
const REALINTEL_URL = process.env.REALESTATEINTEL_URL || 'https://api.realestateintel.ai/search';
const REALINTEL_KEY = process.env.REALESTATEINTEL_API_KEY;

interface UnifiedProperty {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType: string;
  source: 'local' | 'external';
  score?: number;
  description?: string;
  images?: string[];
  coordinates?: { lat: number; lng: number };
  agency?: {
    name: string;
    contact?: string;
  };
}

// Enhanced NL parser with more sophisticated pattern matching
function parseFreeText(q: string) {
  const lower = q.toLowerCase();
  
  // Bedroom extraction
  let beds: number | undefined;
  const digitBed = lower.match(/(\d+)\s*(bed|bedroom|bedroomed)/);
  if (digitBed) {
    beds = parseInt(digitBed[1], 10);
  } else {
    const wordBeds: Record<string, number> = { 
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 
    };
    const wordMatch = lower.match(/(one|two|three|four|five|six|seven|eight)\s*(bed|bedroom|bedroomed)/);
    if (wordMatch) beds = wordBeds[wordMatch[1]];
  }

  // Property type extraction
  let type: string | undefined;
  if (/\b(house|standalone|detached)\b/.test(lower)) type = "house";
  else if (/\b(apartment|flat|unit)\b/.test(lower)) type = "apartment";
  else if (/\b(townhouse|townhome)\b/.test(lower)) type = "townhouse";
  else if (/\b(plot|land|vacant)\b/.test(lower)) type = "plot";
  else if (/\b(farm|agricultural)\b/.test(lower)) type = "farm";
  else if (/\b(commercial|office|retail)\b/.test(lower)) type = "commercial";

  // Price range extraction
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  const priceRange = lower.match(/(\d+)k?\s*(?:to|-)?\s*(\d+)k?\s*(?:pula|bwp|p)?/);
  if (priceRange) {
    minPrice = parseInt(priceRange[1]) * (priceRange[1].includes('k') ? 1000 : 1);
    maxPrice = parseInt(priceRange[2]) * (priceRange[2].includes('k') ? 1000 : 1);
  }

  // Location extraction
  const locations = ['gaborone', 'francistown', 'kasane', 'maun', 'serowe', 'palapye', 'kanye'];
  const location = locations.find(loc => lower.includes(loc));

  return { beds, type, minPrice, maxPrice, location };
}

async function queryDB(q: string, sort: string): Promise<UnifiedProperty[]> {
  const terms = [];
  
  if (q) {
    const like = `%${q}%`;
    terms.push(
      or(
        ilike(properties.title, like),
        ilike(properties.description, like),
        ilike(properties.city, like),
        ilike(properties.address, like)
      )
    );
    
    const derived = parseFreeText(q);
    if (derived.beds) terms.push(gte(properties.bedrooms, derived.beds));
    if (derived.type) terms.push(ilike(properties.propertyType, derived.type));
    if (derived.location) terms.push(ilike(properties.city, `%${derived.location}%`));
  }
  
  const where = terms.length ? and(...terms) : undefined;
  const order = 
    sort === "price_low" ? properties.price :
    sort === "price_high" ? desc(properties.price) :
    desc(properties.createdAt);

  const rows = await db.select().from(properties).where(where).orderBy(order).limit(50);
  return rows.map(mapDBRowToUnified);
}

function mapDBRowToUnified(row: any): UnifiedProperty {
  return {
    id: `local_${row.id}`,
    title: row.title,
    price: parseFloat(row.price.replace(/[^\d.]/g, '')) || 0,
    address: row.address,
    city: row.city,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms ? parseFloat(row.bathrooms) : undefined,
    propertyType: row.propertyType,
    source: 'local',
    description: row.description,
    images: row.images ? JSON.parse(row.images) : [],
    coordinates: row.latitude && row.longitude ? {
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude)
    } : undefined,
    agency: {
      name: 'BeeDab Properties'
    }
  };
}

// Call RealEstateIntel AI GPT
async function queryIntel(q: string, filters: any = {}): Promise<UnifiedProperty[]> {
  if (!REALINTEL_KEY) {
    console.warn('RealEstateIntel API key not configured, skipping external search');
    return [];
  }

  try {
    const payload = {
      query: q,
      locationBias: filters.location || 'Botswana',
      minBeds: filters.beds,
      propertyType: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      maxResults: 25,
      includeImages: true,
      includeCoordinates: true
    };

    console.log('Calling RealEstateIntel AI with payload:', payload);
    
    const response = await fetch(REALINTEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REALINTEL_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`RealEstateIntel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('RealEstateIntel response received:', { count: data.results?.length || 0 });

    // Map RealEstateIntel results to unified format
    return (data.results || []).map((result: any, index: number) => ({
      id: `external_${result.reference || index}`,
      title: result.title || 'External Property',
      price: result.price || 0,
      address: result.address || '',
      city: result.city || '',
      bedrooms: result.beds,
      bathrooms: result.baths,
      propertyType: result.property_type || '',
      source: 'external' as const,
      score: result.score || 0.5,
      description: result.highlights?.join(', ') || '',
      images: [result.media?.cover, ...(result.media?.gallery || [])].filter(Boolean),
      coordinates: result.latitude && result.longitude ? {
        lat: result.latitude,
        lng: result.longitude
      } : undefined,
      agency: {
        name: result.agency?.name || 'External Agency',
        contact: result.agency?.phone || result.agency?.email
      }
    }));
  } catch (error) {
    console.error('RealEstateIntel API error:', error);
    return [];
  }
}

// Merge and dedupe results
function mergeAndDedupe(localResults: UnifiedProperty[], externalResults: UnifiedProperty[]): UnifiedProperty[] {
  const merged = [...localResults];
  
  // Simple deduplication based on address similarity
  for (const external of externalResults) {
    const isDuplicate = localResults.some(local => 
      local.address.toLowerCase().includes(external.address.toLowerCase()) ||
      external.address.toLowerCase().includes(local.address.toLowerCase())
    );
    
    if (!isDuplicate) {
      merged.push(external);
    }
  }
  
  return merged;
}

// Rank results (local first, then by score/relevance)
function rankResults(results: UnifiedProperty[], sort: string): UnifiedProperty[] {
  return results.sort((a, b) => {
    // Local properties get priority
    if (a.source === 'local' && b.source === 'external') return -1;
    if (a.source === 'external' && b.source === 'local') return 1;
    
    // Then by specified sort
    switch (sort) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      default:
        return (b.score || 0) - (a.score || 0);
    }
  });
}

// Main aggregator endpoint
export async function searchAggregator(req: Request, res: Response) {
  try {
    const { q = '', sort = 'relevance', limit = 20 } = req.query;
    const query = q as string;
    const sortBy = sort as string;
    const maxResults = Math.min(parseInt(limit as string) || 20, 100);

    console.log('Search aggregator called:', { query, sortBy, maxResults });

    // Parse additional filters from query
    const filters = parseFreeText(query);
    
    // Step 1: Search local database
    console.log('Searching local database...');
    const localResults = await queryDB(query, sortBy);
    
    // Step 2: Search RealEstateIntel AI
    console.log('Searching RealEstateIntel AI...');
    const externalResults = await queryIntel(query, filters);
    
    // Step 3: Merge and deduplicate
    const mergedResults = mergeAndDedupe(localResults, externalResults);
    
    // Step 4: Rank results
    const rankedResults = rankResults(mergedResults, sortBy);
    
    // Step 5: Apply limit
    const finalResults = rankedResults.slice(0, maxResults);

    console.log('Search completed:', { 
      local: localResults.length, 
      external: externalResults.length, 
      final: finalResults.length 
    });

    res.json({
      query,
      results: finalResults,
      stats: {
        total: finalResults.length,
        local: localResults.length,
        external: externalResults.length,
        merged: mergedResults.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search aggregator error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
