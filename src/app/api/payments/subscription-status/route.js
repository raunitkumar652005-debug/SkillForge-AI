import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserSubscription } from '@/lib/subscriptions';
import { getAllPlans } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { hasActiveSubscription, subscription } = await getUserSubscription(user.id);
    const plans = getAllPlans();

    return NextResponse.json({
      hasActiveSubscription,
      subscription,
      plans,
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email || ''
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
