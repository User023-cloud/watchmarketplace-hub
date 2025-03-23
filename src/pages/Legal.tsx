
import React from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/section-heading';
import { motion } from 'framer-motion';

const Legal = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Mentions Légales"
            subtitle="Informations légales concernant notre entreprise et l'utilisation de notre site web."
            centered
          />
          
          <motion.div 
            className="prose prose-lg dark:prose-invert mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>1. Informations légales</h2>
            <p>
              Le site ChronoElite est édité par la société ChronoElite SAS, au capital de 100 000 euros, 
              immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
            </p>
            <p>
              <strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France<br />
              <strong>Téléphone :</strong> +33 1 23 45 67 89<br />
              <strong>Email :</strong> contact@chronoelite.com<br />
              <strong>Directeur de la publication :</strong> Jean Dupont, Président
            </p>
            
            <h2>2. Hébergement</h2>
            <p>
              Le site ChronoElite est hébergé par la société Hosting Services Inc., 
              dont le siège social est situé au 456 Tech Street, 94107 San Francisco, California, USA.
            </p>
            
            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le site ChronoElite (textes, graphismes, logiciels, photographies, 
              images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, sont la propriété 
              exclusive de ChronoElite SAS ou font l'objet d'une autorisation d'utilisation. Ces éléments sont 
              protégés par les lois relatives à la propriété intellectuelle et notamment le droit d'auteur.
            </p>
            <p>
              Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, 
              de tout ou partie de ces éléments, y compris les applications informatiques, sans l'accord 
              préalable et écrit de ChronoElite SAS, est strictement interdite et constitue un délit de contrefaçon.
            </p>
            
            <h2>4. Données personnelles</h2>
            <p>
              Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à 
              ChronoElite SAS pour la gestion de sa clientèle et la prospection commerciale. 
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée, et au 
              Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, 
              de rectification, d'effacement, et de portabilité des données vous concernant.
            </p>
            <p>
              Pour exercer ces droits ou pour toute question sur le traitement de vos données, 
              vous pouvez contacter notre Délégué à la Protection des Données à l'adresse email : 
              dpo@chronoelite.com ou par courrier à l'adresse postale mentionnée ci-dessus.
            </p>
            
            <h2>5. Cookies</h2>
            <p>
              Le site ChronoElite utilise des cookies pour améliorer l'expérience utilisateur. 
              Ces cookies sont essentiels au fonctionnement du site ou servent à des fins statistiques 
              et ne contiennent aucune information personnelle. En naviguant sur ce site, vous acceptez 
              l'utilisation de ces cookies. Vous pouvez toutefois les désactiver dans les paramètres de votre navigateur.
            </p>
            
            <h2>6. Limitation de responsabilité</h2>
            <p>
              ChronoElite SAS s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations 
              diffusées sur son site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, 
              le contenu. Toutefois, ChronoElite SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité 
              des informations mises à disposition sur ce site.
            </p>
            <p>
              En conséquence, ChronoElite SAS décline toute responsabilité pour les éventuelles imprécisions, 
              inexactitudes ou omissions portant sur des informations disponibles sur ce site.
            </p>
            
            <h2>7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux 
              français seront seuls compétents.
            </p>
            
            <p className="text-sm text-muted-foreground mt-10">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
