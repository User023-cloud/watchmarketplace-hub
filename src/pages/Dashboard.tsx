
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LogOut, User, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Définition des types pour les commandes
interface OrderItem {
  description: string;
  quantity: number;
  amount_total: number;
}

interface Order {
  id: string;
  created: number;
  status: string;
  amount_total: number;
  customer_details: {
    email: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postal_code: string;
    };
  };
  line_items?: {
    data: OrderItem[];
  };
}

const Dashboard = () => {
  const { user, session, isAdmin, signOut, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check authentication and redirect if needed
  useEffect(() => {
    console.log("Dashboard - Auth state:", { user, session, isAdmin, loading });
    
    if (!loading && (!user || !session)) {
      console.log("User not authenticated, redirecting to admin page");
      navigate('/admin');
    }
  }, [user, session, isAdmin, loading, navigate]);

  // Charger les commandes de l'utilisateur
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        
        // Appel à une fonction edge pour récupérer les commandes par email
        const { data, error } = await supabase.functions.invoke('get-user-orders', {
          body: { email: user.email }
        });

        if (error) {
          console.error("Error fetching orders:", error);
          setOrdersError("Impossible de charger vos commandes");
          return;
        }

        if (data?.orders) {
          console.log("Orders fetched:", data.orders.length);
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error in fetchOrders:", error);
        setOrdersError("Une erreur s'est produite lors du chargement des commandes");
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);
  
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
  
  // Fonction utilitaire pour formater les prix
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100); // Stripe retourne les montants en centimes
  };
  
  // Fonction pour obtenir l'icône de statut de commande
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'canceled':
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">En traitement</Badge>;
      case 'canceled':
        return <Badge variant="outline">Annulée</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échouée</Badge>;
      default:
        return <Badge variant="outline">{status || 'Inconnu'}</Badge>;
    }
  };
  
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
          
          {/* Plus de cartes de dashboard pourraient être ajoutées ici */}
        </div>
        
        <Tabs defaultValue="orders" className="mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Mes Commandes</TabsTrigger>
            <TabsTrigger value="account">Mon Compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Mes Commandes
                </CardTitle>
                <CardDescription>
                  Historique et suivi de vos commandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                    <p className="text-destructive font-medium">{ordersError}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground font-medium">Vous n'avez pas encore passé de commande</p>
                    <Button 
                      className="mt-4 bg-gold hover:bg-gold/90 text-white"
                      onClick={() => navigate('/shop')}
                    >
                      Découvrir nos produits
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className="font-medium">Commande #{order.id.slice(-8)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created * 1000).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(order.status)}
                            <span className="font-medium mt-1">
                              {formatPrice(order.amount_total)}
                            </span>
                          </div>
                        </div>
                        
                        {order.line_items?.data && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            <p className="font-medium mb-1">Articles:</p>
                            <ul className="space-y-1">
                              {order.line_items.data.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.quantity}x {item.description}</span>
                                  <span>{formatPrice(item.amount_total)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {order.customer_details?.address && (
                          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                            <p className="font-medium mb-1">Adresse de livraison:</p>
                            <address className="not-italic">
                              {order.customer_details.address.line1}<br />
                              {order.customer_details.address.line2 && (
                                <>{order.customer_details.address.line2}<br /></>
                              )}
                              {order.customer_details.address.postal_code} {order.customer_details.address.city}<br />
                              {order.customer_details.address.country}
                            </address>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mon Compte
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Email</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
