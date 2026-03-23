import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Network, Workflow, CheckCircle2, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function MLOpsDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('quantization');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulated chart data
  const syncData = Array.from({length: 12}).map((_, i) => ({
    time: `T-${12-i}h`,
    bandwidth: Math.random() * 5 + 1,
    latency: Math.random() * 150 + 20
  }));

  const fetchMLData = async (endpoint, payload) => {
    setLoading(true);
    try {
      let res;
      if (payload) {
         res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/mlops/${endpoint}`, payload);
      } else {
         res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/mlops/${endpoint}`);
      }
      setData(res.data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(null);
    if (activeTab === 'quantization') {
      fetchMLData(`quantization-status`);
    } else if (activeTab === 'pwa') {
      fetchMLData(`pwa-sync-manifest`);
    } else if (activeTab === 'federated') {
      fetchMLData(`federated-aggregate`, { client_id: "edge-node-994", gradient_updates: [0.01, -0.04, 0.02], samples_trained: 142 });
    } else if (activeTab === 'bandwidth') {
      fetchMLData(`connection-optimize?client_ping_ms=250&client_downlink_mbps=1.2`);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'quantization', label: 'Quantized Edge Models', icon: Cpu },
    { id: 'pwa', label: 'PWA IndexedDB Sync', icon: HardDrive },
    { id: 'federated', label: 'Federated Global Web', icon: Network },
    { id: 'bandwidth', label: 'Adaptive Latency', icon: Workflow },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
          <Zap size={32} className="text-emerald-500" /> {t('MLOps & Edge Telemetry')}
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.15)] border-emerald-500/50 text-emerald-400 transform scale-105 z-10'
                : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <tab.icon size={36} className="mb-3 opacity-80" />
            <span className="font-bold text-center">{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 min-h-[400px]"
      >
        {loading && (
           <div className="h-64 flex items-center justify-center text-emerald-500">
              <Zap size={48} className="animate-pulse" />
           </div>
        )}

        {!loading && data && activeTab === 'quantization' && (
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-white mb-6">ONNX Edge Inference Engine</h2>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                   <span className="text-slate-400">Current Engine</span>
                   <span className="text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg">{data.primary_inference_engine}</span>
                 </div>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                   <span className="text-slate-400">Model Precision</span>
                   <span className="text-white font-bold">{data.precision}</span>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                   <span className="text-slate-400">Supported Hardware</span>
                   <div className="flex gap-2">
                     {data.supported_hardware.map(hw => <span key={hw} className="text-xs bg-slate-700 px-2 py-1 rounded">{hw}</span>)}
                   </div>
                 </div>
              </div>
              
              <div className="flex justify-center">
                 <div className="relative w-64 h-64 border-8 border-slate-800 rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_50px_rgba(16,185,129,0.2)]">
                   <p className="text-slate-400 font-bold mb-1">Compression</p>
                   <p className="text-5xl font-black text-emerald-400">{data.compression_ratio_achieved}</p>
                   <div className="mt-4 flex gap-4 text-sm font-bold text-slate-500">
                     <span>{data.original_size_mb}MB</span>
                     <span>➔</span>
                     <span className="text-white">{data.weights_size_mb}MB</span>
                   </div>
                 </div>
              </div>
           </div>
        )}

        {!loading && data && activeTab === 'pwa' && (
           <div className="text-center space-y-8 py-8">
              <HardDrive size={64} className="mx-auto text-cyan-500 mb-4" />
              <h2 className="text-3xl font-bold text-white">Local Storage & PWA Caching</h2>
              <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm font-bold uppercase mb-2">Service Worker</p>
                  <p className="text-2xl font-bold text-cyan-400">{data.service_worker_version}</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm font-bold uppercase mb-2">Caching Strategy</p>
                  <p className="text-xl font-bold text-white">{data.strategy}</p>
                </div>
              </div>
              
              <div className="max-w-xl mx-auto text-left mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <h3 className="text-emerald-500 font-bold flex items-center gap-2 mb-4"><CheckCircle2/> Blobs Cached (Offline Ready)</h3>
                <ul className="space-y-2">
                  {data.cached_models.map(m => (
                    <li key={m} className="font-mono text-slate-300 bg-slate-900 px-4 py-2 rounded-lg text-sm border border-slate-800">{m}</li>
                  ))}
                </ul>
              </div>
           </div>
        )}

        {!loading && data && activeTab === 'federated' && (
           <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="p-6 rounded-full bg-indigo-500/20"><Network size={48} className="text-indigo-400" /></div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Federated Learning Node</h2>
                  <p className="text-slate-400 text-lg mt-1">Preserving privacy via localized device level training.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                 <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-indigo-500">
                   <p className="text-slate-400 uppercase text-sm mb-1 font-bold">Client ID</p>
                   <p className="text-white font-mono break-all">{data.client}</p>
                 </div>
                 <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-emerald-500">
                   <p className="text-slate-400 uppercase text-sm mb-1 font-bold">Samples Trained</p>
                   <p className="text-2xl font-bold text-emerald-400">142 Local Inputs</p>
                 </div>
                 <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-500">
                   <p className="text-slate-400 uppercase text-sm mb-1 font-bold">Tokens Earned</p>
                   <p className="text-2xl font-bold text-yellow-400">{data.reward_tokens_earned} $K-Token</p>
                 </div>
              </div>
              
              <div className="mt-8 p-6 border border-slate-700 rounded-xl text-center bg-slate-800/50">
                {data.differential_privacy_noise_added && <p className="text-indigo-400 font-bold flex items-center justify-center gap-2"><CheckCircle2/> Differential Privacy noise successfully injected before gradient transmission.</p>}
                <p className="text-slate-500 text-sm mt-2">Global Master Algorithm Version: {data.global_model_version}</p>
              </div>
           </div>
        )}

        {!loading && data && activeTab === 'bandwidth' && (
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl font-bold text-white">Adaptive Packet Engine</h2>
                 <p className="text-slate-400">Constantly monitoring connection parameters to deploy fallback routing immediately.</p>
                 
                 <div className="space-y-4 py-4">
                   <div className="flex justify-between items-center text-lg p-4 bg-slate-800 rounded-xl">
                      <span className="text-slate-300">Measured Latency</span>
                      <span className="text-red-400 font-bold">{data.detected_latency_ms} ms</span>
                   </div>
                   <div className="flex justify-between items-center text-lg p-4 bg-slate-800 rounded-xl">
                      <span className="text-slate-300">Detected Downlink</span>
                      <span className="text-yellow-400 font-bold">{data.detected_bandwidth} Mbps</span>
                   </div>
                 </div>
                 
                 <div className="bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-xl">
                   <p className="text-cyan-400 text-sm uppercase tracking-widest font-bold mb-2">Live Delivery Profile Shifting</p>
                   <p className="text-2xl font-bold text-white">{data.assigned_delivery_profile}</p>
                 </div>
              </div>
              
              <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={syncData}>
                     <defs>
                       <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                     <Area type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        )}
      </motion.div>
    </div>
  );
}
