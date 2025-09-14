
import { db } from "./db";
import { plans } from "../shared/schema";

export async function seedBilling() {
  console.log('Seeding billing plans...');

  // Check if plans already exist
  const existingPlans = await db.select().from(plans).limit(1);
  if (existingPlans.length > 0) {
    console.log('✅ Billing plans already exist, skipping...');
    return;
  }

  // Define plan features and pricing
  const planData = [
    {
      code: 'LISTER_FREE',
      name: 'Free Lister',
      description: 'Perfect for first-time property listers',
      price_bwp: 0,
      interval: 'monthly',
      features: JSON.stringify({
        listingLimit: 1,
        photosPerListing: 5,
        analytics: false,
        heroSlots: 0,
        priorityRanking: false,
        leadManager: false,
        directoryListing: false,
        bookingWidget: false
      })
    },
    {
      code: 'LISTER_PRO',
      name: 'Pro Lister',
      description: 'For casual property listers who want more exposure',
      price_bwp: 100,
      interval: 'monthly',
      features: JSON.stringify({
        listingLimit: 5,
        photosPerListing: 20,
        analytics: true,
        heroSlots: 0,
        priorityRanking: true,
        leadManager: false,
        directoryListing: false,
        bookingWidget: false
      })
    },
    {
      code: 'LISTER_PREMIUM',
      name: 'Premium Lister',
      description: 'For serious sellers and landlords who want maximum visibility',
      price_bwp: 200,
      interval: 'monthly',
      features: JSON.stringify({
        listingLimit: -1, // unlimited
        photosPerListing: 50,
        analytics: true,
        heroSlots: 1,
        priorityRanking: true,
        leadManager: false,
        directoryListing: false,
        bookingWidget: false
      })
    },
    {
      code: 'AGENT',
      name: 'Real Estate Agent',
      description: 'Professional tools for real estate agents',
      price_bwp: 150,
      interval: 'monthly',
      features: JSON.stringify({
        listingLimit: -1, // unlimited
        photosPerListing: 50,
        analytics: true,
        heroSlots: 2,
        priorityRanking: true,
        leadManager: true,
        directoryListing: true,
        bookingWidget: true
      })
    },
    {
      code: 'SERVICE_PROVIDER',
      name: 'Service Provider',
      description: 'For contractors, artisans, and property service providers',
      price_bwp: 100,
      interval: 'monthly',
      features: JSON.stringify({
        listingLimit: 0, // no property listings
        photosPerListing: 0,
        analytics: false,
        heroSlots: 0,
        priorityRanking: false,
        leadManager: false,
        directoryListing: true,
        bookingWidget: true
      })
    }
  ];

  // Insert plans
  await db.insert(plans).values(planData);

  console.log('✅ Billing plans seeded successfully');
}
