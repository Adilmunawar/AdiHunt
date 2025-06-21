import { createClient } from '@supabase/supabase-js';

// Environment variables with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Supabase environment variables not configured. Using demo mode.');
}

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'AdiHunt'
      }
    }
  }
);

// Check if we're in demo mode
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          usage_count: number;
          usage_limit: number;
          api_credits: number;
          preferences: any;
          onboarding_completed: boolean;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          usage_count?: number;
          usage_limit?: number;
          api_credits?: number;
          preferences?: any;
          onboarding_completed?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          usage_count?: number;
          usage_limit?: number;
          api_credits?: number;
          preferences?: any;
          onboarding_completed?: boolean;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          color: string;
          industry: string;
          target_audience: string;
          brand_voice: string;
          primary_keywords: string[];
          competitor_urls: string[];
          content_goals: any;
          seo_settings: any;
          article_count: number;
          total_words: number;
          avg_seo_score: number;
          is_archived: boolean;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
          industry?: string;
          target_audience?: string;
          brand_voice?: string;
          primary_keywords?: string[];
          competitor_urls?: string[];
          content_goals?: any;
          seo_settings?: any;
        };
        Update: {
          name?: string;
          description?: string | null;
          color?: string;
          industry?: string;
          target_audience?: string;
          brand_voice?: string;
          primary_keywords?: string[];
          competitor_urls?: string[];
          content_goals?: any;
          seo_settings?: any;
        };
      };
      articles: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          slug: string;
          meta_description: string | null;
          content: string;
          excerpt: string;
          featured_image: string;
          seo_title: string;
          seo_description: string;
          seo_keywords: string[];
          target_keywords: string[];
          semantic_keywords: string[];
          internal_links: string[];
          external_links: string[];
          word_count: number;
          reading_time: string;
          seo_score: number;
          readability_score: number;
          keyword_density: any;
          content_structure: any;
          schema_markup: any;
          ai_suggestions: any;
          optimization_history: any[];
          status: 'draft' | 'optimizing' | 'ready' | 'published' | 'archived';
          published_at: string | null;
          export_count: number;
          last_exported_at: string | null;
          version: number;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          slug: string;
          meta_description?: string | null;
          content: string;
          excerpt?: string;
          featured_image?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          target_keywords?: string[];
          semantic_keywords?: string[];
          internal_links?: string[];
          external_links?: string[];
          word_count?: number;
          reading_time?: string;
          seo_score?: number;
          readability_score?: number;
          keyword_density?: any;
          content_structure?: any;
          schema_markup?: any;
          ai_suggestions?: any;
          optimization_history?: any[];
          status?: 'draft' | 'optimizing' | 'ready' | 'published' | 'archived';
          published_at?: string | null;
          export_count?: number;
          last_exported_at?: string | null;
          version?: number;
          parent_id?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          meta_description?: string | null;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          target_keywords?: string[];
          semantic_keywords?: string[];
          internal_links?: string[];
          external_links?: string[];
          word_count?: number;
          reading_time?: string;
          seo_score?: number;
          readability_score?: number;
          keyword_density?: any;
          content_structure?: any;
          schema_markup?: any;
          ai_suggestions?: any;
          optimization_history?: any[];
          status?: 'draft' | 'optimizing' | 'ready' | 'published' | 'archived';
          published_at?: string | null;
          export_count?: number;
          last_exported_at?: string | null;
          version?: number;
          parent_id?: string | null;
        };
      };
    };
  };
};