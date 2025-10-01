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

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

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

// Submit maintenance request
router.post('/maintenance-requests', async (req, res) => {
  try {
    const requestData = req.body;

    // Validate required fields
    if (!requestData.property_id || !requestData.description) {
      return res.status(400).json({
        success: false,
        error: 'Property ID and description are required'
      });
    }

    // Mock creation - replace with actual database insert
    const newRequest = {
      id: Math.floor(Math.random() * 1000),
      ...requestData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Maintenance request submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting maintenance request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit maintenance request'
    });
  }
});

// Get tenant's maintenance requests
router.get('/maintenance-requests', async (req, res) => {
  try {
    const tenantId = req.query.tenant_id ? parseInt(req.query.tenant_id as string) : undefined;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    // Mock data - replace with actual database query
    const requests = [
      {
        id: 1,
        property_id: 1,
        tenant_id: tenantId,
        type: 'plumbing',
        priority: 'high',
        description: 'Kitchen sink is leaking',
        status: 'pending',
        created_at: new Date().toISOString()
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

// Make rent payment
router.post('/rent-payments', async (req, res) => {
  try {
    const paymentData = req.body;

    // Validate required fields
    if (!paymentData.rental_id || !paymentData.amount) {
      return res.status(400).json({
        success: false,
        error: 'Rental ID and amount are required'
      });
    }

    // Mock payment processing - replace with actual payment gateway integration
    const payment = {
      id: Math.floor(Math.random() * 1000),
      ...paymentData,
      payment_date: new Date().toISOString(),
      status: 'completed',
      transaction_id: `TXN${Date.now()}`
    };

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing rent payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process rent payment'
    });
  }
});

// Get tenant's payment history
router.get('/rent-payments', async (req, res) => {
  try {
    const tenantId = req.query.tenant_id ? parseInt(req.query.tenant_id as string) : undefined;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    // Mock data - replace with actual database query
    const payments = [
      {
        id: 1,
        rental_id: 1,
        tenant_id: tenantId,
        amount: 5000,
        payment_date: '2024-01-28',
        status: 'completed',
        transaction_id: 'TXN123456'
      }
    ];

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment history'
    });
  }
});

export default router;