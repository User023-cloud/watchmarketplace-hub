
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [email, setEmail] = useState('admin@site.local');
  const [password, setPassword] = useState('admin');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn, loading, user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Admin page - Auth state:", { 
      user, 
      session, 
      sessionExists: !!session, 
      userEmail: user?.email,
      loading 
    });
    
    if (user && session) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, session, navigate, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    console.log("Login form submitted with email:", email);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error caught in form handler:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsRegistering(true);
    
    try {
      console.log("Creating user with email:", regEmail);
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
      });

      if (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.message);
      } else {
        console.log("Registration successful:", data);
        setSuccessMessage("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Administration"
            subtitle="Connectez-vous ou créez un compte administrateur pour accéder à l'interface d'administration."
            centered
          />
          
          <motion.div
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="admin@exemple.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Mot de passe</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full hover-shine"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      'Créer un compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
              <p>
                Pour commencer, vous pouvez créer un compte administrateur ou utiliser les identifiants par défaut (si un compte existe déjà) :
              </p>
              <p className="mt-2">
                <strong>Email:</strong> admin@site.local<br />
                <strong>Mot de passe:</strong> admin
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
