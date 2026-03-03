import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import api from '../api';

const YieldPredictor = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    area: '',
    rainfall: '',
    fertilizer: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/api/predict-yield', {
        crop: formData.crop,
        area: parseFloat(formData.area),
        rainfall: parseFloat(formData.rainfall),
        fertilizer: parseFloat(formData.fertilizer)
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
          <TrendingUp color="#6366f1" /> Yield Predictor
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Estimate your total crop yield based on acreage, rainfall, and fertilizer usage.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <select className="form-select" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})}>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Area (Acres)</label>
              <input type="number" className="form-input" placeholder="e.g. 5" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} required min="0.1" step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Rainfall (mm)</label>
              <input type="number" className="form-input" placeholder="e.g. 800" value={formData.rainfall} onChange={e => setFormData({...formData, rainfall: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fertilizer Used (kg)</label>
              <input type="number" className="form-input" placeholder="e.g. 150" value={formData.fertilizer} onChange={e => setFormData({...formData, fertilizer: e.target.value})} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><TrendingUp size={18} /> Predict Yield <ArrowRight size={18} /></>}
          </button>
        </form>

        {result && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} /> Prediction Results
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estimated Yield per Acre</p>
                <h4 style={{ fontSize: '1.5rem' }}>{result.yield_per_acre} Tons</h4>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Estimated Harvest</p>
                <h4 style={{ fontSize: '1.5rem', color: '#10b981' }}>{result.total_estimated_yield.toFixed(2)} Tons</h4>
              </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Confidence Rate: {result.confidence}%
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default YieldPredictor;
