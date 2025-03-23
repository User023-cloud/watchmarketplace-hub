
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, TruckIcon, CreditCard } from 'lucide-react';
import SectionHeading from '@/components/ui/section-heading';

const features = [
  {
    icon: Clock,
    title: 'Fabrication Suisse',
    description: 'Nos montres sont fabriquées en Suisse selon les standards les plus élevés de l\'horlogerie traditionnelle.',
  },
  {
    icon: Shield,
    title: 'Garantie 5 ans',
    description: 'Toutes nos montres bénéficient d\'une garantie de 5 ans contre les défauts de fabrication.',
  },
  {
    icon: TruckIcon,
    title: 'Livraison Offerte',
    description: 'Nous vous offrons la livraison express et assurée partout dans le monde.',
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé',
    description: 'Vos transactions sont 100% sécurisées grâce à notre système de paiement crypté.',
  },
];

const Features = () => {
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
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Pourquoi Nous Choisir"
          subtitle="ChronoElite vous offre une expérience horlogère d'exception, de la qualité de nos produits à notre service client premium."
          centered
        />
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-playfair text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
