
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get email from request body
    const { email } = await req.json()
    
    if (!email) {
      console.error('Missing email in request');
      return new Response(
        JSON.stringify({ error: 'Email manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Recherche des commandes pour l\'email:', email);

    // Vérifier si le stripe est correctement initialisé
    if (!stripe) {
      console.error('Stripe is not properly initialized');
      return new Response(
        JSON.stringify({ error: 'Configuration de paiement manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    try {
      // Rechercher le client par son email
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      let orders = [];

      if (customers.data.length > 0) {
        const customer = customers.data[0];
        console.log('Client trouvé:', customer.id);

        // Récupérer toutes les commandes (checkout sessions) du client
        const sessions = await stripe.checkout.sessions.list({
          customer: customer.id,
          limit: 100,
          expand: ['data.line_items', 'data.customer_details'],
        });

        // Transformer les sessions en format d'ordre pour l'affichage
        orders = sessions.data.map(session => ({
          id: session.id,
          created: session.created,
          status: session.payment_status,
          amount_total: session.amount_total,
          customer_details: session.customer_details,
          line_items: session.line_items
        }));

        console.log(`${orders.length} commandes trouvées pour le client.`);
      } else {
        console.log('Aucun client trouvé avec cet email.');
        
        // Rechercher aussi les commandes qui ont été passées avec cet email directement
        // (avant que l'utilisateur ne crée un compte)
        const sessions = await stripe.checkout.sessions.list({
          customer_details: {
            email: email
          },
          limit: 100,
          expand: ['data.line_items', 'data.customer_details'],
        });
        
        if (sessions.data.length > 0) {
          orders = sessions.data.map(session => ({
            id: session.id,
            created: session.created,
            status: session.payment_status,
            amount_total: session.amount_total,
            customer_details: session.customer_details,
            line_items: session.line_items
          }));
          
          console.log(`${orders.length} commandes trouvées avec cet email.`);
        } else {
          console.log('Aucune commande trouvée pour cet email.');
        }
      }

      return new Response(
        JSON.stringify({ orders }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError.message);
      throw stripeError;
    }
  } catch (error: any) {
    console.error('Error retrieving orders:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
