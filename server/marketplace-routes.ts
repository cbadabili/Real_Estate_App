import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from './auth-middleware';

const router = Router();

// Mock data for categories and services
const categories = {
  professionals: [
    { id: 1, name: 'Lawyers', description: 'Property law specialists', icon_url: '/icons/lawyer.svg', service_count: 45 },
    { id: 2, name: 'Valuers', description: 'Property valuation experts', icon_url: '/icons/valuer.svg', service_count: 23 },
    { id: 3, name: 'Conveyancers', description: 'Property transfer specialists', icon_url: '/icons/conveyancer.svg', service_count: 34 },
    { id: 4, name: 'Insurance Providers', description: 'Property insurance services', icon_url: '/icons/insurance.svg', service_count: 18 },
    { id: 5, name: 'Architects', description: 'Building design professionals', icon_url: '/icons/architect.svg', service_count: 27 }
  ],
  suppliers: [
    { id: 6, name: 'Hardware Stores', description: 'Building materials and tools', icon_url: '/icons/hardware.svg', service_count: 38 },
    { id: 7, name: 'Concrete Suppliers', description: 'Ready-mix concrete providers', icon_url: '/icons/concrete.svg', service_count: 15 },
    { id: 8, name: 'Timber Suppliers', description: 'Quality wood and lumber', icon_url: '/icons/timber.svg', service_count: 22 },
    { id: 9, name: 'Steel Suppliers', description: 'Construction steel and reinforcement', icon_url: '/icons/steel.svg', service_count: 12 },
    { id: 10, name: 'Paint Suppliers', description: 'Interior and exterior paints', icon_url: '/icons/paint.svg', service_count: 29 }
  ],
  artisans: [
    { id: 11, name: 'Plumbers', description: 'Water systems and pipe installation', icon_url: '/icons/plumber.svg', service_count: 67 },
    { id: 12, name: 'Electricians', description: 'Electrical installations and repairs', icon_url: '/icons/electrician.svg', service_count: 89 },
    { id: 13, name: 'Carpenters', description: 'Woodwork and furniture specialists', icon_url: '/icons/carpenter.svg', service_count: 45 },
    { id: 14, name: 'Masons', description: 'Brickwork and stonework experts', icon_url: '/icons/mason.svg', service_count: 34 },
    { id: 15, name: 'Painters', description: 'Interior and exterior painting', icon_url: '/icons/painter.svg', service_count: 56 },
    { id: 16, name: 'Roofers', description: 'Roofing installation and repairs', icon_url: '/icons/roofer.svg', service_count: 23 },
    { id: 17, name: 'Landscapers', description: 'Garden design and maintenance', icon_url: '/icons/landscaper.svg', service_count: 31 },
    { id: 18, name: 'Welders', description: 'Metal fabrication and welding', icon_url: '/icons/welder.svg', service_count: 19 }
  ],
  training_providers: [
    { id: 16, name: 'Property Valuation', description: 'Learn property assessment skills', icon_url: '/icons/valuation-course.svg', service_count: 8 },
    { id: 17, name: 'Conveyancing', description: 'Property transfer process training', icon_url: '/icons/conveyancing-course.svg', service_count: 6 },
    { id: 18, name: 'Construction Skills', description: 'Building and trade skills', icon_url: '/icons/construction-course.svg', service_count: 14 },
    { id: 19, name: 'Real Estate Sales', description: 'Property sales techniques', icon_url: '/icons/sales-course.svg', service_count: 12 },
    { id: 20, name: 'Property Management', description: 'Rental property management', icon_url: '/icons/management-course.svg', service_count: 9 }
  ]
};

