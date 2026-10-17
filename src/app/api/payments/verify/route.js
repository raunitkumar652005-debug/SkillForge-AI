import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/db';
import { requireAuth, getUserQuery } from '@/lib/auth-utils';
import { getPlan } from '@/lib/plans';
import { recordPaymentAndGrantAccess } from '@/lib/subscriptions';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keySecret || !keyId) {
      console.error('Razorpay secret key not found in environment.');
      return NextResponse.json(
        { error: 'Payment gateway configuration error.' },
        { status: 500 }
      );
    }

    // 1. Official Signature Verification
    // Razorpay signature formula: HMAC_SHA256(order_id + "|" + payment_id, secret)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn(`Signature mismatch for order ${razorpay_order_id}. Possible tampering attempt.`);
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    // 2. Ownership & Order Validation from Database
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const pendingOrder = await db.collection('payment_orders').findOne({
      orderId: razorpay_order_id,
      ...getUserQuery(user.id)
    });

    if (!pendingOrder) {
      console.warn(`Order ${razorpay_order_id} does not belong to user ${user.id} or does not exist.`);
      return NextResponse.json(
        { error: 'Order not found or does not belong to the authenticated user.' },
        { status: 403 }
      );
    }

    // 3. Trusted Plan Lookup
    const plan = getPlan(pendingOrder.planId);
    if (!plan) {
      return NextResponse.json({ error: 'Associated plan configuration not found.' }, { status: 400 });
    }

    // 4. Double check payment status directly with Razorpay API
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    try {
      const paymentCheckRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: { 'Authorization': authHeader }
      });

      if (paymentCheckRes.ok) {
        const paymentData = await paymentCheckRes.json();
        
        // Verify payment matches order and expected plan amount
        if (paymentData.order_id !== razorpay_order_id) {
          return NextResponse.json(
            { error: 'Payment order ID does not match payment details.' },
            { status: 400 }
          );
        }

        if (paymentData.amount !== plan.amountInPaise || paymentData.currency !== plan.currency) {
          return NextResponse.json(
            { error: 'Payment amount or currency mismatch with plan specification.' },
            { status: 400 }
          );
        }

        // Verify status is captured or authorized
        if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
          return NextResponse.json(
            { error: `Payment status is ${paymentData.status}. Only successful payments can be verified.` },
            { status: 400 }
          );
        }
      }
    } catch (apiCheckErr) {
      console.warn('Could not verify directly with Razorpay API, proceeding with signature verification:', apiCheckErr.message);
    }

    // 5. Idempotently Grant Entitlement & Update Expiry
    const grantResult = await recordPaymentAndGrantAccess({
      user,
      plan,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    return NextResponse.json({
      success: true,
      idempotent: grantResult.idempotent,
      extended: grantResult.extended,
      planId: plan.id,
      planName: plan.name,
      expiresAt: grantResult.expiresAt,
      message: grantResult.idempotent
        ? 'Payment previously verified.'
        : 'Payment successfully verified. Subscription activated!'
    });

  } catch (error) {
    console.error('Error during payment verification:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during payment verification.' },
      { status: 500 }
    );
  }
}
