
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple login simulation
    setTimeout(() => {
      if (email === 'admin@site.local' && password === 'admin') {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à l'interface d'administration.",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Identifiants incorrects. Veuillez réessayer.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Administration"
            subtitle="Connectez-vous pour accéder à l'interface d'administration."
            centered
          />
          
          <motion.div
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@site.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full hover-shine"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
              <p>
                Première connexion ? Utilisez les identifiants par défaut :
              </p>
              <p className="mt-2">
                <strong>Email:</strong> admin@site.local<br />
                <strong>Mot de passe:</strong> admin
              </p>
              <p className="mt-4 text-xs">
                Note: Pour une version complète avec intégration Supabase, veuillez suivre les étapes d'intégration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
