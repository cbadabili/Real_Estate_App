
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

// GET /api/support/tickets
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

// POST /api/support/tickets
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
import express from 'express';

export function createTenantSupportRoutes(): express.Router {
  const router = express.Router();

  // Get support resources
  router.get('/resources', async (req, res) => {
    try {
      const resources = {
        tenantRights: [
          {
            title: 'Right to Peaceful Enjoyment',
            description: 'You have the right to use your rental property without unreasonable interference from your landlord.',
            details: 'Landlords cannot enter without proper notice (typically 24-48 hours) except in emergencies.'
          },
          {
            title: 'Right to Habitable Housing',
            description: 'Your rental property must meet basic health and safety standards.',
            details: 'This includes proper plumbing, heating, electrical systems, and structural integrity.'
          },
          {
            title: 'Right to Security Deposit Return',
            description: 'You are entitled to the return of your security deposit minus legitimate deductions.',
            details: 'Landlords must provide itemized list of deductions and return deposits within 30 days of lease termination.'
          }
        ],
        legalRequirements: [
          {
            title: 'Rental Agreement Requirements',
            description: 'All rental agreements must be in writing and include specific terms.',
            details: 'Must include rent amount, payment schedule, lease duration, and property condition.'
          },
          {
            title: 'Notice Requirements',
            description: 'Proper notice must be given for lease termination and rent increases.',
            details: 'Typically 30 days notice for month-to-month tenancies, 60 days for rent increases.'
          },
          {
            title: 'Landlord Obligations',
            description: 'Landlords must maintain the property and address health/safety issues.',
            details: 'Includes repairs, pest control, and ensuring compliance with building codes.'
          }
        ],
        contactInfo: {
          helpline: '+267 123 4567',
          email: 'support@beedab.com',
          officeHours: 'Monday - Friday: 8:00 AM - 6:00 PM'
        }
      };

      res.json({
        success: true,
        data: resources
      });
    } catch (error) {
      console.error('Error fetching support resources:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch support resources'
      });
    }
  });

  // Submit a complaint
  router.post('/complaint', async (req, res) => {
    try {
      const { subject, description, category, propertyId } = req.body;
      
      const complaint = {
        id: Date.now(),
        referenceNumber: `TN-${Date.now().toString().slice(-6)}`,
        subject,
        description,
        category,
        propertyId,
        status: 'submitted',
        submittedDate: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: complaint,
        message: 'Complaint submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit complaint'
      });
    }
  });

  // Get tenant complaints
  router.get('/complaints', async (req, res) => {
    try {
      const complaints = [
        {
          id: 1,
          referenceNumber: 'TN-123456',
          subject: 'Heating system not working',
          category: 'maintenance',
          status: 'in_progress',
          submittedDate: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: complaints
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch complaints'
      });
    }
  });

  return router;
}
