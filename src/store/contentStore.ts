import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { GeminiService } from '../lib/gemini';
import { TrendsService } from '../lib/trends';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  article_count: number;
  created_at: string;
}

interface Article {
  id: string;
  project_id: string;
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
}

interface ContentState {
  projects: Project[];
  articles: Article[];
  currentProject: Project | null;
  currentArticle: Article | null;
  loading: boolean;
  trends: any[];
  
  // Actions
  loadProjects: () => Promise<void>;
  createProject: (name: string, description?: string, color?: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  loadArticles: (projectId?: string) => Promise<void>;
  createArticle: (projectId: string, data: any) => Promise<Article>;
  updateArticle: (id: string, updates: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  generateContent: (request: any) => Promise<Article>;
  optimizeContent: (articleId: string) => Promise<void>;
  
  loadTrends: (industry?: string) => Promise<void>;
  
  setCurrentProject: (project: Project | null) => void;
  setCurrentArticle: (article: Article | null) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  projects: [],
  articles: [],
  currentProject: null,
  currentArticle: null,
  loading: false,
  trends: [],

  loadProjects: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [] });
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (name: string, description?: string, color = '#3b82f6') => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        color,
        user_id: (await supabase.auth.getUser()).data.user?.id!,
      })
      .select()
      .single();

    if (error) throw error;
    
    set(state => ({
      projects: [data, ...state.projects]
    }));
    
    return data;
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    set(state => ({
      projects: state.projects.map(p => p.id === id ? data : p)
    }));
  },

  deleteProject: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    set(state => ({
      projects: state.projects.filter(p => p.id !== id)
    }));
  },

  loadArticles: async (projectId?: string) => {
    set({ loading: true });
    try {
      let query = supabase.from('articles').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ articles: data || [] });
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      set({ loading: false });
    }
  },

  createArticle: async (projectId: string, data: any) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        project_id: projectId,
        user_id: user.id,
        ...data,
      })
      .select()
      .single();

    if (error) throw error;
    
    set(state => ({
      articles: [article, ...state.articles]
    }));
    
    return article;
  },

  updateArticle: async (id: string, updates: Partial<Article>) => {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    set(state => ({
      articles: state.articles.map(a => a.id === id ? data : a),
      currentArticle: state.currentArticle?.id === id ? data : state.currentArticle
    }));
  },

  deleteArticle: async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    set(state => ({
      articles: state.articles.filter(a => a.id !== id)
    }));
  },

  generateContent: async (request: any) => {
    set({ loading: true });
    try {
      // Generate content using Gemini
      const generatedContent = await GeminiService.generateContent(request);
      
      // Create article in database
      const article = await get().createArticle(request.projectId, {
        title: generatedContent.title,
        meta_description: generatedContent.metaDescription,
        content: generatedContent.content,
        seo_score: generatedContent.seoScore,
        word_count: generatedContent.content.split(' ').length,
        target_keywords: generatedContent.keywords,
        status: 'ready',
        schema_markup: generatedContent.schemaMarkup,
      });
      
      return article;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  optimizeContent: async (articleId: string) => {
    const article = get().articles.find(a => a.id === articleId);
    if (!article) return;

    set({ loading: true });
    try {
      const optimization = await GeminiService.optimizeContent(
        article.content,
        article.target_keywords
      );
      
      await get().updateArticle(articleId, {
        seo_score: optimization.seoScore,
        status: 'ready'
      });
    } catch (error) {
      console.error('Error optimizing content:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadTrends: async (industry = 'technology') => {
    set({ loading: true });
    try {
      const trends = await TrendsService.getTrendingKeywords(industry);
      set({ trends });
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      set({ loading: false });
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  setCurrentArticle: (article: Article | null) => {
    set({ currentArticle: article });
  },
}));