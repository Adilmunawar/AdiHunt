import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { CompetitorDashboard } from '../components/intelligence/CompetitorDashboard';

export const CompetitorIntelligence: React.FC = () => {
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
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Competitor Intelligence</h1>
        </div>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Advanced competitor monitoring and content gap analysis
        </p>
      </motion.div>

      <CompetitorDashboard />
    </div>
  );
};