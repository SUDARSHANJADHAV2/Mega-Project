import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sprout, Bug, ThermometerSun, Gamepad2, GraduationCap, Loader2 } from 'lucide-react';

export default function EducationSimulator() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('soil');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // States for interactive simulators
  const [soil, setSoil] = useState({ ph: 6.5, nitrogen: 50, moisture: 40 });
  const [climate, setClimate] = useState({ tempRise: 1.5 });
  
  const [quizState, setQuizState] = useState({ questions: [], currentIdx: 0, score: 0, showResult: false });

  const fetchEduData = async (endpoint) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/education/${endpoint}`);
      setData(res.data);
      if(endpoint.includes('quiz')) {
         setQuizState({ questions: res.data.questions, currentIdx: 0, score: 0, showResult: false });
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(null);
    if (activeTab === 'soil') {
      fetchEduData(`soil-simulator?ph=${soil.ph}&nitrogen=${soil.nitrogen}&moisture=${soil.moisture}&crop=wheat`);
    } else if (activeTab === 'pest') {
      fetchEduData(`pest-lifecycle?pest_name=fall_armyworm`);
    } else if (activeTab === 'climate') {
      fetchEduData(`climate-simulator?crop=wheat&temp_increase_celsius=${climate.tempRise}`);
    } else if (activeTab === 'quiz') {
      fetchEduData(`generate-quiz`);
    }
  }, [activeTab, soil, climate.tempRise]);

  const handleQuizAnswer = (idx) => {
     const currentQ = quizState.questions[quizState.currentIdx];
     const isCorrect = idx === currentQ.correct_index;
     
     if(isCorrect) setQuizState(prev => ({...prev, score: prev.score + 1}));
     
     if(quizState.currentIdx < quizState.questions.length - 1) {
         setQuizState(prev => ({...prev, currentIdx: prev.currentIdx + 1}));
     } else {
         setQuizState(prev => ({...prev, showResult: true}));
     }
  };

  const tabs = [
    { id: 'soil', label: 'Soil Sandbox', icon: Sprout },
    { id: 'pest', label: 'Pest Evolution', icon: Bug },
    { id: 'climate', label: 'Climate Yield', icon: ThermometerSun },
    { id: 'quiz', label: 'Agri-Quiz', icon: Gamepad2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
          <GraduationCap size={32} className="text-purple-500" /> {t('Interactive Science')}
        </h1>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] border-purple-500/50 text-purple-400'
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[400px]"
        >
          {loading && activeTab !== 'soil' && activeTab !== 'climate' && (
            <div className="flex flex-col items-center justify-center h-64 text-purple-500 space-y-4">
               <Loader2 size={48} className="animate-spin" />
            </div>
          )}

          {data && activeTab === 'soil' && (
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 bg-slate-900 border border-slate-700 p-6 rounded-2xl">
                   <h3 className="text-xl font-bold text-white mb-4">Adjust Global Parameters</h3>
                   
                   <div>
                     <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Soil pH Level</span><span className="text-purple-400 font-bold">{soil.ph}</span></div>
                     <input type="range" min="3" max="10" step="0.5" value={soil.ph} onChange={(e) => setSoil({...soil, ph: parseFloat(e.target.value)})} className="w-full accent-purple-500" />
                     <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Acidic</span><span>Alkaline</span></div>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Nitrogen (kg/ha)</span><span className="text-blue-400 font-bold">{soil.nitrogen}</span></div>
                     <input type="range" min="0" max="250" step="10" value={soil.nitrogen} onChange={(e) => setSoil({...soil, nitrogen: parseFloat(e.target.value)})} className="w-full accent-blue-500" />
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Volumetric Moisture %</span><span className="text-blue-400 font-bold">{soil.moisture}%</span></div>
                     <input type="range" min="0" max="100" step="5" value={soil.moisture} onChange={(e) => setSoil({...soil, moisture: parseFloat(e.target.value)})} className="w-full accent-cyan-500" />
                   </div>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                   <div className="relative w-48 h-48 flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="#334155" strokeWidth="16" fill="none" />
                       <circle cx="96" cy="96" r="88" stroke="#a855f7" strokeWidth="16" fill="none" strokeDasharray="552" strokeDashoffset={552 - (552 * Math.max(0, data.simulated_yield_capacity_percent) / 100)} className="transition-all duration-500" />
                     </svg>
                     <div className="z-10 text-center">
                       <span className="text-4xl font-black text-white">{data.simulated_yield_capacity_percent}%</span>
                       <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Yield Cap</p>
                     </div>
                   </div>
                   
                   <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-left w-full space-y-2">
                     <h4 className="text-purple-400 font-bold text-sm uppercase">Agronomic Feedback</h4>
                     {data.agronomic_feedback.map((f, i) => <p key={i} className="text-slate-300 text-sm">👉 {f}</p>)}
                   </div>
                </div>
             </div>
          )}

          {data && activeTab === 'pest' && (
             <div className="space-y-8 py-4">
               <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><Bug className="text-red-400"/> {data.pest} Lifecycle</h2>
                  <p className="text-slate-400">Total Lifecycle Duration: {data.total_lifecycle_days} Days</p>
               </div>
               
               <div className="grid md:grid-cols-4 gap-4">
                 {Object.entries(data.stages).map(([stage, info], idx) => (
                    <div key={stage} className={`p-4 rounded-xl border relative ${info.vulnerability === 'High' ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900 border-slate-700'}`}>
                       <div className="absolute -top-3 left-4 bg-slate-800 px-3 border border-slate-600 rounded-full text-xs font-bold text-slate-300">Phase {idx+1}</div>
                       <h3 className="text-xl font-bold text-white mt-2 capitalize">{stage}</h3>
                       <p className="text-xl font-light text-slate-400 mt-1">{info.days} Days</p>
                       <div className="mt-4 pt-4 border-t border-slate-800">
                         <p className="text-xs text-slate-500 uppercase font-bold mb-1">Vulnerability</p>
                         <p className={`font-bold mb-3 ${info.vulnerability === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>{info.vulnerability}</p>
                         <p className="text-sm text-slate-300">{info.control}</p>
                       </div>
                    </div>
                 ))}
               </div>
               
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold text-center">
                 💡 Key Learning: {data.key_learning}
               </div>
             </div>
          )}
          
          {data && activeTab === 'climate' && (
             <div className="flex flex-col items-center justify-center p-8 space-y-8">
                <ThermometerSun size={64} className="text-orange-500" />
                <div className="w-full max-w-xl space-y-4">
                   <div className="flex justify-between font-bold text-slate-300">
                     <span>Global Temp Rise: +{climate.tempRise.toFixed(1)}°C</span>
                     <span className={data.predicted_yield_impact_percent < 0 ? 'text-red-400' : 'text-green-400'}>{data.predicted_yield_impact_percent}% Yield</span>
                   </div>
                   <input type="range" min="0" max="4" step="0.1" value={climate.tempRise} onChange={(e) => setClimate({tempRise: parseFloat(e.target.value)})} className="w-full accent-orange-500" />
                   <div className="flex justify-between text-xs text-slate-500"><span>Pre-Industrial</span><span>+4.0°C Extreme</span></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 w-full mt-8">
                   <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-lg">
                      <h3 className="text-orange-400 font-bold mb-2 uppercase tracking-wider text-sm">Adaptation Strategy</h3>
                      <p className="text-slate-300">{data.adaptation_strategy}</p>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-lg">
                      <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-sm">Ecological Impact</h3>
                      <p className="text-slate-300">{data.carbon_feedback_loop}</p>
                   </div>
                </div>
             </div>
          )}

          {data && activeTab === 'quiz' && quizState.questions.length > 0 && (
            <div className="max-w-2xl mx-auto py-8">
               {!quizState.showResult ? (
                 <div className="space-y-6">
                    <div className="flex justify-between text-purple-400 font-bold mb-6">
                      <span>Quiz: {data.topic}</span>
                      <span>Q {quizState.currentIdx + 1} of {quizState.questions.length}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white leading-relaxed">
                      {quizState.questions[quizState.currentIdx].question}
                    </h2>
                    
                    <div className="space-y-3 mt-8">
                      {quizState.questions[quizState.currentIdx].options.map((opt, i) => (
                        <button key={i} onClick={() => handleQuizAnswer(i)} className="w-full text-left p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-xl text-white font-medium transition-colors">
                          <span className="inline-block w-8 text-slate-500">{String.fromCharCode(65+i)}.</span> {opt}
                        </button>
                      ))}
                    </div>
                 </div>
               ) : (
                 <div className="text-center space-y-6 py-12">
                    <div className="inline-block p-6 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <Gamepad2 size={64} className="text-purple-500" />
                    </div>
                    <h2 className="text-4xl font-black text-white">Quiz Completed!</h2>
                    <p className="text-2xl text-slate-300">Score: <span className="text-purple-400 font-bold">{quizState.score} / {quizState.questions.length}</span></p>
                    <button onClick={() => fetchEduData('generate-quiz')} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl mt-4">
                      Replay Academic Suite
                    </button>
                 </div>
               )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
