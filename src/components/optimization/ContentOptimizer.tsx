import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  Eye,
  Edit3
} from 'lucide-react';
import { ContentOptimizerService } from '../../lib/contentOptimizer';
import { toast } from 'react-hot-toast';

interface ContentOptimizerProps {
  articleId: string;
  content: string;
  targetKeywords: string[];
  onOptimized: (optimizedContent: string) => void;
}

export const ContentOptimizer: React.FC<ContentOptimizerProps> = ({
  articleId,
  content,
  targetKeywords,
  onOptimized
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [optimizedContent, setOptimizedContent] = useState('');

  useEffect(() => {
    analyzeContent();
  }, [content, targetKeywords]);

  const analyzeContent = async () => {
    setLoading(true);
    try {
      const analysisResult = await ContentOptimizerService.analyzeContent(content, targetKeywords);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast.error('Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeForKeyword = async (keyword: string) => {
    setLoading(true);
    try {
      const result = await ContentOptimizerService.optimizeForKeyword(content, keyword);
      setOptimizedContent(result.rewrittenText);
      toast.success('Content optimized successfully!');
    } catch (error) {
      toast.error('Failed to optimize content');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOptimization = () => {
    onOptimized(optimizedContent);
    toast.success('Optimization applied!');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'keyword': return Target;
      case 'structure': return FileText;
      case 'readability': return Eye;
      case 'seo': return TrendingUp;
      case 'engagement': return Zap;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-neon-green bg-neon-green/20';
      default: return 'text-dark-400 bg-dark-400/20';
    }
  };

  if (loading && !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">SEO Score</h3>
              <Target className="w-5 h-5 text-neon-blue" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{analysis.seoScore}/100</div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.seoScore}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Readability</h3>
              <Eye className="w-5 h-5 text-neon-green" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{analysis.readabilityScore}/100</div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.readabilityScore}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Word Count</h3>
              <FileText className="w-5 h-5 text-neon-purple" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{analysis.structureAnalysis.words}</div>
            <p className="text-dark-400 text-sm">
              vs {analysis.competitorComparison.averageWordCount} avg
            </p>
          </motion.div>
        </div>
      )}

      {/* Keyword Density */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Keyword Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.keywordDensity).map(([keyword, density]) => (
              <div key={keyword} className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{keyword}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    (density as number) >= 1 && (density as number) <= 3 
                      ? 'bg-neon-green/20 text-neon-green' 
                      : 'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {(density as number).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      (density as number) >= 1 && (density as number) <= 3 
                        ? 'bg-gradient-to-r from-neon-green to-green-600' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}
                    style={{ width: `${Math.min((density as number) * 20, 100)}%` }}
                  ></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptimizeForKeyword(keyword)}
                  disabled={loading}
                  className="w-full mt-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 disabled:opacity-50"
                >
                  Optimize for {keyword}
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Optimization Suggestions */}
      {analysis && analysis.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Optimization Suggestions</h3>
          <div className="space-y-4">
            {analysis.suggestions.map((suggestion: any, index: number) => {
              const SuggestionIcon = getSuggestionIcon(suggestion.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30 hover:border-neon-blue/30 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                      <SuggestionIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{suggestion.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-dark-300 text-sm mb-2">{suggestion.description}</p>
                      <p className="text-dark-400 text-xs">{suggestion.impact}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {suggestion.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {suggestion.priority === 'medium' && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                      {suggestion.priority === 'low' && <CheckCircle className="w-4 h-4 text-neon-green" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Optimized Content Preview */}
      {optimizedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Optimized Content Preview</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyOptimization}
              className="bg-gradient-to-r from-neon-green to-green-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-green/30 transition-all duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Changes</span>
            </motion.button>
          </div>
          <div className="max-h-96 overflow-y-auto p-4 bg-dark-900/30 rounded-xl border border-dark-700/30">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: optimizedContent.substring(0, 2000) + '...' }}
            />
          </div>
        </motion.div>
      )}

      {/* Competitor Comparison */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Competitor Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Common Headings</h4>
              <div className="space-y-2">
                {analysis.competitorComparison.commonHeadings.map((heading: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-dark-900/50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span className="text-dark-300 text-sm">{heading}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Missing Topics</h4>
              <div className="space-y-2">
                {analysis.competitorComparison.missingTopics.map((topic: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-dark-900/50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-dark-300 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};