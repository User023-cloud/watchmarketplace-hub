
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const { cartItems, successUrl, cancelUrl } = await req.json()
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Invalid cart:', !cartItems ? 'missing' : !Array.isArray(cartItems) ? 'not an array' : 'empty');
      return new Response(
        JSON.stringify({ error: 'Panier invalide' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Creating checkout session with items:', JSON.stringify(cartItems));

    // Format line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.imageSrc ? [item.imageSrc] : [],
          description: item.category || 'Montre de luxe',
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity || 1,
    }))

    // Add better origin fallback
    const origin = req.headers.get('origin') || 'https://example.com';
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      billing_address_collection: 'required',
      locale: 'fr',
      allow_promotion_codes: true,
      customer_creation: 'always',
    })

    console.log('Checkout session created successfully:', session.id, 'redirecting to', session.url);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error('Error creating checkout session:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
