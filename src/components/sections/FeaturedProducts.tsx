
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/product-card';
import SectionHeading from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Temporary product data
const products = [
  {
    id: '1',
    name: 'Chronographe Precision',
    price: 3499.99,
    imageSrc: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Chronographe',
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: '2',
    name: 'Classique Élégance',
    price: 2899.99,
    imageSrc: 'https://images.unsplash.com/photo-1548359638-e51353ca6d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Classique',
    featured: false,
    bestseller: true,
    new: false,
  },
  {
    id: '3',
    name: 'Sport Aventure',
    price: 1999.99,
    imageSrc: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Sport',
    featured: false,
    bestseller: false,
    new: true,
  },
];

const FeaturedProducts = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Notre Collection"
          subtitle="Découvrez nos montres d'exception, alliant tradition horlogère et innovation technique pour une élégance intemporelle."
          centered
        />
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <Button asChild className="rounded-full px-8 hover-shine bg-gold text-white hover:bg-gold/90">
            <Link to="/shop">
              Voir toute la collection <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
