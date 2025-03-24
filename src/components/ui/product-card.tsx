
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  category: string;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
}

export const ProductCard = ({
  id,
  name,
  price,
  imageSrc,
  category,
  featured = false,
  bestseller = false,
  new: isNew = false,
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { addItem } = useCart();

  // Format price with euro symbol
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    initial: {
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Animation d'ajout
    setIsAdding(true);
    
    // Ajouter au panier
    addItem({ id, name, price, imageSrc, category });
    
    // Réinitialiser après une courte durée
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
    
    // Notification
    toast.success(`${name} ajouté au panier`, {
      description: "Vous pouvez voir votre panier en cliquant sur l'icône en haut à droite",
    });
  };

  return (
    <motion.div
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <Link to={`/product/${id}`} className="relative overflow-hidden aspect-square">
        <div className={cn("image-blur-wrapper", imageLoaded ? "image-loaded" : "")}>
          {/* Blurred placeholder */}
          <div
            className="image-blur"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Actual image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={name}
            className="image-main object-cover w-full h-full"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-gold text-gold-foreground hover:bg-gold/90">
              Exclusif
            </Badge>
          )}
          {bestseller && (
            <Badge className="bg-black text-white dark:bg-white dark:text-black">
              Bestseller
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-white text-black dark:bg-black dark:text-white border border-current">
              Nouveau
            </Badge>
          )}
        </div>
        
        {/* Quick actions */}
        <motion.div 
          className="absolute right-3 top-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            size="icon" 
            variant="outline" 
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Ajouter aux favoris</span>
          </Button>
        </motion.div>
      </Link>
      
      {/* Content */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="text-sm text-muted-foreground font-medium mb-1">{category}</div>
        <Link to={`/product/${id}`} className="hover:underline">
          <h3 className="font-playfair text-lg font-medium mb-2 line-clamp-1">{name}</h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="font-semibold">{formattedPrice}</div>
          <Button
            size="sm"
            className={`rounded-full text-sm px-4 ${isAdding ? 'bg-green-600 hover:bg-green-700' : 'hover-shine bg-primary hover:bg-primary/90'}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Ajouté
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
