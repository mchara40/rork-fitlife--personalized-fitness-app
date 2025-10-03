// Environment configuration for the fitness app
export const ENV = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || './fitness.db',
  
  // App Configuration
  APP_URL: process.env.EXPO_PUBLIC_APP_URL || 'https://your-app-url.com',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// Stripe price IDs - replace with your actual Stripe price IDs
export const STRIPE_PRICE_IDS = {
  '1_month': 'price_1month', // Replace with actual Stripe price ID
  '3_months': 'price_3months', // Replace with actual Stripe price ID
  '6_months': 'price_6months', // Replace with actual Stripe price ID
  '1_year': 'price_1year', // Replace with actual Stripe price ID
};

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
  '1_month': {
    label: '1 Month',
    price: 29.99,
    duration: 30, // days
    stripePriceId: STRIPE_PRICE_IDS['1_month'],
  },
  '3_months': {
    label: '3 Months',
    price: 74.99,
    duration: 90, // days
    savings: 'Save 17%',
    stripePriceId: STRIPE_PRICE_IDS['3_months'],
  },
  '6_months': {
    label: '6 Months',
    price: 134.99,
    duration: 180, // days
    savings: 'Save 25%',
    stripePriceId: STRIPE_PRICE_IDS['6_months'],
  },
  '1_year': {
    label: '1 Year',
    price: 239.99,
    duration: 365, // days
    savings: 'Save 33%',
    stripePriceId: STRIPE_PRICE_IDS['1_year'],
  },
};

// Free trial configuration
export const TRIAL_CONFIG = {
  duration: 14, // days
  requiresPaymentMethod: true,
  maxTrialPerCard: 1,
};

// Validation functions
export function validateEnvironment() {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please set these variables in your .env file');
  }
  
  return missingVars.length === 0;
}

// Get subscription plan by Stripe price ID
export function getPlanByStripePriceId(priceId: string) {
  return Object.entries(STRIPE_PRICE_IDS).find(([, id]) => id === priceId)?.[0];
}

// Get subscription plan configuration
export function getSubscriptionPlan(plan: keyof typeof SUBSCRIPTION_PLANS) {
  return SUBSCRIPTION_PLANS[plan];
}
