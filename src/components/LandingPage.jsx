import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Fingerprint, ArrowRight } from 'lucide-react';

const LandingPage = ({ setActiveTab }) => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
      title: "1. Encrypt & Hash",
      description: "We use SHA-256 cryptographic algorithms to generate a unique digital fingerprint for your document directly in your browser."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-500" />,
      title: "2. Immutable Storage",
      description: "The generated hash is anchored into our decentralized ledger, ensuring the record can never be tampered with or altered."
    },
    {
      icon: <Fingerprint className="w-8 h-8 text-pink-500" />,
      title: "3. Instant Verification",
      description: "Anyone can verify the authenticity of a document instantly by comparing its hash against the immutable ledger."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-20 overflow-visible">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-20"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel mb-8 text-sm font-medium text-slate-800 dark:text-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Web3 Ledger Network Active
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
          Secure Your Certificates with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 drop-shadow-sm">
            Blockchain
          </span>
        </h1>
        
        <p className="mt-4 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
          The new standard for document authenticity. Issue, store, and verify digital credentials with mathematical certainty.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('upload')}
            className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-shadow flex items-center justify-center"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('verify')}
            className="px-8 py-4 rounded-xl font-bold text-slate-800 dark:text-white glass-panel hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-center"
          >
            Verify a Document
          </motion.button>
        </div>
      </motion.div>

      {/* How it works */}
      <div className="mt-32 w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400">Three simple steps to unbreakable authenticity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 z-0"></div>

          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800/80 shadow-lg flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
