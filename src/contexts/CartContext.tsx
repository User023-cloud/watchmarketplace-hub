
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      return [];
    }
  });

  // Sauvegarde du panier dans le localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Produit existant, augmenter la quantité
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        toast.success(`Quantité de ${product.name} augmentée`);
        return updatedItems;
      } else {
        // Nouveau produit, ajouter au panier
        toast.success(`${product.name} ajouté au panier`);
        return [...currentItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} retiré du panier`);
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
