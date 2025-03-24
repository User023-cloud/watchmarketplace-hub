
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || localStorage.getItem('stripe_session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Vider le panier une fois sur la page de succès
    clearCart();
    
    // Clean up session ID from localStorage
    if (localStorage.getItem('stripe_session_id')) {
      console.log('Using session ID from localStorage');
    }
    
    // Si pas de session_id, on ne fait pas la requête
    if (!sessionId) {
      console.error('No session ID available');
      setLoading(false);
      setError("Paramètre de session manquant. Impossible de récupérer les détails de votre commande.");
      return;
    }

    const fetchSession = async () => {
      try {
        console.log('Fetching session details for ID:', sessionId);
        
        const { data, error } = await supabase.functions.invoke('get-session', {
          body: { session_id: sessionId }
        });

        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          setError('Impossible de récupérer les détails de votre commande');
          setLoading(false);
          return;
        }

        if (!data || !data.session) {
          console.error('No session data returned:', data);
          setError('Aucune donnée de session trouvée');
          setLoading(false);
          return;
        }

        console.log('Session data received:', data.session.id);
        setOrderDetails(data.session);
        setLoading(false);
        toast.success('Commande confirmée avec succès!');
        
        // Clear the session ID from localStorage after successful retrieval
        localStorage.removeItem('stripe_session_id');
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue lors de la récupération des détails de la commande');
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100); // Stripe returns amounts in cents
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-playfair font-bold mb-4">Commande confirmée !</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Merci pour votre achat. Votre commande a été traitée avec succès et est en cours de préparation.
          </p>

          {loading ? (
            <div className="space-y-4 max-w-md mx-auto">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => navigate('/shop')}>
                Retourner à la boutique
              </Button>
            </div>
          ) : orderDetails ? (
            <div className="text-left divide-y border rounded-md overflow-hidden">
              <div className="p-4 bg-muted/50">
                <h2 className="font-semibold">Détails de la commande</h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Numéro de commande</h3>
                  <p className="font-mono text-sm">{orderDetails.id}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Date</h3>
                  <p>{new Date(orderDetails.created * 1000).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                  <p>{orderDetails.customer_details?.email || 'Non disponible'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Total</h3>
                  <p className="font-medium">{formatPrice(orderDetails.amount_total)}</p>
                </div>
              </div>
              {orderDetails.customer_details && orderDetails.customer_details.address && (
                <div className="p-4">
                  <h3 className="font-medium mb-2">Adresse de livraison</h3>
                  <address className="not-italic text-sm text-muted-foreground">
                    {orderDetails.customer_details?.name}<br />
                    {orderDetails.customer_details.address.line1}<br />
                    {orderDetails.customer_details.address.line2 && 
                      <>{orderDetails.customer_details.address.line2}<br /></>
                    }
                    {orderDetails.customer_details.address.postal_code} {orderDetails.customer_details.address.city}<br />
                    {orderDetails.customer_details.address.country}
                  </address>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium mb-2">Articles</h3>
                <ul className="space-y-2">
                  {orderDetails.line_items?.data?.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.description}</span>
                      <span>{formatPrice(item.amount_total)}</span>
                    </li>
                  )) || <li>Aucune information sur les articles disponible</li>}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-yellow-600">
              Les détails de la commande ne sont pas disponibles, mais votre paiement a bien été enregistré.
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/shop')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuer vos achats
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
