
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get session_id from request body
    const { session_id } = await req.json()
    
    if (!session_id) {
      console.error('Missing session_id in request');
      return new Response(
        JSON.stringify({ error: 'Session ID manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Retrieving session with ID:', session_id);

    // Vérifier si le stripe est correctement initialisé
    if (!stripe) {
      console.error('Stripe is not properly initialized');
      return new Response(
        JSON.stringify({ error: 'Configuration de paiement manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    try {
      // Retry mechanism for Stripe API calls
      let retries = 3;
      let session;
      
      while (retries > 0) {
        try {
          // Retrieve the session details from Stripe with expanded details
          session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'line_items.data.price.product', 'customer', 'payment_intent', 'customer_details'],
          });
          break; // If successful, break the retry loop
        } catch (retryError) {
          retries--;
          if (retries === 0) {
            throw retryError; // If all retries fail, throw the error
          }
          // Wait a moment before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!session) {
        throw new Error('Failed to retrieve session after multiple attempts');
      }

      console.log('Session retrieved successfully:', session.id);

      return new Response(
        JSON.stringify({ session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (stripeError) {
      console.error('Stripe API error when retrieving session:', stripeError.message);
      // Check for specific Stripe errors
      if (stripeError.message?.includes('No such checkout.session')) {
        return new Response(
          JSON.stringify({ error: 'Session de paiement introuvable ou expirée' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      throw stripeError;
    }
  } catch (error: any) {
    console.error('Error retrieving session:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
