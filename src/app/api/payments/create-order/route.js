import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { requireAuth, getUserIdForStorage } from '@/lib/auth-utils';
import { getPlan } from '@/lib/plans';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { planId } = body || {};

    if (!planId) {
      return NextResponse.json({ error: 'Missing planId in request body.' }, { status: 400 });
    }

    // Look up trusted plan configuration exclusively on the server
    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid subscription plan selected.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('Razorpay credentials missing in server environment variables.');
      return NextResponse.json(
        { 
          error: 'Payment gateway configuration error. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.' 
        },
        { status: 500 }
      );
    }

    // Create order using official Razorpay REST API
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const receiptId = `rcpt_${Date.now()}_${user.id.slice(-6)}`;

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: plan.amountInPaise,
        currency: plan.currency,
        receipt: receiptId,
        notes: {
          userId: user.id,
          userEmail: user.email || '',
          planId: plan.id,
          planName: plan.name,
          mode: 'test'
        }
      })
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error creating order:', razorpayResponse.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create payment order with gateway. Please check your credentials.' },
        { status: 502 }
      );
    }

    const orderData = await razorpayResponse.json();

    // Persist pending order in MongoDB associated with authenticated user
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    await db.collection('payment_orders').insertOne({
      orderId: orderData.id,
      userId: getUserIdForStorage(user.id),
      userStringId: user.id,
      planId: plan.id,
      amount: plan.amountInPaise,
      currency: plan.currency,
      receipt: receiptId,
      status: 'created',
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: keyId, // Public Key ID for Checkout script only; secret is NEVER returned
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays
      }
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while creating order.' },
      { status: 500 }
    );
  }
}
