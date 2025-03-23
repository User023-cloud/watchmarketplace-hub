
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Valeurs par défaut pour Supabase si les variables d'environnement ne sont pas définies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-id.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Vérifier que les valeurs sont définies
if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-id.supabase.co') {
  console.error("ATTENTION: URL Supabase non configurée. Veuillez définir VITE_SUPABASE_URL dans votre environnement.");
}

if (!supabaseKey || supabaseKey === 'your-supabase-anon-key') {
  console.error("ATTENTION: Clé Supabase non configurée. Veuillez définir VITE_SUPABASE_ANON_KEY dans votre environnement.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

type AuthContextType = {
  user: User | null;
  session: any | null;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkIsAdmin(session.user);
      }
      
      setLoading(false);
    });

    // Configurer l'écouteur de changement d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkIsAdmin(session.user);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIsAdmin = async (user: User) => {
    try {
      // Vérifier si l'utilisateur a un rôle admin dans la base de données
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
      
      // Définir isAdmin en fonction du rôle de l'utilisateur
      setIsAdmin(data?.role === 'admin');
      console.log('User admin status:', data?.role === 'admin');
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à l'interface d'administration.",
        });
        
        // Vérifier le rôle admin avant la redirection
        await checkIsAdmin(data.user);
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
        supabase,
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
