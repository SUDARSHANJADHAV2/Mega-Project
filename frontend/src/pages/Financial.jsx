import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ShieldCheck, Globe, Users, FileText, IndianRupee, PieChart, Landmark, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart as RePieChart, Pie } from 'recharts';

export default function FinancialDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('emi');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulated State for inputs (could use forms for production)
  const profile = { crop: 'Wheat', acres: 5, state: 'MH', gender: 'male', category: 'small', sum_insured: 30000 };

  const fetchFinData = async (endpoint, payload) => {
    setLoading(true);
    try {
      let res;
      if (payload) {
         res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/financial/${endpoint}`, payload);
      } else {
         res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/financial/${endpoint}`);
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
    if (activeTab === 'emi') {
      fetchFinData(`emi?principal=200000&rate_annual_percent=7.0&tenure_months=36`);
    } else if (activeTab === 'insurance') {
      fetchFinData(`insurance-premium?crop=${profile.crop}&sum_insured_per_acre=${profile.sum_insured}&acres=${profile.acres}`);
    } else if (activeTab === 'forex') {
      fetchFinData(`export-forex?commodity=${profile.crop}&quantity_tons=10`);
    } else if (activeTab === 'subsidy') {
      fetchFinData(`subsidy-eligibility`, { category: profile.category, gender: profile.gender, state: profile.state, equipment_type: 'tractor' });
    } else if (activeTab === 'fpo') {
      fetchFinData(`fpo-savings?input_type=DAP_Fertilizer&qty_individual=20&fpo_size=150`);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'emi', label: 'Loan EMI (KCC)', icon: Calculator },
    { id: 'insurance', label: 'PMFBY Insurance', icon: ShieldCheck },
    { id: 'forex', label: 'Export Forex', icon: Globe },
    { id: 'subsidy', label: 'Subsidy Screener', icon: Landmark },
    { id: 'fpo', label: 'FPO Group Savings', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          {t('Fintech & Market Tools')}
        </h1>
        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm border border-yellow-500/30 flex items-center gap-2">
          <IndianRupee size={16}/> Live Financials
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] border-yellow-500/50 text-yellow-400'
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
            <div className="flex flex-col items-center justify-center h-64 text-yellow-500 space-y-4">
               <Loader2 size={48} className="animate-spin" />
               <p className="font-medium animate-pulse">Running Financial Engine...</p>
            </div>
          )}

          {!loading && data && activeTab === 'emi' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white mb-2">Amortization Details</h2>
                   <p className="text-slate-400">Based on ₹2,00,000 at 7% p.a over 36 Months</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                     <p className="text-slate-400 text-sm">Monthly EMI</p>
                     <p className="text-2xl font-bold text-white">₹{data.monthly_emi.toLocaleString()}</p>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                     <p className="text-slate-400 text-sm">Total Interest</p>
                     <p className="text-2xl font-bold text-red-400">₹{data.total_interest_paid.toLocaleString()}</p>
                   </div>
                 </div>
                 {data.kcc_interest_subvention_eligible && (
                   <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                     <p className="text-green-400 font-bold mb-1">Eligible for 3% Interest Subvention</p>
                     <p className="text-slate-300">Your effective interest rate will drop to <span className="font-bold text-white">{data.kcc_effective_rate_if_prompt}%</span> if you repay promptly.</p>
                   </div>
                 )}
               </div>
               
               <div className="h-64 flex flex-col items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                     <Pie data={[
                       { name: 'Principal', value: data.principal, color: '#3b82f6' },
                       { name: 'Interest', value: data.total_interest_paid, color: '#ef4444' }
                     ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                       { [0,1].map((entry, index) => <Cell key={`cell-${index}`} fill={['#3b82f6','#ef4444'][index]} />) }
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}/>
                   </RePieChart>
                 </ResponsiveContainer>
               </div>
            </div>
          )}

          {!loading && data && activeTab === 'insurance' && (
             <div className="space-y-8">
               <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3"><ShieldCheck size={32} className="text-blue-500"/> PMFBY Estimator</h2>
                    <p className="text-slate-400 mt-2">Crop: {data.crop} ({data.season_type}) | Area: {profile.acres} Acres</p>
                  </div>
                  <div className="text-right bg-slate-900 px-6 py-4 rounded-2xl border border-white/5 shadow-xl">
                    <p className="text-slate-400 text-sm uppercase tracking-wide">Farmer Premium Rate</p>
                    <p className="text-4xl font-black text-blue-500 mt-1">{data.farmer_premium_rate_percent}%</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 max-w-2xl">
                 <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col justify-center">
                   <p className="text-slate-400 mb-1">Total Sum Insured Coverage</p>
                   <p className="text-3xl font-bold text-emerald-400">₹{data.total_sum_insured_inr.toLocaleString()}</p>
                 </div>
                 <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-center">
                   <p className="text-blue-400 mb-1">Your Estimated Premium</p>
                   <p className="text-3xl font-bold text-white">₹{data.estimated_farmer_premium_inr.toLocaleString()}</p>
                 </div>
               </div>
               
               <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl max-w-2xl text-slate-300">
                 <p className="mb-2">💡 <span className="text-white font-semibold">Subsidy Allocation:</span> {data.government_subsidy_share}</p>
                 <p className="text-red-400 flex items-center gap-2"><Globe size={16}/> {data.deadline_warning}</p>
               </div>
             </div>
          )}

          {!loading && data && activeTab === 'forex' && (
             <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-full aspect-square border-4 border-slate-800">
                 <Globe size={64} className="text-indigo-400 mb-4" />
                 <p className="text-4xl font-black text-white">${data.export_price_usd_per_ton}</p>
                 <p className="text-indigo-400 font-medium">USD per Ton ({data.commodity})</p>
               </div>
               <div className="space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Export Revenue Scenario</h2>
                   <p className="text-slate-400">Assuming sale of 10 tons of {data.commodity}. Exchange USD/INR: ₹{data.current_usd_inr_rate}</p>
                 </div>
                 <div className="space-y-3">
                   <div className="flex justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl">
                     <span className="text-slate-400">Domestic Wholesale Return</span>
                     <span className="text-slate-300 font-bold">₹{data.domestic_equivalence_inr.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between p-4 bg-indigo-500/20 border border-indigo-500/40 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                     <span className="text-indigo-400 font-bold">Projected Export Revenue</span>
                     <span className="text-white font-bold text-xl">₹{data.projected_gross_export_revenue_inr.toLocaleString()}</span>
                   </div>
                 </div>
                 <p className="text-green-400 font-bold bg-green-500/10 p-4 rounded-xl">Exporting yields a {data.export_premium_advantage_percent}% profit premium over local mandis.</p>
               </div>
             </div>
          )}

          {!loading && data && activeTab === 'subsidy' && (
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Landmark size={32} className="text-yellow-500" />
                  <h2 className="text-2xl font-bold text-white">Algorithmic Subsidy Screener</h2>
                </div>
                <p className="text-slate-400">Matching schemes for Category: {profile.category}, Gender: {profile.gender}, State: {profile.state}. Intended purchase: Tractor.</p>
                
                <div className="space-y-3 mt-4">
                  {data.eligible_schemes.map((scheme, i) => (
                    <div key={i} className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium flex items-start gap-4">
                       <span className="bg-yellow-500/20 text-yellow-500 w-8 h-8 rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                       <span className="pt-1">{scheme}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                  <a href={data.recommended_portal_application} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2">
                    Access Official Application Portal <Globe size={16}/>
                  </a>
                </div>
             </div>
          )}

          {!loading && data && activeTab === 'fpo' && (
             <div className="text-center space-y-8 py-8">
                <h2 className="text-3xl font-bold text-white">Farmer Producer Organization (FPO) Synergy</h2>
                <div className="flex justify-center items-center gap-8">
                   <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl opacity-60">
                     <p className="text-slate-400 mb-2">Solo Retail Cost</p>
                     <p className="text-4xl font-bold text-slate-300">₹{data.individual_retail_cost_inr.toLocaleString()}</p>
                   </div>
                   <div className="text-slate-500 font-bold text-2xl">VS</div>
                   <div className="bg-cyan-500/10 p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] transform scale-105">
                     <p className="text-cyan-400 mb-2 font-bold">{data.syndicate_strength} Collective Unit Cost</p>
                     <p className="text-5xl font-black text-white">₹{data.fpo_wholesale_unit_cost_inr.toLocaleString()}</p>
                   </div>
                </div>
                
                <div className="max-w-2xl mx-auto bg-slate-900 border border-white/5 rounded-2xl p-6 flex justify-between items-center text-left">
                  <div>
                    <p className="text-slate-400">Total Capital Saved Per Farmer</p>
                    <p className="text-3xl font-bold text-green-400">₹{data.direct_savings_per_farmer_inr.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Volume Discount Acquired</p>
                    <p className="text-3xl font-bold text-white">{data.volume_discount_achieved_percent}%</p>
                  </div>
                </div>
             </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
