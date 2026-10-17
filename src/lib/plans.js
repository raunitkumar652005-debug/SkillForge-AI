/**
 * Server-side trusted Subscription Plans Configuration.
 * 
 * Never accept prices, amounts, durations, or entitlements from the client.
 * All order creation and entitlement validation MUST reference this configuration.
 */

export const SUBSCRIPTION_PLANS = {
  plan_7_days: {
    id: 'plan_7_days',
    name: '7 Days Sprint',
    price: 49,
    amountInPaise: 4900,
    currency: 'INR',
    durationDays: 7,
    tagline: 'Ideal for rapid interview prep & module review',
    badge: 'Sprint',
    popular: false,
    entitlements: ['ai_mentor', 'quiz_mode', 'interview_mode'],
    features: [
      '7 days full platform access',
      'Unlimited AI Mentor sessions',
      'AI-graded Quiz flashcards & MCQs',
      'Realistic Mock Technical Interviews',
      'Instant AI feedback & model answers',
      'Progress analytics & insights'
    ]
  },
  plan_30_days: {
    id: 'plan_30_days',
    name: '30 Days Pro',
    price: 99,
    amountInPaise: 9900,
    currency: 'INR',
    durationDays: 30,
    tagline: 'Most popular for full full-stack mastery',
    badge: 'Most Popular',
    popular: true,
    entitlements: ['ai_mentor', 'quiz_mode', 'interview_mode'],
    features: [
      '30 days full platform access',
      'Unlimited AI Mentor sessions',
      'AI-graded Quiz flashcards & MCQs',
      'Realistic Mock Technical Interviews',
      'Instant AI feedback & model answers',
      'Progress analytics & insights',
      'Priority response latency'
    ]
  },
  plan_1_year: {
    id: 'plan_1_year',
    name: '1 Year Annual Pass',
    price: 499,
    amountInPaise: 49900,
    currency: 'INR',
    durationDays: 365,
    tagline: 'Best value for year-round career growth',
    badge: 'Best Value',
    popular: false,
    entitlements: ['ai_mentor', 'quiz_mode', 'interview_mode'],
    features: [
      '365 days full platform access',
      'Unlimited AI Mentor sessions',
      'AI-graded Quiz flashcards & MCQs',
      'Realistic Mock Technical Interviews',
      'Instant AI feedback & model answers',
      'Progress analytics & insights',
      'Priority response latency',
      'Save over 55% compared to monthly'
    ]
  }
};

/**
 * Returns the plan configuration by plan ID, or null if invalid.
 */
export function getPlan(planId) {
  if (!planId || typeof planId !== 'string') return null;
  return SUBSCRIPTION_PLANS[planId] || null;
}

/**
 * Returns all available subscription plans as an array.
 */
export function getAllPlans() {
  return Object.values(SUBSCRIPTION_PLANS);
}
