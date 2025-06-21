import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Zap } from 'lucide-react';
import { SEOAuditDashboard } from '../components/seo/SEOAuditDashboard';

export const SEOAudit: React.FC = () => {
  const [auditUrl, setAuditUrl] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleStartAudit = () => {
    if (auditUrl) {
      setShowResults(true);
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
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SEO Audit</h1>
        </div>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Comprehensive SEO analysis with technical insights and actionable recommendations
        </p>
      </motion.div>

      {!showResults ? (
        /* URL Input */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center">Enter URL to Audit</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Website URL</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="url"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAudit}
              disabled={!auditUrl}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Start SEO Audit</span>
            </motion.button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Core Web Vitals Analysis',
              'Technical SEO Issues',
              'Mobile Optimization',
              'Security & Performance',
              'Content Analysis',
              'Competitor Comparison'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-dark-300">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Audit Results */
        <SEOAuditDashboard url={auditUrl} />
      )}
    </div>
  );
};