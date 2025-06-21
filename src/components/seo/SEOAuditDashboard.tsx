import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { AdvancedSEOService } from '../../lib/advancedSEO';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface SEOAuditDashboardProps {
  url: string;
}

export const SEOAuditDashboard: React.FC<SEOAuditDashboardProps> = ({ url }) => {
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAuditData();
  }, [url]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const audit = await AdvancedSEOService.performComprehensiveAudit(url);
      setAuditData(audit);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#ffd700';
    return '#ff4444';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      case 'info': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'info': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!auditData) return null;

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-6">SEO Audit Score</h2>
        <div className="flex items-center justify-center space-x-12">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={auditData.score}
              text={`${auditData.score}`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: getScoreColor(auditData.score),
                trailColor: '#334155'
              })}
            />
          </div>
          <div className="text-left">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-neon-green" />
                <span className="text-white">
                  {auditData.issues.filter((i: any) => i.type === 'info').length} Passed
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-white">
                  {auditData.issues.filter((i: any) => i.type === 'warning').length} Warnings
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-white">
                  {auditData.issues.filter((i: any) => i.type === 'critical').length} Critical
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Web Vitals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-neon-blue" />
          <span>Core Web Vitals</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-dark-900/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-300">Largest Contentful Paint</span>
              <span className={`text-sm px-2 py-1 rounded ${
                auditData.technicalSEO.coreWebVitals.lcp <= 2.5 ? 'bg-neon-green/20 text-neon-green' : 'bg-red-400/20 text-red-400'
              }`}>
                {auditData.technicalSEO.coreWebVitals.lcp}s
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  auditData.technicalSEO.coreWebVitals.lcp <= 2.5 ? 'bg-neon-green' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min((auditData.technicalSEO.coreWebVitals.lcp / 4) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-dark-900/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-300">First Input Delay</span>
              <span className={`text-sm px-2 py-1 rounded ${
                auditData.technicalSEO.coreWebVitals.fid <= 100 ? 'bg-neon-green/20 text-neon-green' : 'bg-red-400/20 text-red-400'
              }`}>
                {auditData.technicalSEO.coreWebVitals.fid}ms
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  auditData.technicalSEO.coreWebVitals.fid <= 100 ? 'bg-neon-green' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min((auditData.technicalSEO.coreWebVitals.fid / 300) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-dark-900/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-300">Cumulative Layout Shift</span>
              <span className={`text-sm px-2 py-1 rounded ${
                auditData.technicalSEO.coreWebVitals.cls <= 0.1 ? 'bg-neon-green/20 text-neon-green' : 'bg-red-400/20 text-red-400'
              }`}>
                {auditData.technicalSEO.coreWebVitals.cls}
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  auditData.technicalSEO.coreWebVitals.cls <= 0.1 ? 'bg-neon-green' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min((auditData.technicalSEO.coreWebVitals.cls / 0.25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Issues & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Issues & Recommendations</h3>
        <div className="space-y-4">
          {auditData.issues.map((issue: any, index: number) => {
            const IssueIcon = getIssueIcon(issue.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIssueColor(issue.type)}`}>
                    <IssueIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{issue.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-dark-400 text-sm">Impact: {issue.impact}%</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          issue.priority === 1 ? 'bg-red-400/20 text-red-400' :
                          issue.priority === 2 ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-blue-400/20 text-blue-400'
                        }`}>
                          Priority {issue.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-dark-300 text-sm mb-3">{issue.description}</p>
                    <div className="p-3 bg-dark-800/50 rounded-lg">
                      <p className="text-neon-blue text-sm font-medium mb-1">Solution:</p>
                      <p className="text-dark-200 text-sm">{issue.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Technical SEO Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Smartphone className="w-6 h-6 text-neon-blue" />
            <h3 className="text-white font-semibold">Mobile</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Responsive</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Speed Score</span>
              <span className="text-white font-medium">{auditData.technicalSEO.mobileOptimization.mobileSpeed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Touch Targets</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-neon-green" />
            <h3 className="text-white font-semibold">Crawlability</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Robots.txt</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Sitemap</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Internal Links</span>
              <span className="text-white font-medium">{auditData.technicalSEO.crawlability.internalLinks}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-neon-purple" />
            <h3 className="text-white font-semibold">Security</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">HTTPS</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Mixed Content</span>
              <CheckCircle className="w-4 h-4 text-neon-green" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Headers</span>
              <span className="text-white font-medium">{auditData.technicalSEO.security.securityHeaders.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-neon-pink" />
            <h3 className="text-white font-semibold">Content</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Word Count</span>
              <span className="text-white font-medium">{auditData.contentAnalysis.wordCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Readability</span>
              <span className="text-white font-medium">{auditData.contentAnalysis.readabilityScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 text-sm">Headings</span>
              <span className="text-white font-medium">{auditData.contentAnalysis.headingStructure.h1 + auditData.contentAnalysis.headingStructure.h2}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};