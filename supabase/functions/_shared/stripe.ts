
import Stripe from 'https://esm.sh/stripe@14.2.0?dts'

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable')
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

console.log('Initializing Stripe with key starting with:', stripeSecretKey.substring(0, 3) + '...');

// Try-catch block to handle potential Stripe initialization errors
let stripe;
try {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
  console.log('Stripe initialized successfully');
} catch (error) {
  console.error('Failed to initialize Stripe:', error.message);
  throw error;
}

export { stripe }
