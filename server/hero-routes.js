import { Router } from 'express';
import { authenticate } from './auth-middleware';
import { db } from './db';
import { hero_slots, properties, entitlements } from '../shared/schema';
import { eq, and, lte, gte, desc } from 'drizzle-orm';
const router = Router();
// Get active hero listings for homepage carousel
router.get('/', async (req, res) => {
    try {
        const now = Date.now();
        const heroListings = await db
            .select({
            heroSlot: hero_slots,
            property: properties
        })
            .from(hero_slots)
            .innerJoin(properties, eq(hero_slots.property_id, properties.id))
            .where(and(eq(hero_slots.is_active, true), lte(hero_slots.starts_at, now), gte(hero_slots.ends_at, now)))
            .orderBy(hero_slots.position, desc(hero_slots.created_at))
            .limit(6); // Limit to 6 hero slots
        res.json({
            success: true,
            data: heroListings.map(item => ({
                ...item.property,
                heroSlot: item.heroSlot
            }))
        });
    }
    catch (error) {
        console.error('Error fetching hero listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hero listings'
        });
    }
});
// Purchase a hero slot for a property
router.post('/properties/:propertyId/hero', authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const propertyId = parseInt(req.params.propertyId);
        // Check if property exists and belongs to user
        const [property] = await db
            .select()
            .from(properties)
            .where(and(eq(properties.id, propertyId), eq(properties.user_id, req.user.id)));
        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found or access denied'
            });
        }
        // Check user's hero slots entitlement
        const [heroEntitlement] = await db
            .select()
            .from(entitlements)
            .where(and(eq(entitlements.user_id, req.user.id), eq(entitlements.feature_key, 'heroSlots')));
        if (!heroEntitlement || heroEntitlement.used_count >= heroEntitlement.feature_value) {
            return res.status(403).json({
                success: false,
                error: 'No hero slots available. Please upgrade your plan.'
            });
        }
        // Check if property already has an active hero slot
        const now = Date.now();
        const [existingSlot] = await db
            .select()
            .from(hero_slots)
            .where(and(eq(hero_slots.property_id, propertyId), eq(hero_slots.is_active, true), lte(hero_slots.starts_at, now), gte(hero_slots.ends_at, now)));
        if (existingSlot) {
            return res.status(400).json({
                success: false,
                error: 'Property already has an active hero slot'
            });
        }
        // Create hero slot (30 days duration)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const [heroSlot] = await db
            .insert(hero_slots)
            .values({
            property_id: propertyId,
            user_id: req.user.id,
            starts_at: now,
            ends_at: now + thirtyDays,
            position: 0,
            is_active: true
        })
            .returning();
        // Update entitlement usage
        await db
            .update(entitlements)
            .set({
            used_count: heroEntitlement.used_count + 1,
            updated_at: now
        })
            .where(eq(entitlements.id, heroEntitlement.id));
        res.status(201).json({
            success: true,
            data: heroSlot,
            message: 'Property featured in hero carousel for 30 days'
        });
    }
    catch (error) {
        console.error('Error creating hero slot:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to feature property'
        });
    }
});
// Admin route to manage hero slots
router.get('/admin', authenticate, async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }
        const allHeroSlots = await db
            .select({
            heroSlot: hero_slots,
            property: properties
        })
            .from(hero_slots)
            .innerJoin(properties, eq(hero_slots.property_id, properties.id))
            .orderBy(desc(hero_slots.created_at));
        res.json({
            success: true,
            data: allHeroSlots
        });
    }
    catch (error) {
        console.error('Error fetching admin hero slots:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hero slots'
        });
    }
});
export default router;
