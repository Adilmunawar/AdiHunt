import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, Zap, BarChart3 } from 'lucide-react';
import { ContentOptimizer } from '../components/optimization/ContentOptimizer';
import { useContentStore } from '../store/contentStore';

export const Optimizer: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const { articles, loadArticles, updateArticle } = useContentStore();

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOptimized = async (optimizedContent: string) => {
    if (selectedArticle) {
      await updateArticle(selectedArticle.id, { content: optimizedContent });
      setSelectedArticle({ ...selectedArticle, content: optimizedContent });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Content Optimizer</h1>
        </div>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Analyze and optimize your content for better SEO performance and user engagement
        </p>
      </motion.div>

      {!selectedArticle ? (
        /* Article Selection */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Select Content to Optimize</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedArticle(article)}
                className="p-6 bg-dark-900/50 rounded-xl border border-dark-700/30 hover:border-neon-blue/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-6 h-6 text-neon-blue" />
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <span className="text-neon-green text-xs font-semibold">{article.seo_score}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-dark-300 text-sm mb-4 line-clamp-3">{article.meta_description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-400">{article.word_count} words</span>
                  <span className={`px-2 py-1 rounded-full ${
                    article.status === 'published' ? 'bg-neon-green/20 text-neon-green' :
                    article.status === 'ready' ? 'bg-neon-blue/20 text-neon-blue' :
                    'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {article.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Content Optimizer */
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedArticle.title}</h2>
                <p className="text-dark-300">Optimizing content for better performance</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedArticle(null)}
                className="bg-dark-700 text-white px-4 py-2 rounded-xl font-medium hover:bg-dark-600 transition-colors duration-200"
              >
                Back to Articles
              </motion.button>
            </div>
          </motion.div>

          <ContentOptimizer
            articleId={selectedArticle.id}
            content={selectedArticle.content}
            targetKeywords={selectedArticle.target_keywords || []}
            onOptimized={handleOptimized}
          />
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Bulk Optimization',
            description: 'Optimize multiple articles at once',
            icon: Zap,
            color: 'from-neon-blue to-blue-600',
            action: 'Coming Soon'
          },
          {
            title: 'SEO Audit',
            description: 'Comprehensive SEO analysis',
            icon: BarChart3,
            color: 'from-neon-green to-green-600',
            action: 'Run Audit'
          },
          {
            title: 'Competitor Analysis',
            description: 'Compare with top-ranking content',
            icon: Target,
            color: 'from-neon-purple to-purple-600',
            action: 'Analyze'
          }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-6 bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl hover:border-neon-blue/30 transition-all duration-200"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">{action.title}</h3>
            <p className="text-dark-300 text-sm mb-4">{action.description}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-r ${action.color} text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              {action.action}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};