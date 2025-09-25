import type { Request, Response } from "express";
import { db } from "./db";
import { properties } from "../shared/schema";
import { and, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import fetch from "node-fetch";

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

interface SearchCriteria {
  beds?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  query?: string;
}

// Enhanced NL parser with more sophisticated pattern matching
function parseFreeText(query: string): SearchCriteria {
  const derived: SearchCriteria = {};

  // Helper function to parse price with suffixes
  const parsePrice = (priceStr: string, suffix: string = ''): number => {
    const num = parseInt(priceStr);
    if (suffix.toLowerCase() === 'k') return num * 1000;
    if (suffix.toLowerCase() === 'm') return num * 1000000;
    return num;
  };

  // Extract descriptive terms (modern, luxury, etc.)
  const descriptiveTerms = ['modern', 'luxury', 'new', 'renovated', 'spacious', 'cozy', 'family'];
  const foundTerms = descriptiveTerms.filter(term => 
    query.toLowerCase().includes(term)
  );
  if (foundTerms.length > 0) {
    derived.query = foundTerms.join(' ');
  }

  // Extract price ranges with proper suffix handling
  const rangeMatch = query.match(/(\d+)(k|m)?\s*(?:to|-)\s*(\d+)(k|m)?/i);
  if (rangeMatch) {
    const [, min, minSuffix, max, maxSuffix] = rangeMatch;
    derived.minPrice = parsePrice(min, minSuffix);
    derived.maxPrice = parsePrice(max, maxSuffix);
  }

  // Extract single price limits with suffix support
  const underMatch = query.match(/under\s*(\d+)(k|m)?/i);
  if (underMatch) {
    const [, amount, suffix] = underMatch;
    derived.maxPrice = parsePrice(amount, suffix);
  }

  const overMatch = query.match(/over\s*(\d+)(k|m)?/i);
  if (overMatch) {
    const [, amount, suffix] = overMatch;
    derived.minPrice = parsePrice(amount, suffix);
  }

  const aboveMatch = query.match(/above\s*(\d+)(k|m)?/i);
  if (aboveMatch) {
    const [, amount, suffix] = aboveMatch;
    derived.minPrice = parsePrice(amount, suffix);
  }

  // Bedroom extraction
  let beds: number | undefined;
  const digitBed = query.match(/(\d+)\s*(bed|bedroom|bedroomed)/i);
  if (digitBed) {
    beds = parseInt(digitBed[1], 10);
  } else {
    const wordBeds: Record<string, number> = { 
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 
    };
    const wordMatch = query.match(/(one|two|three|four|five|six|seven|eight)\s*(bed|bedroom|bedroomed)/i);
    if (wordMatch) beds = wordBeds[wordMatch[1]];
  }

  // Property type extraction
  let type: string | undefined;
  if (/\b(house|standalone|detached)\b/i.test(query)) type = "house";
  else if (/\b(apartment|flat|unit)\b/i.test(query)) type = "apartment";
  else if (/\b(townhouse|townhome)\b/i.test(query)) type = "townhouse";
  else if (/\b(plot|land|vacant)\b/i.test(query)) type = "plot";
  else if (/\b(farm|agricultural)\b/i.test(query)) type = "farm";
  else if (/\b(commercial|office|retail)\b/i.test(query)) type = "commercial";

  // Location extraction
  const locations = ['gaborone', 'francistown', 'kasane', 'maun', 'serowe', 'palapye', 'kanye'];
  const location = locations.find(loc => query.toLowerCase().includes(loc));

  return {
    beds,
    type,
    minPrice: derived.minPrice,
    maxPrice: derived.maxPrice,
    location,
    query: derived.query,
  };
}

async function queryDB(q: string, sort: string): Promise<UnifiedProperty[]> {
  try {
    console.log('QueryDB called with:', { q, sort });

    const terms = [];
    const derived = parseFreeText(q);
    console.log('Parsed query filters:', derived);

    if (derived.beds) terms.push(gte(properties.bedrooms, derived.beds));
    if (derived.type) terms.push(eq(properties.propertyType, derived.type));
    if (derived.location) terms.push(ilike(properties.city, `%${derived.location}%`));

    // Apply price constraints using Drizzle ORM's gte and lte
    if (derived.minPrice !== undefined) {
      terms.push(gte(properties.price, derived.minPrice));
    }
    if (derived.maxPrice !== undefined) {
      terms.push(lte(properties.price, derived.maxPrice));
    }
    
    // If no specific filters detected, fall back to text search
    if (terms.length === 0) {
      const like = `%${q}%`;
      terms.push(
        or(
          ilike(properties.title, like),
          ilike(properties.description, like),
          ilike(properties.city, like),
          ilike(properties.address, like),
          ilike(properties.propertyType, like)
        )
      );
    } else if (derived.query) {
      // Add descriptive term search even if other filters exist
      const descriptiveLike = `%${derived.query}%`;
      terms.push(
        or(
          ilike(properties.title, descriptiveLike),
          ilike(properties.description, descriptiveLike)
        )
      );
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
  const price = normalizeNumber(row.price);
  const lat = normalizeNumber(row.latitude);
  const lng = normalizeNumber(row.longitude);

  return {
    id: `local_${row.id}`,
    title: row.title,
    price: price ?? 0,
    address: row.address,
    city: row.city,
    bedrooms: typeof row.bedrooms === "number" ? row.bedrooms : normalizeNumber(row.bedrooms) ?? undefined,
    bathrooms: row.bathrooms !== undefined && row.bathrooms !== null
      ? normalizeNumber(row.bathrooms) ?? undefined
      : undefined,
    propertyType: row.propertyType,
    source: 'local',
    description: row.description,
    images: normalizeStringArray(row.images ?? []),
    coordinates: lat !== null && lng !== null ? { lat, lng } : undefined,
    agency: {
      name: 'BeeDab Properties'
    }
  };
}

// Call OpenAI-powered search
async function queryIntel(q: string, filters: SearchCriteria = {}): Promise<UnifiedProperty[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, skipping external search');
    return [];
  }

  try {
    const payload = { query: q, filters }; // Pass filters to the AI search
    console.log('Calling OpenAI search with query:', q, 'and filters:', filters);

    const base = (process.env.INTEL_API_BASE ?? 'http://localhost:5000').replace(/\/$/, '');
    const response = await fetch(`${base}/intel/search`, {
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
    return (data.results || []).map((result: any, index: number) => {
      const price = normalizeNumber(result.price) ?? 0;
      const bedrooms = normalizeNumber(result.bedrooms ?? result.beds ?? null) ?? undefined;
      const bathrooms = normalizeNumber(result.bathrooms ?? result.baths ?? null) ?? undefined;
      const lat = normalizeNumber(result.lat);
      const lng = normalizeNumber(result.lng);

      return {
        id: `external_${result.id || index}`,
        title: result.title || 'External Property',
        price,
        address: result.address || '',
        city: result.city || '',
        bedrooms: bedrooms === undefined ? undefined : bedrooms,
        bathrooms: bathrooms === undefined ? undefined : bathrooms,
        propertyType: result.propertyType || '',
        source: 'external' as const,
        score: Number.isFinite(result.score) ? result.score : 0.8,
        description: result.description || '',
        images: normalizeStringArray(result.images ?? []),
        coordinates: Number.isFinite(lat) && Number.isFinite(lng)
          ? { lat: lat as number, lng: lng as number }
          : undefined,
        agency: {
          name: result.agent?.name || 'External Agent',
          contact: result.agent?.phone || result.agent?.email,
        },
      };
    });
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