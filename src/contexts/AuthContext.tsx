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
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
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
        // Clear invalid session data
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

  // Enhanced logout function for HTML/JavaScript applications
  const handleSignOut = async () => {
    try {
      console.log('Starting enhanced logout process...');
      
      // Step 1: Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      
      // Step 2: Manual localStorage cleanup
      localStorage.clear();
      sessionStorage.clear();
      
      // Step 3: Clear user state
      setUser(null);
      
      // Step 4: Clear any cached auth tokens
      try {
        // Clear any potential auth cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (cookieError) {
        console.warn('Could not clear cookies:', cookieError);
      }
      
      // Step 5: Force page reload to reset application state
      console.log('Forcing page reload to complete logout...');
      window.location.href = '/';
      
    } catch (err) {
      console.error('Logout process failed:', err);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      window.location.href = '/';
    }
  };

  useEffect(() => {
    // Enhanced initial session check with validation
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

    // Enhanced auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          if (event === 'SIGNED_OUT' || !session) {
            // Clear all storage and state on sign out
            console.log('Handling sign out event...');
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
          } else if (event === 'SIGNED_IN' && session?.user) {
            console.log('Handling sign in event...');
            await setUserFromSupabaseUser(session.user);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('Handling token refresh event...');
            // Validate refreshed session
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
    }, 5 * 60 * 1000); // 5 minutes

    // Listen for storage events (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue && user) {
        console.log('Auth token removed in another tab, signing out...');
        setUser(null);
        window.location.href = '/';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for beforeunload to clean up if needed
    const handleBeforeUnload = () => {
      // Don't clear storage on page refresh, only on actual navigation away
      if (performance.navigation?.type === 1) { // TYPE_RELOAD
        return;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const setUserFromSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Setting user from Supabase user:', supabaseUser.email);
      
      // Get or create user profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
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

  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      console.log('Sending magic link to:', email);
      
      // Clear any existing session and storage first
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          shouldCreateUser: true,
          data: {
            full_name: email.split('@')[0] // Default name from email
          }
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        
        // Provide more specific error messages
        let errorMessage = 'An error occurred while sending the magic link. Please try again.';
        
        if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before requesting another magic link.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('Magic link sent successfully to:', email);
      return { success: true };
    } catch (error) {
      console.error('Magic link error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Use the enhanced logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await handleSignOut();
    // handleSignOut already handles setIsLoading(false) via page reload
  };

  return (
    <AuthContext.Provider value={{ user, sendMagicLink, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};