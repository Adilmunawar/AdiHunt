import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Brain } from 'lucide-react';
import { ContentCalendar } from '../components/planning/ContentCalendar';

export const ContentPlanning: React.FC = () => {
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
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Content Planning</h1>
        </div>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Strategic content planning with AI-powered insights and automated workflows
        </p>
      </motion.div>

      <ContentCalendar />
    </div>
  );
};