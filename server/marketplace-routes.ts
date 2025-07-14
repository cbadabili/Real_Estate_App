
import express from 'express';
import { marketplaceStorage } from './marketplace-storage';
import { authenticate, authorize } from './auth-middleware';
import { Permission } from '../shared/schema';
import { z } from 'zod';

const router = express.Router();

// Service Categories
router.get('/categories', async (req, res) => {
  try {
    const journey_type = req.query.journey_type as string;
    const categories = await marketplaceStorage.getServiceCategories(journey_type);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ message: 'Failed to fetch service categories' });
  }
});

// Marketplace Providers
router.get('/providers', async (req, res) => {
  try {
    const filters = {
      provider_type: req.query.provider_type as string,
      category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
      service_area: req.query.service_area as string,
      min_rating: req.query.min_rating ? parseFloat(req.query.min_rating as string) : undefined,
      is_verified: req.query.is_verified === 'true',
      is_featured: req.query.is_featured === 'true',
      availability_status: req.query.availability_status as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      sort_by: req.query.sort_by as 'rating' | 'price' | 'experience' | 'reviews' | 'name',
      sort_order: req.query.sort_order as 'asc' | 'desc'
    };

    const providers = await marketplaceStorage.getMarketplaceProviders(filters);
    res.json(providers);
  } catch (error) {
    console.error('Error fetching marketplace providers:', error);
    res.status(500).json({ message: 'Failed to fetch marketplace providers' });
  }
});

router.get('/providers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const provider = await marketplaceStorage.getMarketplaceProvider(id);
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json(provider);
  } catch (error) {
    console.error('Error fetching marketplace provider:', error);
    res.status(500).json({ message: 'Failed to fetch marketplace provider' });
  }
});

router.post('/providers', authenticate, async (req, res) => {
  try {
    const providerData = {
      ...req.body,
      user_id: req.user?.id
    };
    
    const provider = await marketplaceStorage.createMarketplaceProvider(providerData);
    res.status(201).json(provider);
  } catch (error) {
    console.error('Error creating marketplace provider:', error);
    res.status(500).json({ message: 'Failed to create marketplace provider' });
  }
});

// Professionals (Professional Services)
router.get('/professionals', async (req, res) => {
  try {
    const filters = {
      ...req.query,
      provider_type: 'professional'
    };
    
    const professionals = await marketplaceStorage.getMarketplaceProviders(filters);
    res.json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ message: 'Failed to fetch professionals' });
  }
});

// Suppliers (Building Materials)
router.get('/suppliers', async (req, res) => {
  try {
    const filters = {
      ...req.query,
      provider_type: 'supplier'
    };
    
    const suppliers = await marketplaceStorage.getMarketplaceProviders(filters);
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers' });
  }
});

// Trades (Skilled Labor)
router.get('/trades', async (req, res) => {
  try {
    const filters = {
      ...req.query,
      provider_type: 'artisan'
    };
    
    const trades = await marketplaceStorage.getMarketplaceProviders(filters);
    res.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Training Programs
router.get('/training', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      provider_id: req.query.provider_id ? parseInt(req.query.provider_id as string) : undefined,
      status: req.query.status as string || 'active'
    };
    
    const programs = await marketplaceStorage.getTrainingPrograms(filters);
    res.json(programs);
  } catch (error) {
    console.error('Error fetching training programs:', error);
    res.status(500).json({ message: 'Failed to fetch training programs' });
  }
});

router.post('/training', authenticate, async (req, res) => {
  try {
    const program = await marketplaceStorage.createTrainingProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating training program:', error);
    res.status(500).json({ message: 'Failed to create training program' });
  }
});

// Building Materials
router.get('/materials', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      supplier_id: req.query.supplier_id ? parseInt(req.query.supplier_id as string) : undefined,
      status: req.query.status as string || 'available'
    };
    
    const materials = await marketplaceStorage.getBuildingMaterials(filters);
    res.json(materials);
  } catch (error) {
    console.error('Error fetching building materials:', error);
    res.status(500).json({ message: 'Failed to fetch building materials' });
  }
});

router.post('/materials', authenticate, async (req, res) => {
  try {
    const material = await marketplaceStorage.createBuildingMaterial(req.body);
    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating building material:', error);
    res.status(500).json({ message: 'Failed to create building material' });
  }
});

// Project Requests
router.get('/projects', async (req, res) => {
  try {
    const filters = {
      project_type: req.query.project_type as string,
      category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
      city: req.query.city as string,
      status: req.query.status as string || 'open',
      budget_range: req.query.budget_min && req.query.budget_max ? {
        min: parseInt(req.query.budget_min as string),
        max: parseInt(req.query.budget_max as string)
      } : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };
    
    const projects = await marketplaceStorage.getProjectRequests(filters);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching project requests:', error);
    res.status(500).json({ message: 'Failed to fetch project requests' });
  }
});

router.post('/projects', authenticate, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      client_id: req.user?.id
    };
    
    const project = await marketplaceStorage.createProjectRequest(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project request:', error);
    res.status(500).json({ message: 'Failed to create project request' });
  }
});

// Project Proposals
router.get('/projects/:id/proposals', async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const proposals = await marketplaceStorage.getProjectProposals(project_id);
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching project proposals:', error);
    res.status(500).json({ message: 'Failed to fetch project proposals' });
  }
});

router.post('/projects/:id/proposals', authenticate, async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const proposalData = {
      ...req.body,
      project_id,
      provider_id: req.user?.id // Assuming user is a provider
    };
    
    const proposal = await marketplaceStorage.createProjectProposal(proposalData);
    res.status(201).json(proposal);
  } catch (error) {
    console.error('Error creating project proposal:', error);
    res.status(500).json({ message: 'Failed to create project proposal' });
  }
});

// Reviews
router.get('/providers/:id/reviews', async (req, res) => {
  try {
    const provider_id = parseInt(req.params.id);
    const reviews = await marketplaceStorage.getMarketplaceReviews(provider_id);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching marketplace reviews:', error);
    res.status(500).json({ message: 'Failed to fetch marketplace reviews' });
  }
});

router.post('/providers/:id/reviews', authenticate, async (req, res) => {
  try {
    const provider_id = parseInt(req.params.id);
    const reviewData = {
      ...req.body,
      provider_id,
      client_id: req.user?.id
    };
    
    const review = await marketplaceStorage.createMarketplaceReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating marketplace review:', error);
    res.status(500).json({ message: 'Failed to create marketplace review' });
  }
});

// Job Opportunities
router.get('/jobs', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      employer_id: req.query.employer_id ? parseInt(req.query.employer_id as string) : undefined,
      status: req.query.status as string || 'active'
    };
    
    const jobs = await marketplaceStorage.getJobOpportunities(filters);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching job opportunities:', error);
    res.status(500).json({ message: 'Failed to fetch job opportunities' });
  }
});

router.post('/jobs', authenticate, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employer_id: req.user?.id
    };
    
    const job = await marketplaceStorage.createJobOpportunity(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job opportunity:', error);
    res.status(500).json({ message: 'Failed to create job opportunity' });
  }
});

// Search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const type = req.query.type as string;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await marketplaceStorage.searchMarketplace(query, type);
    res.json(results);
  } catch (error) {
    console.error('Error searching marketplace:', error);
    res.status(500).json({ message: 'Failed to search marketplace' });
  }
});

export { router as marketplaceRoutes };
