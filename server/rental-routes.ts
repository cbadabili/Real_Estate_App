
import { Router } from 'express';
import { z } from 'zod';
import { rentalStorage } from './rental-storage';
import { authenticate } from './auth-middleware';

const router = Router();

// Validation schemas
const rentalListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  property_type: z.string().min(1),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  square_meters: z.number().min(0),
  monthly_rent: z.number().min(0),
  deposit_amount: z.number().min(0),
  lease_duration: z.number().min(1),
  available_from: z.string(),
  furnished: z.boolean(),
  pets_allowed: z.boolean(),
  parking_spaces: z.number().min(0),
  photos: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  utilities_included: z.array(z.string()).optional()
});

const applicationSchema = z.object({
  application_data: z.object({
    employment_info: z.object({
      employer: z.string(),
      position: z.string(),
      monthly_income: z.number(),
      employment_duration: z.string()
    }),
    references: z.array(z.object({
      name: z.string(),
      relationship: z.string(),
      contact: z.string()
    })),
    personal_info: z.object({
      emergency_contact: z.string(),
      preferred_move_in_date: z.string(),
      reason_for_moving: z.string()
    })
  })
});

// 2.1 Rental Listing Management (for Landlords)

// POST /api/rentals
router.post('/rentals', authenticate, async (req, res) => {
  try {
    const validatedData = rentalListingSchema.parse(req.body);
    
    const rental = await rentalStorage.createRental({
      ...validatedData,
      landlord_id: req.user.id,
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      data: rental,
      message: 'Rental listing created successfully'
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Invalid rental data'
    });
  }
});

// PUT /api/rentals/:rentalId
router.put('/rentals/:rentalId', authenticate, async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId);
    const validatedData = rentalListingSchema.partial().parse(req.body);
    
    const rental = await rentalStorage.updateRental(rentalId, validatedData, req.user.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: rental,
      message: 'Rental updated successfully'
    });
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Invalid rental data'
    });
  }
});

// GET /api/landlord/rentals
router.get('/landlord/rentals', authenticate, async (req, res) => {
  try {
    const rentals = await rentalStorage.getLandlordRentals(req.user.id);
    
    res.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error('Error fetching landlord rentals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rentals'
    });
  }
});

// POST /api/rentals/:rentalId/photos
router.post('/rentals/:rentalId/photos', authenticate, async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId);
    const { photos } = req.body;
    
    if (!Array.isArray(photos)) {
      return res.status(400).json({
        success: false,
        error: 'Photos must be an array'
      });
    }
    
    const rental = await rentalStorage.updateRental(rentalId, { photos }, req.user.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: rental,
      message: 'Photos uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photos'
    });
  }
});

// 2.2 Rental Discovery (for Renters)

// GET /api/rentals/search
router.get('/rentals/search', async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      bedrooms,
      propertyType,
      page = 0,
      limit = 20
    } = req.query;
    
    const filters = {
      location: location as string,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
      propertyType: propertyType as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };
    
    const rentals = await rentalStorage.searchRentals(filters);
    
    res.json({
      success: true,
      data: rentals,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: rentals.length
      }
    });
  } catch (error) {
    console.error('Error searching rentals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search rentals'
    });
  }
});

// GET /api/rentals/:rentalId
router.get('/rentals/:rentalId', async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId);
    const rental = await rentalStorage.getRentalById(rentalId);
    
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

// 2.3 Application & Screening Workflow

// POST /api/rentals/:rentalId/apply
router.post('/rentals/:rentalId/apply', authenticate, async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId);
    const validatedData = applicationSchema.parse(req.body);
    
    const application = await rentalStorage.createApplication({
      rental_id: rentalId,
      renter_id: req.user.id,
      application_data: validatedData.application_data,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Invalid application data'
    });
  }
});

// GET /api/landlord/applications
router.get('/landlord/applications', authenticate, async (req, res) => {
  try {
    const applications = await rentalStorage.getLandlordApplications(req.user.id);
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

// PUT /api/applications/:applicationId
router.put('/applications/:applicationId', authenticate, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.applicationId);
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const application = await rentalStorage.updateApplicationStatus(
      applicationId,
      status,
      req.user.id
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: application,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application'
    });
  }
});

// POST /api/applications/:applicationId/screen
router.post('/applications/:applicationId/screen', authenticate, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.applicationId);
    
    const application = await rentalStorage.screenTenant(applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application,
      message: 'Tenant screening initiated successfully'
    });
  } catch (error) {
    console.error('Error screening tenant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to screen tenant'
    });
  }
});

// 2.4 Lease & Payment Workflow

// POST /api/applications/:applicationId/generate-lease
router.post('/applications/:applicationId/generate-lease', authenticate, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.applicationId);
    const { lease_start_date, lease_end_date, lease_terms } = req.body;
    
    // Get application details
    const applications = await rentalStorage.getLandlordApplications(req.user.id);
    const application = applications.find(app => app.application.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found or not authorized'
      });
    }
    
    const lease = await rentalStorage.createLease({
      application_id: applicationId,
      rental_id: application.rental.id,
      landlord_id: req.user.id,
      renter_id: application.application.renter_id,
      lease_start_date,
      lease_end_date,
      monthly_rent: application.rental.monthly_rent,
      deposit_amount: application.rental.deposit_amount,
      lease_terms,
      landlord_signature_status: 'pending',
      renter_signature_status: 'pending',
      e_signature_status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: lease,
      message: 'Lease generated successfully'
    });
  } catch (error) {
    console.error('Error generating lease:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate lease'
    });
  }
});

// POST /api/leases/:leaseId/sign
router.post('/leases/:leaseId/sign', authenticate, async (req, res) => {
  try {
    const leaseId = parseInt(req.params.leaseId);
    const { role } = req.body;
    
    if (!['landlord', 'renter'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }
    
    const lease = await rentalStorage.updateLeaseSignature(leaseId, role, req.user.id);
    
    if (!lease) {
      return res.status(404).json({
        success: false,
        error: 'Lease not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: lease,
      message: 'Lease signed successfully'
    });
  } catch (error) {
    console.error('Error signing lease:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign lease'
    });
  }
});

// POST /api/leases/:leaseId/pay-rent
router.post('/leases/:leaseId/pay-rent', authenticate, async (req, res) => {
  try {
    const leaseId = parseInt(req.params.leaseId);
    const { amount } = req.body;
    
    const lease = await rentalStorage.getLeaseById(leaseId);
    
    if (!lease) {
      return res.status(404).json({
        success: false,
        error: 'Lease not found'
      });
    }
    
    // Simulate payment processing
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: amount,
      currency: 'BWP',
      status: 'succeeded',
      created: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: paymentIntent,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    });
  }
});

// GET /api/renter/applications
router.get('/renter/applications', authenticate, async (req, res) => {
  try {
    const applications = await rentalStorage.getRenterApplications(req.user.id);
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching renter applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

export default router;
