import { Router } from 'express';
import { ServicesStorage } from './services-storage';

const router = Router();
const servicesStorage = new ServicesStorage();

// GET /api/services - Get all services or by section
router.get('/services', async (req, res) => {
  try {
    const { section, category } = req.query;

    console.log('Services request:', { section, category });

    if (section && typeof section === 'string') {
      // Get services by section
      const services = await servicesStorage.getServicesBySection(section);
      res.json({
        success: true,
        data: services
      });
    } else if (category && typeof category === 'string') {
      // Get services by category
      const services = await servicesStorage.getServicesByCategory(category);
      res.json({
        success: true,
        data: services
      });
    } else {
      // Get all services if no section specified
      const services = await servicesStorage.getAllServices();
      res.json({
        success: true,
        data: services
      });
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/categories - Get all service categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await servicesStorage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/marketplace/providers - Get marketplace providers
router.get('/marketplace/providers', async (req, res) => {
  try {
    const { section, category } = req.query;

    if (section && typeof section === 'string') {
      const providers = await servicesStorage.getProvidersBySection(section);
      res.json({
        success: true,
        data: providers
      });
    } else if (category && typeof category === 'string') {
      const providers = await servicesStorage.getProvidersByCategory(category);
      res.json({
        success: true,
        data: providers
      });
    } else {
      const providers = await servicesStorage.getAllProviders();
      res.json({
        success: true,
        data: providers
      });
    }
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch providers'
    });
  }
});

// POST /api/services - Create a new service
router.post('/services', async (req, res) => {
  try {
    const serviceData = req.body;
    const service = await servicesStorage.createService(serviceData);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service'
    });
  }
});

export default router;