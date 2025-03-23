
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import SectionHeading from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, ShoppingBag, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, isAdmin, loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification supplémentaire de l'authentification
    console.log("Dashboard - Auth state:", {
      user,
      sessionExists: !!session,
      isAdmin,
      loading,
      userEmail: user?.email,
      userId: user?.id
    });
    
    if (!loading && (!user || !session)) {
      console.log("User not authenticated, redirecting to admin page");
      navigate('/admin');
    }
  }, [user, navigate, loading, isAdmin, session]);

  return (
    <Layout>
      <section className="py-8">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <SectionHeading
              title="Tableau de bord Admin"
              subtitle={`Bienvenue, ${user?.email}`}
              className="mb-0"
            />
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Produits
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  Paramètres
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User size={16} />
                  Compte
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestion des produits</CardTitle>
                      <CardDescription>
                        Ajoutez, modifiez ou supprimez des produits de votre catalogue.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Vous avez actuellement 3 produits dans votre catalogue.
                      </p>
                      <div className="grid gap-4">
                        {/* Liste des produits serait ici */}
                        <div className="p-4 border rounded-md flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">ChronoElite Classic</h3>
                            <p className="text-sm text-muted-foreground">599 €</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            <Button variant="destructive" size="sm">Supprimer</Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-md flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">ChronoElite Sport</h3>
                            <p className="text-sm text-muted-foreground">899 €</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            <Button variant="destructive" size="sm">Supprimer</Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-md flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">ChronoElite Luxe</h3>
                            <p className="text-sm text-muted-foreground">1499 €</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            <Button variant="destructive" size="sm">Supprimer</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Ajouter un nouveau produit</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du site</CardTitle>
                    <CardDescription>
                      Gérez les paramètres généraux de votre boutique en ligne.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Cette section est en cours de développement.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du compte</CardTitle>
                    <CardDescription>
                      Gérez votre profil administrateur et vos informations de connexion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">ID utilisateur</p>
                        <p className="text-muted-foreground">{user?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rôle</p>
                        <p className="text-muted-foreground">
                          {isAdmin ? 'Administrateur' : 'Utilisateur standard'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dernière connexion</p>
                        <p className="text-muted-foreground">
                          {new Date().toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Changer le mot de passe</Button>
                    <Button variant="destructive">Supprimer le compte</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
