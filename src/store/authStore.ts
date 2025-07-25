import { create } from 'zustand';
import { supabase, isDemoMode } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  enableDemoMode: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  demoMode: isDemoMode,

  signIn: async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode - simulate successful login
      const demoUser = {
        id: 'demo-user-id',
        email: email,
        user_metadata: { full_name: 'Demo User' }
      } as User;
      
      set({ 
        user: demoUser,
        profile: {
          id: 'demo-user-id',
          email: email,
          full_name: 'Demo User',
          subscription_tier: 'pro',
          usage_count: 5,
          usage_limit: 100,
          api_credits: 500
        }
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      set({ user: data.user });
      await get().loadProfile();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    if (isDemoMode) {
      // Demo mode - simulate successful signup
      const demoUser = {
        id: 'demo-user-id',
        email: email,
        user_metadata: { full_name: fullName }
      } as User;
      
      set({ 
        user: demoUser,
        profile: {
          id: 'demo-user-id',
          email: email,
          full_name: fullName,
          subscription_tier: 'free',
          usage_count: 0,
          usage_limit: 10,
          api_credits: 100
        }
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    if (isDemoMode) {
      set({ user: null, profile: null });
      return;
    }

    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  loadProfile: async () => {
    if (isDemoMode) return;

    try {
      const user = get().user;
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || null,
          subscription_tier: 'free' as const,
          usage_count: 0,
          usage_limit: 10,
          api_credits: 100,
          preferences: {},
          onboarding_completed: false
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        set({ profile: createdProfile });
      } else {
        set({ profile: data });
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    }
  },

  updateProfile: async (updates: any) => {
    if (isDemoMode) {
      set(state => ({ profile: { ...state.profile, ...updates } }));
      return;
    }

    try {
      const user = get().user;
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  enableDemoMode: () => {
    set({ 
      demoMode: true,
      user: {
        id: 'demo-user-id',
        email: 'demo@adihunt.com',
        user_metadata: { full_name: 'Demo User' }
      } as User,
      profile: {
        id: 'demo-user-id',
        email: 'demo@adihunt.com',
        full_name: 'Demo User',
        subscription_tier: 'pro',
        usage_count: 5,
        usage_limit: 100,
        api_credits: 500
      }
    });
  }
}));

// Initialize auth state with error handling
if (!isDemoMode) {
  supabase.auth.onAuthStateChange((event, session) => {
    try {
      const { user } = session || {};
      useAuthStore.setState({ user, loading: false });
      
      if (user) {
        useAuthStore.getState().loadProfile();
      }
    } catch (error) {
      console.error('Auth state change error:', error);
      useAuthStore.setState({ loading: false });
    }
  });
} else {
  // In demo mode, set loading to false immediately
  useAuthStore.setState({ loading: false });
}