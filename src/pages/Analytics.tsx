import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Filter, Download, TrendingUp } from 'lucide-react';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-neon-blue" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-dark-300 text-lg mt-2">
            Track your content performance and SEO metrics
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-dark-800/50 border border-dark-700/50 rounded-xl px-4 py-2 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard timeRange={timeRange} />
    </div>
  );
};