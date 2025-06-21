import { GeminiService } from './gemini';

interface OptimizationSuggestion {
  type: 'keyword' | 'structure' | 'readability' | 'seo' | 'engagement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  impact: string;
}

interface ContentAnalysis {
  seoScore: number;
  readabilityScore: number;
  keywordDensity: { [keyword: string]: number };
  structureAnalysis: {
    headings: { level: number; text: string; optimized: boolean }[];
    paragraphs: number;
    sentences: number;
    words: number;
  };
  suggestions: OptimizationSuggestion[];
  competitorComparison: {
    averageWordCount: number;
    commonHeadings: string[];
    missingTopics: string[];
  };
}

interface AIRewrite {
  originalText: string;
  rewrittenText: string;
  improvements: string[];
  seoImpact: number;
}

export class ContentOptimizerService {
  static async analyzeContent(content: string, targetKeywords: string[]): Promise<ContentAnalysis> {
    // Comprehensive content analysis
    const structureAnalysis = this.analyzeStructure(content);
    const keywordDensity = this.calculateKeywordDensity(content, targetKeywords);
    const readabilityScore = this.calculateReadabilityScore(content);
    const seoScore = this.calculateSEOScore(content, targetKeywords, structureAnalysis);
    
    const suggestions = await this.generateOptimizationSuggestions(
      content,
      targetKeywords,
      structureAnalysis,
      seoScore,
      readabilityScore
    );

    const competitorComparison = await this.getCompetitorComparison(targetKeywords[0]);

    return {
      seoScore,
      readabilityScore,
      keywordDensity,
      structureAnalysis,
      suggestions,
      competitorComparison
    };
  }

