import { getSessionUser } from '@/lib/auth-utils';
import { getUserSubscription } from '@/lib/subscriptions';
import { getAllPlans } from '@/lib/plans';
import { redirect } from 'next/navigation';
import { PricingClient } from './PricingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Subscription Plans & Pricing | WebDev Mentor AI',
  description: 'Unlock full access to AI Mentor, AI-graded Quizzes, and Mock Technical Interviews in WebDev Mentor AI.'
};

export default async function PricingPage(props) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const searchParams = await props.searchParams;
  const feature = searchParams?.feature; // e.g. 'mentor', 'quiz', 'interview'

  const { hasActiveSubscription, subscription } = await getUserSubscription(user.id);
  const plans = getAllPlans();

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
        <PricingClient
          user={{
            id: user.id,
            name: user.name || '',
            email: user.email || ''
          }}
          initialSubscription={subscription}
          hasActiveSubscription={hasActiveSubscription}
          plans={plans}
          requestedFeature={feature}
        />
      </div>
    </div>
  );
}
