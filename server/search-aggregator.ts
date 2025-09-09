
import type { Request, Response } from "express";
import { db } from "./db";
import { properties } from "../shared/schema";
import { and, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import fetch from "node-fetch";

// ---- CONFIG ----
// Now using OpenAI-powered search via /intel/search endpoint

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
  try {
    console.log('QueryDB called with:', { q, sort });
    
    const terms = [];
    
    if (q) {
      const derived = parseFreeText(q);
      console.log('Parsed query filters:', derived);
      
      // More flexible approach: Apply semantic filters
      if (derived.beds) terms.push(gte(properties.bedrooms, derived.beds));
      if (derived.type) terms.push(eq(properties.propertyType, derived.type));
      if (derived.location) terms.push(ilike(properties.city, `%${derived.location}%`));
      
      // If no specific filters detected, fall back to text search
      if (!derived.beds && !derived.type && !derived.location) {
        const like = `%${q}%`;
        terms.push(
          or(
            ilike(properties.title, like),
            ilike(properties.description, like),
            ilike(properties.city, like),
            ilike(properties.address, like)
          )
        );
      }
    }
    
    const where = terms.length ? and(...terms) : undefined;
    const order = 
      sort === "price_low" ? properties.price :
      sort === "price_high" ? desc(properties.price) :
      desc(properties.createdAt);

    console.log('Executing query with', terms.length, 'filter terms');
    const rows = await db.select().from(properties).where(where).orderBy(order).limit(50);
    console.log('Raw query result:', rows.length, 'rows');
    
    const mappedResults = rows.map(mapDBRowToUnified);
    console.log('Mapped results:', mappedResults.length, 'properties');
    return mappedResults;
    
  } catch (error) {
    console.error('QueryDB error:', error);
    return [];
  }
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

// Call OpenAI-powered search
async function queryIntel(q: string, filters: any = {}): Promise<UnifiedProperty[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, skipping external search');
    return [];
  }

  try {
    const payload = { query: q };
    console.log('Calling OpenAI search with query:', q);
    
    const response = await fetch('http://0.0.0.0:5000/intel/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`OpenAI search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    console.log('OpenAI search response received:', { count: data.results?.length || 0 });

    // Map OpenAI results to unified format
    return (data.results || []).map((result: any, index: number) => ({
      id: `external_${result.id || index}`,
      title: result.title || 'External Property',
      price: result.price || 0,
      address: result.address || '',
      city: result.city || '',
      bedrooms: result.bedrooms,
      bathrooms: result.bathrooms,
      propertyType: result.propertyType || '',
      source: 'external' as const,
      score: 0.8, // Default high score for OpenAI results
      description: result.description || '',
      images: result.images || [],
      coordinates: result.lat && result.lng ? {
        lat: result.lat,
        lng: result.lng
      } : undefined,
      agency: {
        name: result.agent?.name || 'External Agent',
        contact: result.agent?.phone || result.agent?.email
      }
    }));
  } catch (error) {
    console.error('OpenAI search API error:', error);
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
    console.log('About to call queryDB with:', { query, sortBy });
    let localResults: UnifiedProperty[] = [];
    try {
      console.log('Calling queryDB now...');
      localResults = await queryDB(query, sortBy);
      console.log('QueryDB returned:', localResults.length, 'results');
    } catch (error) {
      console.error('QueryDB threw error:', error);
      localResults = [];
    }
    console.log('Local search phase completed with', localResults.length, 'results');
    
    // Step 2: Search RealEstateIntel AI
    console.log('Searching RealEstateIntel AI...');
    const externalResults = await queryIntel(query, filters);
    
    // Step 3: Merge and deduplicate
    const mergedResults = mergeAndDedupe(localResults, externalResults);
    console.log('After merge:', mergedResults.length, 'results');
    
    // Step 4: Rank results
    const rankedResults = rankResults(mergedResults, sortBy);
    console.log('After ranking:', rankedResults.length, 'results');
    
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
