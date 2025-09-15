
import { db } from '../server/db';
import { subscriptions, plans } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { applyPlanToUser } from '../server/entitlements-service';

async function syncEntitlementsV2() {
  console.log('Starting entitlements sync for v2 monetisation...');
  
  try {
    // Get all active subscriptions
    const activeSubs = await db.select({
      userId: subscriptions.user_id,
      planId: subscriptions.plan_id
    })
    .from(subscriptions)
    .where(eq(subscriptions.status, 'active'));

    console.log(`Found ${activeSubs.length} active subscriptions to sync`);

    for (const sub of activeSubs) {
      const plan = await db.select()
        .from(plans)
        .where(eq(plans.id, sub.planId))
        .limit(1);
      
      if (plan[0]) {
        console.log(`Syncing user ${sub.userId} with plan ${plan[0].code}`);
        await applyPlanToUser(sub.userId, plan[0].code);
      }
    }

    console.log('Entitlements sync completed successfully');
  } catch (error) {
    console.error('Error syncing entitlements:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncEntitlementsV2().then(() => process.exit(0));
}

export { syncEntitlementsV2 };
