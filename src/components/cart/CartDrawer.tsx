
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setOpen(false);
    navigate('/cart');
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number, name: string) => {
    updateQuantity(id, currentQuantity + 1);
    toast.success(`Quantité de ${name} augmentée`);
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number, name: string) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
      toast.info(`Quantité de ${name} diminuée`);
    } else {
      removeItem(id);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.info(`${name} retiré du panier`);
  };

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl">Votre Panier</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Votre panier est vide</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setOpen(false);
                  navigate('/shop');
                }}
              >
                Découvrir notre collection
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        title="Retirer du panier"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Retirer du panier</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleDecreaseQuantity(item.id, item.quantity, item.name)}
                          title="Diminuer la quantité"
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Diminuer la quantité</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.name)}
                          title="Augmenter la quantité"
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Augmenter la quantité</span>
                        </Button>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(item.price)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formattedPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>Calculée à la commande</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formattedPrice}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 mt-4">
              <Button 
                className="w-full bg-gold hover:bg-gold/90 text-white"
                onClick={handleCheckout}
              >
                Passer à la caisse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Voir le panier
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
