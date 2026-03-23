import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, AlertTriangle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../api';

const Profit = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    area: '',
    budget: '',
    expected_yield_tons: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await api.post('/api/predict-profit', {
        crop: formData.crop,
        area: parseFloat(formData.area),
        budget: parseFloat(formData.budget),
        expected_yield_tons: parseFloat(formData.expected_yield_tons)
      });
      setResult(res.data);
    } catch (err) {
      setError("Analysis failed. Check your inputs or server status.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <DollarSign color="#10b981" size={40} /> Financial Analyzer
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Calculate farm profitability, assess weather risks, and find your break-even yield.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calculator size={20} color="#6366f1" /> Financial Parameters</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5">
              <div className="form-group">
                <label className="form-label">Crop Type</label>
                <select className="form-select" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})}>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Farm Area (Acres)</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" className="form-input" placeholder="e.g. 5" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} required min="0.1" step="0.1" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Total Investment Budget (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 50000" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required min="1000" />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Money allocated for seeds, fertilizers, and labor.</p>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Yield (Tons, Optional)</label>
                <input type="number" className="form-input" placeholder="Leave blank to use AI estimate" value={formData.expected_yield_tons} onChange={e => setFormData({...formData, expected_yield_tons: e.target.value})} min="0.1" step="0.1" />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary mt-6" style={{ width: '100%' }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Generate Financial Report <ArrowRight size={18} /></>}
            </button>
            {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.85rem' }}>{error}</p>}
          </form>
        </div>

        {/* Results Panel */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.6))', borderTop: '4px solid #10b981' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Estimated Net Profit</p>
              <h2 style={{ fontSize: '3rem', color: result.net_profit > 0 ? '#10b981' : '#ef4444', marginBottom: '0.25rem' }}>
                ₹{result.net_profit.toLocaleString('en-IN')}
              </h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '0.85rem' }}>
                  ROI: <strong style={{ color: result.roi_percentage > 0 ? '#10b981' : '#ef4444' }}>{result.roi_percentage}%</strong>
                </span>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '0.85rem' }}>
                  Market: <strong>₹{result.live_market_price}/Qtl</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass-panel" style={{ padding: '1.5rem' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gross Revenue</p>
                 <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>₹{result.gross_revenue.toLocaleString('en-IN')}</h4>
                 <p style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '0.5rem' }}>Based on {result.total_yield_tons} tons yield</p>
               </div>
               
               <div className="glass-panel" style={{ padding: '1.5rem', background: result.risk_level === 'High' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                   <AlertTriangle size={14} color={result.risk_level === 'High' ? '#ef4444' : '#f59e0b'} /> Risk Level
                 </p>
                 <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem', color: result.risk_level === 'High' ? '#ef4444' : 'white' }}>{result.risk_level}</h4>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{result.risk_reason}</p>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}><CheckCircle2 size={18} color="#10b981" /> Economic Advice</h4>
               <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>{result.economic_advice}</p>
               
               <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Break-even Yield Required:</span>
                    <strong style={{ color: 'white' }}>{result.break_even_tons} Tons</strong>
                  </p>
               </div>
            </div>

          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profit;