  static async optimizeForKeyword(content: string, keyword: string): Promise<AIRewrite> {
    const prompt = `
    Optimize this content for the keyword "${keyword}" while maintaining natural readability:
    
    Content: ${content.substring(0, 2000)}...
    
    Return JSON with:
    {
      "rewrittenText": "optimized version",
      "improvements": ["list of improvements made"],
      "seoImpact": "estimated SEO score improvement (0-100)"
    }
    
    Focus on:
    - Natural keyword integration
    - Improved semantic relevance
    - Better content structure
    - Enhanced user engagement
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    try {
      const result = JSON.parse(response);
      return {
        originalText: content,
        rewrittenText: result.rewrittenText,
        improvements: result.improvements,
        seoImpact: result.seoImpact
      };
    } catch {
      return {
        originalText: content,
        rewrittenText: content,
        improvements: ['Failed to optimize content'],
        seoImpact: 0
      };
    }
  }

  static async generateMetaDescription(content: string, targetKeyword: string): Promise<string> {
    const prompt = `
    Create an SEO-optimized meta description (150-160 characters) for this content:
    
    Content: ${content.substring(0, 1000)}...
    Target Keyword: ${targetKeyword}
    
    Requirements:
    - Include target keyword naturally
    - Compelling and click-worthy
    - Accurate content summary
    - Call-to-action if appropriate
    `;

    return await GeminiService['makeRequest'](prompt);
  }

  static async generateSchemaMarkup(content: string, type: string): Promise<any> {
    const prompt = `
    Generate appropriate Schema.org markup for this ${type} content:
    
    ${content.substring(0, 1500)}...
    
    Return valid JSON-LD schema markup that includes:
    - Article schema
    - Author information
    - Publishing details
    - Relevant structured data
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Generated Content",
        "author": { "@type": "Person", "name": "AI Assistant" }
      };
    }
  }

  static async suggestInternalLinks(content: string, existingArticles: any[]): Promise<string[]> {
    const suggestions = [];
    
    // Analyze content for internal linking opportunities
    const words = content.toLowerCase().split(/\s+/);
    
    for (const article of existingArticles) {
      const articleKeywords = article.target_keywords || [];
      
      for (const keyword of articleKeywords) {
        if (words.includes(keyword.toLowerCase())) {
          suggestions.push(`Link "${keyword}" to "${article.title}"`);
        }
      }
    }

    return suggestions.slice(0, 10);
  }

  static async generateContentOutline(topic: string, targetKeywords: string[]): Promise<any> {
    const prompt = `
    Create a comprehensive content outline for: "${topic}"
    Target Keywords: ${targetKeywords.join(', ')}
    
    Return JSON with:
    {
      "title": "SEO-optimized title",
      "introduction": "intro outline",
      "sections": [
        {
          "heading": "H2 heading",
          "subheadings": ["H3 subheadings"],
          "keyPoints": ["main points to cover"],
          "wordCount": "estimated words"
        }
      ],
      "conclusion": "conclusion outline",
      "faq": ["relevant FAQ questions"],
      "totalWordCount": "estimated total"
    }
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        title: topic,
        sections: [],
        totalWordCount: 2000
      };
    }
  }

  private static analyzeStructure(content: string) {
    const headings = [];
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, ''),
        optimized: match[2].length > 20 && match[2].length < 70
      });
    }

    const textContent = content.replace(/<[^>]*>/g, '');
    const paragraphs = textContent.split(/\n\s*\n/).length;
    const sentences = textContent.split(/[.!?]+/).length;
    const words = textContent.split(/\s+/).length;

    return { headings, paragraphs, sentences, words };
  }

  private static calculateKeywordDensity(content: string, keywords: string[]) {
    const textContent = content.replace(/<[^>]*>/g, '').toLowerCase();
    const words = textContent.split(/\s+/);
    const totalWords = words.length;
    
    const density: { [keyword: string]: number } = {};
    
    for (const keyword of keywords) {
      const keywordCount = textContent.split(keyword.toLowerCase()).length - 1;
      density[keyword] = (keywordCount / totalWords) * 100;
    }
    
    return density;
  }

  private static calculateReadabilityScore(content: string): number {
    const textContent = content.replace(/<[^>]*>/g, '');
    const sentences = textContent.split(/[.!?]+/).length;
    const words = textContent.split(/\s+/).length;
    const syllables = this.countSyllables(textContent);
    
    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, score));
  }

  private static countSyllables(text: string): number {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/a$/, '')
      .length || 1;
  }

  private static calculateSEOScore(content: string, keywords: string[], structure: any): number {
    let score = 0;
    
    // Keyword presence in title (20 points)
    const hasKeywordInTitle = structure.headings.some((h: any) => 
      h.level === 1 && keywords.some(k => h.text.toLowerCase().includes(k.toLowerCase()))
    );
    if (hasKeywordInTitle) score += 20;
    
    // Proper heading structure (15 points)
    if (structure.headings.length >= 3) score += 15;
    
    // Content length (15 points)
    if (structure.words >= 1500) score += 15;
    
    // Keyword density (20 points)
    const densities = this.calculateKeywordDensity(content, keywords);
    const optimalDensity = Object.values(densities).some(d => d >= 1 && d <= 3);
    if (optimalDensity) score += 20;
    
    // Meta description presence (10 points)
    if (content.includes('meta-description') || content.includes('description')) score += 10;
    
    // Internal/external links (10 points)
    if (content.includes('<a href')) score += 10;
    
    // Image optimization (10 points)
    if (content.includes('alt=')) score += 10;
    
    return Math.min(100, score);
  }

  private static async generateOptimizationSuggestions(
    content: string,
    keywords: string[],
    structure: any,
    seoScore: number,
    readabilityScore: number
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    if (seoScore < 70) {
      suggestions.push({
        type: 'seo',
        priority: 'high',
        title: 'Improve SEO Score',
        description: 'Your content needs SEO optimization to rank better',
        implementation: 'Add target keywords to headings, improve meta description, add internal links',
        impact: 'Could improve rankings by 20-30 positions'
      });
    }

    if (readabilityScore < 60) {
      suggestions.push({
        type: 'readability',
        priority: 'medium',
        title: 'Improve Readability',
        description: 'Content is difficult to read for average users',
        implementation: 'Use shorter sentences, simpler words, add bullet points',
        impact: 'Better user engagement and lower bounce rate'
      });
    }

    if (structure.words < 1500) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        title: 'Increase Content Length',
        description: 'Content is too short for competitive keywords',
        implementation: 'Add more detailed explanations, examples, and sections',
        impact: 'Longer content typically ranks better for competitive terms'
      });
    }

    return suggestions;
  }

  private static async getCompetitorComparison(keyword: string) {
    // Simulate competitor analysis
    return {
      averageWordCount: 2800,
      commonHeadings: [
        'What is ' + keyword,
        'Benefits of ' + keyword,
        'How to implement ' + keyword,
        'Best practices',
        'Conclusion'
      ],
      missingTopics: [
        'Case studies',
        'Expert opinions',
        'Future trends',
        'Common mistakes'
      ]
    };
  }
}