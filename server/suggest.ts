
import type { Request, Response } from "express";
import fetch from "node-fetch";

const INTEL_SUGGEST_URL = process.env.REALESTATEINTEL_SUGGEST_URL || 'https://api.realestateintel.ai/suggest';
const INTEL_KEY = process.env.REALESTATEINTEL_API_KEY;

export async function suggest(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

  try {
    // Call AI suggestor if available
    if (INTEL_KEY) {
      const response = await fetch(INTEL_SUGGEST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${INTEL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: q, market: "BW", max: 8 }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.suggestions ?? []);
        return res.json(list.slice(0, 8));
      }
    }
  } catch (error) {
    console.warn('AI suggestions failed, using fallback:', error);
  }

  // Fallback suggestions based on common Botswana locations and property terms
  const locations = ["Gaborone", "Francistown", "Phakalane", "Mogoditshane", "Lobatse", "Tlokweng", "Kasane", "Maun"];
  const propertyTypes = ["house", "apartment", "plot", "townhouse", "farm"];
  const features = ["3 bedroom", "4 bedroom", "swimming pool", "garden", "garage"];
  
  const term = q.toLowerCase();
  const suggestions = [
    ...locations.filter(s => s.toLowerCase().includes(term)),
    ...propertyTypes.filter(s => s.toLowerCase().includes(term)).map(t => `${t} in Botswana`),
    ...features.filter(s => s.toLowerCase().includes(term))
  ];

  return res.json(suggestions.slice(0, 8));
}
