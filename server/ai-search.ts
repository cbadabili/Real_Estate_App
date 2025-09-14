
import express from 'express';
import type { Request, Response } from 'express';
import { intelSearch } from './intel-adapter';

const router = express.Router();

// AI-powered search endpoint
router.post('/search/ai', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Query is required and must be a string' 
      });
    }

    // Use the existing intel search functionality
    await intelSearch(req, res);
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      results: []
    });
  }
});

export default router;
