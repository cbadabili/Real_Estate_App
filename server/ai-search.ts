import OpenAI from "openai";

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
}

export interface AISearchResult {
  filters: SearchFilters;
  explanation: string;
  confidence: number;
}

export async function parseNaturalLanguageSearch(query: string): Promise<AISearchResult> {
  if (!openai) {
    // Fallback parsing without AI
    return parseQueryFallback(query);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a real estate search assistant. Parse natural language property search queries into structured filters.

Extract the following information from the user's query for Botswana real estate:
- Price range in Botswana Pula (minPrice, maxPrice) - note P for Pula, k for thousands, M for millions
- Property type (house, apartment, townhouse, plot)
- Number of bedrooms (minBedrooms)
- Number of bathrooms (minBathrooms)
- Location (city like Gaborone, Francistown, Maun, Kasane, etc.)
- Features (pool, garage, backyard, security, etc.)
- Listing type (fsbo, agent, mls)

Respond with JSON in this exact format:
{
  "filters": {
    "minPrice": number or null,
    "maxPrice": number or null,
    "propertyType": string or null,
    "minBedrooms": number or null,
    "minBathrooms": number or null,
    "city": string or null,
    "state": string or null,
    "features": array of strings or null,
    "listingType": string or null
  },
  "explanation": "Brief explanation of what was understood",
  "confidence": number between 0 and 1
}`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      filters: result.filters || {},
      explanation: result.explanation || "Parsed your search query",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8))
    };
  } catch (error) {
    console.error('AI search parsing error:', error);
    return parseQueryFallback(query);
  }
}

function parseQueryFallback(query: string): AISearchResult {
  const lowerQuery = query.toLowerCase();
  const filters: SearchFilters = {};

  // Extract price information (Botswana Pula)
  const priceMatches = lowerQuery.match(/(?:under|below|less than|<)\s*p?(\d+(?:,\d{3})*(?:k|m|000)?)/i);
  if (priceMatches) {
    let price = priceMatches[1].replace(/,/g, '');
    if (price.toLowerCase().endsWith('k')) {
      price = price.slice(0, -1) + '000';
    } else if (price.toLowerCase().endsWith('m')) {
      price = price.slice(0, -1) + '000000';
    }
    filters.maxPrice = parseInt(price);
  }

  // Extract bedroom count
  const bedroomMatches = lowerQuery.match(/(\d+)\s*(?:bed|bedroom)/);
  if (bedroomMatches) {
    filters.minBedrooms = parseInt(bedroomMatches[1]);
  }

  // Extract bathroom count
  const bathroomMatches = lowerQuery.match(/(\d+)\s*(?:bath|bathroom)/);
  if (bathroomMatches) {
    filters.minBathrooms = parseInt(bathroomMatches[1]);
  }

  // Extract property type
  if (lowerQuery.includes('house')) filters.propertyType = 'house';
  else if (lowerQuery.includes('apartment') || lowerQuery.includes('flat')) filters.propertyType = 'apartment';
  else if (lowerQuery.includes('townhouse')) filters.propertyType = 'townhouse';
  else if (lowerQuery.includes('commercial') || lowerQuery.includes('office') || lowerQuery.includes('retail')) filters.propertyType = 'commercial';
  else if (lowerQuery.includes('farm') || lowerQuery.includes('agricultural')) filters.propertyType = 'farm';
  else if (lowerQuery.includes('plot') || lowerQuery.includes('land')) filters.propertyType = 'land';

  // Extract features
  const features: string[] = [];
  if (lowerQuery.includes('pool')) features.push('Pool');
  if (lowerQuery.includes('garage')) features.push('Garage');
  if (lowerQuery.includes('backyard') || lowerQuery.includes('yard')) features.push('Large Backyard');
  if (lowerQuery.includes('cbd') || lowerQuery.includes('city view') || lowerQuery.includes('downtown')) features.push('City Views');
  if (lowerQuery.includes('security') || lowerQuery.includes('gated')) features.push('Security');
  if (lowerQuery.includes('borehole') || lowerQuery.includes('water')) features.push('Borehole');
  if (features.length > 0) filters.features = features;

  // Extract listing type
  if (lowerQuery.includes('fsbo') || lowerQuery.includes('by owner')) {
    filters.listingType = 'fsbo';
  }

  return {
    filters,
    explanation: "Parsed your search using basic text analysis",
    confidence: 0.6
  };
}