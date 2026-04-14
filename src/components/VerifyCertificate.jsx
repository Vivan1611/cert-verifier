import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, ShieldCheck, ShieldAlert, CheckCircle, Search, ArrowRight, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateFileHash } from '../lib/crypto';
import { verifyCertificateHash } from '../lib/storage';
import { cn } from '../lib/utils';

const VerifyCertificate = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const handleVerify = async () => {
    if (!file) return;
    
    setIsVerifying(true);
    setResult(null);
    
    const toastId = toast.loading('Calculating cryptographic signature...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.loading('Querying decentralized network...', { id: toastId });
      
      const hash = await generateFileHash(file);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate deep scan
      
      const certificate = verifyCertificateHash(hash);
      
      if (certificate) {
        toast.success('Authenticity Confirmed.', { id: toastId });
        setResult({ isValid: true, certificate, hash });
      } else {
        toast.error('Warning: Document Not Found.', { id: toastId });
        setResult({ isValid: false, hash });
      }
    } catch (error) {
      toast.error('Network error during verification.', { id: toastId });
      setResult({ isValid: false, error: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-6"
        >
          <Search className="w-8 h-8" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Verify Authenticity
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Upload any document to compare its digital signature against our immutable timeline records.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 md:p-10 shadow-xl shadow-blue-500/5 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isVerifying && !result && (
            <motion.div
              key="verify-zone"
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
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.02]" 
                    : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <motion.div animate={{ y: isDragOver ? -10 : 0 }}>
                  <ScanLine className={cn(
                    "w-16 h-16 mb-4 transition-colors",
                    isDragOver ? "text-blue-500" : "text-slate-400"
                  )} />
                </motion.div>
                <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Select a document to Verify
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Drag & drop or click to upload
                </p>
              </div>
              
              <AnimatePresence>
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, mt: 0 }}
                    animate={{ opacity: 1, height: 'auto', mt: 24 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 gap-4"
                  >
                    <div className="flex-1 flex items-center min-w-0 w-full">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4 shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handleVerify(); }}
                      className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0"
                    >
                      Scan Document <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {isVerifying && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center px-4 relative"
            >
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <FileText className="w-10 h-10 text-blue-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Cryptography</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Scanning the global decentralized ledger for a matching mathematical proof...
              </p>
            </motion.div>
          )}

          {result && !isVerifying && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6"
            >
              <div className={cn(
                "p-8 rounded-2xl relative overflow-hidden transition-colors border",
                result.isValid 
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]" 
                  : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
              )}>
                {/* Glow Background effect */}
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10",
                  result.isValid ? "bg-green-500/20" : "bg-red-500/20"
                )}></div>

                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  <div className={cn(
                    "w-20 h-20 shrink-0 rounded-full flex items-center justify-center relative",
                    result.isValid ? "bg-green-100 dark:bg-green-500/20 text-green-500" : "bg-red-100 dark:bg-red-500/20 text-red-500"
                  )}>
                    {result.isValid ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                    {result.isValid && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1"
                      >
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <h3 className={cn(
                        "text-3xl font-extrabold tracking-tight mb-2",
                        result.isValid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                      )}>
                        {result.isValid ? "✅ Verified Authentic" : "❌ Fraudulent Document"}
                      </h3>
                      <p className={cn(
                        "text-base",
                        result.isValid ? "text-green-800/70 dark:text-green-200/70" : "text-red-800/70 dark:text-red-200/70"
                      )}>
                        {result.isValid 
                          ? "This document is an exact, unaltered match to the record preserved in the ledger."
                          : "This document's signature cannot be found. It may be altered, fake, or unrecorded."
                        }
                      </p>
                    </div>

                    {result.isValid && (
                      <div className="bg-white/60 dark:bg-slate-950/40 rounded-xl p-4 border border-green-200/50 dark:border-green-500/20 w-full backdrop-blur-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Original Issue Name</span>
                            <span className="font-semibold text-slate-900 dark:text-white break-all">{result.certificate.fileName}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Secured Timestamp</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {new Date(result.certificate.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.hash && (
                      <div className="w-full relative mt-4">
                        <span className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">Scanned Hash</span>
                        <code className="block w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-mono break-all border border-slate-200 dark:border-slate-800">
                          {result.hash}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => { setFile(null); setResult(null); }}
                  className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  Verify Another Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
