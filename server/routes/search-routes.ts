import type { Express } from "express";
import { searchAggregator } from "../search-aggregator";

export function registerSearchRoutes(app: Express) {
  // Unified search endpoint
  app.get('/api/search', searchAggregator);

  // Search suggestions endpoint  
  app.get('/api/search/suggestions', async (req, res) => {
    try {
      const { q } = req.query;
      const query = (q as string)?.toLowerCase() || '';

      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      const suggestions = [];

      // Location suggestions
      const locations = [
        'Gaborone', 'Francistown', 'Maun', 'Kasane', 'Serowe', 'Palapye',
        'Mogoditshane', 'Molepolole', 'Kanye', 'Mahalapye', 'Lobatse',
        'Gaborone West', 'Gaborone CBD', 'Block 6', 'Block 8', 'Block 10',
        'Extension 2', 'Extension 9', 'Extension 12', 'Phakalane'
      ];

      const matchingLocations = locations
        .filter(loc => loc.toLowerCase().includes(query))
        .slice(0, 3)
        .map((loc, index) => ({
          id: `loc-${index}`,
          text: `Properties in ${loc}`,
          type: 'location'
        }));

      suggestions.push(...matchingLocations);

      // Property type suggestions
      const propertyTypes = [
        'house', 'apartment', 'townhouse', 'commercial', 'farm', 'land', 'plot'
      ];

      const matchingTypes = propertyTypes
        .filter(type => type.includes(query) || query.includes(type))
        .slice(0, 2)
        .map((type, index) => ({
          id: `type-${index}`,
          text: `${type.charAt(0).toUpperCase() + type.slice(1)}s for sale`,
          type: 'property_type'
        }));

      suggestions.push(...matchingTypes);

      // Feature suggestions
      const features = [
        'with pool', 'with garden', '3 bedroom', '4 bedroom', '2 bathroom',
        'with garage', 'furnished', 'sea view', 'city view', 'new development'
      ];

      const matchingFeatures = features
        .filter(feature => feature.includes(query) || query.split(' ').some(word => feature.includes(word)))
        .slice(0, 2)
        .map((feature, index) => ({
          id: `feat-${index}`,
          text: `Properties ${feature}`,
          type: 'feature'
        }));

      suggestions.push(...matchingFeatures);

      // Price range suggestions
      if (query.includes('under') || query.includes('below')) {
        suggestions.push({
          id: 'price-under',
          text: 'Properties under BWP 2M',
          type: 'feature'
        });
      }

      if (query.includes('above') || query.includes('over')) {
        suggestions.push({
          id: 'price-over',
          text: 'Properties over BWP 1M',
          type: 'feature'
        });
      }

      // Limit to 6 suggestions
      const limitedSuggestions = suggestions.slice(0, 6);

      res.json({ suggestions: limitedSuggestions });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  });
}