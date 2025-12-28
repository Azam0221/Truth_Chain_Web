import React, { useState, useCallback } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Upload, ShieldCheck, AlertOctagon, 
  MapPin, Clock, Smartphone, Hash, 
  CheckCircle2, Lock, Server, 
  Fingerprint, ChevronDown, Terminal 
} from 'lucide-react';

 const BACKEND_URL = "https://truthchain-backend.up.railway.app/api/evidence";

export default function VerificationPage() {
  const [viewState, setViewState] = useState('idle'); 
  const [evidence, setEvidence] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const onFileSelect = useCallback(async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    if(e.target.value) {
        e.target.value = '';
    }

    setFileName(file.name);
    setViewState('processing');

    try {
      const hash = await generateSHA256(file);
      console.log(`Generated Hash: ${hash}`);

      const { data } = await axios.get(`${BACKEND_URL}/verify/${hash}`, {
        timeout: 15000 
      });

      setEvidence(data);
      setViewState('success');

    } catch (err) {
      console.error("Verification failed:", err);
      if (err.response && err.response.status === 404) {
        setErrorDetails("Hash mismatch: This file does not exist in the ledger.");
      } else {
        setErrorDetails("Network error: Could not reach TruthChain nodes.");
      }
      setViewState('error');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
      
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
      
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="border-b border-emerald-500/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">TruthChain</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#verify" className="hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">Verify</a>
            <a href="#protocol" className="hover:text-white transition-all">Protocol</a>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </nav>

      <section id="verify" className="flex-1 flex flex-col items-center pt-24 pb-32 px-6 relative z-10">
        
        <div className="text-center mb-16 space-y-6 max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
            Trust What <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">You See.</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
            The world's first <span className="text-emerald-400">hardware-backed</span> cryptographic evidence recorder. 
            Verify authenticity instantly.
          </p>
        </div>

        <div className="w-full max-w-xl mb-24 relative">
            
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl opacity-20 blur-xl animate-pulse pointer-events-none"></div>

          <AnimatePresence mode="wait">
            
            {viewState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <label className="block group cursor-pointer">
                  <input type="file" onChange={onFileSelect} className="hidden" />
                  <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-16 text-center transition-all duration-300 group-hover:border-emerald-500/50 group-hover:bg-[#0f0f0f] group-hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)]">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 border border-gray-800 group-hover:border-emerald-500/30">
                      <Upload className="w-10 h-10 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Drop Evidence File</h3>
                    <p className="text-gray-500 text-base">Click to upload or drag and drop</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-gray-600 bg-gray-900 px-3 py-1 rounded-md border border-gray-800">
                        <Terminal className="w-3 h-3" /> SHA-256 ENCRYPTION READY
                    </div>
                  </div>
                </label>
              </motion.div>
            )}

            {viewState === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-20 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                <div className="w-24 h-24 mx-auto mb-8 relative">
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-emerald-400 border-r-emerald-400 rounded-full animate-spin shadow-[0_0_20px_#10b981]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verifying Cryptography...</h3>
                <p className="text-emerald-500/70 font-mono text-sm tracking-wider">{fileName}</p>
              </motion.div>
            )}

            {viewState === 'success' && evidence && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0A0A] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)]"
              >
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-8 flex items-center gap-5">
                  <div className="bg-emerald-500 text-black p-3 rounded-full shadow-[0_0_20px_#10b981]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Authenticity Verified</h3>
                    <p className="text-emerald-400 font-mono text-sm tracking-wide">SIGNATURE MATCH CONFIRMED</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={MapPin} label="Location" value={evidence.gpsLocation} highlight />
                    <InfoRow icon={Clock} label="Timestamp" value={formatTime(evidence.metaData)} highlight />
                  </div>
                  
                  <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-wider font-bold group-hover:text-emerald-400 transition-colors">
                      <Smartphone className="w-3 h-3" /> Source Device ID
                    </div>
                    <code className="text-white text-sm font-mono tracking-wide">{evidence.deviceId}</code>
                  </div>

                  <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-wider font-bold group-hover:text-emerald-400 transition-colors">
                      <Hash className="w-3 h-3" /> Digital Signature
                    </div>
                    <code className="text-emerald-500/80 text-xs break-all font-mono leading-relaxed">
                      {evidence.digitalSignature}
                    </code>
                  </div>

                  <button 
                    onClick={() => setViewState('idle')} 
                    className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-colors shadow-lg mt-4"
                  >
                    Verify Another File
                  </button>
                </div>
              </motion.div>
            )}

            {viewState === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A0A] border border-red-500/40 rounded-3xl overflow-hidden shadow-[0_0_100px_-20px_rgba(239,68,68,0.2)]"
              >
                <div className="bg-red-500/10 border-b border-red-500/20 p-8 flex items-center gap-5">
                  <div className="bg-red-500 text-black p-3 rounded-full shadow-[0_0_20px_#ef4444]">
                    <AlertOctagon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Verification Failed</h3>
                    <p className="text-red-400 font-mono text-sm tracking-wide">INTEGRITY CHECK FAILED</p>
                  </div>
                </div>
                <div className="p-10 text-center">
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">{errorDetails}</p>
                  <button 
                    onClick={() => setViewState('idle')} 
                    className="w-full py-4 bg-gray-800 text-white font-bold text-lg rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 animate-bounce text-gray-600">
            <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      <section id="protocol" className="bg-[#050505] border-t border-gray-900 py-32 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-white">Unbreakable Trust Protocol</h2>
                <p className="text-gray-400 text-lg">
                    TruthChain secures digital evidence through a three-layer hardware-software stack.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <ProtocolCard 
                    icon={Lock} 
                    title="1. Hardware Sign" 
                    desc="Media is signed instantly inside the device's Trusted Execution Environment (TEE). The raw sensor data is locked before file creation." 
                />
                <ProtocolCard 
                    icon={Server} 
                    title="2. Immutable Net" 
                    desc="Cryptographic hashes are broadcast to our distributed network. Files are pinned to IPFS, making them permanently uncensorable." 
                />
                <ProtocolCard 
                    icon={Fingerprint} 
                    title="3. Zero-Trust Check" 
                    desc="Verification happens client-side. We hash the file on your device and compare it to the ledger. We never see your private files." 
                />
            </div>
        </div>
      </section>

      <footer className="border-t border-gray-900 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-gray-400">TruthChain Protocol</span>
            </div>
            <p className="text-gray-600 text-sm">© 2025 Hackthon</p>
        </div>
      </footer>
    </div>
  );
}

const generateSHA256 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      resolve(CryptoJS.SHA256(wordArray).toString());
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const formatTime = (metaDataString) => {
  try {
    const { time } = JSON.parse(metaDataString);
    return new Date(parseInt(time)).toLocaleString();
  } catch (e) {
    return "Timestamp Unreadable";
  }
};

const InfoRow = ({ icon: Icon, label, value, highlight }) => (
  <div className={`p-4 rounded-xl border transition-colors ${highlight ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-gray-900 border-gray-800'}`}>
    <div className={`flex items-center gap-2 mb-1 text-[10px] uppercase tracking-wider font-bold ${highlight ? 'text-emerald-400' : 'text-gray-500'}`}>
      <Icon className="w-3 h-3" /> {label}
    </div>
    <div className="text-white font-medium text-sm truncate" title={value}>
      {value || "N/A"}
    </div>
  </div>
);

const ProtocolCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-gray-800 hover:border-emerald-500/30 hover:bg-[#0f0f0f] transition-all duration-300 group hover:-translate-y-1">
        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors border border-gray-800 group-hover:border-emerald-500/20">
            <Icon className="w-7 h-7 text-gray-400 group-hover:text-emerald-400 transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);