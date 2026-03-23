import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Map as MapIcon, CloudRain, ThermometerSun, Droplets, Trees, Maximize, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SatelliteDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ndvi');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ lat: 20.5937, lon: 78.9629, crop: 'Wheat' });
  
  // States for features
  const [ndvi, setNdvi] = useState(null);
  const [climateRisk, setClimateRisk] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [lst, setLst] = useState(null);
  const [canopy, setCanopy] = useState(null);

  useEffect(() => {
    // Attempt to load profile coordinates
    const stored = localStorage.getItem('krushiai_farmer_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.lat && parsed.lon) setProfile(parsed);
      } catch(e) {}
    }
  }, []);

  const fetchSatelliteData = async (endpoint, setter, extraParams = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/satellite/${endpoint}?lat=${profile.lat}&lon=${profile.lon}${extraParams}`);
      setter(res.data);
    } catch (e) {
      console.error("Satellite fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ndvi' && !ndvi) fetchSatelliteData(`ndvi`, setNdvi, `&date_from=2023-01-01&date_to=2023-01-31`);
    if (activeTab === 'climate' && !climateRisk) fetchSatelliteData(`climate-risk`, setClimateRisk, `&crop=${profile.crop}`);
    if (activeTab === 'moisture' && !soilMoisture) fetchSatelliteData(`soil-moisture`, setSoilMoisture);
    if (activeTab === 'temperature' && !lst) fetchSatelliteData(`land-temperature`, setLst);
    if (activeTab === 'canopy' && !canopy) fetchSatelliteData(`canopy-cover`, setCanopy);
  }, [activeTab]);

  const tabs = [
    { id: 'ndvi', label: 'NDVI Stress', icon: Activity },
    { id: 'climate', label: 'Flood & Drought', icon: CloudRain },
    { id: 'moisture', label: 'Soil Moisture (SMAP)', icon: Droplets },
    { id: 'temperature', label: 'LST Heatmap', icon: ThermometerSun },
    { id: 'canopy', label: 'Canopy Carbon', icon: Trees },
    { id: 'boundary', label: 'Field Boundary', icon: Maximize },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          {t('Satellite Intelligence')}
        </h1>
        <div className="text-sm font-medium text-slate-400 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
           <MapIcon size={16}/> {profile.lat.toFixed(4)}, {profile.lon.toFixed(4)}
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-500/50 text-emerald-400'
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
          {loading && <div className="text-emerald-400 animate-pulse">Establishing Satellite Uplink...</div>}
          
          {/* NDVI Tab */}
          {!loading && activeTab === 'ndvi' && ndvi && (
            <div className="grid md:grid-cols-2 gap-6">
               <div className="h-64 bg-slate-900 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                 {/* Visual proxy for NDVI gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 opacity-20 MixBlendMode-overlay" />
                 <Target size={48} className="text-emerald-500/50 mb-2"/>
                 <span className="text-slate-400 font-mono text-sm leading-relaxed">COPERNICUS SENTINEL-2 L2A<br/>RESOLUTION: 10m<br/>LAT: {profile.lat}<br/>LON: {profile.lon}</span>
               </div>
               <div className="space-y-4">
                 <h2 className="text-xl font-bold text-white">Vegetation Index (NDVI)</h2>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900/50 p-4 rounded-xl">
                     <div className="text-sm text-slate-400">Mean NDVI</div>
                     <div className="text-3xl font-bold text-emerald-400">{ndvi.ndvi_mean}</div>
                   </div>
                   <div className="bg-slate-900/50 p-4 rounded-xl">
                     <div className="text-sm text-slate-400">Stressed Area</div>
                     <div className="text-3xl font-bold text-amber-400">{ndvi.stressed_area_percent}%</div>
                   </div>
                 </div>
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                   <h3 className="text-sm font-semibold text-emerald-400 mb-2">Agronomist Recommendations</h3>
                   <ul className="list-disc pl-4 text-sm text-slate-300 space-y-1">
                     {ndvi.recommendations.map((r,i) => <li key={i}>{r}</li>)}
                   </ul>
                 </div>
               </div>
            </div>
          )}

          {/* Climate Risk Tab */}
          {!loading && activeTab === 'climate' && climateRisk && (
            <div className="space-y-6">
               <div className="flex gap-4 items-center">
                 <div className={`px-4 py-2 rounded-lg font-bold ${climateRisk.drought_risk === 'Severe' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                   Drought Risk: {climateRisk.drought_risk} (PDSI {climateRisk.pdsi_estimate})
                 </div>
                 <div className="px-4 py-2 rounded-lg font-bold bg-blue-500/20 text-blue-400">
                   Flood Frequency: {climateRisk.flood_frequency_per_decade} / decade
                 </div>
               </div>
               <p className="text-slate-300 text-lg">{climateRisk.crop_climate_suitability}</p>
               <div className="p-4 bg-slate-900/50 rounded-xl">
                   <h3 className="text-sm font-semibold text-white mb-2">Historical Drought Years in this Region</h3>
                   <div className="flex gap-2">
                     {climateRisk.historical_drought_years.map(y => (
                       <span key={y} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-sm font-mono">{y}</span>
                     ))}
                   </div>
               </div>
            </div>
          )}

          {/* Soil Moisture Tab */}
          {!loading && activeTab === 'moisture' && soilMoisture && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
               <div className="flex flex-col items-center">
                 <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-700 flex items-center justify-center">
                   <div 
                     className="absolute inset-[-16px] rounded-full border-[16px] border-blue-500 transition-all duration-1000" 
                     style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - (soilMoisture.soil_moisture_m3_per_m3 * 100)}%, 0 ${100 - (soilMoisture.soil_moisture_m3_per_m3 * 100)}%)` }}
                   />
                   <div className="text-center z-10">
                     <Droplets size={32} className="mx-auto text-blue-400 mb-2"/>
                     <div className="text-3xl font-bold text-white">{soilMoisture.soil_moisture_m3_per_m3}</div>
                     <div className="text-xs text-slate-400">m³/m³ SMAP Value</div>
                   </div>
                 </div>
               </div>
               <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-white">Root Zone Wetness</h3>
                 <p className="text-slate-300">Days since last significant rain: <span className="font-bold text-amber-400">{soilMoisture.days_since_last_rain} days</span></p>
                 <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="font-semibold text-blue-400 uppercase tracking-wide text-sm mb-1">Recommendation</div>
                    <div className="text-slate-200 text-lg">
                      Irrigation Urgency is <b>{soilMoisture.irrigation_urgency}</b>. 
                      {soilMoisture.recommended_irrigation_mm > 0 && ` Apply ${soilMoisture.recommended_irrigation_mm}mm of water within 48 hours.`}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Canopy Tab */}
          {!loading && activeTab === 'canopy' && canopy && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Vegetative Land Cover Classification</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={[
                    { name: 'Tree Canopy', value: canopy.canopy_cover_percent, color: '#10b981' },
                    { name: 'Crop Cover', value: canopy.crop_cover_percent, color: '#3b82f6' },
                    { name: 'Bare Soil', value: canopy.bare_soil_percent, color: '#f59e0b' }
                  ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                    { [0,1,2].map((entry, index) => <Cell key={`cell-${index}`} fill={['#10b981','#3b82f6','#f59e0b'][index]} />) }
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trees size={64} />
                </div>
                <h3 className="font-bold text-emerald-400 mb-2">Carbon Credit Estimation</h3>
                <p className="text-slate-300 text-lg">Your farm's permanent canopy sequesters approx <span className="text-white font-bold">{canopy.carbon_sequestration_estimate_tCO2} tCO2/year</span>.</p>
                <p className="text-slate-400 mt-2">{canopy.recommendation}</p>
              </div>
            </div>
          )}

          {/* Fallback info for remaining tabs */}
          {(!['ndvi','climate','moisture','canopy'].includes(activeTab)) && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <Maximize size={48} className="mb-4 opacity-50"/>
               <p>Leaflet and Turf.js components are actively initializing...</p>
               <p className="text-sm mt-2 opacity-50">Experimental Geofencing features in development.</p>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