const services = {
  professionals: [
    {
      id: 1, business_name: 'Mogale & Associates', business_description: 'Experienced property lawyers serving Botswana for over 15 years',
      service_area: 'Gaborone, Francistown', hourly_rate: 850, rating: 4.8, review_count: 127,
      contact_email: 'info@mogalelaw.bw', contact_phone: '+267 391 2345', category_id: 1, user_id: 101,
      profile_image: '/avatars/lawyer1.jpg', verified: true, years_experience: 15
    },
    {
      id: 2, business_name: 'Precision Valuers', business_description: 'Certified property valuers with extensive market knowledge',
      service_area: 'Nationwide', hourly_rate: 650, rating: 4.9, review_count: 89,
      contact_email: 'valuations@precision.bw', contact_phone: '+267 395 7890', category_id: 2, user_id: 102,
      profile_image: '/avatars/valuer1.jpg', verified: true, years_experience: 12
    }
  ],
  suppliers: [
    {
      id: 3, business_name: 'BuildMax Hardware', business_description: 'Complete range of building materials and tools',
      service_area: 'Gaborone, Molepolole', hourly_rate: 0, rating: 4.6, review_count: 203,
      contact_email: 'orders@buildmax.bw', contact_phone: '+267 390 1234', category_id: 6, user_id: 103,
      profile_image: '/avatars/hardware1.jpg', verified: true, years_experience: 8
    }
  ],
  artisans: [
    {
      id: 4, business_name: 'Elite Builders', business_description: 'Quality construction services for residential and commercial projects',
      service_area: 'Greater Gaborone', hourly_rate: 450, rating: 4.7, review_count: 156,
      contact_email: 'projects@elitebuilders.bw', contact_phone: '+267 392 5678', category_id: 11, user_id: 104,
      profile_image: '/avatars/builder1.jpg', verified: true, years_experience: 18
    }
  ],
  training_providers: [
    {
      id: 5, business_name: 'Property Academy Botswana', business_description: 'Professional development courses for real estate professionals',
      service_area: 'Online & Gaborone', hourly_rate: 300, rating: 4.5, review_count: 67,
      contact_email: 'courses@propertyacademy.bw', contact_phone: '+267 393 9012', category_id: 16, user_id: 105,
      profile_image: '/avatars/training1.jpg', verified: true, years_experience: 6
    }
  ]
};

// Provider registration schema
const providerRegistrationSchema = z.object({
  category_id: z.number(),
  business_name: z.string().min(1),
  business_description: z.string().min(10),
  service_area: z.string().min(1),
  hourly_rate: z.number().min(0),
  contact_email: z.string().email(),
  contact_phone: z.string().min(1),
  profile_image: z.string().optional()
});

// GET /api/categories?section={section}
router.get('/categories', async (req, res) => {
  try {
    const { section } = req.query;

    if (!section || typeof section !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Section parameter is required'
      });
    }

    const sectionCategories = categories[section as keyof typeof categories];

    if (!sectionCategories) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    res.json({
      success: true,
      data: sectionCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/services?section={section}&category={category}&limit={limit}
router.get('/services', async (req, res) => {
  try {
    const { section, category, limit = '10' } = req.query;

    if (!section || typeof section !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Section parameter is required'
      });
    }

    const sectionServices = services[section as keyof typeof services] || [];
    let filteredServices = sectionServices;

    // Filter by category if provided
    if (category && typeof category === 'string') {
      const categoryId = parseInt(category);
      filteredServices = sectionServices.filter(service => service.category_id === categoryId);
    }

    // Apply limit
    const limitNum = parseInt(limit as string);
    if (limitNum > 0) {
      filteredServices = filteredServices.slice(0, limitNum);
    }

    res.json({
      success: true,
      data: filteredServices,
      total: filteredServices.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/providers/{id}
router.get('/providers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = parseInt(id);

    // Search across all sections for the provider
    let provider = null;
    for (const sectionServices of Object.values(services)) {
      provider = sectionServices.find(service => service.id === providerId);
      if (provider) break;
    }

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch provider details'
    });
  }
});

// POST /api/providers/register
router.post('/providers/register', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const validatedData = providerRegistrationSchema.parse(req.body);

    // Create new provider
    const newProvider = {
      id: Math.floor(Math.random() * 10000),
      user_id: req.user.id,
      ...validatedData,
      rating: 0,
      review_count: 0,
      verified: false,
      years_experience: 0,
      created_at: new Date().toISOString()
    };

    // In a real app, you'd save this to the database
    // For now, we'll just return the created provider
    res.status(201).json({
      success: true,
      data: newProvider,
      message: 'Provider registration submitted successfully. Your profile will be reviewed and activated within 24 hours.'
    });
  } catch (error) {
    console.error('Error registering provider:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to register provider'
    });
  }
});

// GET /api/featured-services
router.get('/featured-services', async (req, res) => {
  try {
    const featuredServices = [
      ...services.professionals.slice(0, 2),
      ...services.suppliers.slice(0, 1),
      ...services.artisans.slice(0, 1)
    ];

    res.json({
      success: true,
      data: featuredServices
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured services'
    });
  }
});

