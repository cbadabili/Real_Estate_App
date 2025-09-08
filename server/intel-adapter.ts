
import type { Request, Response } from "express";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function intelSearch(req: Request, res: Response) {
  const q = String(req.body?.query || "").trim();
  if (!q) return res.json({ results: [] });

  if (!openai) {
    console.warn("OpenAI API key not configured");
    return res.json({ results: [] });
  }

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are RealEstateIntel for Botswana. Search for real estate properties and return normalized JSON data. Focus on reputable Botswana property websites and listings."
        },
        {
          role: "user",
          content: `Find properties matching: "${q}". Prefer Botswana sources like Property24, Seeff, Pam Golding, etc. Include price in BWP, beds/baths, property type, location, URL, and images if available.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "PropertyResults",
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    currency: { type: "string", default: "BWP" },
                    bedrooms: { type: "integer" },
                    bathrooms: { type: "integer" },
                    propertyType: { type: "string" },
                    city: { type: "string" },
                    neighborhood: { type: "string" },
                    address: { type: "string" },
                    lat: { type: "number" },
                    lng: { type: "number" },
                    images: { type: "array", items: { type: "string" } },
                    url: { type: "string" },
                    listedAt: { type: "string" },
                    agent: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        phone: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  },
                  required: ["title", "price"]
                }
              }
            },
            required: ["results"],
            additionalProperties: false
          }
        }
      }
    });

    const json = response.choices[0].message.parsed || { results: [] };
    console.log(`OpenAI search returned ${json.results.length} properties`);
    res.json(json);
  } catch (error) {
    console.warn("OpenAI search error:", error);
    res.json({ results: [] }); // soft-fail
  }
}

export async function intelSuggest(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

  if (!openai) {
    // Fallback suggestions for Botswana
    const fallbackSuggestions = ["Gaborone", "Francistown", "Phakalane", "Mogoditshane", "Lobatse", "Tlokweng"];
    const term = q.toLowerCase();
    return res.json(fallbackSuggestions.filter(s => s.toLowerCase().includes(term)).slice(0, 8));
  }

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return only a JSON array of location/keyword suggestions for property search in Botswana. Focus on cities, neighborhoods, and property-related terms."
        },
        {
          role: "user",
          content: `Suggest up to 8 terms related to: "${q}"`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "SuggestList",
          schema: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    const suggestions = response.choices[0].message.parsed || [];
    res.json(Array.isArray(suggestions) ? suggestions.slice(0, 8) : []);
  } catch (error) {
    console.warn("OpenAI suggest error:", error);
    // Fallback suggestions for Botswana
    const fallbackSuggestions = ["Gaborone", "Francistown", "Phakalane", "Mogoditshane", "Lobatse", "Tlokweng"];
    const term = q.toLowerCase();
    res.json(fallbackSuggestions.filter(s => s.toLowerCase().includes(term)).slice(0, 8));
  }
}
