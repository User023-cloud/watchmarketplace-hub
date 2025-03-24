
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          cartItems: items,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        },
      });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast.error('Une erreur est survenue lors de la préparation du paiement');
        setLoading(false);
        return;
      }

      if (data && data.url) {
        // Rediriger vers Stripe
        window.location.href = data.url;
      } else {
        toast.error('URL de paiement manquante dans la réponse');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
      setLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-16 px-4">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-playfair font-bold mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Vous n'avez aucun article dans votre panier.
            </p>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              Explorer notre collection
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-playfair font-bold ml-4">Finaliser votre commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Résumé de la commande */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-playfair font-semibold mb-4">Résumé de votre commande</h2>
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="font-medium">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-playfair font-semibold">Informations de livraison</h2>
              </div>
              <p className="text-muted-foreground">
                Les informations de livraison seront collectées sur la page de paiement Stripe.
              </p>
            </div>
          </div>

          {/* Résumé du paiement */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-playfair font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formattedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>Calculée à l'étape suivante</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>Calculées à l'étape suivante</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gold hover:bg-gold/90 text-white"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Préparation du paiement...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Procéder au paiement
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                En procédant au paiement, vous acceptez nos conditions générales de vente.
                Le paiement est sécurisé par Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
