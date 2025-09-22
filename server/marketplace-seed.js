import { db } from "./db";
import { marketplace_providers, service_categories } from "../shared/schema";
export async function seedMarketplace() {
    console.log('Seeding marketplace...');
    // Check if marketplace providers already exist
    const existingProviders = await db.select().from(marketplace_providers).limit(1);
    if (existingProviders.length > 0) {
        console.log('✅ Marketplace providers already exist, skipping...');
        return;
    }
    // Sample marketplace data
    const sampleCategories = [
        {
            name: 'Real Estate Professionals',
            journey_type: 'professionals',
            icon: '/icons/professional.svg',
            description: 'Licensed real estate agents and brokers',
            sort_order: 1,
            is_active: true
        },
        {
            name: 'Property Valuers',
            journey_type: 'professionals',
            icon: '/icons/valuer.svg',
            description: 'Certified property valuation experts',
            sort_order: 2,
            is_active: true
        },
        {
            name: 'Construction Materials',
            journey_type: 'suppliers',
            icon: '/icons/materials.svg',
            description: 'Building materials and supplies',
            sort_order: 3,
            is_active: true
        },
        {
            name: 'Skilled Artisans',
            journey_type: 'artisans',
            icon: '/icons/artisan.svg',
            description: 'Skilled tradespeople and craftsmen',
            sort_order: 4,
            is_active: true
        }
    ];
    // Insert categories first
    await db.insert(service_categories).values(sampleCategories);
    const sampleProviders = [
        {
            user_id: 1,
            provider_type: 'professional',
            business_name: 'Premium Properties Botswana',
            category_id: 1,
            specializations: 'Residential, Commercial, Land Sales',
            service_areas: 'Gaborone, Phakalane, Mogoditshane',
            contact_person: 'John Mokwena',
            phone: '+267 71 234 567',
            email: 'john@premiumproperties.bw',
            description: 'Leading real estate agency in Botswana with over 15 years of experience',
            years_experience: 15,
            is_verified: true,
            is_featured: true,
            rating: 4.8,
            review_count: 127,
            status: 'active'
        },
        {
            user_id: 2,
            provider_type: 'artisan',
            business_name: 'Elite Builders & Contractors',
            category_id: 4,
            specializations: 'Construction, Renovation, Plumbing, Electrical',
            service_areas: 'Greater Gaborone',
            contact_person: 'Thabo Kgositsile',
            phone: '+267 72 345 678',
            email: 'thabo@elitebuilders.bw',
            description: 'Quality construction services for residential and commercial projects',
            years_experience: 12,
            is_verified: true,
            is_featured: false,
            rating: 4.6,
            review_count: 89,
            status: 'active'
        }
    ];
    // Insert providers
    await db.insert(marketplace_providers).values(sampleProviders);
    console.log('✅ Marketplace seeded successfully');
}
