import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ThermometerSnowflake, Droplets, CloudLightning, Sunrise, Tractor, Sprout, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ForecastDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('price');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const profile = { lat: 20.59, lon: 78.96, crop: 'Wheat', state: 'Maharashtra', variety: 'Lokwan' };

  const fetchForecast = async (endpoint, payload) => {
    setLoading(true);
    try {
      let res;
      if (payload) {
         res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/forecast/${endpoint}`, payload);
      } else {
         res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/forecast/${endpoint}`);
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
    if (activeTab === 'price') fetchForecast(`price?crop=${profile.crop}&days_ahead=90`);
    if (activeTab === 'gdd') fetchForecast(`gdd?crop=${profile.crop}&sowing_date=2023-11-15&lat=${profile.lat}&lon=${profile.lon}`);
    if (activeTab === 'enso') fetchForecast(`enso-impact?state=${profile.state}&crop=${profile.crop}&season=Rabi`);
    if (activeTab === 'frost') fetchForecast(`frost-dates?lat=${profile.lat}&lon=${profile.lon}&crop=${profile.crop}`);
    if (activeTab === 'chill') fetchForecast(`chill-hours?lat=${profile.lat}&lon=${profile.lon}&variety=${profile.variety}`);
    if (activeTab === 'monsoon') fetchForecast(`monsoon?state=${profile.state}&year=${new Date().getFullYear()}`);
    if (activeTab === 'demand') fetchForecast(`demand`, { crop: profile.crop, state: profile.state, target_date: '2024-05-01' });
  }, [activeTab]);

  const tabs = [
    { id: 'price', label: 'Price Forecast', icon: TrendingUp },
    { id: 'demand', label: 'Demand Index', icon: TrendingUp },
    { id: 'gdd', label: 'Growing Degree Days', icon: Sprout },
    { id: 'enso', label: 'El Niño Predictor', icon: CloudLightning },
    { id: 'monsoon', label: 'Monsoon Tracker', icon: Droplets },
    { id: 'frost', label: 'Frost Risk', icon: ThermometerSnowflake },
    { id: 'chill', label: 'Chill Hours', icon: Sunrise },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-600 bg-clip-text text-transparent">
          {t('Predictive Intelligence')}
        </h1>
        <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
          Target Crop: <span className="font-bold text-white">{profile.crop}</span>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)] border-violet-500/50 text-violet-400'
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
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-violet-400 space-y-4">
               <Loader2 size={48} className="animate-spin" />
               <p className="font-medium animate-pulse">Running Time-Series Analysis...</p>
            </div>
          )}

          {!loading && data && activeTab === 'price' && (
            <div className="space-y-6">
               <div className="flex justify-between items-end mb-4">
                 <div>
                    <h2 className="text-2xl font-bold text-white">90-Day Price Trajectory</h2>
                    <p className="text-slate-400">Mathematical FFT proxy modeling for {data.crop}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-slate-400">Current MSP</p>
                    <p className="text-2xl font-bold text-emerald-400">₹{data.current_msp}/Qtl</p>
                 </div>
               </div>
               
               <ResponsiveContainer width="100%" height={300}>
                 <AreaChart data={data.forecast}>
                   <defs>
                     <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickFormatter={(t) => t.substring(5)} />
                   <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                     labelStyle={{ color: '#94a3b8' }}
                     itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                   />
                   <Area type="monotone" dataKey="predicted_price" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                 </AreaChart>
               </ResponsiveContainer>

               <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                   <h3 className="text-sm font-semibold text-violet-400 mb-1">Optimal Selling Window</h3>
                   <div className="text-xl font-bold text-white">{data.optimal_sell_window.start_date} to {data.optimal_sell_window.end_date}</div>
                   <p className="text-slate-300 mt-1">Expected Peak: ₹{data.optimal_sell_window.expected_price}/Qtl</p>
                 </div>
                 <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl relative overflow-hidden">
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
                   <h3 className="text-sm font-semibold text-slate-400 mb-1">Algorithmic Recommendation</h3>
                   <p className="text-white text-lg">{data.recommendation}</p>
                 </div>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'gdd' && (
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8">
               <div className="relative w-48 h-48 rounded-full border-[12px] border-slate-700 flex items-center justify-center shadow-2xl">
                 <div 
                   className="absolute inset-[-12px] rounded-full border-[12px] border-green-500 transition-all duration-1000" 
                   style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - ((data.current_gdd/1500)*100)}%, 0 ${100 - ((data.current_gdd/1500)*100)}%)` }}
                 />
                 <div className="text-center">
                   <div className="text-4xl font-black text-white">{data.current_gdd}</div>
                   <div className="text-xs text-slate-400">Total GDD</div>
                 </div>
               </div>
               <div className="space-y-4 flex-1">
                 <h2 className="text-3xl font-bold text-white">Crop Phenology Tracker</h2>
                 <p className="text-slate-300 text-lg">Current Stage: <span className="text-green-400 font-bold">{data.current_stage}</span></p>
                 <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                   <div className="flex justify-between mb-2">
                     <span className="text-slate-400">Next Stage: {data.next_stage}</span>
                     <span className="text-white font-bold">{data.next_stage_in_days} Days</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                   </div>
                 </div>
                 <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl inline-block mt-4">
                   <span className="text-green-400">Estimated Harvest: </span><span className="text-white font-bold">{data.estimated_maturity_date}</span>
                 </div>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'enso' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Macro-Climate: ENSO Simulator</h2>
                <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-bold">
                  Phase: {data.current_enso_phase} (ONI: {data.oni_value})
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                   <CloudLightning size={48} className="text-amber-400 mb-4" />
                   <p className="text-slate-400 text-sm">Monsoon Deviation</p>
                   <p className="text-3xl font-black text-white">{data.expected_monsoon_deviation_percent}%</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                   <Droplets size={48} className="text-red-400 mb-4" />
                   <p className="text-slate-400 text-sm">Drought Probability</p>
                   <p className="text-3xl font-black text-white">{data.probability_of_below_normal_rainfall * 100}%</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                   <Tractor size={48} className="text-blue-400 mb-4" />
                   <p className="text-slate-400 text-sm">Crop Risk Level</p>
                   <p className="text-3xl font-black text-white">{data.crop_risk_level}</p>
                </div>
              </div>
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                 <h3 className="font-bold text-amber-400 mb-2">Prescriptive Actions against El Niño</h3>
                 <ul className="list-disc pl-5 text-slate-300 space-y-2">
                   {data.recommendations.map((r,i) => <li key={i}>{r}</li>)}
                 </ul>
              </div>
            </div>
          )}

          {!loading && data && !['price', 'gdd', 'enso'].includes(activeTab) && (
            <div className="space-y-4">
               <h2 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')} Analysis</h2>
               {Object.entries(data).map(([k,v]) => {
                 if(typeof v === 'object') return null;
                 return (
                   <div key={k} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5">
                     <span className="text-slate-400 capitalize">{k.replace(/_/g, ' ')}</span>
                     <span className="text-white font-bold">{v}</span>
                   </div>
                 )
               })}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
