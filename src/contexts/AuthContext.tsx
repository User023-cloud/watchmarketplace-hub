
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initializing auth context...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        
        if (newSession) {
          console.log('User authenticated:', newSession.user.email);
          setSession(newSession);
          setUser(newSession.user);
          setIsAdmin(true); // Consider all authenticated users as admin for now
          
          // Only redirect if we're on admin page or login-related paths
          if (location.pathname === '/admin') {
            console.log('Redirecting to dashboard after authentication');
            navigate('/dashboard');
          }
        } else {
          console.log('User not authenticated');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          
          // Redirect to admin login if on dashboard and not authenticated
          if (location.pathname === '/dashboard') {
            console.log('Redirecting to admin login page - not authenticated');
            navigate('/admin');
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Existing session:", existingSession);
      
      if (existingSession) {
        setSession(existingSession);
        setUser(existingSession.user);
        setIsAdmin(true); // Consider all authenticated users as admin for now
        
        // Only redirect if we're on admin page
        if (location.pathname === '/admin') {
          console.log('Redirecting to dashboard - existing session found');
          navigate('/dashboard');
        }
      } else {
        // Redirect to admin login if on dashboard and no session
        if (location.pathname === '/dashboard') {
          console.log('Redirecting to admin login page - no session found');
          navigate('/admin');
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to register with:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin' // Store role in user metadata
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log("Registration successful:", data.user);
        toast({
          title: "Inscription réussie",
          description: "Votre compte administrateur a été créé avec succès.",
        });
        
        // After successful registration, sign in
        await signIn(email, password);
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        
        setIsAdmin(true); // Consider all authenticated users as admin for now
        
        // Explicit redirect to dashboard
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
      console.log("User signed out successfully");
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
        signUp,
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
