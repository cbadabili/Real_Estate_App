import express from 'express';
import { RentalStorage } from './rental-storage';
import { Database } from 'better-sqlite3';

export function createRentalRoutes(db: Database): express.Router {
  const router = express.Router();
  const rentalStorage = new RentalStorage(db);

  // Get all rentals
  router.get('/', async (req, res) => {
    try {
      const rentals = rentalStorage.getAllRentals();
      res.json({
        success: true,
        data: rentals,
        count: rentals.length
      });
    } catch (error) {
      console.error('Error fetching rentals:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch rentals'
      });
    }
  });

  // Get rental by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rental ID'
        });
      }

      const rental = rentalStorage.getRentalById(id);
      if (!rental) {
        return res.status(404).json({
          success: false,
          error: 'Rental not found'
        });
      }

      res.json({
        success: true,
        data: rental
      });
    } catch (error) {
      console.error('Error fetching rental:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch rental'
      });
    }
  });

  // Search rentals
  router.get('/search', async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string,
        city: req.query.city as string,
        district: req.query.district as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
        property_type: req.query.property_type as string,
        furnished: req.query.furnished === 'true',
        pet_friendly: req.query.pet_friendly === 'true',
        parking: req.query.parking === 'true',
        garden: req.query.garden === 'true',
        security: req.query.security === 'true',
        air_conditioning: req.query.air_conditioning === 'true',
        internet: req.query.internet === 'true',
        utilities_included: req.query.utilities_included === 'true',
        available_date: req.query.available_date as string,
        status: req.query.status as string || 'available'
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const rentals = rentalStorage.searchRentals(filters);
      res.json({
        success: true,
        data: rentals,
        count: rentals.length,
        filters: filters
      });
    } catch (error) {
      console.error('Error searching rentals:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search rentals'
      });
    }
  });

  // Create new rental
  router.post('/', async (req, res) => {
    try {
      const rentalData = req.body;

      // Validate required fields
      if (!rentalData.title || !rentalData.price || !rentalData.location || !rentalData.city) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, price, location, city'
        });
      }

      const rental = rentalStorage.createRental(rentalData);
      res.status(201).json({
        success: true,
        data: rental
      });
    } catch (error) {
      console.error('Error creating rental:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create rental'
      });
    }
  });

  // Update rental
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rental ID'
        });
      }

      const updated = rentalStorage.updateRental(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Rental not found'
        });
      }

      const rental = rentalStorage.getRentalById(id);
      res.json({
        success: true,
        data: rental
      });
    } catch (error) {
      console.error('Error updating rental:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update rental'
      });
    }
  });

  // Delete rental
  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rental ID'
        });
      }

      const deleted = rentalStorage.deleteRental(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Rental not found'
        });
      }

      res.json({
        success: true,
        message: 'Rental deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting rental:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete rental'
      });
    }
  });

  // Get rental applications
  router.get('/:id/applications', async (req, res) => {
    try {
      const rentalId = parseInt(req.params.id);
      if (isNaN(rentalId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rental ID'
        });
      }

      const applications = rentalStorage.getRentalApplications(rentalId);
      res.json({
        success: true,
        data: applications,
        count: applications.length
      });
    } catch (error) {
      console.error('Error fetching rental applications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch rental applications'
      });
    }
  });

  // Create rental application
  router.post('/:id/applications', async (req, res) => {
    try {
      const rentalId = parseInt(req.params.id);
      if (isNaN(rentalId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rental ID'
        });
      }

      // Check if rental exists
      const rental = rentalStorage.getRentalById(rentalId);
      if (!rental) {
        return res.status(404).json({
          success: false,
          error: 'Rental not found'
        });
      }

      const applicationData = {
        ...req.body,
        rental_id: rentalId,
        application_date: new Date().toISOString(),
        status: 'pending'
      };

      const application = rentalStorage.createRentalApplication(applicationData);
      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error creating rental application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create rental application'
      });
    }
  });

  // Update rental application status
  router.patch('/applications/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid application ID'
        });
      }

      const { status } = req.body;
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be: pending, approved, or rejected'
        });
      }

      const updated = rentalStorage.updateRentalApplicationStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      res.json({
        success: true,
        message: 'Application status updated successfully'
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update application status'
      });
    }
  });

  // Get rental statistics
  router.get('/stats', async (req, res) => {
    try {
      const stats = rentalStorage.getRentalStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching rental stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch rental stats'
      });
    }
  });

  return router;
}