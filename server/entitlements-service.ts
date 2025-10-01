
import { db } from "./db";
import { entitlements, plans, subscriptions } from "../shared/schema";
import { eq, and } from "drizzle-orm";

// Get entitlement helper
export async function getEntitlement(userId: number, key: string) {
  const result = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.user_id, userId),
        eq(entitlements.feature_key, key),
      ),
    )
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
  const plan = await db
    .select()
    .from(plans)
    .where(eq(plans.code, planCode))
    .limit(1);

  if (!plan[0]) {
    throw new Error(`Plan not found: ${planCode}`);
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.user_id, userId),
        eq(subscriptions.plan_id, plan[0].id),
      ),
    )
    .limit(1);

  if (!subscription) {
    throw new Error(`Subscription not found for user ${userId} on plan ${planCode}`);
  }

  const features = typeof plan[0].features === "string"
    ? JSON.parse(plan[0].features)
    : plan[0].features;

  // Overwrite each key to match plan.features exactly
  for (const [key, value] of Object.entries(features)) {
    const numericValue = typeof value === "boolean"
      ? (value ? 1 : 0)
      : Number(value);

    await db
      .insert(entitlements)
      .values({
        user_id: userId,
        subscription_id: subscription.id,
        feature_key: key,
        feature_value: Number.isFinite(numericValue) ? numericValue : 0,
      })
      .onConflictDoUpdate({
        target: [entitlements.user_id, entitlements.feature_key],
        set: { feature_value: Number.isFinite(numericValue) ? numericValue : 0 },
      });
  }
}
