import { db } from "./db";
import { plans } from "../shared/schema";
import { sql, notInArray } from "drizzle-orm";

export async function seedBilling() {
  console.log('🎯 Seeding billing plans (idempotent)...');

  // Plans v2 – simple pricing & clear value (CANONICAL PLANS ONLY)
  const CANONICAL_PLANS = [
    {
      code: 'LISTER_FREE',
      name: 'Free',
      description: 'Perfect for first-time property listings',
      price_bwp: 0,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '1',
        PHOTO_LIMIT: '5',
        PRIORITY_RANK: '0'
      }),
      is_active: true
    },
    {
      code: 'LISTER_PRO',
      name: 'Pro',
      description: 'For casual property listings with more exposure',
      price_bwp: 100,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '5',
        PHOTO_LIMIT: '20',
        ANALYTICS: 'true',
        PRIORITY_RANK: '0'
      }),
      is_active: true
    },
    {
      code: 'BUSINESS',
      name: 'Business',
      description: 'For contractors, artisans, and property service providers',
      price_bwp: 150,
      interval: 'monthly',
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
      code: 'LISTER_PREMIUM',
      name: 'Premium',
      description: 'For serious sellers and investors who want maximum visibility',
      price_bwp: 200,
      interval: 'monthly',
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

  // Upsert canonical plans (idempotent)
  for (const plan of CANONICAL_PLANS) {
    await db
      .insert(plans)
      .values(plan)
      .onConflictDoUpdate({
        target: plans.code,
        set: {
          name: plan.name,
          description: plan.description,
          price_bwp: plan.price_bwp,
          interval: plan.interval,
          features: plan.features,
          is_active: plan.is_active
        }
      });
  }

  // Deactivate any non-canonical plans (legacy cleanup)
  const canonicalCodes = CANONICAL_PLANS.map(p => p.code);
  if (canonicalCodes.length > 0) {
    const result = await db
      .update(plans)
      .set({ is_active: false })
      .where(notInArray(plans.code, canonicalCodes));
  }

  console.log('✅ Billing plans synchronized successfully');
  console.log(`   - ${CANONICAL_PLANS.length} canonical plans active`);
  console.log(`   - Legacy plans deactivated`);
}