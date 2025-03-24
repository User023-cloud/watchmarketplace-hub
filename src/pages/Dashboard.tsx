
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, session, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  // Check authentication and redirect if needed
  useEffect(() => {
    console.log("Dashboard - Auth state:", { user, session, isAdmin, loading });
    
    if (!loading && (!user || !session)) {
      console.log("User not authenticated, redirecting to admin page");
      navigate('/admin');
    }
  }, [user, session, isAdmin, loading, navigate]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // Show error if not authenticated (should not normally be visible due to redirect)
  if (!user || !session) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-xl font-bold text-center">
                Accès non autorisé
              </CardTitle>
              <CardDescription className="text-center">
                Vous devez être connecté pour accéder à cette page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Button 
                className="bg-gold hover:bg-gold/90 text-white" 
                onClick={() => navigate('/admin')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-10 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">Tableau de bord</h1>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Utilisateur connecté</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {isAdmin ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* More dashboard cards would go here */}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Bienvenue dans votre interface d'administration</h2>
          <p className="text-muted-foreground">
            Vous êtes maintenant connecté et pouvez gérer votre boutique en ligne.
            Cette interface vous permettra de contrôler tous les aspects de votre site.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
