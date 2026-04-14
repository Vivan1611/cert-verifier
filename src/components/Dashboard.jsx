import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Clock, FileText, Hash, Copy, Search, ShieldCheck, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredCertificates, getVerifyCount } from '../lib/storage';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [verifyCount, setVerifyCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCertificates(getStoredCertificates().slice().reverse());
    setVerifyCount(getVerifyCount());
  }, []);

  const filteredCerts = certificates.filter(cert => 
    cert.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cert.hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copied to clipboard!');
  };

  const handleDownloadReceipt = (cert) => {
    const receiptData = {
      protocol: "Blockchain-Simulated Ledger",
      status: "AUTHENTIC",
      documentName: cert.fileName,
      cryptographicHash: cert.hash,
      anchoredTimestamp: cert.timestamp,
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${cert.fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Certificate Receipt Downloaded');
  };

  // Stagger animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header and Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Protocol Dashboard
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explorer for the decentralized immutable document ledger.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-5 rounded-2xl flex items-center min-w-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Issued</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{certificates.length}</h4>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-5 rounded-2xl flex items-center min-w-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Successful Scans</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{verifyCount}</h4>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 glass-panel bg-white/50 dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-shadow text-slate-900 dark:text-white placeholder-slate-400"
            placeholder="Search by document name or cryptographic hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Display Grid */}
      {certificates.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-3xl p-16 text-center border border-dashed border-slate-300 dark:border-slate-700"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
            <Database className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ledger is Empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No documents have been anchored to the timeline yet. Head over to the Issue tab to get started.
          </p>
        </motion.div>
      ) : filteredCerts.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching records</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl p-6 flex flex-col group relative overflow-hidden"
              >
                {/* Micro-glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-colors pointer-events-none"></div>
                
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate" title={cert.fileName}>
                      {cert.fileName}
                    </h4>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(cert.timestamp).toLocaleDateString()} {new Date(cert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/50 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hash Signature</p>
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-lg p-2 group/hash">
                      <div className="flex items-center min-w-0 mr-2">
                        <Hash className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                        <code className="text-xs font-mono text-purple-600 dark:text-purple-400 truncate">
                          {cert.hash.substring(0, 12)}...{cert.hash.substring(cert.hash.length - 8)}
                        </code>
                      </div>
                      <button 
                        onClick={() => handleCopy(cert.hash)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                        title="Copy full hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadReceipt(cert)}
                    className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" /> JSON Receipt
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
