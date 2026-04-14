import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UploadCertificate from './components/UploadCertificate';
import VerifyCertificate from './components/VerifyCertificate';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'upload', 'verify', 'dashboard'
  
  // Initialize dark mode based on user preference or defaulting to dark
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark for Web3 aesthetic
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'upload':
        return <UploadCertificate />;
      case 'verify':
        return <VerifyCertificate />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#fff' : '#1e293b',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }
        }} 
      />
      
      {/* Background gradients for Web3 Feel */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] transition-all duration-1000" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] transition-all duration-1000" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-400/10 dark:bg-pink-600/10 blur-[100px] transition-all duration-1000" />
      </div>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
      />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10 max-w-7xl mx-auto flex-grow relative min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {activeTab !== 'home' && (
        <footer className="py-6 text-center text-sm mt-auto glass-panel border-t-0 border-b-0 border-x-0 !bg-white/30 dark:!bg-slate-900/30">
          <p className="text-slate-600 dark:text-slate-400">Powered by Simulated Immutable Ledger Technology</p>
        </footer>
      )}
    </div>
  );
}

export default App;
