import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Loader2, Sparkles, CheckSquare, Clock } from 'lucide-react';
import api from '../api';

const Calendar = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    sowing_date: new Date().toISOString().split('T')[0],
    soil_type: 'Loam'
  });
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTasks(null);
    
    try {
      const res = await api.post('/api/predict-calendar', formData);
      setTasks(res.data.tasks);
    } catch (err) {
      setError("AI generation failed. Server offline or quota exceeded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CalendarIcon color="#818cf8" size={40} /> AI Crop Calendar
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate a precise day-by-day farming schedule powered by Artificial Intelligence.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row items-end">
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label">Crop Name</label>
            <input type="text" className="form-input" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} placeholder="e.g. Wheat" required />
          </div>
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label">Sowing Date</label>
            <input type="date" className="form-input" value={formData.sowing_date} onChange={e => setFormData({...formData, sowing_date: e.target.value})} required />
          </div>
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label">Soil Type</label>
            <select className="form-select" value={formData.soil_type} onChange={e => setFormData({...formData, soil_type: e.target.value})}>
              <option value="Loam">Loam</option>
              <option value="Black">Black Soil</option>
              <option value="Red">Red Soil</option>
              <option value="Sandy">Sandy</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', height: '42px', display: 'flex', alignItems: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} style={{ marginRight: '6px' }} /> Generate</>}
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.85rem' }}>{error}</p>}
      </div>

      {/* Timeline View */}
      <AnimatePresence>
        {tasks && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <h3 style={{ marginBottom: '1.5rem', paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="#818cf8" /> {formData.crop} Lifecycle Plan
             </h3>
             <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid rgba(129, 140, 248, 0.3)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {tasks.map((task, idx) => (
                   <motion.div 
                     key={idx} 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     transition={{ delay: idx * 0.1 }}
                     style={{ position: 'relative' }}
                   >
                     {/* Timeline Dot */}
                     <div style={{ position: 'absolute', left: '-2.45rem', top: '1.5rem', width: '16px', height: '16px', borderRadius: '50%', background: '#818cf8', border: '4px solid #0f172a' }} />
                     
                     <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                           <h4 style={{ fontSize: '1.1rem', color: 'white' }}>{task.title}</h4>
                           <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', borderRadius: '1rem', fontWeight: 600 }}>Day {task.day}</span>
                        </div>
                        <p style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>Target Date: {task.date}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{task.description}</p>
                        
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                             <CheckSquare size={14} /> Mark Complete
                           </button>
                        </div>
                     </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Calendar;
