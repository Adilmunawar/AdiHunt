import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Target, 
  FileText, 
  Globe, 
  Users, 
  TrendingUp,
  Brain,
  Sparkles,
  Download,
  Eye
} from 'lucide-react';
import { useContentStore } from '../store/contentStore';
import { toast } from 'react-hot-toast';

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal, authoritative tone' },
  { id: 'casual', name: 'Casual', description: 'Friendly, conversational tone' },
  { id: 'technical', name: 'Technical', description: 'Detailed, expert-level tone' },
  { id: 'conversational', name: 'Conversational', description: 'Natural, engaging tone' }
];

const formats = [
  { id: 'blog', name: 'Blog Post', description: 'SEO-optimized blog article' },
  { id: 'guide', name: 'Complete Guide', description: 'Comprehensive how-to guide' },
  { id: 'whitepaper', name: 'Whitepaper', description: 'In-depth research document' },
  { id: 'press-release', name: 'Press Release', description: 'News announcement format' }
];

export const Generator: React.FC = () => {
  const { projects, generateContent, loading } = useContentStore();
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    format: 'blog',
    language: 'English',
    wordCount: 3000,
    targetKeywords: '',
    audience: '',
    projectId: ''
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = async () => {
    if (!formData.topic || !formData.projectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const request = {
        ...formData,
        targetKeywords: formData.targetKeywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      const article = await generateContent(request);
      setGeneratedContent(article);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
      console.error('Generation error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Content Generator</h1>
        </div>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Create expert-level, SEO-optimized content that ranks #1 on Google using advanced AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-neon-blue" />
            <span>Content Configuration</span>
          </h2>

          <div className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., AI-Powered Marketing Automation"
                className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-white font-medium mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-white font-medium mb-3">Tone</label>
              <div className="grid grid-cols-2 gap-3">
                {tones.map(tone => (
                  <motion.button
                    key={tone.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, tone: tone.id })}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      formData.tone === tone.id
                        ? 'border-neon-blue/50 bg-neon-blue/10 text-white'
                        : 'border-dark-700/50 bg-dark-900/30 text-dark-300 hover:border-dark-600/50'
                    }`}
                  >
                    <div className="font-medium">{tone.name}</div>
                    <div className="text-xs opacity-75">{tone.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-white font-medium mb-3">Format</label>
              <div className="grid grid-cols-2 gap-3">
                {formats.map(format => (
                  <motion.button
                    key={format.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, format: format.id })}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      formData.format === format.id
                        ? 'border-neon-purple/50 bg-neon-purple/10 text-white'
                        : 'border-dark-700/50 bg-dark-900/30 text-dark-300 hover:border-dark-600/50'
                    }`}
                  >
                    <div className="font-medium">{format.name}</div>
                    <div className="text-xs opacity-75">{format.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Word Count</label>
                <input
                  type="number"
                  value={formData.wordCount}
                  onChange={(e) => setFormData({ ...formData, wordCount: parseInt(e.target.value) })}
                  min="500"
                  max="10000"
                  step="500"
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-white font-medium mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Target Keywords
              </label>
              <input
                type="text"
                value={formData.targetKeywords}
                onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Target Audience
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="e.g., Marketing professionals, Small business owners"
                className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Content</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-neon-green" />
            <span>Content Preview</span>
          </h2>

          {generatedContent ? (
            <div className="space-y-6">
              {/* Content Header */}
              <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30">
                <h3 className="text-white font-bold text-lg mb-2">{generatedContent.title}</h3>
                <p className="text-dark-300 text-sm mb-3">{generatedContent.meta_description}</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="bg-neon-green/20 text-neon-green px-2 py-1 rounded">
                    SEO Score: {generatedContent.seo_score}
                  </span>
                  <span className="text-dark-400">
                    {generatedContent.word_count} words
                  </span>
                  <span className="text-dark-400 capitalize">
                    {generatedContent.status}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="max-h-96 overflow-y-auto p-4 bg-dark-900/30 rounded-xl border border-dark-700/30">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedContent.content.substring(0, 1000) + '...' }}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-neon-green to-green-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-neon-green/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Full Preview</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-neon-purple to-purple-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center opacity-50">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <p className="text-dark-400">
                Configure your content settings and click "Generate Content" to see your AI-powered article
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};