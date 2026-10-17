import clientPromise from '@/lib/db';
import { requireAuth, getUserQuery, getUserIdForStorage } from '@/lib/auth-utils';
import { getPlan } from '@/lib/plans';
import { NextResponse } from 'next/server';

/**
 * Retrieves the current subscription status for a given user.
 * 
 * @param {string} rawUserId - User ID from session or ObjectId string
 * @returns {Promise<{ hasActiveSubscription: boolean, subscription: object | null }>}
 */
export async function getUserSubscription(rawUserId) {
  if (!rawUserId) {
    return { hasActiveSubscription: false, subscription: null };
  }

  try {
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const sub = await db.collection('subscriptions').findOne(getUserQuery(rawUserId));
    if (!sub || !sub.expiresAt) {
      return { hasActiveSubscription: false, subscription: null };
    }

    const now = new Date();
    const expiresAt = new Date(sub.expiresAt);
    const isActive = sub.status === 'active' && expiresAt.getTime() > now.getTime();

    const plan = getPlan(sub.planId);

    return {
      hasActiveSubscription: isActive,
      subscription: {
        id: sub._id?.toString(),
        planId: sub.planId,
        planName: plan?.name || sub.planId,
        status: isActive ? 'active' : 'expired',
        startDate: sub.startDate ? new Date(sub.startDate) : null,
        expiresAt,
        daysRemaining: isActive ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        lastPaymentId: sub.lastPaymentId || null
      }
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return { hasActiveSubscription: false, subscription: null };
  }
}

/**
 * Route Handler guard that requires BOTH authentication AND an active, unexpired subscription.
 * Returns 401 if unauthenticated, 403 if authenticated but unsubscribed/expired.
 * 
 * @returns {Promise<{ user: object | null, session: object | null, subscription: object | null, errorResponse: NextResponse | null }>}
 */
export async function requireSubscription() {
  const { user, session, errorResponse } = await requireAuth();
  if (errorResponse) {
    return { user: null, session: null, subscription: null, errorResponse };
  }

  const { hasActiveSubscription, subscription } = await getUserSubscription(user.id);
  if (!hasActiveSubscription) {
    return {
      user,
      session,
      subscription: null,
      errorResponse: NextResponse.json(
        {
          error: 'An active subscription is required to access premium features (AI Mentor, Quiz Mode, and Mock Interviews).',
          code: 'SUBSCRIPTION_REQUIRED',
          upgradeUrl: '/pricing'
        },
        { status: 403 }
      )
    };
  }

  return {
    user,
    session,
    subscription,
    errorResponse: null
  };
}

/**
 * Idempotently records a verified payment and grants or extends subscription access.
 * 
 * @param {object} params
 * @param {object} params.user - Authenticated user object with user.id
 * @param {object} params.plan - Verified plan object from SUBSCRIPTION_PLANS
 * @param {string} params.razorpayOrderId - Razorpay Order ID
 * @param {string} params.razorpayPaymentId - Razorpay Payment ID
 * @param {string} params.razorpaySignature - Verified Razorpay signature
 */
export async function recordPaymentAndGrantAccess({
  user,
  plan,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) {
  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  const storageUserId = getUserIdForStorage(user.id);
  const now = new Date();

  // 1. Idempotency Check: if this payment ID was already processed, return existing state
  const existingPayment = await db.collection('payments').findOne({ razorpayPaymentId });
  if (existingPayment) {
    const existingSub = await db.collection('subscriptions').findOne(getUserQuery(user.id));
    return {
      success: true,
      idempotent: true,
      message: 'Payment was already processed and verified.',
      expiresAt: existingSub?.expiresAt ? new Date(existingSub.expiresAt) : null,
      planId: existingPayment.planId
    };
  }

  // 2. Calculate Expiry: extend if user already has an active, unexpired subscription
  const currentSub = await db.collection('subscriptions').findOne(getUserQuery(user.id));
  let baseDate = now;
  let startDate = now;
  let isExtension = false;

  if (currentSub?.expiresAt) {
    const currentExpiry = new Date(currentSub.expiresAt);
    if (currentExpiry.getTime() > now.getTime()) {
      baseDate = currentExpiry; // Extend from current expiry
      startDate = currentSub.startDate ? new Date(currentSub.startDate) : now;
      isExtension = true;
    }
  }

  const durationMs = plan.durationDays * 24 * 60 * 60 * 1000;
  const newExpiresAt = new Date(baseDate.getTime() + durationMs);

  // 3. Persist audit payment record
  await db.collection('payments').insertOne({
    userId: storageUserId,
    planId: plan.id,
    amount: plan.amountInPaise,
    currency: plan.currency,
    durationDays: plan.durationDays,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'captured',
    verifiedAt: now,
    createdAt: now
  });

  // 4. Update or insert subscription record
  await db.collection('subscriptions').updateOne(
    getUserQuery(user.id),
    {
      $set: {
        userId: storageUserId,
        planId: plan.id,
        status: 'active',
        startDate,
        expiresAt: newExpiresAt,
        lastPaymentId: razorpayPaymentId,
        lastOrderId: razorpayOrderId,
        updatedAt: now
      }
    },
    { upsert: true }
  );

  // 5. Update order state in payment_orders
  await db.collection('payment_orders').updateOne(
    { orderId: razorpayOrderId },
    {
      $set: {
        status: 'paid',
        paymentId: razorpayPaymentId,
        paidAt: now,
        updatedAt: now
      }
    }
  );

  // 6. Send in-app notification to the user
  try {
    const dateFormatted = newExpiresAt.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    await db.collection('notifications').insertOne({
      userId: storageUserId,
      title: isExtension ? 'Subscription Extended! ⚡' : 'Subscription Activated! 🎉',
      message: `Your ${plan.name} is now active until ${dateFormatted}. Enjoy unlimited AI Mentor, Quizzes, and Mock Interviews.`,
      type: 'subscription',
      read: false,
      createdAt: now
    });
  } catch (notifErr) {
    console.error('Failed to create subscription notification:', notifErr);
  }

  return {
    success: true,
    idempotent: false,
    extended: isExtension,
    expiresAt: newExpiresAt,
    planId: plan.id
  };
}
