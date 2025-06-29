import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced session validation function
  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        return null;
      }

      // Check if session is expired
      if (session?.expires_at && session.expires_at < Date.now() / 1000) {
        console.log('Session expired, clearing...');
        await handleSignOut();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error validating session:', error);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      return null;
    }
  };

  // Enhanced logout function
  const handleSignOut = async () => {
    try {
      console.log('Starting logout process...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (cookieError) {
        console.warn('Could not clear cookies:', cookieError);
      }
      
      console.log('Logout completed');
      
    } catch (err) {
      console.error('Logout process failed:', err);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Validating initial session...');
        const session = await validateSession();
        
        if (session?.user) {
          console.log('Valid session found, setting user...');
          await setUserFromSupabaseUser(session.user);
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          if (event === 'SIGNED_OUT' || !session) {
            console.log('Handling sign out event...');
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
          } else if (event === 'SIGNED_IN' && session?.user) {
            console.log('Handling sign in event...');
            await setUserFromSupabaseUser(session.user);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('Handling token refresh event...');
            const validSession = await validateSession();
            if (validSession?.user) {
              await setUserFromSupabaseUser(validSession.user);
            }
          } else if (event === 'USER_UPDATED' && session?.user) {
            console.log('Handling user update event...');
            await setUserFromSupabaseUser(session.user);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    );

    // Periodic session validation (every 5 minutes)
    const sessionCheckInterval = setInterval(async () => {
      if (user) {
        console.log('Performing periodic session check...');
        const session = await validateSession();
        if (!session) {
          console.log('Session invalid during periodic check, signing out...');
          await handleSignOut();
        }
      }
    }, 5 * 60 * 1000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue && user) {
        console.log('Auth token removed in another tab, signing out...');
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const setUserFromSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Setting user from Supabase user:', supabaseUser.email);
      
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('Creating new profile for user...');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        profile = newProfile;
      } else if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        const userData = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.email.split('@')[0]
        };
        console.log('User data set:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error in setUserFromSupabaseUser:', error);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      console.log('Signing up user:', email);
      
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        let errorMessage = 'An error occurred during sign up. Please try again.';
        
        if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('Sign up successful:', email);
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      console.log('Signing in user:', email);
      
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('Sign in error:', error);
        
        let errorMessage = 'Invalid email or password. Please try again.';
        
        if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('Sign in successful:', email);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await handleSignOut();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};