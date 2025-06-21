import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Eye,
  MousePointer,
  Share2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AnalyticsService } from '../../lib/analytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsDashboardProps {
  projectId?: string;
  timeRange: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ projectId, timeRange }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [contentPerformance, setContentPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [projectId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsData, performanceData] = await Promise.all([
        AnalyticsService.getWebsiteAnalytics('example.com', timeRange),
        // Load content performance for multiple articles
        Promise.all([
          AnalyticsService.getContentPerformance('1'),
          AnalyticsService.getContentPerformance('2'),
          AnalyticsService.getContentPerformance('3')
        ])
      ]);

      setAnalytics(analyticsData);
      setContentPerformance(performanceData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  const trafficData = [
    { name: 'Jan', organic: 4000, direct: 2400, social: 1200 },
    { name: 'Feb', organic: 3000, direct: 1398, social: 1100 },
    { name: 'Mar', organic: 2000, direct: 9800, social: 1300 },
    { name: 'Apr', organic: 2780, direct: 3908, social: 1400 },
    { name: 'May', organic: 1890, direct: 4800, social: 1500 },
    { name: 'Jun', organic: 2390, direct: 3800, social: 1600 }
  ];

  const keywordData = analytics?.topKeywords.map((kw: any, index: number) => ({
    keyword: kw.keyword,
    position: kw.position,
    clicks: kw.clicks,
    impressions: kw.clicks * (20 - kw.position)
  })) || [];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Total Traffic',
            value: analytics?.pageViews.toLocaleString(),
            change: '+12.5%',
            changeType: 'increase' as const,
            icon: Users,
            color: 'from-neon-blue to-blue-600'
          },
          {
            name: 'Organic Traffic',
            value: analytics?.organicTraffic.toLocaleString(),
            change: '+18.2%',
            changeType: 'increase' as const,
            icon: TrendingUp,
            color: 'from-neon-green to-green-600'
          },
          {
            name: 'Avg Session',
            value: `${analytics?.avgSessionDuration}m`,
            change: '+5.1%',
            changeType: 'increase' as const,
            icon: Clock,
            color: 'from-neon-purple to-purple-600'
          },
          {
            name: 'Conversion Rate',
            value: `${analytics?.conversionRate}%`,
            change: '+2.3%',
            changeType: 'increase' as const,
            icon: Target,
            color: 'from-neon-pink to-pink-600'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">{metric.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.changeType === 'increase' ? (
                    <ArrowUp className="w-4 h-4 text-neon-green mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'increase' ? 'text-neon-green' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-dark-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Traffic Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Traffic Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="organic" stroke="#00d9ff" strokeWidth={3} />
              <Line type="monotone" dataKey="direct" stroke="#00ff88" strokeWidth={3} />
              <Line type="monotone" dataKey="social" stroke="#bf00ff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Keywords */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Top Performing Keywords</h3>
          <div className="space-y-4">
            {analytics?.topKeywords.map((keyword: any, index: number) => (
              <div key={keyword.keyword} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {keyword.position}
                  </div>
                  <div>
                    <p className="text-white font-medium">{keyword.keyword}</p>
                    <p className="text-dark-400 text-sm">{keyword.clicks} clicks</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-dark-400" />
                    <span className="text-white text-sm">{keyword.clicks * 10}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Content Performance</h3>
          <div className="space-y-4">
            {contentPerformance.map((content, index) => (
              <div key={content.articleId} className="p-4 bg-dark-900/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium truncate">{content.title}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <span className="text-neon-green text-xs font-semibold">{content.seoScore}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-dark-400 mb-1">
                      <Eye className="w-3 h-3" />
                      <span>Views</span>
                    </div>
                    <div className="text-white font-semibold">{content.views.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-dark-400 mb-1">
                      <Share2 className="w-3 h-3" />
                      <span>Shares</span>
                    </div>
                    <div className="text-white font-semibold">{content.shares}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-dark-400 mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Time</span>
                    </div>
                    <div className="text-white font-semibold">{content.timeOnPage}m</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyword Rankings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Keyword Rankings</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="keyword" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="clicks" fill="#00d9ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};