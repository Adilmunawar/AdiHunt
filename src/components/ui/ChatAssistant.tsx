import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant' as const,
      content: '👋 Hi! I\'m Adi, your AI SEO assistant. How can I help you create amazing content today?',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    const assistantResponse = {
      id: (Date.now() + 1).toString(),
      type: 'assistant' as const,
      content: getAdiResponse(message),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setMessage('');
  };

  const getAdiResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('seo') || lowerInput.includes('optimize')) {
      return '🎯 For SEO optimization, I recommend focusing on:\n\n• Target keyword density (1-3%)\n• Semantic keywords and entities\n• Proper H1-H6 structure\n• Meta descriptions (150-160 chars)\n• Internal linking opportunities\n\nWould you like me to analyze your content?';
    }
    
    if (lowerInput.includes('content') || lowerInput.includes('write')) {
      return '✍️ I can help you create:\n\n• Long-form blog posts (3000+ words)\n• SEO-optimized articles\n• Technical guides & whitepapers\n• Press releases\n• Social media content\n\nWhat type of content would you like to generate?';
    }
    
    if (lowerInput.includes('keyword') || lowerInput.includes('trend')) {
      return '📈 For keyword research, I suggest:\n\n• Analyzing current trends in your industry\n• Finding long-tail keyword opportunities\n• Checking search intent alignment\n• Competitor keyword analysis\n\nCheck out the Trends section for real-time insights!';
    }
    
    return '🤔 That\'s an interesting question! I can help you with:\n\n• Content generation & optimization\n• SEO analysis & recommendations\n• Keyword research & trends\n• Project organization\n• Publishing workflows\n\nWhat specific challenge are you facing?';
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-neon-blue/50 transition-all duration-300 z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-dark-900/95 backdrop-blur-xl border border-dark-700/50 rounded-2xl shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-dark-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Ask Adi</h3>
                  <p className="text-dark-400 text-xs">AI SEO Assistant</p>
                </div>
                <div className="ml-auto w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl whitespace-pre-line ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white'
                        : 'bg-dark-800/50 text-dark-100 border border-dark-700/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-700/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Adi anything..."
                  className="flex-1 bg-dark-800/50 border border-dark-700/50 rounded-xl px-4 py-2 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};