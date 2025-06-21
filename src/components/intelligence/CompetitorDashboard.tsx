import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Eye,
  BarChart3,
  Globe,
  Link,
  Users,
  Zap,
  Search
} from 'lucide-react';
import { CompetitorIntelligenceService } from '../../lib/competitorIntelligence';

export const CompetitorDashboard: React.FC = () => {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [contentGaps, setContentGaps] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitorData();
  }, []);

  const loadCompetitorData = async () => {
    setLoading(true);
    try {
      const competitorDomains = ['competitor1.com', 'competitor2.com', 'competitor3.com'];
      
      const [competitorProfiles, gaps, competitorAlerts] = await Promise.all([
        Promise.all(competitorDomains.map(domain => 
          CompetitorIntelligenceService.analyzeCompetitor(domain)
        )),
        CompetitorIntelligenceService.findContentGaps(competitorDomains, 'yourdomain.com'),
        CompetitorIntelligenceService.monitorCompetitors(competitorDomains)
      ]);

      setCompetitors(competitorProfiles);
      setContentGaps(gaps);
      setAlerts(competitorAlerts);
      setSelectedCompetitor(competitorProfiles[0]);
    } catch (error) {
      console.error('Error loading competitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'bg-neon-green/20 text-neon-green';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'low': return 'bg-red-400/20 text-red-400';
      default: return 'bg-dark-400/20 text-dark-400';
    }
  };

  const getAlertColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'low': return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      default: return 'bg-dark-400/20 text-dark-400 border-dark-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white flex items-center justify-center space-x-3">
          <Target className="w-8 h-8 text-neon-blue" />
          <span>Competitor Intelligence</span>
        </h1>
        <p className="text-dark-300 text-lg mt-2">
          Monitor competitors and discover content opportunities
        </p>
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>Recent Alerts</span>
        </h2>
        <div className="space-y-4">
          {alerts.slice(0, 3).map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`p-4 rounded-xl border ${getAlertColor(alert.impact)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">{alert.competitor}</h3>
                  <p className="text-sm opacity-90">{alert.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </div>
                  {alert.actionRequired && (
                    <span className="text-xs bg-red-400/20 text-red-400 px-2 py-1 rounded mt-1 inline-block">
                      Action Required
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Competitor Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Competitor Overview</h2>
          
          {/* Competitor Selector */}
          <div className="mb-6">
            <select
              value={selectedCompetitor?.domain || ''}
              onChange={(e) => setSelectedCompetitor(competitors.find(c => c.domain === e.target.value))}
              className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
            >
              {competitors.map(competitor => (
                <option key={competitor.domain} value={competitor.domain}>
                  {competitor.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCompetitor && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="w-4 h-4 text-neon-blue" />
                    <span className="text-dark-300 text-sm">Organic Keywords</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCompetitor.seoMetrics.organicKeywords.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-neon-green" />
                    <span className="text-dark-300 text-sm">Organic Traffic</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCompetitor.seoMetrics.organicTraffic.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Link className="w-4 h-4 text-neon-purple" />
                    <span className="text-dark-300 text-sm">Backlinks</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCompetitor.seoMetrics.backlinks.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-dark-900/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-neon-pink" />
                    <span className="text-dark-300 text-sm">Domain Authority</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCompetitor.seoMetrics.domainAuthority}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white font-semibold mb-3">Strengths</h3>
                  <div className="space-y-2">
                    {selectedCompetitor.strengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-dark-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Weaknesses</h3>
                  <div className="space-y-2">
                    {selectedCompetitor.weaknesses.map((weakness: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-dark-300">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Keywords */}
              <div>
                <h3 className="text-white font-semibold mb-3">Top Keywords</h3>
                <div className="space-y-2">
                  {selectedCompetitor.seoMetrics.topKeywords.map((keyword: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg">
                      <span className="text-white">{keyword.keyword}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-neon-blue text-sm">#{keyword.position}</span>
                        <span className="text-dark-400 text-sm">{keyword.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Gaps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-neon-blue" />
            <span>Content Opportunities</span>
          </h2>
          <div className="space-y-4">
            {contentGaps.map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30 hover:border-neon-blue/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{gap.keyword}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOpportunityColor(gap.opportunity)}`}>
                    {gap.opportunity} opportunity
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-dark-400">Search Volume:</span>
                    <span className="text-white ml-2">{gap.searchVolume.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Difficulty:</span>
                    <span className="text-white ml-2">{gap.difficulty}/100</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Competitor Rank:</span>
                    <span className="text-white ml-2">#{gap.competitorRank}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Est. Traffic:</span>
                    <span className="text-white ml-2">{gap.estimatedTraffic.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-dark-300 text-sm">Suggested: {gap.contentType}</span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-1 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200"
                  >
                    Create Content
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Add Competitor',
            description: 'Monitor a new competitor',
            icon: Target,
            color: 'from-neon-blue to-blue-600',
            action: 'Add'
          },
          {
            title: 'Generate Strategy',
            description: 'AI-powered competitive strategy',
            icon: TrendingUp,
            color: 'from-neon-green to-green-600',
            action: 'Generate'
          },
          {
            title: 'Export Report',
            description: 'Download competitor analysis',
            icon: BarChart3,
            color: 'from-neon-purple to-purple-600',
            action: 'Export'
          }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
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