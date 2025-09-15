
import { db } from './db';
import { entitlements, plans, subscriptions } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// Get entitlement helper
export async function getEntitlement(userId: number, key: string) {
  const result = await db.select()
    .from(entitlements)
    .where(and(
      eq(entitlements.user_id, userId),
      eq(entitlements.key, key)
    ))
    .limit(1);
  
  return result[0] || null;
}

// Normalise "unlimited" helper
export function asLimit(v?: string): number {
  if (!v) return 0;
  return v === "unlimited" ? Number.POSITIVE_INFINITY : Number(v);
}

// Apply plan features to user (idempotent)
export async function applyPlanToUser(userId: number, planCode: string) {
  const plan = await db.select()
    .from(plans)
    .where(eq(plans.code, planCode))
    .limit(1);
  
  if (!plan[0]) {
    throw new Error(`Plan not found: ${planCode}`);
  }

  const features = typeof plan[0].features === 'string' 
    ? JSON.parse(plan[0].features) 
    : plan[0].features;

  // Overwrite each key to match plan.features exactly
  for (const [key, value] of Object.entries(features)) {
    await db.insert(entitlements)
      .values({
        user_id: userId,
        key,
        value: String(value)
      })
      .onConflictDoUpdate({
        target: [entitlements.user_id, entitlements.key],
        set: { value: String(value) }
      });
  }
}
