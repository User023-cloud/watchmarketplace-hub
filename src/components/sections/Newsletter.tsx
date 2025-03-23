
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Inscription réussie",
        description: "Merci de vous être inscrit à notre newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-playfair text-3xl sm:text-4xl font-semibold mb-4">
              Restez informé des dernières nouveautés
            </h2>
            <p className="text-muted-foreground">
              Inscrivez-vous à notre newsletter pour recevoir en avant-première nos nouveautés, offres exclusives et conseils horlogers.
            </p>
          </motion.div>
          
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 rounded-full px-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="rounded-full px-8 hover-shine bg-gold text-white hover:bg-gold/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.form>
          
          <motion.p
            className="text-sm text-muted-foreground mt-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            En vous inscrivant, vous acceptez notre politique de confidentialité et nos conditions d'utilisation.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
