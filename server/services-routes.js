import express from 'express';
import { servicesStorage } from './services-storage';
import { insertServiceProviderSchema } from '../shared/services-schema';
import { z } from 'zod';
const router = express.Router();
// Get all service providers
router.get('/providers', async (req, res) => {
    try {
        const { category, city, verified, featured, reacCertified, minRating, limit, offset, sortBy, sortOrder } = req.query;
        const filters = {
            category: category,
            city: city,
            verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
            featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
            reacCertified: reacCertified === 'true' ? true : reacCertified === 'false' ? false : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            sortBy: sortBy,
            sortOrder: sortOrder
        };
        const providers = await servicesStorage.getServiceProviders(filters);
        res.json(providers);
    }
    catch (error) {
        console.error('Error fetching service providers:', error);
        res.status(500).json({ message: 'Failed to fetch service providers' });
    }
});
// Get service provider by ID
router.get('/providers/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const provider = await servicesStorage.getServiceProvider(id);
        if (!provider) {
            return res.status(404).json({ message: 'Service provider not found' });
        }
        res.json(provider);
    }
    catch (error) {
        console.error('Error fetching service provider:', error);
        res.status(500).json({ message: 'Failed to fetch service provider' });
    }
});
// Create new service provider
router.post('/providers', async (req, res) => {
    try {
        const validatedData = insertServiceProviderSchema.parse(req.body);
        const newProvider = await servicesStorage.createServiceProvider(validatedData);
        res.status(201).json(newProvider);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Error creating service provider:', error);
        res.status(500).json({ message: 'Failed to create service provider' });
    }
});
// Get service categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await servicesStorage.getServiceCategories();
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching service categories:', error);
        res.status(500).json({ message: 'Failed to fetch service categories' });
    }
});
// Get contextual ad
router.get('/ads/:trigger', async (req, res) => {
    try {
        const trigger = req.params.trigger;
        const ad = await servicesStorage.getContextualAd(trigger);
        if (!ad) {
            return res.status(404).json({ message: 'No ad found for this trigger' });
        }
        res.json(ad);
    }
    catch (error) {
        console.error('Error fetching contextual ad:', error);
        res.status(500).json({ message: 'Failed to fetch contextual ad' });
    }
});
// Track ad click
router.post('/ads/:id/click', async (req, res) => {
    try {
        const adId = parseInt(req.params.id);
        await servicesStorage.incrementAdMetrics(adId, 'clicks');
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error tracking ad click:', error);
        res.status(500).json({ message: 'Failed to track ad click' });
    }
});
// Get reviews for a service provider
router.get('/providers/:id/reviews', async (req, res) => {
    try {
        const providerId = parseInt(req.params.id);
        const reviews = await servicesStorage.getServiceReviews(providerId);
        res.json(reviews);
    }
    catch (error) {
        console.error('Error fetching service reviews:', error);
        res.status(500).json({ message: 'Failed to fetch service reviews' });
    }
});
export default router;
