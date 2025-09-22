import express from 'express';
import { RentalStorage } from './rental-storage';
export function createRentalRoutes() {
    const router = express.Router();
    const rentalStorage = new RentalStorage();
    // Get rental statistics (must come before /:id route)
    router.get('/stats', async (req, res) => {
        try {
            const stats = await rentalStorage.getRentalStats();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Error fetching rental stats:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch rental stats'
            });
        }
    });
    // Search rentals (must come before /:id route)
    router.get('/search', async (req, res) => {
        try {
            const filters = {
                location: req.query.location,
                city: req.query.city,
                district: req.query.district,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
                bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms) : undefined,
                bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms) : undefined,
                property_type: req.query.property_type,
                furnished: req.query.furnished === 'true',
                pets_allowed: req.query.pets_allowed === 'true' || req.query.pet_friendly === 'true',
                parking_spaces: req.query.parking_spaces ? parseInt(req.query.parking_spaces) : undefined,
                available_from: req.query.available_from || req.query.available_date,
                status: req.query.status || 'active'
            };
            // Remove undefined values
            Object.keys(filters).forEach(key => {
                if (filters[key] === undefined) {
                    delete filters[key];
                }
            });
            const rentals = await rentalStorage.searchRentals(filters);
            res.json({
                success: true,
                data: rentals,
                count: rentals.length,
                filters: filters
            });
        }
        catch (error) {
            console.error('Error searching rentals:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to search rentals'
            });
        }
    });
    // Get all rentals
    router.get('/', async (req, res) => {
        try {
            const rentals = await rentalStorage.getAllRentals();
            res.json({
                success: true,
                data: rentals,
                count: rentals.length
            });
        }
        catch (error) {
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
            const rental = await rentalStorage.getRentalById(id);
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
        }
        catch (error) {
            console.error('Error fetching rental:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch rental'
            });
        }
    });
    // Create new rental
    router.post('/', async (req, res) => {
        try {
            const rentalData = req.body;
            // Validate required fields
            if (!rentalData.title || (!rentalData.price && !rentalData.monthly_rent) || !rentalData.location || !rentalData.city) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: title, price/monthly_rent, location, city'
                });
            }
            const rental = await rentalStorage.createRental(rentalData);
            res.status(201).json({
                success: true,
                data: rental
            });
        }
        catch (error) {
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
            const updated = await rentalStorage.updateRental(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    error: 'Rental not found'
                });
            }
            const rental = await rentalStorage.getRentalById(id);
            res.json({
                success: true,
                data: rental
            });
        }
        catch (error) {
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
            const deleted = await rentalStorage.deleteRental(id);
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
        }
        catch (error) {
            console.error('Error deleting rental:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete rental'
            });
        }
    });
    // Get user's rental listings
    router.get('/user', async (req, res) => {
        try {
            // This would need user authentication middleware
            // For now, return empty array
            res.json({
                success: true,
                data: []
            });
        }
        catch (error) {
            console.error('Error fetching user rentals:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user rentals'
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
            const applications = await rentalStorage.getRentalApplications(rentalId);
            res.json({
                success: true,
                data: applications,
                count: applications.length
            });
        }
        catch (error) {
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
            const rental = await rentalStorage.getRentalById(rentalId);
            if (!rental) {
                return res.status(404).json({
                    success: false,
                    error: 'Rental not found'
                });
            }
            const applicationData = {
                rental_id: rentalId,
                renter_id: req.body.renter_id || 1, // Default renter ID for testing
                application_data: req.body,
                status: 'pending'
            };
            const application = await rentalStorage.createRentalApplication(applicationData);
            res.status(201).json({
                success: true,
                data: application
            });
        }
        catch (error) {
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
            const updated = await rentalStorage.updateRentalApplicationStatus(id, status);
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
        }
        catch (error) {
            console.error('Error updating application status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update application status'
            });
        }
    });
    return router;
}
