import { db } from '@/db';
import { subscriptions, users, paymentCards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Session } from '@/lib/session';
import { requireAuth } from '@/lib/middleware';

type SubscriptionPlan = '1_month' | '3_months' | '6_months' | '1_year';

const PLAN_DURATIONS: Record<SubscriptionPlan, number> = {
  '1_month': 30,
  '3_months': 90,
  '6_months': 180,
  '1_year': 365,
};

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  '1_month': 29.99,
  '3_months': 79.99,
  '6_months': 149.99,
  '1_year': 249.99,
};

export async function getUserSubscription(session: Session | null) {
  const user = requireAuth(session);
  
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, user.userId),
      eq(subscriptions.isActive, true)
    ),
    orderBy: (subs, { desc }) => [desc(subs.createdAt)],
  });
  
  return subscription;
}

export async function checkTrialEligibility(userId: string, cardFingerprint: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user || user.trialUsed) {
    return false;
  }
  
  const existingCard = await db.query.paymentCards.findFirst({
    where: eq(paymentCards.cardFingerprint, cardFingerprint),
  });
  
  if (existingCard) {
    return false;
  }
  
  return true;
}

export async function startFreeTrial(
  session: Session | null,
  cardData: {
    cardFingerprint: string;
    last4: string;
    brand: string;
    stripePaymentMethodId: string;
  }
) {
  const user = requireAuth(session);
  
  const isEligible = await checkTrialEligibility(user.userId, cardData.cardFingerprint);
  
  if (!isEligible) {
    throw new Error('Not eligible for free trial. Trial already used or card already registered.');
  }
  
  const now = new Date();
  const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(subscriptions).values({
    id: subscriptionId,
    userId: user.userId,
    plan: '1_month',
    startDate: now,
    endDate: endDate,
    isActive: true,
    isTrial: true,
    autoRenew: false,
    stripeSubscriptionId: null,
    createdAt: now,
    updatedAt: now,
  });
  
  await db.insert(paymentCards).values({
    id: cardId,
    userId: user.userId,
    cardFingerprint: cardData.cardFingerprint,
    last4: cardData.last4,
    brand: cardData.brand,
    stripePaymentMethodId: cardData.stripePaymentMethodId,
    createdAt: now,
  });
  
  await db.update(users)
    .set({ trialUsed: true })
    .where(eq(users.id, user.userId));
  
  return subscriptionId;
}

export async function createSubscription(
  session: Session | null,
  data: {
    plan: SubscriptionPlan;
    stripeSubscriptionId: string;
    cardFingerprint: string;
    last4: string;
    brand: string;
    stripePaymentMethodId: string;
    autoRenew: boolean;
  }
) {
  const user = requireAuth(session);
  
  const existingActiveSubscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, user.userId),
      eq(subscriptions.isActive, true)
    ),
  });
  
  if (existingActiveSubscription) {
    await db.update(subscriptions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(subscriptions.id, existingActiveSubscription.id));
  }
  
  const now = new Date();
  const duration = PLAN_DURATIONS[data.plan];
  const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
  
  const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(subscriptions).values({
    id: subscriptionId,
    userId: user.userId,
    plan: data.plan,
    startDate: now,
    endDate: endDate,
    isActive: true,
    isTrial: false,
    autoRenew: data.autoRenew,
    stripeSubscriptionId: data.stripeSubscriptionId,
    createdAt: now,
    updatedAt: now,
  });
  
  const existingCard = await db.query.paymentCards.findFirst({
    where: and(
      eq(paymentCards.userId, user.userId),
      eq(paymentCards.cardFingerprint, data.cardFingerprint)
    ),
  });
  
  if (!existingCard) {
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.insert(paymentCards).values({
      id: cardId,
      userId: user.userId,
      cardFingerprint: data.cardFingerprint,
      last4: data.last4,
      brand: data.brand,
      stripePaymentMethodId: data.stripePaymentMethodId,
      createdAt: now,
    });
  }
  
  return subscriptionId;
}

export async function cancelSubscription(session: Session | null, subscriptionId: string) {
  const user = requireAuth(session);
  
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.id, subscriptionId),
  });
  
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  
  if (subscription.userId !== user.userId) {
    throw new Error('Unauthorized');
  }
  
  await db.update(subscriptions)
    .set({
      autoRenew: false,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.isActive, true)
    ),
  });
  
  if (!subscription) {
    return false;
  }
  
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  
  if (endDate < now) {
    await db.update(subscriptions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscription.id));
    return false;
  }
  
  return true;
}

export function getSubscriptionPrice(plan: SubscriptionPlan): number {
  return PLAN_PRICES[plan];
}

export function getSubscriptionDuration(plan: SubscriptionPlan): number {
  return PLAN_DURATIONS[plan];
}
