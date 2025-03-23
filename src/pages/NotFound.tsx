
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <section className="py-20 flex items-center min-h-[70vh]">
        <div className="container max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-playfair text-7xl md:text-9xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
            
            <div className="w-16 h-1 bg-gold mx-auto mb-8"></div>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-medium mb-4">
              Page non trouvée
            </h2>
            
            <p className="text-muted-foreground mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <Button asChild className="rounded-full px-8 hover-shine">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
