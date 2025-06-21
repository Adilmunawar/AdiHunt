import { create } from 'zustand';
import { supabase, isDemoMode } from '../lib/supabase';
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
  generateAdvancedContent: (request: any) => Promise<Article>;
  optimizeContent: (articleId: string) => Promise<void>;
  
  loadTrends: (industry?: string) => Promise<void>;
  
  setCurrentProject: (project: Project | null) => void;
  setCurrentArticle: (article: Article | null) => void;
}

// Demo data
const demoProjects: Project[] = [
  {
    id: 'demo-project-1',
    name: 'Tech Blog',
    description: 'Technology and AI content',
    color: '#3b82f6',
    article_count: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-project-2',
    name: 'Marketing Hub',
    description: 'Digital marketing strategies',
    color: '#10b981',
    article_count: 8,
    created_at: new Date().toISOString()
  }
];

const demoArticles: Article[] = [
  {
    id: 'demo-article-1',
    project_id: 'demo-project-1',
    title: 'The Future of AI in Content Creation',
    meta_description: 'Explore how AI is revolutionizing content creation and what it means for creators.',
    content: '<h1>The Future of AI in Content Creation</h1><p>Artificial Intelligence is transforming how we create content...</p>',
    seo_score: 92,
    word_count: 2500,
    target_keywords: ['AI content creation', 'artificial intelligence', 'content automation'],
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    trend_data: null,
    schema_markup: null
  },
  {
    id: 'demo-article-2',
    project_id: 'demo-project-1',
    title: 'SEO Best Practices for 2024',
    meta_description: 'Complete guide to SEO best practices and strategies for 2024.',
    content: '<h1>SEO Best Practices for 2024</h1><p>Search engine optimization continues to evolve...</p>',
    seo_score: 88,
    word_count: 3200,
    target_keywords: ['SEO 2024', 'search optimization', 'SEO best practices'],
    status: 'ready',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    trend_data: null,
    schema_markup: null
  }
];

export const useContentStore = create<ContentState>((set, get) => ({
  projects: isDemoMode ? demoProjects : [],
  articles: isDemoMode ? demoArticles : [],
  currentProject: isDemoMode ? demoProjects[0] : null,
  currentArticle: null,
  loading: false,
  trends: [],

  loadProjects: async () => {
    if (isDemoMode) {
      set({ projects: demoProjects });
      return;
    }

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
      set({ projects: [] });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (name: string, description?: string, color = '#3b82f6') => {
    if (isDemoMode) {
      const newProject: Project = {
        id: `demo-project-${Date.now()}`,
        name,
        description,
        color,
        article_count: 0,
        created_at: new Date().toISOString()
      };
      
      set(state => ({
        projects: [newProject, ...state.projects]
      }));
      
      return newProject;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          color,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        projects: [data, ...state.projects]
      }));
      
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    if (isDemoMode) {
      set(state => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      }));
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    if (isDemoMode) {
      set(state => ({
        projects: state.projects.filter(p => p.id !== id)
      }));
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        projects: state.projects.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  loadArticles: async (projectId?: string) => {
    if (isDemoMode) {
      const filteredArticles = projectId 
        ? demoArticles.filter(a => a.project_id === projectId)
        : demoArticles;
      set({ articles: filteredArticles });
      return;
    }

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
      set({ articles: [] });
    } finally {
      set({ loading: false });
    }
  },

  createArticle: async (projectId: string, data: any) => {
    if (isDemoMode) {
      const newArticle: Article = {
        id: `demo-article-${Date.now()}`,
        project_id: projectId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set(state => ({
        articles: [newArticle, ...state.articles]
      }));
      
      return newArticle;
    }

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          project_id: projectId,
          user_id: user.id,
          slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        articles: [article, ...state.articles]
      }));
      
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  updateArticle: async (id: string, updates: Partial<Article>) => {
    if (isDemoMode) {
      set(state => ({
        articles: state.articles.map(a => a.id === id ? { ...a, ...updates } : a),
        currentArticle: state.currentArticle?.id === id ? { ...state.currentArticle, ...updates } : state.currentArticle
      }));
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    if (isDemoMode) {
      set(state => ({
        articles: state.articles.filter(a => a.id !== id)
      }));
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        articles: state.articles.filter(a => a.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
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

  generateAdvancedContent: async (request: any) => {
    set({ loading: true });
    try {
      // Enhanced content generation with deep research
      const enhancedRequest = {
        topic: request.title,
        tone: 'professional',
        format: 'blog',
        language: 'English',
        wordCount: 3000,
        targetKeywords: [], // Will be researched automatically
        audience: 'professionals',
        researchDepth: request.researchDepth || 'comprehensive',
        seoTarget: request.seoTarget || 90
      };

      const generatedContent = await GeminiService.generateAdvancedContent(enhancedRequest);
      
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
      console.error('Error generating advanced content:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  optimizeContent: async (articleId: string) => {
    try {
      const article = get().articles.find(a => a.id === articleId);
      if (!article) return;

      set({ loading: true });
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
      set({ trends: [] });
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