import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PenTool,
  TrendingUp,
  Target,
  FolderOpen,
  Settings,
  Zap,
  Brain,
  Users,
  BarChart3
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Generate', href: '/generate', icon: PenTool },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Optimizer', href: '/optimizer', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="w-64 bg-dark-900/50 backdrop-blur-xl border-r border-dark-700/50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-dark-700/50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-glow"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AdiHunt</h1>
            <p className="text-xs text-dark-400">AI SEO Platform</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 text-white shadow-lg shadow-neon-blue/20'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-neon-blue' : ''}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-neon-blue rounded-full animate-glow"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Section */}
      <div className="p-4 border-t border-dark-700/50">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-5 h-5 text-neon-purple" />
            <span className="text-white font-semibold">Upgrade to Pro</span>
          </div>
          <p className="text-dark-300 text-sm mb-3">
            Unlock unlimited content generation and advanced analytics
          </p>
          <button className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-lg py-2 text-sm font-medium hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-200">
            Upgrade Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};