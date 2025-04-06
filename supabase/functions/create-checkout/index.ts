
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      console.error('Stripe is not properly initialized');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration de paiement manquante', 
          details: 'Le service de paiement n\'est pas correctement configuré.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

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
    
    try {
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
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError.message, stripeError.type, stripeError.stack);
      
      // Check for specific Stripe errors
      if (stripeError.message?.includes('API key')) {
        return new Response(
          JSON.stringify({ 
            error: 'Erreur de configuration du service de paiement',
            details: 'La clé API Stripe est invalide ou expirée.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      throw stripeError; // Re-throw to be caught by outer catch block
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la préparation du paiement',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
