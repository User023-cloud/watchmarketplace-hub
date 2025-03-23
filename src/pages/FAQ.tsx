
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/section-heading';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqCategories = [
  {
    category: 'Produits',
    questions: [
      {
        question: 'Comment choisir la montre qui me convient ?',
        answer: 'Pour choisir la montre qui vous convient, prenez en compte votre style de vie, vos activités quotidiennes et vos préférences esthétiques. Une montre de plongée conviendra aux amateurs de sports nautiques, tandis qu'une montre classique s'adaptera mieux aux environnements professionnels. Nous vous recommandons également de tenir compte de la taille de votre poignet, du matériau du boîtier et du bracelet, ainsi que des fonctionnalités que vous recherchez.',
      },
      {
        question: 'Quelle est la différence entre un mouvement automatique et un mouvement à quartz ?',
        answer: 'Un mouvement automatique fonctionne grâce à l'énergie mécanique générée par les mouvements naturels du poignet, sans nécessiter de pile. C'est une prouesse d'ingénierie horlogère traditionnelle. Un mouvement à quartz, quant à lui, est alimenté par une pile et offre une précision supérieure. Les montres automatiques sont généralement plus appréciées des collectionneurs pour leur artisanat, tandis que les montres à quartz sont plus accessibles et nécessitent moins d'entretien.',
      },
      {
        question: 'Mes montres sont-elles étanches ?',
        answer: 'Toutes nos montres possèdent un certain degré d'étanchéité, indiqué en mètres ou en atmosphères (ATM). Une montre marquée 30m/3ATM résiste aux éclaboussures et à la pluie, mais n'est pas adaptée à la natation. Pour la natation, optez pour une étanchéité de 50m/5ATM minimum. Pour la plongée, choisissez des montres offrant au moins 100m/10ATM d'étanchéité. Notez que l'étanchéité peut diminuer avec le temps et nécessite une vérification régulière.',
      },
    ],
  },
  {
    category: 'Commandes et Livraison',
    questions: [
      {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Pour les produits en stock, nous expédions sous 24 à 48 heures ouvrées. La livraison standard prend généralement 3 à 5 jours ouvrables pour la France métropolitaine, et 5 à 10 jours pour l'international. Nous proposons également une option de livraison express qui permet une réception sous 1 à 2 jours ouvrables. Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition de votre commande.',
      },
      {
        question: 'Comment suivre ma commande ?',
        answer: 'Dès que votre commande est expédiée, vous recevez automatiquement un email contenant un lien de suivi. Vous pouvez également vous connecter à votre compte sur notre site et consulter la section "Mes commandes" pour voir l'état de votre livraison en temps réel. Si vous rencontrez des problèmes ou si vous n'avez pas reçu d'information de suivi dans les 48h après votre achat, n'hésitez pas à contacter notre service client.',
      },
      {
        question: 'Quelles sont les options de paiement disponibles ?',
        answer: 'Nous acceptons plusieurs méthodes de paiement sécurisées : cartes bancaires (Visa, Mastercard, American Express), PayPal, Apple Pay et Google Pay. Pour les achats de montres haut de gamme, nous proposons également des solutions de financement avec paiement en plusieurs fois. Toutes vos informations de paiement sont protégées par un cryptage SSL avancé pour garantir la sécurité de vos transactions.',
      },
    ],
  },
  {
    category: 'Garantie et SAV',
    questions: [
      {
        question: 'Quelle garantie offrez-vous sur vos montres ?',
        answer: 'Toutes nos montres bénéficient d'une garantie internationale de 5 ans contre les défauts de fabrication. Cette garantie couvre le mouvement, les aiguilles, le cadran et toutes les pièces internes. Les dommages résultant d'un accident, d'une utilisation inappropriée ou d'une modification non autorisée ne sont pas couverts. Pour activer votre garantie, il suffit d'enregistrer votre montre sur notre site web dans les 30 jours suivant votre achat.',
      },
      {
        question: 'Comment entretenir ma montre ?',
        answer: 'Pour préserver la beauté et la performance de votre montre, nous recommandons un nettoyage régulier avec un chiffon doux légèrement humide. Évitez d'exposer votre montre à des champs magnétiques puissants, à des produits chimiques ou à des températures extrêmes. Pour les montres automatiques, si vous ne les portez pas régulièrement, utilisez un écrin rotatif pour maintenir le mouvement. Un service d'entretien est recommandé tous les 3 à 5 ans pour garantir la précision et l'étanchéité de votre montre.',
      },
      {
        question: 'Comment faire réparer ma montre ?',
        answer: 'Si votre montre nécessite une réparation, contactez notre service client pour obtenir un numéro d'autorisation de retour. Vous pouvez ensuite nous envoyer votre montre, ou la déposer dans l'une de nos boutiques partenaires. Nos horlogers certifiés effectueront un diagnostic complet et vous fourniront un devis détaillé avant toute intervention. Les réparations sous garantie sont bien sûr gratuites. Pour les autres cas, nous vous proposerons la solution la plus adaptée au meilleur prix.',
      },
    ],
  },
];

// Flatten all questions for search functionality
const allQuestions = faqCategories.flatMap(category => 
  category.questions.map(q => ({ ...q, category: category.category }))
);

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filter questions based on search term
  const filteredQuestions = searchTerm
    ? allQuestions.filter(
        q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  // Show either filtered results or all categories
  const displayedCategories = searchTerm
    ? [...new Set(filteredQuestions.map(q => q.category))].map(catName => {
        const questions = filteredQuestions.filter(q => q.category === catName);
        return { category: catName, questions };
      })
    : faqCategories;
  
  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Foire Aux Questions"
            subtitle="Retrouvez les réponses aux questions les plus fréquemment posées."
            centered
          />
          
          {/* Search Bar */}
          <motion.div 
            className="mb-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </motion.div>
          
          {/* Quick Category Navigation - only shown when not searching */}
          {!searchTerm && (
            <motion.div 
              className="mb-8 flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {faqCategories.map((cat, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.category
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat.category ? null : cat.category);
                    // Scroll to the category
                    if (activeCategory !== cat.category) {
                      document.getElementById(cat.category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </motion.div>
          )}
          
          {/* FAQ Content */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {displayedCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} id={category.category} className="scroll-mt-24">
                <h3 className="font-playfair text-2xl font-medium mb-6">
                  {category.category}
                </h3>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${categoryIndex}-${itemIndex}`}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
            
            {searchTerm && displayedCategories.length === 0 && (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground">
                  Nous n'avons pas trouvé de réponse correspondant à votre recherche.
                </p>
              </div>
            )}
          </motion.div>
          
          {/* Additional Contact Info */}
          <motion.div 
            className="mt-16 text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-playfair text-xl font-medium mb-3">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-muted-foreground mb-6">
              N'hésitez pas à contacter notre équipe customer service qui se fera un plaisir de vous aider.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:support@chronoelite.com" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                support@chronoelite.com
              </a>
              <a 
                href="tel:+33123456789" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                +33 1 23 45 67 89
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
