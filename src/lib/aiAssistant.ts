import { GeminiService } from './gemini';

interface ConversationContext {
  userId: string;
  projectId?: string;
  articleId?: string;
  currentTask?: string;
  preferences: {
    tone: string;
    industry: string;
    expertise_level: string;
  };
}

interface AIResponse {
  message: string;
  suggestions?: string[];
  actions?: {
    type: string;
    label: string;
    data: any;
  }[];
  followUp?: string[];
}

interface ContentSuggestion {
  type: 'topic' | 'keyword' | 'structure' | 'optimization';
  title: string;
  description: string;
  priority: number;
  estimatedImpact: string;
}

export class AIAssistantService {
  private static conversationHistory: Map<string, any[]> = new Map();

  static async processMessage(
    message: string, 
    context: ConversationContext
  ): Promise<AIResponse> {
    const history = this.getConversationHistory(context.userId);
    
    // Analyze intent
    const intent = await this.analyzeIntent(message, context);
    
    // Generate contextual response
    const response = await this.generateResponse(message, intent, context, history);
    
    // Store conversation
    this.storeMessage(context.userId, { role: 'user', content: message });
    this.storeMessage(context.userId, { role: 'assistant', content: response.message });
    
    return response;
  }

  static async generateContentSuggestions(context: ConversationContext): Promise<ContentSuggestion[]> {
    const prompt = `
    Based on the user's context:
    - Industry: ${context.preferences.industry}
    - Expertise: ${context.preferences.expertise_level}
    - Current project: ${context.projectId ? 'Active' : 'None'}
    
    Generate 5 high-impact content suggestions that would help them achieve better SEO results.
    
    Return JSON array with:
    {
      "type": "topic|keyword|structure|optimization",
      "title": "suggestion title",
      "description": "detailed description",
      "priority": 1-10,
      "estimatedImpact": "impact description"
    }
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return this.getDefaultSuggestions();
    }
  }

  static async analyzeUserBehavior(userId: string): Promise<any> {
    // Analyze user patterns and provide insights
    const history = this.getConversationHistory(userId);
    
    const patterns = {
      mostAskedTopics: this.extractTopics(history),
      preferredContentTypes: this.extractContentTypes(history),
      skillLevel: this.assessSkillLevel(history),
      recommendations: await this.generatePersonalizedRecommendations(history)
    };

    return patterns;
  }

  static async generateWorkflowSuggestion(projectData: any): Promise<any> {
    const prompt = `
    Based on this project data:
    ${JSON.stringify(projectData, null, 2)}
    
    Suggest an optimal content workflow with:
    - Content planning steps
    - Research phases
    - Writing milestones
    - Review processes
    - Publishing timeline
    
    Return JSON with workflow steps and estimated timeframes.
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return this.getDefaultWorkflow();
    }
  }

  static async provideRealTimeGuidance(
    currentAction: string, 
    context: ConversationContext
  ): Promise<string[]> {
    const guidance = [];
    
    switch (currentAction) {
      case 'writing':
        guidance.push("Consider adding more semantic keywords to improve topical relevance");
        guidance.push("Your current paragraph could benefit from a specific example");
        guidance.push("Try breaking this long sentence into two for better readability");
        break;
        
      case 'optimizing':
        guidance.push("Your keyword density is optimal, but consider adding related terms");
        guidance.push("Add more internal links to boost page authority");
        guidance.push("Consider adding FAQ section for featured snippet opportunities");
        break;
        
      case 'researching':
        guidance.push("Look for trending subtopics in your industry");
        guidance.push("Check competitor content gaps for opportunities");
        guidance.push("Analyze search intent for your target keywords");
        break;
    }
    
    return guidance;
  }

  private static async analyzeIntent(message: string, context: ConversationContext): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('write')) {
      return 'content_generation';
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('seo')) {
      return 'optimization';
    }
    
    if (lowerMessage.includes('keyword') || lowerMessage.includes('research') || lowerMessage.includes('trend')) {
      return 'research';
    }
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('report') || lowerMessage.includes('performance')) {
      return 'analytics';
    }
    
    return 'general';
  }

  private static async generateResponse(
    message: string,
    intent: string,
    context: ConversationContext,
    history: any[]
  ): Promise<AIResponse> {
    const prompt = `
    You are Adi, an expert AI SEO assistant. Respond to this user message:
    
    Message: "${message}"
    Intent: ${intent}
    User Context: ${JSON.stringify(context)}
    Recent History: ${JSON.stringify(history.slice(-5))}
    
    Provide a helpful, actionable response with:
    - Clear, expert advice
    - Specific next steps
    - Relevant suggestions
    - Follow-up questions if appropriate
    
    Keep responses conversational but professional.
    `;

    const response = await GeminiService['makeRequest'](prompt);
    
    const suggestions = await this.generateContextualSuggestions(intent, context);
    const actions = this.generateActionButtons(intent);
    const followUp = this.generateFollowUpQuestions(intent);

    return {
      message: response,
      suggestions,
      actions,
      followUp
    };
  }

  private static async generateContextualSuggestions(
    intent: string, 
    context: ConversationContext
  ): Promise<string[]> {
    const suggestions: { [key: string]: string[] } = {
      content_generation: [
        "Try the advanced content generator for long-form articles",
        "Use trending keywords from your industry",
        "Consider creating a content series for better engagement"
      ],
      optimization: [
        "Run a full SEO audit on your existing content",
        "Check your competitors' top-performing pages",
        "Optimize for voice search queries"
      ],
      research: [
        "Explore the trending keywords section",
        "Analyze your competitors' content gaps",
        "Look for seasonal keyword opportunities"
      ],
      analytics: [
        "Set up automated performance tracking",
        "Create custom analytics dashboards",
        "Monitor your keyword rankings weekly"
      ]
    };

    return suggestions[intent] || [
      "Explore the content generator for new ideas",
      "Check out trending topics in your industry",
      "Consider optimizing your existing content"
    ];
  }

  private static generateActionButtons(intent: string) {
    const actions: { [key: string]: any[] } = {
      content_generation: [
        { type: 'navigate', label: 'Open Generator', data: { route: '/generate' } },
        { type: 'modal', label: 'Quick Generate', data: { modal: 'quick-generate' } }
      ],
      optimization: [
        { type: 'navigate', label: 'SEO Optimizer', data: { route: '/optimizer' } },
        { type: 'action', label: 'Analyze Content', data: { action: 'analyze' } }
      ],
      research: [
        { type: 'navigate', label: 'Trends Dashboard', data: { route: '/trends' } },
        { type: 'action', label: 'Keyword Research', data: { action: 'research' } }
      ]
    };

    return actions[intent] || [];
  }

  private static generateFollowUpQuestions(intent: string): string[] {
    const questions: { [key: string]: string[] } = {
      content_generation: [
        "What type of content would you like to create?",
        "Do you have specific keywords in mind?",
        "What's your target audience for this content?"
      ],
      optimization: [
        "Which piece of content needs optimization?",
        "Are you targeting specific keywords?",
        "What's your current SEO score?"
      ],
      research: [
        "What industry or niche are you researching?",
        "Are you looking for trending or evergreen topics?",
        "Do you want competitor analysis included?"
      ]
    };

    return questions[intent] || [
      "How can I help you improve your content strategy?",
      "What's your main SEO challenge right now?",
      "Would you like me to analyze your current performance?"
    ];
  }

  private static getConversationHistory(userId: string): any[] {
    return this.conversationHistory.get(userId) || [];
  }

  private static storeMessage(userId: string, message: any): void {
    const history = this.getConversationHistory(userId);
    history.push({ ...message, timestamp: new Date().toISOString() });
    
    // Keep only last 50 messages
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    this.conversationHistory.set(userId, history);
  }

  private static extractTopics(history: any[]): string[] {
    // Extract common topics from conversation history
    const topics = new Set<string>();
    
    history.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        if (content.includes('seo')) topics.add('SEO');
        if (content.includes('content')) topics.add('Content Creation');
        if (content.includes('keyword')) topics.add('Keyword Research');
        if (content.includes('optimize')) topics.add('Optimization');
      }
    });
    
    return Array.from(topics);
  }

  private static extractContentTypes(history: any[]): string[] {
    const types = new Set<string>();
    
    history.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        if (content.includes('blog')) types.add('Blog Posts');
        if (content.includes('guide')) types.add('Guides');
        if (content.includes('article')) types.add('Articles');
        if (content.includes('whitepaper')) types.add('Whitepapers');
      }
    });
    
    return Array.from(types);
  }

  private static assessSkillLevel(history: any[]): string {
    // Simple heuristic to assess user skill level
    const advancedTerms = ['schema markup', 'canonical', 'crawl budget', 'semantic keywords'];
    const basicTerms = ['seo', 'keywords', 'content', 'optimize'];
    
    let advancedCount = 0;
    let basicCount = 0;
    
    history.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        advancedTerms.forEach(term => {
          if (content.includes(term)) advancedCount++;
        });
        basicTerms.forEach(term => {
          if (content.includes(term)) basicCount++;
        });
      }
    });
    
    if (advancedCount > basicCount * 0.3) return 'Advanced';
    if (basicCount > 5) return 'Intermediate';
    return 'Beginner';
  }

  private static async generatePersonalizedRecommendations(history: any[]): Promise<string[]> {
    // Generate recommendations based on user behavior
    const recommendations = [
      "Focus on long-tail keywords for better conversion rates",
      "Create content clusters around your main topics",
      "Implement structured data for better search visibility",
      "Optimize for voice search with natural language content",
      "Build topic authority with comprehensive content series"
    ];
    
    return recommendations.slice(0, 3);
  }

  private static getDefaultSuggestions(): ContentSuggestion[] {
    return [
      {
        type: 'topic',
        title: 'Create Industry Trend Analysis',
        description: 'Write about emerging trends in your industry to capture early search traffic',
        priority: 8,
        estimatedImpact: 'High - trending topics get more shares and backlinks'
      },
      {
        type: 'keyword',
        title: 'Target Long-tail Keywords',
        description: 'Focus on specific, less competitive keywords with higher conversion potential',
        priority: 7,
        estimatedImpact: 'Medium - easier to rank, better conversion rates'
      },
      {
        type: 'optimization',
        title: 'Improve Page Speed',
        description: 'Optimize images and code to improve Core Web Vitals scores',
        priority: 9,
        estimatedImpact: 'High - direct ranking factor and user experience improvement'
      }
    ];
  }

  private static getDefaultWorkflow(): any {
    return {
      steps: [
        { name: 'Research & Planning', duration: '2-3 days', tasks: ['Keyword research', 'Competitor analysis', 'Content outline'] },
        { name: 'Content Creation', duration: '3-5 days', tasks: ['Writing', 'Editing', 'Fact-checking'] },
        { name: 'Optimization', duration: '1-2 days', tasks: ['SEO optimization', 'Meta tags', 'Internal linking'] },
        { name: 'Review & Publishing', duration: '1 day', tasks: ['Final review', 'Publishing', 'Promotion'] }
      ],
      totalDuration: '7-11 days',
      recommendations: ['Use AI assistance for faster content creation', 'Implement peer review process', 'Schedule content in advance']
    };
  }
}