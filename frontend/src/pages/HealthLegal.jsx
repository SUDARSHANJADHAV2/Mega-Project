import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Cross, Scale, HeartPulse, ShieldCheck, Activity, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function HealthLegalDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('toxicity');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const stateInputs = {
     chemical: 'Monocrotophos', 
     hours: 20, 
     incident: 'snakebite', 
     legalTopic: 'tenant farmer msp', 
     debt: 'high', 
     cropFail: true, 
     sleep: 4.5
  };

  const fetchData = async (endpoint, payload) => {
    setLoading(true);
    try {
      let res;
      if (payload) {
         res = await axios.post(`http://localhost:8000/api/health/${endpoint}`, payload);
      } else {
         res = await axios.get(`http://localhost:8000/api/health/${endpoint}`);
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
    if (activeTab === 'toxicity') {
      fetchData(`pesticide-risk?chemical=${stateInputs.chemical}&hours_exposed_per_week=${stateInputs.hours}`);
    } else if (activeTab === 'firstaid') {
      fetchData(`first-aid?incident=${stateInputs.incident}`);
    } else if (activeTab === 'legal') {
      fetchData(`legal-advisory?topic=${stateInputs.legalTopic}`);
    } else if (activeTab === 'mental') {
      fetchData(`stress-audit`, { debt_burden: stateInputs.debt, recent_crop_failure: stateInputs.cropFail, sleep_hours: stateInputs.sleep, social_isolation: true });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'toxicity', label: 'Toxicity Risk Matrix', icon: ShieldAlert },
    { id: 'firstaid', label: 'Offline First-Aid', icon: Cross },
    { id: 'mental', label: 'Mental Wellness', icon: HeartPulse },
    { id: 'legal', label: 'Legal Counsel Bot', icon: Scale },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
          <Activity size={32} className="text-red-500" /> {t('Health, Safety & Rights')}
        </h1>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/50 text-red-500'
                : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[400px]"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-4">
               <Activity size={48} className="animate-spin" />
            </div>
          )}

          {!loading && data && activeTab === 'toxicity' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Pesticide Hazard Engine</h2>
                   <p className="text-slate-400 mb-6">Evaluating exposure to: <span className="text-white font-bold capitalize">{data.chemical_analyzed}</span></p>
                 </div>
                 <div className={`p-6 rounded-2xl border flex items-center justify-between ${data.hazard_classification.includes('RED') ? 'bg-red-500/10 border-red-500/40' : 'bg-yellow-500/10 border-yellow-500/40'}`}>
                    <div>
                      <p className="text-sm uppercase tracking-wider text-slate-400 mb-1">Hazard Class</p>
                      <p className={`text-2xl font-black ${data.hazard_classification.includes('RED') ? 'text-red-500' : 'text-yellow-500'}`}>{data.hazard_classification}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm uppercase tracking-wider text-slate-400 mb-1">Risk Score</p>
                      <p className="text-4xl font-black text-white">{data.cumulative_risk_score_1_to_10}<span className="text-lg text-slate-500">/10</span></p>
                    </div>
                 </div>
                 
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                   <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2"><ShieldCheck size={16}/> Mandatory PPE</h3>
                   <div className="flex flex-wrap gap-2">
                     {data.mandatory_ppe_requirements.map(ppe => (
                        <span key={ppe} className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm">{ppe}</span>
                     ))}
                   </div>
                 </div>
               </div>
               
               <div className="bg-slate-900 p-8 rounded-3xl border border-red-500/20 shadow-[inset_0_0_80px_rgba(239,68,68,0.05)]">
                 <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><ShieldAlert /> Acute Symptoms Guide</h3>
                 <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                   {data.acute_symptoms_to_monitor.map((s,i) => <li key={i}>{s}</li>)}
                 </ul>
                 <h3 className="text-orange-400 font-bold mb-2 uppercase text-sm tracking-widest">Immediate First Aid</h3>
                 <p className="text-slate-300 italic">"{data.first_aid}"</p>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'firstaid' && (
            <div className="flex flex-col items-center justify-center p-8 space-y-8">
               <Cross size={64} className="text-emerald-500" />
               <div className="text-center">
                 <h2 className="text-3xl font-bold text-white mb-2">Emergency Field Protocol</h2>
                 <div className="text-xl font-medium text-emerald-400 capitalize bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20 inline-block">{data.incident_type.replace('_',' ')}</div>
               </div>
               <div className="w-full max-w-3xl bg-slate-900 border-l-4 border-emerald-500 p-8 rounded-xl shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-4">Immediate Actions (Do's and Don'ts)</h3>
                 <ul className="space-y-4">
                   {data.immediate_action_steps.map((step, i) => (
                     <li key={i} className="flex gap-4 text-slate-300 text-lg">
                       <span className="text-emerald-500 font-black">{i+1}.</span>
                       <span dangerouslySetInnerHTML={{__html: step.replace('NOT', '<strong class="text-red-400">NOT</strong>')}} />
                     </li>
                   ))}
                 </ul>
                 <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center pr-4 text-slate-400">
                    <span>Emergency Hotline:</span>
                    <span className="font-bold text-2xl text-red-500 ml-4 bg-red-500/10 px-4 py-1 rounded-lg border border-red-500/20">{data.helpline}</span>
                 </div>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'legal' && (
             <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <div className="p-4 bg-amber-500/20 rounded-full text-amber-500"><Scale size={32}/></div>
                 <div>
                   <h2 className="text-2xl font-bold text-white">Farmer Rights Advisory</h2>
                   <p className="text-slate-400">Analyzing: {data.topic}</p>
                 </div>
               </div>
               
               <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-0"></div>
                 <h3 className="text-amber-400 font-bold mb-4 uppercase tracking-widest text-sm z-10 relative">Legal Position Summary</h3>
                 <p className="text-slate-200 text-lg leading-relaxed z-10 relative">"{data.legal_position_summary}"</p>
               </div>
               
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-2">Recommended Authority</p>
                    <p className="text-white font-medium">{data.recommended_authority}</p>
                 </div>
                 <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-2">Free Legal Aid Routing</p>
                    <p className="text-white font-medium">{data.free_legal_aid}</p>
                 </div>
               </div>
             </div>
          )}

          {!loading && data && activeTab === 'mental' && (
             <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="text-center md:text-left space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white flex items-center gap-3"><BrainCircuit size={32} className="text-pink-500"/> Stress Analyzer</h2>
                   <p className="text-slate-400 mt-2">Correlating environmental stressors, economic weight, and operational data.</p>
                 </div>
                 
                 <div className={`p-8 rounded-3xl border ${data.stress_index_score > 60 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                    <p className="text-5xl font-black mb-2">{data.stress_index_score} <span className="text-xl opacity-60">Index</span></p>
                    <p className="text-xl font-bold uppercase tracking-widest">{data.clinical_risk_category}</p>
                 </div>
                 
                 <p className="text-white bg-slate-900 p-6 rounded-2xl border border-white/10 leading-relaxed font-semibold">
                   {data.immediate_recommendation}
                 </p>
               </div>
               
               <div className="h-80 w-full flex justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                     { subject: 'Debt Stress', A: 90, fullMark: 100 },
                     { subject: 'Sleep Deficit', A: 85, fullMark: 100 },
                     { subject: 'Crop Anxiety', A: 70, fullMark: 100 },
                     { subject: 'Isolation', A: 60, fullMark: 100 },
                     { subject: 'Market Volatility', A: 80, fullMark: 100 },
                   ]}>
                     <PolarGrid stroke="#334155" />
                     <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 12}} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: 'transparent'}} axisLine={false} />
                     <Radar name="Stress Profile" dataKey="A" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.3} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
             </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
