
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initializing auth context...");
    
    // Configurer l'écouteur de changement d'authentification AVANT de vérifier la session existante
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          await checkIsAdmin(newSession.user);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // ENSUITE vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Existing session:", existingSession);
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkIsAdmin(existingSession.user);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIsAdmin = async (user: User) => {
    try {
      // Pour l'instant, considérer tous les utilisateurs authentifiés comme admin
      // À modifier plus tard pour vérifier un rôle spécifique dans la base de données
      console.log("Checking admin status for user:", user.id);
      setIsAdmin(true);
      
      // Décommenter et adapter ce code lorsque la table users avec le champ role sera créée
      /*
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data?.role === 'admin');
      console.log('User admin status:', data?.role === 'admin');
      */
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting sign in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log("Sign in successful:", data.user);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à l'interface d'administration.",
        });
        
        // Vérifier le rôle admin avant la redirection
        await checkIsAdmin(data.user);
        
        // Redirection explicite vers le tableau de bord
        console.log("Redirecting to dashboard after successful login");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/admin');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signOut,
        loading,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
