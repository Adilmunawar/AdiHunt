import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();

  return (
    <header className="bg-dark-900/30 backdrop-blur-xl border-b border-dark-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search content, projects, or ask Adi..."
              className="w-full bg-dark-800/50 border border-dark-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 bg-dark-800/50 rounded-xl border border-dark-700/50 text-dark-300 hover:text-white hover:border-neon-blue/50 transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-dark-400 text-xs capitalize">
                {profile?.subscription_tier || 'Free'} Plan
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};