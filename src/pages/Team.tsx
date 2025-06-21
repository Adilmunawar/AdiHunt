import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, MessageSquare, Settings } from 'lucide-react';
import { TeamManagement } from '../components/collaboration/TeamManagement';
import { useContentStore } from '../store/contentStore';

export const Team: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');
  const { currentProject } = useContentStore();

  const tabs = [
    { id: 'members', name: 'Team Members', icon: Users },
    { id: 'activity', name: 'Activity Feed', icon: Activity },
    { id: 'comments', name: 'Comments', icon: MessageSquare },
    { id: 'settings', name: 'Team Settings', icon: Settings }
  ];

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-dark-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Project Selected</h2>
        <p className="text-dark-300">Please select a project to manage your team</p>
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
          <Users className="w-8 h-8 text-neon-blue" />
          <span>Team Collaboration</span>
        </h1>
        <p className="text-dark-300 text-lg mt-2">
          Manage your team and collaborate on content creation
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg'
                : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'members' && <TeamManagement projectId={currentProject.id} />}
        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Activity Feed</h2>
            <p className="text-dark-300">Coming soon - Track team activities and changes</p>
          </div>
        )}
        {activeTab === 'comments' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Comments & Reviews</h2>
            <p className="text-dark-300">Coming soon - Collaborative content review system</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Team Settings</h2>
            <p className="text-dark-300">Coming soon - Configure team workflows and permissions</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};