import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, CheckCircle, ArrowUpRight, Search, Loader2 } from 'lucide-react';
import api from '../api';

const Schemes = () => {
  const [formData, setFormData] = useState({
    land_area: '',
    category: 'General',
    state: 'Maharashtra'
  });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.land_area) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await api.post('/api/predict-schemes', {
        land_area: parseFloat(formData.land_area),
        category: formData.category,
        state: formData.state
      });
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Landmark color="#3b82f6" /> Krushi Schemes Matcher
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Automatically matches your profile with eligible government grants and subsidies.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 border-b border-gray-700 pb-6 mb-6">
          <div className="form-group">
            <label className="form-label">Land Area (Acres)</label>
            <input type="number" className="form-input" placeholder="e.g. 5" value={formData.land_area} onChange={e => setFormData({...formData, land_area: e.target.value})} required min="0.1" step="0.1" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC/ST">SC/ST</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <select className="form-select" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 3' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#3b82f6' }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Search size={18} /> Find Eligible Schemes</>}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {hasSearched && schemes.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
              {schemes.map(scheme => (
                <motion.div key={scheme.id} whileHover={{ scale: 1.01 }} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderLeft: scheme.eligible ? '4px solid #10b981' : '4px solid #64748b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: scheme.eligible ? 'white' : 'var(--text-muted)' }}>{scheme.name}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.75rem 0' }}>
                          {scheme.tags.map((tag, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                          {scheme.desc}
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                        {scheme.eligible ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <CheckCircle size={16} /> Eligible
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem' }}>
                            Not Eligible
                          </div>
                        )}
                        
                        {scheme.eligible && (
                          <a href="#" className="btn" style={{ border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', padding: '0.5rem 1rem' }}>
                            Apply Now <ArrowUpRight size={16} />
                          </a>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Schemes;
