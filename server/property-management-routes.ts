
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from './auth-middleware';

const router = Router();

// Property Management Routes

// GET /api/property-management/dashboard
router.get('/property-management/dashboard', authenticate, async (req, res) => {
  try {
    // Mock property management dashboard data
    const dashboardData = {
      totalProperties: 5,
      activeRentals: 3,
      maintenanceRequests: 2,
      monthlyRevenue: 12500,
      occupancyRate: 85,
      recentActivity: [
        {
          id: 1,
          type: 'maintenance',
          description: 'AC repair completed in Unit 3B',
          date: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          type: 'payment',
          description: 'Rent payment received from John Doe',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching property management dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// POST /api/property-management/maintenance-request
router.post('/property-management/maintenance-request', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { propertyId, title, description, priority, category } = req.body;

    // Mock maintenance request creation
    const maintenanceRequest = {
      id: Math.floor(Math.random() * 1000),
      propertyId,
      title,
      description,
      priority: priority || 'medium',
      category,
      status: 'pending',
      tenantId: req.user.id,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: maintenanceRequest,
      message: 'Maintenance request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create maintenance request'
    });
  }
});

// GET /api/property-management/maintenance-requests
router.get('/property-management/maintenance-requests', authenticate, async (req, res) => {
  try {
    // Mock maintenance requests
    const requests = [
      {
        id: 1,
        title: 'Leaking Faucet',
        description: 'Kitchen faucet has been dripping for days',
        priority: 'medium',
        status: 'pending',
        category: 'plumbing',
        property: 'Apartment 2B - Gaborone CBD',
        createdAt: new Date().toISOString(),
        estimatedCost: 350
      },
      {
        id: 2,
        title: 'AC Not Working',
        description: 'Air conditioning unit stopped working completely',
        priority: 'high',
        status: 'in_progress',
        category: 'hvac',
        property: 'House 15 - Phakalane',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedCost: 1200
      }
    ];

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch maintenance requests'
    });
  }
});

// GET /api/properties
router.get('/properties', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Properties retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
});

// POST /api/properties
router.post('/properties', authenticate, async (req, res) => {
  try {
    const property = {
      id: Math.floor(Math.random() * 10000),
      ...req.body,
      owner_id: req.user?.id,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create property'
    });
  }
});

// GET /api/properties/:id
router.get('/properties/:id', authenticate, async (req, res) => {
  try {
    const property = {
      id: parseInt(req.params.id),
      title: 'Sample Property',
      owner_id: req.user?.id
    };

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    });
  }
});

// PUT /api/properties/:id
router.put('/properties/:id', authenticate, async (req, res) => {
  try {
    const property = {
      id: parseInt(req.params.id),
      ...req.body,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update property'
    });
  }
});

// DELETE /api/properties/:id
router.delete('/properties/:id', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete property'
    });
  }
});

export default router;
import express from 'express';
import { RentalStorage } from './rental-storage';

export function createPropertyManagementRoutes(): express.Router {
  const router = express.Router();
  const rentalStorage = new RentalStorage();

  // Get dashboard data
  router.get('/dashboard', async (req, res) => {
    try {
      const stats = await rentalStorage.getRentalStats();
      const recentActivity = [
        {
          id: 1,
          type: 'maintenance',
          description: 'Plumbing repair completed at Gaborone Apartment',
          date: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          type: 'rental',
          description: 'New tenant application for CBD Office Space',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending'
        },
        {
          id: 3,
          type: 'payment',
          description: 'Rent payment received for Francistown House',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed'
        }
      ];

      const dashboardData = {
        totalProperties: stats.total,
        activeRentals: stats.available,
        maintenanceRequests: 5,
        monthlyRevenue: stats.avgPrice * stats.available,
        occupancyRate: stats.rented > 0 ? (stats.rented / stats.total) * 100 : 0,
        recentActivity
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Error fetching property management dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data'
      });
    }
  });

  // Get all managed properties
  router.get('/properties', async (req, res) => {
    try {
      const properties = await rentalStorage.getAllRentals();
      res.json({
        success: true,
        data: properties
      });
    } catch (error) {
      console.error('Error fetching managed properties:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch properties'
      });
    }
  });

  // Get maintenance requests
  router.get('/maintenance', async (req, res) => {
    try {
      const maintenanceRequests = [
        {
          id: 1,
          propertyId: 1,
          description: 'Leaking faucet in kitchen',
          priority: 'medium',
          status: 'pending',
          reportedDate: new Date().toISOString(),
          tenantName: 'John Doe'
        },
        {
          id: 2,
          propertyId: 2,
          description: 'Air conditioning not working',
          priority: 'high',
          status: 'in_progress',
          reportedDate: new Date(Date.now() - 86400000).toISOString(),
          tenantName: 'Jane Smith'
        }
      ];

      res.json({
        success: true,
        data: maintenanceRequests
      });
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch maintenance requests'
      });
    }
  });

  // Create maintenance request
  router.post('/maintenance', async (req, res) => {
    try {
      const { propertyId, description, priority } = req.body;
      
      const newRequest = {
        id: Date.now(),
        propertyId,
        description,
        priority: priority || 'medium',
        status: 'pending',
        reportedDate: new Date().toISOString(),
        tenantName: 'System Generated'
      };

      res.status(201).json({
        success: true,
        data: newRequest
      });
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create maintenance request'
      });
    }
  });

  return router;
}
