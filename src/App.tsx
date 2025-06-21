import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { Generator } from './pages/Generator';
import { Analytics } from './pages/Analytics';
import { Optimizer } from './pages/Optimizer';
import { Team } from './pages/Team';
import { AuthPage } from './pages/Auth';
import { SEOAudit } from './pages/SEOAudit';
import { ContentPlanning } from './pages/ContentPlanning';
import { CompetitorIntelligence } from './pages/CompetitorIntelligence';
import { useAuthStore } from './store/authStore';
import { isDemoMode } from './lib/supabase';

function App() {
  const { user, loading, demoMode } = useAuthStore();

  // Error boundary for the app
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error:', error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg">Loading AdiHunt...</p>
          {isDemoMode && (
            <p className="text-neon-blue text-sm mt-2">Demo Mode - No database required</p>
          )}
        </div>
      </div>
    );
  }

  if (!user && !demoMode) {
    return (
      <>
        <AuthPage />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155'
            }
          }}
        />
      </>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/trends" element={<div className="text-white">Trends Page - Coming Soon</div>} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/seo-audit" element={<SEOAudit />} />
          <Route path="/content-planning" element={<ContentPlanning />} />
          <Route path="/competitor-intelligence" element={<CompetitorIntelligence />} />
          <Route path="/projects" element={<div className="text-white">Projects Page - Coming Soon</div>} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<div className="text-white">Settings Page - Coming Soon</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }}
      />
    </Router>
  );
}

export default App;