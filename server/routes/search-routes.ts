
import type { Express } from "express";
import { searchAggregator } from "../search-aggregator";
import { intelSuggest } from "../intel-adapter";

export function registerSearchRoutes(app: Express) {
  // Unified search endpoint (replaces both /api/search and /api/search/enhanced)
  app.get('/api/search', searchAggregator);
  
  // Search suggestions endpoint
  app.get('/api/search/suggestions', intelSuggest);
  
  // Backward compatibility - redirect enhanced search to unified search
  app.get('/api/search/enhanced', (req, res) => {
    // Redirect to unified search with same parameters
    const queryString = new URLSearchParams(req.query as any).toString();
    res.redirect(`/api/search?${queryString}`);
  });
}
