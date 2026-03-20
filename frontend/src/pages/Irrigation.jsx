import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Loader2, ArrowRight } from 'lucide-react';
import api from '../api';

const IrrigationForecaster = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    temperature: '',
    humidity: '',
    irrigation_method: 'Drip',
    forecasted_rainfall_mm: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/api/predict-irrigation', {
        crop: formData.crop,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        irrigation_method: formData.irrigation_method,
        forecasted_rainfall_mm: parseFloat(formData.forecasted_rainfall_mm)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="container" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Droplets color="#3b82f6" /> Irrigation Forecaster
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Calculate the exact amount of water needed for your crops today based on climate conditions.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Crop</label>
              <select className="form-select" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})}>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input type="number" className="form-input" placeholder="e.g. 30" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} required step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Humidity (%)</label>
              <input type="number" className="form-input" placeholder="e.g. 60" value={formData.humidity} onChange={e => setFormData({...formData, humidity: e.target.value})} required step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Irrigation Method</label>
              <select className="form-select" value={formData.irrigation_method} onChange={e => setFormData({...formData, irrigation_method: e.target.value})}>
                <option value="Drip">Drip</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood">Flood/Furrow</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Forecasted Rainfall Today (mm)</label>
              <input type="number" className="form-input" placeholder="e.g. 0 if no rain" value={formData.forecasted_rainfall_mm} onChange={e => setFormData({...formData, forecasted_rainfall_mm: e.target.value})} required step="0.1" />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%', backgroundColor: '#3b82f6' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Droplets size={18} /> Calculate Water Needs <ArrowRight size={18} /></>}
          </button>
        </form>

        {result && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '1rem' }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={20} /> Irrigation Recommendation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ETo (Base Evapotranspiration)</p>
                <h4 style={{ fontSize: '1.2rem' }}>{result.eto_mm_day} mm/day</h4>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ETc (Crop Evapotranspiration)</p>
                <h4 style={{ fontSize: '1.2rem' }}>{result.etc_mm_day} mm/day</h4>
              </div>
            </div>
            <div className="mt-4 p-4" style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem' }}>
                <p style={{ color: '#bfdbfe', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Water to Apply Today</p>
                <h2 style={{ fontSize: '2rem', color: '#60a5fa', margin: 0 }}>{result.water_to_apply_liters.toLocaleString()} Liters / Hectare</h2>
                <p style={{ fontSize: '0.9rem', color: '#bfdbfe', marginTop: '0.5rem' }}>{result.recommendation}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default IrrigationForecaster;
