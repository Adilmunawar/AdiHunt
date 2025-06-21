# AdiHunt - AI SEO Content Intelligence Platform

The world's most advanced AI-powered SEO content intelligence platform. Generate expert-level, SEO-optimized content that ranks #1 on Google.

## 🚀 Features

- **AI Content Generation**: Create 3000+ word expert-level articles with 90+ SEO scores
- **Deep Research**: Automatic keyword research, competitor analysis, and trend identification
- **SEO Optimization**: Advanced on-page SEO with schema markup and meta optimization
- **Content Planning**: Strategic content calendars with AI-powered insights
- **Competitor Intelligence**: Monitor competitors and discover content opportunities
- **SEO Audit**: Comprehensive technical SEO analysis and recommendations
- **Team Collaboration**: Multi-user workflows with role-based permissions
- **Analytics Dashboard**: Track content performance and SEO metrics

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: Google Gemini API for content generation
- **Deployment**: Vercel
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide React icons

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)
1. Visit the deployed app
2. Click "Try Demo" on the login page
3. Explore all features with sample data

### Option 2: Full Setup with Database

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adihunt.git
   cd adihunt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the database migrations (see Database Setup below)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

The app uses Supabase PostgreSQL with the following tables:

- `profiles` - User profiles and subscription info
- `projects` - Content projects and settings
- `articles` - Generated articles and SEO data
- `trends` - Keyword trends and market data
- `seo_briefs` - Content briefs and strategies
- `content_analytics` - Performance metrics
- `team_members` - Collaboration and permissions
- `export_logs` - Content export history

### Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 10,
  api_credits INTEGER DEFAULT 100,
  preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#3b82f6',
  industry TEXT DEFAULT 'technology',
  target_audience TEXT DEFAULT '',
  brand_voice TEXT DEFAULT 'professional',
  primary_keywords TEXT[] DEFAULT '{}',
  competitor_urls TEXT[] DEFAULT '{}',
  content_goals JSONB DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  article_count INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  avg_seo_score NUMERIC(4,2) DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  meta_description TEXT DEFAULT '',
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT[] DEFAULT '{}',
  target_keywords TEXT[] DEFAULT '{}',
  semantic_keywords TEXT[] DEFAULT '{}',
  internal_links TEXT[] DEFAULT '{}',
  external_links TEXT[] DEFAULT '{}',
  word_count INTEGER DEFAULT 0,
  reading_time TEXT DEFAULT '5 min read',
  seo_score NUMERIC(4,2) DEFAULT 0,
  readability_score NUMERIC(4,2) DEFAULT 0,
  keyword_density JSONB DEFAULT '{}',
  content_structure JSONB DEFAULT '{}',
  schema_markup JSONB DEFAULT '{}',
  ai_suggestions JSONB DEFAULT '{}',
  optimization_history JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'optimizing', 'ready', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  export_count INTEGER DEFAULT 0,
  last_exported_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES articles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own articles" ON articles FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_articles_project_id ON articles(project_id);
CREATE INDEX idx_articles_user_id ON articles(user_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
```

## 🔑 API Keys Setup

### Required APIs

1. **Supabase** (Database & Auth)
   - Create project at [supabase.com](https://supabase.com)
   - Get URL and anon key from Settings > API

2. **Google Gemini** (AI Content Generation)
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `VITE_GEMINI_API_KEY`

### Optional APIs (for enhanced features)

- **OpenAI API** - Alternative AI provider
- **SERP API** - Real-time search data
- **Google Analytics** - Traffic insights

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository**
   ```bash
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add all environment variables from `.env`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository

## 📱 Features Overview

### AI Content Generator
- **One-Click Generation**: Just enter a title, AI handles everything
- **Deep Research**: Automatic keyword research and competitor analysis
- **90+ SEO Score**: Advanced optimization for top rankings
- **Multiple Formats**: Blog posts, guides, whitepapers, press releases

### SEO Audit Tool
- **Technical SEO**: Core Web Vitals, mobile optimization, security
- **Content Analysis**: Readability, keyword density, structure
- **Actionable Insights**: Prioritized recommendations with impact scores

### Competitor Intelligence
- **Monitor Competitors**: Track content, rankings, and backlinks
- **Content Gaps**: Discover untapped keyword opportunities
- **Real-time Alerts**: Get notified of competitor movements

### Content Planning
- **AI-Powered Calendar**: Strategic content planning with insights
- **Workflow Automation**: Streamlined content creation processes
- **Team Collaboration**: Multi-user workflows with permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.adihunt.com](https://docs.adihunt.com)
- **Discord**: [Join our community](https://discord.gg/adihunt)
- **Email**: support@adihunt.com

## 🌟 Roadmap

- [ ] WordPress plugin integration
- [ ] Shopify app for e-commerce SEO
- [ ] Advanced analytics dashboard
- [ ] Multi-language content generation
- [ ] Video content optimization
- [ ] Voice search optimization
- [ ] Local SEO features
- [ ] White-label solutions

---

Built with ❤️ by the AdiHunt team. Empowering content creators with AI-driven SEO intelligence.