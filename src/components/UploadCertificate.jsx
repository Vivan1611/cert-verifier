import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Database, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateFileHash } from '../lib/crypto';
import { storeCertificate } from '../lib/storage';
import { cn } from '../lib/utils';

const UploadCertificate = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setResult(null);
    
    // Web3-esque Toast sequence
    const toastId = toast.loading('Encrypting document locally...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.loading('Generating cryptographic signature...', { id: toastId });
      
      const hash = await generateFileHash(file);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate chain interaction
      toast.loading('Anchoring to immutable ledger...', { id: toastId });
      
      const stored = storeCertificate(hash, file.name);
      
      if (stored) {
        toast.success('Document anchored to blockchain successfully!', { id: toastId });
        setResult({ success: true, hash });
      } else {
        toast.error('Document already exists on the ledger.', { id: toastId });
        setResult({ success: false, hash });
      }
    } catch (error) {
      toast.error(error.message || 'Error anchoring document.', { id: toastId });
      setResult({ success: false });
    } finally {
      setIsUploading(false);
      setFile(null); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 mb-6"
        >
          <Database className="w-8 h-8" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Issue a Certificate
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Upload any document to generate a permanent, verifiable cryptographic hash on the simulated ledger.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 md:p-10 shadow-xl shadow-purple-500/5 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isUploading && !result && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                  isDragOver 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10 scale-[1.02]" 
                    : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                />
                <motion.div animate={{ y: isDragOver ? -10 : 0 }}>
                  <UploadCloud className={cn(
                    "w-16 h-16 mb-4 transition-colors",
                    isDragOver ? "text-purple-500" : "text-slate-400"
                  )} />
                </motion.div>
                <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  or click to browse your computer
                </p>
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, mt: 0 }}
                    animate={{ opacity: 1, height: 'auto', mt: 24 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-500/20"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-200 dark:bg-purple-800 flex items-center justify-center mr-4 shrink-0">
                      <FileText className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                    </div>
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-500/30 flex items-center shrink-0"
                    >
                      Anchor <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Securing Document</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Generating unique SHA-256 fingerprint and anchoring to the decentralized protocol network...
              </p>
            </motion.div>
          )}

          {result && !isUploading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center relative",
                  result.success ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                )}>
                  {result.success && <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-40 animate-pulse"></div>}
                  {result.success ? <ShieldCheck className="w-12 h-12 relative z-10" /> : <div className="text-4xl relative z-10">❌</div>}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {result.success ? "Successfully Secured" : "Ledger Rejection"}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                {result.success 
                  ? "Your document is now permanently registered on the blockchain. Its authenticity can be verified anytime." 
                  : "This document already exists in the immutable registry and cannot be issued twice."}
              </p>

              {result.hash && (
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 text-left max-w-xl mx-auto relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">Cryptographic Fingerprint (SHA-256)</p>
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 break-all">
                    {result.hash}
                  </code>
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Issue Another Document
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadCertificate;
