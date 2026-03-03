import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api';

const Fertilizer = () => {
  const [formData, setFormData] = useState({
    temperature: 26.0,
    humidity: 52.0,
    moisture: 38.0,
    soil_type: 'Loamy',
    crop_type: 'Wheat',
    nitrogen: 37.0,
    potassium: 0.0,
    phosphorous: 0.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
  const cropTypes = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Kidneybeans', 'Mothbeans', 'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya', 'Coconut', 'Jute', 'Coffee'];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/api/predict-fertilizer', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get prediction from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Droplets color="#6366f1" /> Fertilizer Recommender
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Get AI-driven targeted fertilizer recommendations for your soil</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
        <motion.div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Temperature (°C)</label>
                <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Humidity (%)</label>
                <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Soil Moisture (%)</label>
                <input type="number" step="0.1" name="moisture" value={formData.moisture} onChange={handleChange} className="form-input" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select name="soil_type" value={formData.soil_type} onChange={handleChange} className="form-select">
                  {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Crop Type</label>
                <select name="crop_type" value={formData.crop_type} onChange={handleChange} className="form-select">
                  {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nitrogen (N)</label>
                <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Potassium (K)</label>
                <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phosphorous (P)</label>
                <input type="number" name="phosphorous" value={formData.phosphorous} onChange={handleChange} className="form-input" required />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" /> Analyzing Soil...</> : <><ArrowRight /> Recommend Fertilizer</>}
            </button>
          </form>
        </motion.div>

        <div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div key="err" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Analysis Error</h3>
                <p>{error}</p>
              </motion.div>
            )}

            {result && !error && (
              <motion.div 
                key="res"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="glass-panel" 
                style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(30, 41, 59, 0.7))', border: '1px solid rgba(99, 102, 241, 0.3)' }}
              >
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#6366f1' }}>
                  <ShieldCheck size={40} />
                </div>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recommended Solution</h3>
                <h2 style={{ fontSize: '2.5rem', color: '#8b5cf6', textTransform: 'capitalize' }}>{result.recommended_fertilizer}</h2>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>AI Confidence Score</p>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '0.5rem 0' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1 }} style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', height: '100%' }} />
                  </div>
                  <p style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{result.confidence.toFixed(1)}%</p>
                </div>
              </motion.div>
            )}

            {!result && !error && (
              <motion.div key="empty" className="glass-panel" style={{ padding: '2rem', opacity: 0.5, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Ensure your inputs match your exact field conditions for the best results from the AI.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Fertilizer;