// POST /api/providers/{id}/contact
router.post('/providers/:id/contact', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const { id } = req.params;
    const { message, contact_preference } = req.body;

    // In a real app, you'd send an email/SMS or create a lead record
    const contactRequest = {
      id: Math.floor(Math.random() * 10000),
      provider_id: parseInt(id),
      user_id: req.user.id,
      message,
      contact_preference,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: contactRequest,
      message: 'Your message has been sent to the provider. They will contact you soon.'
    });
  } catch (error) {
    console.error('Error sending contact request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send contact request'
    });
  }
});

// GET /api/marketplace/categories
router.get('/marketplace/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/marketplace/providers
router.get('/marketplace/providers', async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 12 } = req.query;

    const filters = {
      category: category as string,
      location: location as string,
      search: search as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };

    const providers = await getProviders(filters);
    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch providers'
    });
  }
});

// POST /api/marketplace/providers
router.post('/marketplace/providers', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const providerSchema = z.object({
      business_name: z.string().min(1, 'Business name is required'),
      business_description: z.string().min(1, 'Business description is required'),
      category_id: z.string().min(1, 'Category is required'),
      service_area: z.string().min(1, 'Service area is required'),
      hourly_rate: z.number().positive('Hourly rate must be positive'),
      phone: z.string().min(1, 'Phone number is required'),
      email: z.string().email('Valid email is required'),
      website: z.string().url().optional(),
      specialties: z.array(z.string()).optional()
    });

    const validatedData = providerSchema.parse(req.body);

    const provider = await createProvider({
      ...validatedData,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: provider,
      message: 'Provider registered successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating provider:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register provider'
    });
  }
});

// GET /api/marketplace/providers/:id
router.get('/marketplace/providers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await getProviderById(parseInt(id));

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch provider'
    });
  }
});

// PUT /api/marketplace/providers/:id
router.put('/marketplace/providers/:id', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const provider = await getProviderById(parseInt(id));

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }

    if (provider.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only update your own provider profile'
      });
    }

    const updateSchema = z.object({
      business_name: z.string().min(1).optional(),
      business_description: z.string().min(1).optional(),
      service_area: z.string().min(1).optional(),
      hourly_rate: z.number().positive().optional(),
      phone: z.string().min(1).optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      specialties: z.array(z.string()).optional()
    });

    const validatedData = updateSchema.parse(req.body);
    const updatedProvider = await updateProvider(parseInt(id), validatedData);

    res.json({
      success: true,
      data: updatedProvider,
      message: 'Provider updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating provider:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update provider'
    });
  }
});

// POST /api/marketplace/providers/:id/reviews
router.post('/marketplace/providers/:id/reviews', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const reviewSchema = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().min(1, 'Review comment is required'),
      service_type: z.string().optional()
    });

    const validatedData = reviewSchema.parse(req.body);

    const review = await createProviderReview({
      ...validatedData,
      provider_id: parseInt(id),
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
});

// GET /api/marketplace/providers/:id/reviews
router.get('/marketplace/providers/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await getProviderReviews(parseInt(id), {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// Helper functions for marketplace operations
async function getCategories() {
  return Object.values(categories).flat();
}

async function getProviders(filters: any) {
  let allProviders = Object.values(services).flat();

  if (filters.category) {
    allProviders = allProviders.filter(p => p.category_id.toString() === filters.category);
  }

  if (filters.location) {
    allProviders = allProviders.filter(p => 
      p.service_area.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.search) {
    allProviders = allProviders.filter(p => 
      p.business_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.business_description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  return allProviders.slice(0, filters.limit || 12);
}

async function getProviderById(id: number) {
  for (const sectionServices of Object.values(services)) {
    const provider = sectionServices.find(service => service.id === id);
    if (provider) return provider;
  }
  return null;
}

async function createProvider(data: any) {
  const newProvider = {
    id: Math.floor(Math.random() * 10000),
    ...data,
    rating: 0,
    review_count: 0,
    verified: false,
    years_experience: 0,
    created_at: new Date().toISOString()
  };
  return newProvider;
}

async function updateProvider(id: number, data: any) {
  const provider = await getProviderById(id);
  if (!provider) return null;
  return { ...provider, ...data, updated_at: new Date().toISOString() };
}

export default router;