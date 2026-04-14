import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Moon, Sun, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = ({ activeTab, setActiveTab, isDark, toggleDark }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'upload', label: 'Issue' },
    { id: 'verify', label: 'Verify' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/20 dark:border-white/10 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="ml-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Cert<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Verify</span>
            </span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200",
                  activeTab === item.id 
                    ? "text-slate-900 dark:text-white" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDark}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
