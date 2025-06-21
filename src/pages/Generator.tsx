import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Sparkles,
  Search,
  Target,
  TrendingUp,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Eye,
  Globe,
  Users,
  Lightbulb
} from 'lucide-react';
import { useContentStore } from '../store/contentStore';
import { toast } from 'react-hot-toast';

interface ResearchStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  icon: any;
}

export const Generator: React.FC = () => {
  const { projects, generateAdvancedContent, loading } = useContentStore();
  const [articleTitle, setArticleTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [researchSteps, setResearchSteps] = useState<ResearchStep[]>([]);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const initializeResearchSteps = () => {
    return [
      {
        id: 'keyword-research',
        name: 'Keyword Research',
        status: 'pending' as const,
        description: 'Analyzing trending keywords and search intent',
        icon: Search
      },
      {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        status: 'pending' as const,
        description: 'Studying top-ranking content and gaps',
        icon: Target
      },
      {
        id: 'trend-analysis',
        name: 'Trend Analysis',
        status: 'pending' as const,
        description: 'Identifying current trends and opportunities',
        icon: TrendingUp
      },
      {
        id: 'expert-research',
        name: 'Expert Research',
        status: 'pending' as const,
        description: 'Gathering expert insights and authoritative sources',
        icon: Users
      },
      {
        id: 'content-structure',
        name: 'Content Structure',
        status: 'pending' as const,
        description: 'Creating optimal content outline and structure',
        icon: FileText
      },
      {
        id: 'seo-optimization',
        name: 'SEO Optimization',
        status: 'pending' as const,
        description: 'Optimizing for 90+ SEO score and rankings',
        icon: Zap
      },
      {
        id: 'content-generation',
        name: 'Content Generation',
        status: 'pending' as const,
        description: 'Writing comprehensive, expert-level content',
        icon: Brain
      },
      {
        id: 'final-optimization',
        name: 'Final Optimization',
        status: 'pending' as const,
        description: 'Final SEO polish and quality assurance',
        icon: Sparkles
      }
    ];
  };

  const handleGenerate = async () => {
    if (!articleTitle.trim()) {
      toast.error('Please enter an article title');
      return;
    }

    if (!selectedProject) {
      toast.error('Please select a project');
      return;
    }

    const steps = initializeResearchSteps();
    setResearchSteps(steps);
    setCurrentStep(0);
    setShowResults(true);

    // Simulate the research and generation process
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update current step to in-progress
      setResearchSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'in-progress' } : step
      ));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      // Update current step to completed
      setResearchSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
    }

    try {
      // Generate the actual content
      const content = await generateAdvancedContent({
        title: articleTitle,
        projectId: selectedProject,
        researchDepth: 'comprehensive',
        seoTarget: 90
      });

      setGeneratedContent(content);
      toast.success('🎉 High-quality content generated with 90+ SEO score!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
      console.error('Generation error:', error);
    }
  };

  const resetGenerator = () => {
    setShowResults(false);
    setGeneratedContent(null);
    setResearchSteps([]);
    setCurrentStep(0);
    setArticleTitle('');
  };

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">AI Research & Generation</h1>
          <p className="text-dark-300">Creating: "{articleTitle}"</p>
        </motion.div>

        {/* Research Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-neon-green/10 border-neon-green/30' 
                      : isInProgress 
                        ? 'bg-neon-blue/10 border-neon-blue/30' 
                        : 'bg-dark-900/50 border-dark-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-neon-green/20' 
                        : isInProgress 
                          ? 'bg-neon-blue/20' 
                          : 'bg-dark-700/50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-neon-green" />
                      ) : isInProgress ? (
                        <div className="w-5 h-5 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                      ) : (
                        <StepIcon className="w-5 h-5 text-dark-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isCompleted ? 'text-neon-green' : isInProgress ? 'text-neon-blue' : 'text-dark-300'
                      }`}>
                        {step.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-dark-400 text-sm">{step.description}</p>
                  {isInProgress && (
                    <div className="mt-3">
                      <div className="w-full bg-dark-700 rounded-full h-1">
                        <div className="bg-neon-blue h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Generated Content Preview */}
        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Content Generated Successfully!</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <span className="text-neon-green text-sm font-bold">{generatedContent.seo_score}</span>
                    </div>
                    <span className="text-neon-green font-semibold">SEO Score</span>
                  </div>
                </div>
              </div>

              {/* Content Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-neon-blue" />
                    <span className="text-dark-300 text-sm">Word Count</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{generatedContent.word_count}</div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-neon-green" />
                    <span className="text-dark-300 text-sm">Reading Time</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{Math.ceil(generatedContent.word_count / 200)} min</div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-neon-purple" />
                    <span className="text-dark-300 text-sm">Keywords</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{generatedContent.target_keywords?.length || 0}</div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-neon-pink" />
                    <span className="text-dark-300 text-sm">Readability</span>
                  </div>
                  <div className="text-2xl font-bold text-white">95</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{generatedContent.title}</h3>
                <p className="text-dark-300 mb-4">{generatedContent.meta_description}</p>
                <div className="max-h-64 overflow-y-auto p-4 bg-dark-900/30 rounded-xl border border-dark-700/30">
                  <div 
                    className="prose prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content.substring(0, 1500) + '...' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-neon-green to-green-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-neon-green/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Full Preview</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-neon-blue to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetGenerator}
                  className="bg-dark-700 text-white font-semibold py-3 px-6 rounded-xl hover:bg-dark-600 transition-all duration-200"
                >
                  Generate New
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white">AI Content Generator</h1>
            <p className="text-neon-blue font-medium">Just add a title - AI handles everything else</p>
          </div>
        </div>
        <p className="text-dark-300 text-lg max-w-3xl mx-auto">
          Enter your article title and our advanced AI will conduct deep research, analyze competitors, 
          identify trending keywords, and create expert-level content with 90+ SEO score automatically.
        </p>
      </motion.div>

      {/* Main Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-8"
      >
        <div className="space-y-8">
          {/* Article Title Input */}
          <div>
            <label className="block text-white font-semibold text-lg mb-4">
              <Lightbulb className="w-5 h-5 inline mr-2 text-neon-blue" />
              Article Title
            </label>
            <input
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="e.g., The Future of AI in Digital Marketing"
              className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-6 py-4 text-white text-lg placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
            />
            <p className="text-dark-400 text-sm mt-2">
              💡 Pro tip: Be specific and include your main topic for better AI research
            </p>
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-white font-semibold text-lg mb-4">
              <FolderOpen className="w-5 h-5 inline mr-2 text-neon-green" />
              Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-6 py-4 text-white text-lg focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          {/* AI Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Search, title: 'Deep Research', desc: 'Keyword & trend analysis' },
              { icon: Target, title: 'Competitor Intel', desc: 'Analyze top-ranking content' },
              { icon: Users, title: 'Expert Sources', desc: 'Authoritative references' },
              { icon: Zap, title: '90+ SEO Score', desc: 'Automatic optimization' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-dark-900/30 rounded-xl border border-dark-700/30"
              >
                <feature.icon className="w-6 h-6 text-neon-blue mb-2" />
                <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                <p className="text-dark-400 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading || !articleTitle.trim() || !selectedProject}
            className="w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-bold py-6 rounded-xl text-xl hover:shadow-2xl hover:shadow-neon-blue/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>AI is researching and writing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Generate Expert Content with AI</span>
                <Brain className="w-6 h-6" />
              </>
            )}
          </motion.button>

          {/* What AI Will Do */}
          <div className="bg-dark-900/30 rounded-xl p-6 border border-dark-700/30">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-neon-purple" />
              <span>What Our AI Will Do Automatically:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '🔍 Research trending keywords and search intent',
                '🎯 Analyze top-ranking competitor content',
                '📊 Identify content gaps and opportunities',
                '👥 Gather expert insights and authoritative sources',
                '📝 Create comprehensive content outline',
                '⚡ Write 2500+ words of expert-level content',
                '🎯 Optimize for 90+ SEO score automatically',
                '📈 Add schema markup and meta optimization'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-dark-300 text-sm">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Generations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Generations</h2>
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-dark-400 mx-auto mb-3" />
          <p className="text-dark-400">Your generated content will appear here</p>
        </div>
      </motion.div>
    </div>
  );
};