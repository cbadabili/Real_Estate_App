
import { db } from "./db";
import { plans } from "../shared/schema";
import { notInArray } from "drizzle-orm";

export async function seedBilling() {
  console.log('🎯 Seeding billing plans (idempotent)...');

  // Updated Plans - Free Trial, Pro, Business, Premium
  const CANONICAL_PLANS = [
    {
      code: 'FREE_TRIAL',
      name: 'Free Trial',
      description: 'Perfect for first-time sellers testing the platform',
      price_bwp: 0,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '1',
        PHOTO_LIMIT: '5',
        ANALYTICS: 'false',
        PRIORITY_RANK: '0',
        HERO_SLOTS: '0',
        TRIAL_DAYS: '30'
      }),
      is_active: true
    },
    {
      code: 'PRO',
      name: 'Pro',
      description: 'For casual sellers with multiple properties',
      price_bwp: 100,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '5',
        PHOTO_LIMIT: '20',
        ANALYTICS: 'true',
        PRIORITY_RANK: '1',
        HERO_SLOTS: '0',
        FEATURED_SEARCH: 'true'
      }),
      is_active: true
    },
    {
      code: 'BUSINESS',
      name: 'Business',
      description: 'For professional agents & service providers',
      price_bwp: 200,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '50',
        PHOTO_LIMIT: '50',
        ANALYTICS: 'true',
        DIRECTORY: 'true',
        BOOKING: 'true',
        LEAD_MANAGER: 'true',
        PRIORITY_RANK: '2',
        VERIFIED_BADGE: 'true',
        SUPPORT_24H: 'true'
      }),
      is_active: true
    },
    {
      code: 'PREMIUM',
      name: 'Premium',
      description: 'For established agencies & developers with portfolios',
      price_bwp: 500,
      interval: 'monthly',
      features: JSON.stringify({
        LISTING_LIMIT: '100',
        PHOTO_LIMIT: '75',
        ANALYTICS: 'true',
        HERO_SLOTS: '3',
        PRIORITY_RANK: '5',
        AGENCY_PROFILE: 'true',
        PREMIUM_BADGE: 'true',
        MONTHLY_REPORTS: 'true',
        PRIORITY_SUPPORT: 'true',
        WHITE_LABEL: 'true',
        EARLY_ACCESS: 'true',
        ACCOUNT_MANAGER: 'true'
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
    await db
      .update(plans)
      .set({ is_active: false })
      .where(notInArray(plans.code, canonicalCodes));
  }

  console.log('✅ Billing plans synchronized successfully');
  console.log(`   - ${CANONICAL_PLANS.length} canonical plans active`);
  console.log(`   - Legacy plans deactivated`);
}
