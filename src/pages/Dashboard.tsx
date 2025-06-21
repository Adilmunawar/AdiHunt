import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileText,
  Target,
  Zap,
  BarChart3,
  Clock,
  Users,
  Award
} from 'lucide-react';
import { useContentStore } from '../store/contentStore';
import { useAuthStore } from '../store/authStore';

const stats = [
  {
    name: 'Articles Generated',
    value: '47',
    change: '+12%',
    changeType: 'increase' as const,
    icon: FileText,
    color: 'from-neon-blue to-blue-600'
  },
  {
    name: 'Avg SEO Score',
    value: '87',
    change: '+5%',
    changeType: 'increase' as const,
    icon: Target,
    color: 'from-neon-green to-green-600'
  },
  {
    name: 'Keywords Ranked',
    value: '234',
    change: '+18%',
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'from-neon-purple to-purple-600'
  },
  {
    name: 'Time Saved',
    value: '156h',
    change: '+24%',
    changeType: 'increase' as const,
    icon: Clock,
    color: 'from-neon-pink to-pink-600'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'article',
    title: 'AI-Powered SEO Strategies for 2024',
    action: 'Generated',
    time: '2 hours ago',
    score: 92
  },
  {
    id: 2,
    type: 'optimization',
    title: 'Machine Learning in Digital Marketing',
    action: 'Optimized',
    time: '4 hours ago',
    score: 88
  },
  {
    id: 3,
    type: 'trend',
    title: 'Voice Search Optimization',
    action: 'Trend Analysis',
    time: '6 hours ago',
    score: null
  }
];

export const Dashboard: React.FC = () => {
  const { projects, articles, trends, loadProjects, loadArticles, loadTrends } = useContentStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    loadProjects();
    loadArticles();
    loadTrends();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-dark-700/50 p-8"
      >
        <div className="absolute inset-0 bg-gradient-mesh opacity-5"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.full_name || 'Creator'}! 👋
              </h1>
              <p className="text-dark-300 text-lg">
                Your AI-powered content empire is ready to dominate search results
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6 hover:border-neon-blue/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-neon-green text-sm font-medium">{stat.change}</span>
                  <span className="text-dark-400 text-sm ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-dark-700/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                    {activity.type === 'article' && <FileText className="w-5 h-5 text-white" />}
                    {activity.type === 'optimization' && <Target className="w-5 h-5 text-white" />}
                    {activity.type === 'trend' && <TrendingUp className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-dark-400 text-sm">{activity.action} • {activity.time}</p>
                  </div>
                </div>
                {activity.score && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-neon-green" />
                    </div>
                    <span className="text-neon-green font-semibold">{activity.score}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {[
              { name: 'Generate Article', icon: FileText, color: 'from-neon-blue to-blue-600', href: '/generate' },
              { name: 'Analyze Trends', icon: TrendingUp, color: 'from-neon-green to-green-600', href: '/trends' },
              { name: 'Optimize Content', icon: Target, color: 'from-neon-purple to-purple-600', href: '/optimizer' },
              { name: 'New Project', icon: Users, color: 'from-neon-pink to-pink-600', href: '/projects' }
            ].map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-medium hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <action.icon className="w-5 h-5" />
                  <span>{action.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending Keywords Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Trending Keywords</h2>
          <button className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium">
            Explore Trends
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trends.slice(0, 3).map((trend, index) => (
            <motion.div
              key={trend.keyword}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{trend.keyword}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trend.trend === 'rising' ? 'bg-neon-green/20 text-neon-green' :
                  trend.trend === 'stable' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {trend.trend}
                </div>
              </div>
              <p className="text-dark-400 text-sm">Volume: {trend.volume?.toLocaleString()}</p>
              <p className="text-dark-400 text-sm">Difficulty: {trend.difficulty}/100</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};