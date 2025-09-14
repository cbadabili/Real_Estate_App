
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from './auth-middleware';
import { db } from './db';
import { plans, subscriptions, entitlements, payments, users } from '../shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

const router = Router();

// Get all available plans
router.get('/plans', async (req, res) => {
  try {
    const availablePlans = await db
      .select()
      .from(plans)
      .where(eq(plans.is_active, true))
      .orderBy(plans.price_bwp);

    res.json({
      success: true,
      data: availablePlans.map(plan => ({
        ...plan,
        features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
      }))
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plans'
    });
  }
});

// Subscribe to a plan
const subscribeSchema = z.object({
  planCode: z.string().min(1, 'Plan code is required'),
  paymentMethod: z.enum(['bank_transfer', 'mobile_money']).default('bank_transfer'),
  paymentReference: z.string().optional()
});

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const validatedData = subscribeSchema.parse(req.body);

    // Find the plan
    const [plan] = await db
      .select()
      .from(plans)
      .where(and(
        eq(plans.code, validatedData.planCode),
        eq(plans.is_active, true)
      ));

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        user_id: req.user.id,
        plan_id: plan.id,
        amount_bwp: plan.price_bwp,
        payment_method: validatedData.paymentMethod,
        payment_reference: validatedData.paymentReference,
        status: 'pending'
      })
      .returning();

    // For free plans, auto-activate
    if (plan.price_bwp === 0) {
      await activateSubscription(req.user.id, plan.id, payment.id);
    }

    const paymentInstructions = getPaymentInstructions(validatedData.paymentMethod, plan.price_bwp, payment.id);

    res.status(201).json({
      success: true,
      data: {
        payment,
        plan,
        paymentInstructions
      },
      message: plan.price_bwp === 0 
        ? 'Free plan activated successfully!' 
        : 'Subscription created. Please complete payment to activate.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription'
    });
  }
});

// Get current user's subscription and entitlements
router.get('/me', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // Get active subscription
    const [subscription] = await db
      .select({
        subscription: subscriptions,
        plan: plans
      })
      .from(subscriptions)
      .innerJoin(plans, eq(subscriptions.plan_id, plans.id))
      .where(and(
        eq(subscriptions.user_id, req.user.id),
        eq(subscriptions.status, 'active')
      ))
      .orderBy(desc(subscriptions.created_at))
      .limit(1);

    // Get entitlements
    const userEntitlements = await db
      .select()
      .from(entitlements)
      .where(eq(entitlements.user_id, req.user.id));

    // Transform entitlements into a more usable format
    const entitlementsMap = userEntitlements.reduce((acc, entitlement) => {
      acc[entitlement.feature_key] = {
        limit: entitlement.feature_value,
        used: entitlement.used_count,
        remaining: entitlement.feature_value === -1 ? -1 : Math.max(0, entitlement.feature_value - entitlement.used_count)
      };
      return acc;
    }, {} as Record<string, any>);

    res.json({
      success: true,
      data: {
        subscription: subscription ? {
          ...subscription.subscription,
          plan: {
            ...subscription.plan,
            features: typeof subscription.plan.features === 'string' 
              ? JSON.parse(subscription.plan.features) 
              : subscription.plan.features
          }
        } : null,
        entitlements: entitlementsMap
      }
    });
  } catch (error) {
    console.error('Error fetching user billing info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch billing information'
    });
  }
});

// Admin route to approve payments
router.post('/payments/:id/approve', authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required' 
      });
    }

    const paymentId = parseInt(req.params.id);

    // Get payment details
    const [payment] = await db
      .select({
        payment: payments,
        plan: plans
      })
      .from(payments)
      .innerJoin(plans, eq(payments.plan_id, plans.id))
      .where(eq(payments.id, paymentId));

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    if (payment.payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Payment is not pending'
      });
    }

    // Update payment status
    await db
      .update(payments)
      .set({ 
        status: 'succeeded',
        updated_at: Date.now()
      })
      .where(eq(payments.id, paymentId));

    // Activate subscription
    await activateSubscription(payment.payment.user_id, payment.payment.plan_id, paymentId);

    res.json({
      success: true,
      message: 'Payment approved and subscription activated'
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve payment'
    });
  }
});

// Helper function to activate subscription
async function activateSubscription(userId: number, planId: number, paymentId: number) {
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));
  if (!plan) throw new Error('Plan not found');

  const now = Date.now();
  const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Create or update subscription
  const [subscription] = await db
    .insert(subscriptions)
    .values({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      starts_at: now,
      ends_at: plan.interval === 'monthly' ? now + oneMonth : null,
      next_billing_date: plan.interval === 'monthly' ? now + oneMonth : null
    })
    .returning();

  // Create entitlements based on plan features
  const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;
  const entitlementData = Object.entries(features).map(([key, value]) => ({
    user_id: userId,
    subscription_id: subscription.id,
    feature_key: key,
    feature_value: typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
    used_count: 0,
    expires_at: subscription.ends_at
  }));

  if (entitlementData.length > 0) {
    await db.insert(entitlements).values(entitlementData);
  }

  // Update payment with subscription reference
  await db
    .update(payments)
    .set({ subscription_id: subscription.id })
    .where(eq(payments.id, paymentId));
}

// Helper function to generate payment instructions
function getPaymentInstructions(paymentMethod: string, amount: number, paymentId: number) {
  const baseInstructions = {
    amount,
    reference: `BEEDAB-${paymentId}`,
    paymentId
  };

  if (paymentMethod === 'bank_transfer') {
    return {
      ...baseInstructions,
      method: 'Bank Transfer',
      details: {
        bankName: 'First National Bank of Botswana',
        accountName: 'Beedab Properties Ltd',
        accountNumber: '12345678901',
        branchCode: '280267',
        swiftCode: 'FIRNBWGX'
      },
      instructions: [
        `Transfer BWP ${amount} to the bank account above`,
        `Use reference: BEEDAB-${paymentId}`,
        'Your subscription will be activated within 24 hours of payment verification'
      ]
    };
  } else {
    return {
      ...baseInstructions,
      method: 'Mobile Money',
      details: {
        orangeMoney: '75123456',
        mascom: '77123456'
      },
      instructions: [
        `Send BWP ${amount} to Orange Money: 75123456 or Mascom MyZaka: 77123456`,
        `Use reference: BEEDAB-${paymentId}`,
        'Your subscription will be activated within 24 hours of payment verification'
      ]
    };
  }
}

export default router;
