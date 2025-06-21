import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  Filter,
  Download,
  Eye,
  Edit3,
  Clock,
  Target,
  Users,
  TrendingUp
} from 'lucide-react';
import { ContentPlanningService } from '../../lib/contentPlanning';

export const ContentCalendar: React.FC = () => {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const data = await ContentPlanningService.generateContentCalendar(
        'Technology',
        ['Increase organic traffic', 'Build brand awareness'],
        6
      );
      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-neon-green/20 text-neon-green';
      case 'ready': return 'bg-neon-blue/20 text-neon-blue';
      case 'in-progress': return 'bg-yellow-400/20 text-yellow-400';
      case 'planned': return 'bg-dark-400/20 text-dark-400';
      default: return 'bg-dark-400/20 text-dark-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-400/20 text-red-400';
      case 'high': return 'bg-orange-400/20 text-orange-400';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'low': return 'bg-green-400/20 text-green-400';
      default: return 'bg-dark-400/20 text-dark-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentMonth = calendarData[selectedMonth];

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
            <Calendar className="w-8 h-8 text-neon-blue" />
            <span>Content Calendar</span>
          </h1>
          <p className="text-dark-300 text-lg mt-2">
            Plan, schedule, and track your content strategy
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-dark-800/50 border border-dark-700/50 rounded-xl px-4 py-2 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
          >
            {calendarData.map((month, index) => (
              <option key={index} value={index}>
                {month.month} {month.year}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Content</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Month Overview */}
      {currentMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {currentMonth.month} {currentMonth.year} Overview
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{currentMonth.metrics.plannedContent}</div>
                <div className="text-dark-400 text-sm">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{currentMonth.metrics.inProgress}</div>
                <div className="text-dark-400 text-sm">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">{currentMonth.metrics.published}</div>
                <div className="text-dark-400 text-sm">Published</div>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Monthly Themes</h3>
            <div className="flex flex-wrap gap-2">
              {currentMonth.themes.map((theme: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Campaigns */}
          <div>
            <h3 className="text-white font-semibold mb-3">Active Campaigns</h3>
            <div className="space-y-3">
              {currentMonth.campaigns.map((campaign: any, index: number) => (
                <div key={index} className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{campaign.name}</h4>
                      <p className="text-dark-300 text-sm">{campaign.objective}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-green font-semibold">${campaign.budget.toLocaleString()}</div>
                      <div className="text-dark-400 text-sm">Budget</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Content List */}
      {currentMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Content Pipeline</h3>
          <div className="space-y-4">
            {currentMonth.content.map((content: any, index: number) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30 hover:border-neon-blue/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{content.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(content.priority)}`}>
                        {content.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-dark-300">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{content.targetKeywords.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(content.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{content.estimatedTraffic.toLocaleString()} est. traffic</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{content.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            title: 'Generate Ideas',
            description: 'AI-powered content suggestions',
            icon: TrendingUp,
            color: 'from-neon-blue to-blue-600',
            action: 'Generate'
          },
          {
            title: 'Bulk Schedule',
            description: 'Schedule multiple posts at once',
            icon: Calendar,
            color: 'from-neon-green to-green-600',
            action: 'Schedule'
          },
          {
            title: 'Export Calendar',
            description: 'Download as CSV or PDF',
            icon: Download,
            color: 'from-neon-purple to-purple-600',
            action: 'Export'
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