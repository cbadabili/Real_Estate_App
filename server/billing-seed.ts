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

  // Plans v2 – simple pricing & clear value
  const planData = [
    {
      id: 1,
      code: 'LISTER_FREE',
      name: 'Free',
      description: 'Basic plan for individual listers',
      price_bwp: 0,
      features: JSON.stringify({
        LISTING_LIMIT: '1',
        PHOTO_LIMIT: '5',
        PRIORITY_RANK: '0'
      }),
      is_active: true
    },
    {
      id: 2,
      code: 'LISTER_PRO',
      name: 'Pro',
      description: 'Professional plan for active listers',
      price_bwp: 100,
      features: JSON.stringify({
        LISTING_LIMIT: '5',
        PHOTO_LIMIT: '20',
        ANALYTICS: 'true',
        PRIORITY_RANK: '0'
      }),
      is_active: true
    },
    {
      id: 3,
      code: 'BUSINESS',
      name: 'Business',
      description: 'Business plan for agents and service providers',
      price_bwp: 150,
      features: JSON.stringify({
        LISTING_LIMIT: 'unlimited',
        PHOTO_LIMIT: '50',
        DIRECTORY: 'true',
        BOOKING: 'true',
        LEAD_MANAGER: 'true',
        PRIORITY_RANK: '1'
      }),
      is_active: true
    },
    {
      id: 4,
      code: 'LISTER_PREMIUM',
      name: 'Premium',
      description: 'Premium plan with hero slots and maximum visibility',
      price_bwp: 200,
      features: JSON.stringify({
        LISTING_LIMIT: 'unlimited',
        PHOTO_LIMIT: '50',
        ANALYTICS: 'true',
        HERO_SLOTS: '1',
        PRIORITY_RANK: '2'
      }),
      is_active: true
    }
  ];

  // Insert plans
  await db.insert(plans).values(planData);

  console.log('✅ Billing plans seeded successfully');
}