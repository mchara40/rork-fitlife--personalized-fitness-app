import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  if (session.mode === 'subscription' && session.subscription) {
    // Handle subscription creation
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await handleSubscriptionCreated(subscription);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  try {
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const customerEmail = (customer as Stripe.Customer).email;
    
    if (!customerEmail) {
      console.error('No customer email found for subscription:', subscription.id);
      return;
    }

    // Find user in database by email
    // This would be your database query
    // const user = await findUserByEmail(customerEmail);
    
    // Create subscription record
    const subscriptionData = {
      id: `sub_${subscription.id}`,
      userId: 'user_id_from_database', // Replace with actual user ID
      plan: mapStripePriceToPlan(subscription.items.data[0].price.id),
      startDate: new Date(subscription.current_period_start * 1000).toISOString(),
      endDate: new Date(subscription.current_period_end * 1000).toISOString(),
      isActive: subscription.status === 'active',
      isTrial: false,
      autoRenew: true,
      stripeSubscriptionId: subscription.id,
    };

    // Save to database
    // await createSubscription(subscriptionData);
    
    console.log('Subscription saved:', subscriptionData);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    const subscriptionData = {
      isActive: subscription.status === 'active',
      endDate: new Date(subscription.current_period_end * 1000).toISOString(),
    };

    // Update subscription in database
    // await updateSubscription(subscription.id, subscriptionData);
    
    console.log('Subscription updated:', subscriptionData);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    // Deactivate subscription in database
    // await deactivateSubscription(subscription.id);
    
    console.log('Subscription deactivated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  if (invoice.subscription) {
    // Update subscription status
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdated(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  if (invoice.subscription) {
    // Handle failed payment - maybe send notification to user
    // await notifyUserOfFailedPayment(invoice.subscription);
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log('Payment method attached:', paymentMethod.id);
  
  try {
    // Store payment method information
    const cardData = {
      id: `pm_${paymentMethod.id}`,
      userId: 'user_id_from_database', // Replace with actual user ID
      cardFingerprint: paymentMethod.card?.fingerprint || '',
      last4: paymentMethod.card?.last4 || '',
      brand: paymentMethod.card?.brand || '',
      stripePaymentMethodId: paymentMethod.id,
    };

    // Save to database
    // await createPaymentCard(cardData);
    
    console.log('Payment method saved:', cardData);
  } catch (error) {
    console.error('Error handling payment method attached:', error);
  }
}

function mapStripePriceToPlan(priceId: string): '1_month' | '3_months' | '6_months' | '1_year' {
  // Map your Stripe price IDs to your internal plan types
  const priceMap: Record<string, '1_month' | '3_months' | '6_months' | '1_year'> = {
    'price_1month': '1_month',
    'price_3months': '3_months',
    'price_6months': '6_months',
    'price_1year': '1_year',
  };

  return priceMap[priceId] || '1_month';
}

// Helper function to verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret);
    return true;
  } catch (error) {
    return false;
  }
}
