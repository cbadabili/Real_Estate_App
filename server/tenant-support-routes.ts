
import { Router } from 'express';
import { authenticate } from './auth-middleware';

const router = Router();

// Tenant Support Routes

// GET /api/tenant-support/resources
router.get('/tenant-support/resources', async (req, res) => {
  try {
    const resources = {
      tenantRights: [
        {
          title: 'Right to Safe Housing',
          description: 'Tenants have the right to live in safe, habitable conditions',
          details: 'Landlords must ensure properties meet basic safety and health standards'
        },
        {
          title: 'Privacy Rights',
          description: 'Landlords must give proper notice before entering rental property',
          details: 'Typically 24-48 hours notice required except in emergencies'
        },
        {
          title: 'Deposit Protection',
          description: 'Security deposits must be returned within reasonable time',
          details: 'Deposits can only be withheld for legitimate damages or unpaid rent'
        }
      ],
      legalRequirements: [
        {
          title: 'Rental Agreement',
          description: 'All rentals must have written agreements',
          details: 'Agreements should specify terms, rent amount, and responsibilities'
        },
        {
          title: 'Rent Control',
          description: 'Rent increases must follow legal procedures',
          details: 'Notice periods and maximum increase percentages apply'
        }
      ],
      contactInfo: {
        helpline: '+267 123 4567',
        email: 'support@beedab.co.bw',
        officeHours: 'Monday-Friday 8:00-17:00'
      }
    };

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching tenant support resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch support resources'
    });
  }
});

// POST /api/tenant-support/complaint
router.post('/tenant-support/complaint', authenticate, async (req, res) => {
  try {
    const { subject, description, category, propertyId } = req.body;
    
    const complaint = {
      id: Math.floor(Math.random() * 1000),
      subject,
      description,
      category,
      propertyId,
      tenantId: req.user.id,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      referenceNumber: `TS${Date.now()}`
    };

    res.status(201).json({
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully. You will receive updates via email.'
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit complaint'
    });
  }
});

// GET /api/tenant-support/agreements
router.get('/tenant-support/agreements', authenticate, async (req, res) => {
  try {
    // Mock rental agreements for the tenant
    const agreements = [
      {
        id: 1,
        propertyTitle: 'Modern Apartment in Gaborone CBD',
        propertyAddress: '123 Independence Ave, Gaborone',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        monthlyRent: 8500,
        depositAmount: 17000,
        status: 'active',
        downloadUrl: '/api/documents/lease-agreement-1.pdf'
      }
    ];

    res.json({
      success: true,
      data: agreements
    });
  } catch (error) {
    console.error('Error fetching rental agreements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rental agreements'
    });
  }
});

export default router;
import { Router } from 'express';
import { authenticate } from './auth-middleware';

const router = Router();

// Placeholder routes for tenant support
router.get('/support/tickets', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Support tickets retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch support tickets'
    });
  }
});

router.post('/support/tickets', authenticate, async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    
    const ticket = {
      id: Math.floor(Math.random() * 10000),
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      user_id: req.user?.id,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create support ticket'
    });
  }
});

export default router;
