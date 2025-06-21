interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface ContentGenerationRequest {
  topic: string;
  tone: 'professional' | 'casual' | 'technical' | 'conversational';
  format: 'blog' | 'whitepaper' | 'guide' | 'press-release';
  language: string;
  wordCount: number;
  targetKeywords: string[];
  audience: string;
  researchDepth?: 'basic' | 'comprehensive' | 'expert';
  seoTarget?: number;
}

interface GeneratedContent {
  title: string;
  metaDescription: string;
  content: string;
  keywords: string[];
  internalLinks: string[];
  schemaMarkup: any;
  seoScore: number;
}

const GEMINI_API_KEY = 'AIzaSyBE-SkmQO-yqDyn51HaenX8Xw3BCLjCcM0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  static async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildContentPrompt(request);
    const response = await this.makeRequest(prompt);
    return this.parseContentResponse(response);
  }

  static async generateAdvancedContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildAdvancedContentPrompt(request);
    const response = await this.makeRequest(prompt);
    return this.parseContentResponse(response);
  }

  static async generateSEOBrief(topic: string, targetKeywords: string[]): Promise<any> {
    const prompt = `
    Create a comprehensive SEO content brief for the topic: "${topic}"
    Target keywords: ${targetKeywords.join(', ')}
    
    Return a JSON object with:
    - suggestedTitle: string
    - primaryKeywords: string[]
    - secondaryKeywords: string[]
    - competitorAnalysis: string
    - contentOutline: { heading: string, subheadings: string[] }[]
    - targetWordCount: number
    - searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial'
    - difficulty: number (1-100)
    - recommendations: string[]
    `;
    
    const response = await this.makeRequest(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { error: 'Failed to parse SEO brief response' };
    }
  }

  static async optimizeContent(content: string, targetKeywords: string[]): Promise<any> {
    const prompt = `
    Analyze this content for SEO optimization:
    
    Content: ${content.substring(0, 2000)}...
    Target Keywords: ${targetKeywords.join(', ')}
    
    Return a JSON object with:
    - seoScore: number (0-100)
    - keywordDensity: { [keyword: string]: number }
    - suggestions: string[]
    - readabilityScore: number
    - structureAnalysis: { headings: number, paragraphs: number, lists: number }
    - missingElements: string[]
    `;
    
    const response = await this.makeRequest(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { seoScore: 0, error: 'Failed to analyze content' };
    }
  }

  private static buildAdvancedContentPrompt(request: ContentGenerationRequest): string {
    return `
    You are AdiHunt, the world's most advanced AI SEO content generator. Create expert-level, EEAT-optimized content that ranks #1 on Google.

    CONTENT REQUIREMENTS:
    - Topic: ${request.topic}
    - Target SEO Score: ${request.seoTarget || 90}+
    - Research Depth: ${request.researchDepth || 'comprehensive'}
    - Word Count: ${request.wordCount}+
    - Target Audience: ${request.audience}

    ADVANCED AI RESEARCH PROCESS:
    1. KEYWORD RESEARCH: Identify trending keywords, long-tail variations, and semantic keywords
    2. COMPETITOR ANALYSIS: Analyze top-ranking content gaps and opportunities
    3. EXPERT SOURCES: Include authoritative references and expert insights
    4. TREND ANALYSIS: Incorporate current industry trends and data
    5. CONTENT STRUCTURE: Create optimal heading hierarchy and content flow
    6. SEO OPTIMIZATION: Implement advanced on-page SEO techniques

    GENERATE A JSON RESPONSE WITH:
    {
      "title": "SEO-optimized title (60-70 characters)",
      "metaDescription": "Compelling meta description (150-160 characters)",
      "content": "Full HTML article with proper headings, paragraphs, lists, and semantic structure",
      "keywords": ["primary", "secondary", "LSI keywords"],
      "internalLinks": ["suggested internal link anchor texts"],
      "schemaMarkup": {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "title",
        "author": { "@type": "Person", "name": "Expert Author" },
        "datePublished": "current date",
        "description": "meta description"
      },
      "seoScore": 92
    }

    CRITICAL REQUIREMENTS:
    - Use EEAT principles (Experience, Expertise, Authoritativeness, Trustworthiness)
    - Include expert quotes and citations
    - Add FAQ section with schema markup
    - Optimize for voice search with natural language
    - Include semantic keywords and entities
    - Structure with proper H1-H6 hierarchy
    - Add internal linking opportunities
    - Include compelling CTAs
    - Ensure mobile-first readability
    - Target featured snippets with concise answers
    - Achieve ${request.seoTarget || 90}+ SEO score

    CONTENT DEPTH REQUIREMENTS:
    - Comprehensive coverage of the topic
    - Multiple expert perspectives
    - Data-driven insights and statistics
    - Actionable advice and implementation steps
    - Real-world examples and case studies
    - Future trends and predictions
    - Common challenges and solutions
    `;
  }

  private static buildContentPrompt(request: ContentGenerationRequest): string {
    return `
    You are AdiHunt, the world's most advanced AI SEO content generator. Create expert-level, EEAT-optimized content that ranks #1 on Google.

    CONTENT REQUIREMENTS:
    - Topic: ${request.topic}
    - Tone: ${request.tone}
    - Format: ${request.format}
    - Language: ${request.language}
    - Word Count: ${request.wordCount}
    - Target Keywords: ${request.targetKeywords.join(', ')}
    - Target Audience: ${request.audience}

    GENERATE A JSON RESPONSE WITH:
    {
      "title": "SEO-optimized title (60-70 characters)",
      "metaDescription": "Compelling meta description (150-160 characters)",
      "content": "Full HTML article with proper headings, paragraphs, lists, and semantic structure",
      "keywords": ["primary", "secondary", "LSI keywords"],
      "internalLinks": ["suggested internal link anchor texts"],
      "schemaMarkup": {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "title",
        "author": { "@type": "Person", "name": "Expert Author" },
        "datePublished": "current date",
        "description": "meta description"
      },
      "seoScore": 85
    }

    CRITICAL REQUIREMENTS:
    - Use EEAT principles (Experience, Expertise, Authoritativeness, Trustworthiness)
    - Include expert quotes and citations
    - Add FAQ section with schema markup
    - Optimize for voice search with natural language
    - Include semantic keywords and entities
    - Structure with proper H1-H6 hierarchy
    - Add internal linking opportunities
    - Include compelling CTAs
    - Ensure mobile-first readability
    - Target featured snippets with concise answers
    `;
  }

  private static parseContentResponse(response: string): GeneratedContent {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
    }

    // Fallback parsing if JSON parsing fails
    return {
      title: this.extractValue(response, 'title') || 'Generated Content',
      metaDescription: this.extractValue(response, 'metaDescription') || 'AI-generated content description',
      content: response.replace(/```html|```/g, '').trim(),
      keywords: this.extractKeywords(response),
      internalLinks: this.extractInternalLinks(response),
      schemaMarkup: {},
      seoScore: 85
    };
  }

  private static extractValue(text: string, key: string): string | null {
    const regex = new RegExp(`"${key}":\\s*"([^"]*)"`, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  private static extractKeywords(text: string): string[] {
    const keywordMatch = text.match(/"keywords":\s*\[(.*?)\]/s);
    if (keywordMatch) {
      try {
        return JSON.parse(`[${keywordMatch[1]}]`);
      } catch {
        return keywordMatch[1].split(',').map(k => k.trim().replace(/"/g, ''));
      }
    }
    return [];
  }

  private static extractInternalLinks(text: string): string[] {
    const linkMatch = text.match(/"internalLinks":\s*\[(.*?)\]/s);
    if (linkMatch) {
      try {
        return JSON.parse(`[${linkMatch[1]}]`);
      } catch {
        return linkMatch[1].split(',').map(l => l.trim().replace(/"/g, ''));
      }
    }
    return [];
  }
}