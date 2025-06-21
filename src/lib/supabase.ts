import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          usage_count?: number;
          usage_limit?: number;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          usage_count?: number;
          usage_limit?: number;
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
          article_count: number;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          color?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          meta_description: string | null;
          content: string;
          seo_score: number;
          word_count: number;
          target_keywords: string[];
          status: 'draft' | 'optimizing' | 'ready' | 'published';
          created_at: string;
          updated_at: string;
          trend_data: any | null;
          schema_markup: any | null;
          internal_links: string[] | null;
        };
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          meta_description?: string | null;
          content: string;
          seo_score?: number;
          word_count?: number;
          target_keywords?: string[];
          status?: 'draft' | 'optimizing' | 'ready' | 'published';
          trend_data?: any | null;
          schema_markup?: any | null;
          internal_links?: string[] | null;
        };
        Update: {
          title?: string;
          meta_description?: string | null;
          content?: string;
          seo_score?: number;
          word_count?: number;
          target_keywords?: string[];
          status?: 'draft' | 'optimizing' | 'ready' | 'published';
          trend_data?: any | null;
          schema_markup?: any | null;
          internal_links?: string[] | null;
        };
      };
    };
  };
};