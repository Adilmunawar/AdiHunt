import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, Sparkles, TrendingUp, Target, Zap, Play } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const { signIn, signUp, enableDemoMode, demoMode } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back to AdiHunt!');
      } else {
        await signUp(formData.email, formData.password, formData.fullName);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    enableDemoMode();
    toast.success('Welcome to AdiHunt Demo!');
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Content Generation',
      description: 'Create expert-level, SEO-optimized content that ranks #1'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Trends',
      description: 'Stay ahead with trending keywords and market insights'
    },
    {
      icon: Target,
      title: 'SEO Optimization',
      description: 'Advanced SEO scoring and optimization recommendations'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate 3000+ word articles in seconds'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative">
        <div className="max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AdiHunt</h1>
              <p className="text-dark-400">AI SEO Intelligence Platform</p>
            </div>
          </motion.div>

          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center border border-neon-blue/30">
                  <feature.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                  <p className="text-dark-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-6 mt-12 p-6 bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">10M+</div>
              <div className="text-dark-400 text-sm">Words Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">95%</div>
              <div className="text-dark-400 text-sm">SEO Score Avg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple">24/7</div>
              <div className="text-dark-400 text-sm">AI Assistant</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AdiHunt</h1>
              <p className="text-dark-400 text-sm">AI SEO Platform</p>
            </div>
          </div>

          {/* Demo Mode Banner */}
          {demoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-center"
            >
              <p className="text-neon-blue font-medium">🚀 Demo Mode Active</p>
              <p className="text-dark-300 text-sm">Exploring AdiHunt with sample data</p>
            </motion.div>
          )}

          {/* Form */}
          <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join AdiHunt'}
              </h2>
              <p className="text-dark-300">
                {isLogin 
                  ? 'Sign in to your AI content empire' 
                  : 'Create your AI-powered content platform'
                }
              </p>
            </div>

            {/* Demo Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-neon-green to-green-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-neon-green/30 transition-all duration-200 mb-6 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Try Demo (No Signup Required)</span>
            </motion.button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-dark-400">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-neon-blue hover:text-neon-blue/80 transition-colors duration-200"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="mt-6 text-center">
            <p className="text-dark-400 text-xs">
              🔧 To connect your own Supabase database, add your credentials to environment variables
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};