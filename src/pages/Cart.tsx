
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Minus, Plus, Trash, ShoppingBag, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-playfair font-bold ml-4">Votre panier</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-playfair font-semibold mb-4">Articles ({items.length})</h2>
              
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.id} className="py-6 flex gap-4">
                    <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(item.price)} par unité
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continuer vos achats
                </Button>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
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
                  <span>Total estimé</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gold hover:bg-gold/90 text-white"
                onClick={() => navigate('/checkout')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Procéder au paiement
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Tous les prix incluent la TVA. Livraison calculée à l'étape suivante.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
