import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Loader2, ArrowRight, Calendar, Droplets } from 'lucide-react';
import api from '../api';

const Crop = () => {
  const [formData, setFormData] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    temperature: 25.0,
    humidity: 60.0,
    ph: 6.5,
    rainfall: 100.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert strings to float for API
    const payload = {};
    for (const key in formData) {
      payload[key] = parseFloat(formData[key]) || 0;
    }

    try {
      const response = await api.post('/api/predict-crop', payload);
      const cropName = response.data.recommended_crop;
      
      try {
         const marketRes = await api.post('/api/market-prices', { crop: cropName });
         setResult({ crop: cropName, market: marketRes.data });
      } catch (err) {
         setResult({ crop: cropName, market: null });
      }
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
          <Sprout color="#10b981" /> Crop Recommender
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Find the most suitable crop to maximize your harvest</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
        <motion.div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nitrogen (N) content in soil</label>
                <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phosphorus (P) content in soil</label>
                <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Potassium (K) content in soil</label>
                <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Temperature (°C)</label>
                <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Humidity (%)</label>
                <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">pH value of soil</label>
                <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Rainfall (mm)</label>
                <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} className="form-input" required />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><ArrowRight /> Get Recommendation</>}
            </button>
          </form>
        </motion.div>

        <div>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Error</h3>
              <p>{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="glass-panel" 
              style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(30, 41, 59, 0.7))', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                <Sprout size={40} />
              </div>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recommended Crop</h3>
              <h2 style={{ fontSize: '2.5rem', color: '#10b981', textTransform: 'capitalize' }}>{result.crop}</h2>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Based on your soil nutrients and climatic conditions, {result.crop} is the most optimal crop for maximum yield.</p>
              
              {result.market && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>Live Market Estimate</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Price</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹{result.market.current_price_per_quintal} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span></p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Market Trend</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: result.market.trend === 'up' ? '#10b981' : result.market.trend === 'down' ? '#ef4444' : '#facc15', textTransform: 'capitalize' }}>
                        {result.market.trend} {result.market.trend === 'stable' ? '' : `${result.market.change_percentage}%`}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Demand Forecast:</span>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '0.25rem', fontWeight: 600 }}>{result.market.demand_forecast}</span>
                  </div>
                </div>
              )}

              {/* ERP: 90-Day Crop Calendar & Irrigation Alerts */}
              <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                 <h4 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Calendar size={18} color="#6366f1" /> 90-Day Crop Calendar
                 </h4>
                 <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid #6366f1' }}>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                       <div style={{ minWidth: '60px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Day 1</div>
                       <div>
                          <p style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>Sowing & Seed Treatment</p>
                          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Plant {result.crop} seeds at 5cm depth.</p>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                       <div style={{ minWidth: '60px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Day 25</div>
                       <div>
                          <p style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>First Fertilization (N-P-K)</p>
                          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Apply Urea based on soil deficiency.</p>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                       <div style={{ minWidth: '60px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Day 45</div>
                       <div>
                          <p style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>Weeding & Pest Control</p>
                          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Inspect leaves for early signs of blight.</p>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                       <div style={{ minWidth: '60px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>Day 90+</div>
                       <div>
                          <p style={{ color: '#10b981', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Harvest Window</p>
                          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Prepare equipment for cutting.</p>
                       </div>
                    </div>

                 </div>

                 {/* Intelligent Irrigation Alert */}
                 <div style={{ marginTop: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#3b82f6' }}>
                      <Droplets size={20} />
                    </div>
                    <div>
                      <p style={{ color: '#60a5fa', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Smart Irrigation Alert</p>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>Heavy rainfall (15mm) expected in next 48 hours. <strong>Skip manual irrigation today.</strong></p>
                    </div>
                 </div>
              </div>

            </motion.div>
          )}

          {!result && !error && (
            <div className="glass-panel" style={{ padding: '2rem', opacity: 0.5, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Enter your agricultural parameters and run the analysis to unveil the best crop choice.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Crop;
