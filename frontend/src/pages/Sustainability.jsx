import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, Sun, RotateCcw, Sprout, CircleDollarSign, Fingerprint, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function SustainabilityDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('water');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulated Farmer Profile logic
  const profile = { crop: 'Wheat', acres: 5, farming_type: 'chemical', soil: 'Black', yield_kg: 2000, diesel_liters: 120, pump_hp: 5 };

  const fetchEnvData = async (endpoint, payload) => {
    setLoading(true);
    try {
      let res;
      if (payload) {
         res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/environment/${endpoint}`, payload);
      } else {
         res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/environment/${endpoint}`);
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
    if (activeTab === 'water') {
      fetchEnvData(`water-footprint?crop=${profile.crop}&yield_kg=${profile.yield_kg}`);
    } else if (activeTab === 'carbon') {
      fetchEnvData(`sustainability-audit`, { crop: profile.crop, acres: profile.acres, farming_type: profile.farming_type });
    } else if (activeTab === 'rotation') {
      fetchEnvData(`crop-rotation?current_crop=${profile.crop}&soil_type=${profile.soil}`);
    } else if (activeTab === 'solar') {
      fetchEnvData(`solar-roi?diesel_liters_per_month=${profile.diesel_liters}&pump_hp=${profile.pump_hp}`);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'water', label: 'Water Footprint', icon: Droplets },
    { id: 'carbon', label: 'Carbon & Profit Audit', icon: Leaf },
    { id: 'rotation', label: 'Crop Rotation', icon: RotateCcw },
    { id: 'solar', label: 'Solar Pump ROI', icon: Sun },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-600 bg-clip-text text-transparent">
          {t('Sustainability & Ecology')}
        </h1>
        <div className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm border border-teal-500/30 flex items-center gap-2">
          <Fingerprint size={16}/> Eco-Footprint Active
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)] border-teal-500/50 text-teal-400'
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
            <div className="flex flex-col items-center justify-center h-64 text-teal-400 space-y-4">
               <Loader2 size={48} className="animate-spin" />
               <p className="font-medium animate-pulse">Calculating Ecological Matrices...</p>
            </div>
          )}

          {!loading && data && activeTab === 'water' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-full aspect-square border-4 border-slate-800 shadow-[inset_0_0_50px_rgba(59,130,246,0.1)]">
                 <Droplets size={64} className="text-blue-400 mb-4" />
                 <p className="text-4xl font-black text-white">{data.water_intensity_liters_per_kg}</p>
                 <p className="text-blue-400 font-medium">Liters per Kg of {data.crop}</p>
               </div>
               <div className="space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Total Water Footprint</h2>
                   <p className="text-5xl font-black text-blue-500">{data.total_water_footprint_liters.toLocaleString()} <span className="text-xl text-slate-400">Liters Current Season</span></p>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-800 border border-slate-700 rounded-xl">
                   <span className="text-slate-400">Sustainability Score</span>
                   <span className={`font-bold text-lg ${data.sustainability_score_1_to_100 > 60 ? 'text-green-400' : 'text-red-400'}`}>
                     {data.sustainability_score_1_to_100} / 100 ({data.comparison_to_average})
                   </span>
                 </div>
                 <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                   <p className="text-blue-400 font-semibold">{data.recommendation}</p>
                 </div>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'carbon' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Leaf size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-bold text-emerald-400">Carbon Sequestration</h3>
                  </div>
                  <div className="text-4xl font-black text-white mb-2">{data.carbon_credits_earned_tco2} <span className="text-lg text-slate-400 font-normal">tCO2 Sequestered</span></div>
                  <div className="text-xl text-emerald-300">Potential Revenue: ₹{data.potential_carbon_revenue_inr.toLocaleString()}</div>
                  <p className="text-sm text-slate-400 mt-4">Soil Trajectory: <span className="text-white">{data.soil_health_trajectory}</span></p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <CircleDollarSign size={24} className="text-teal-400" />
                    <h3 className="text-xl font-bold text-teal-400">Economic Audit</h3>
                  </div>
                  <p className="text-slate-400 mb-2">Comparing Conventional vs Alternative ({data.comparative_economics.alternative_method_name}) Approach</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart layout="vertical" data={[
                      { name: 'Current Method', profit: data.comparative_economics.projected_profit_current_method },
                      { name: 'Alternative Method', profit: data.comparative_economics.projected_profit_alternative_method }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155"/>
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis type="category" dataKey="name" width={120} stroke="#94a3b8" />
                      <Tooltip contentStyle={{backgroundColor: '#1e293b', border:'none'}}/>
                      <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                        <Cell fill="#ef4444" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {!loading && data && activeTab === 'rotation' && (
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
               <RotateCcw size={64} className="text-teal-400 mb-4" />
               <div className="text-center">
                 <h2 className="text-2xl font-bold text-white mb-2">Intelligent Crop Rotation</h2>
                 <p className="text-slate-400 text-lg">After harvesting {data.current_crop}, plant:</p>
                 <div className="text-4xl font-black text-teal-400 my-4 bg-teal-500/10 px-8 py-4 rounded-2xl border border-teal-500/20 inline-block">
                   {data.recommended_next_crop}
                 </div>
                 <p className="text-slate-300">Or alternative: {data.alternative_crop}</p>
               </div>
               <div className="grid grid-cols-3 gap-6 max-w-3xl w-full mt-8">
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center">
                   <p className="text-slate-400 text-sm">Nitrogen Fixed</p>
                   <p className="text-2xl font-bold text-white">{data.nitrogen_fixed_kg_per_acre} kg/ac</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center">
                   <p className="text-slate-400 text-sm">Pest Cycle</p>
                   <p className="text-2xl font-bold text-white">{data.pest_cycle_broken ? 'Broken' : 'Continuous'}</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center">
                   <p className="text-slate-400 text-sm">Disease Suppression</p>
                   <p className="text-2xl font-bold text-white">{data.disease_suppression_rating}</p>
                 </div>
               </div>
               <p className="text-green-400 italic mt-4">{data.soil_biome_benefit}</p>
            </div>
          )}

          {!loading && data && activeTab === 'solar' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-amber-400 mb-2 flex items-center gap-3"><Sun size={32}/> Solar Pump ROI</h2>
                   <p className="text-slate-300">Based on a {profile.pump_hp} HP pump replacing diesel.</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl">
                     <span className="text-slate-400">Current Monthly Diesel</span>
                     <span className="text-red-400 font-bold">₹{data.current_monthly_diesel_cost_inr.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl">
                     <span className="text-slate-400">Est. Solar System Cost</span>
                     <span className="text-slate-300 font-bold line-through opacity-50">₹{data.gross_solar_system_cost_inr.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl">
                     <span className="text-amber-400 font-bold">Net Cost (PM-KUSUM Subsidy)</span>
                     <span className="text-amber-400 font-bold text-xl">₹{data.net_cost_after_pm_kusum_subsidy_inr.toLocaleString()}</span>
                   </div>
                 </div>
               </div>
               
               <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center space-y-4">
                 <p className="text-slate-400">System Break-Even Point</p>
                 <p className="text-6xl font-black text-white">{data.break_even_time_months} <span className="text-2xl text-slate-400 font-medium">Months</span></p>
                 <div className="w-full h-px bg-slate-700 my-4"></div>
                 <p className="text-slate-400">Annual CO2 Saved</p>
                 <p className="text-3xl font-bold text-green-400">{data.co2_emissions_saved_kg_per_year} kg</p>
                 <p className="text-amber-400 font-bold mt-4">{data.recommendation}</p>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
