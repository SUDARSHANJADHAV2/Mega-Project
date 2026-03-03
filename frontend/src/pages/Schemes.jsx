import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileText, CheckCircle, ArrowUpRight } from 'lucide-react';

const Schemes = () => {
  const [schemes] = useState([
    { id: 1, name: 'PM-KISAN Samman Nidhi', desc: 'Provides income support of ₹6,000 per year to all landholding farmer families.', tags: ['Cash Transfer', 'Central Govt'], eligible: true },
    { id: 2, name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', desc: 'Crop insurance scheme providing financial support in event of failure of notified crops as a result of natural calamities.', tags: ['Insurance', 'Central Govt'], eligible: true },
    { id: 3, name: 'Mahatma Jyotirao Phule Shetkari Karjmukti Yojana', desc: 'Debt waiver scheme for farmers holding land up to 2 hectares in Maharashtra.', tags: ['Debt Waiver', 'State Govt (MH)'], eligible: false },
    { id: 4, name: 'PKVY (Paramparagat Krishi Vikas Yojana)', desc: 'Promotes organic farming through cluster approach and Participatory Guarantee System.', tags: ['Organic Farming', 'Subsidies'], eligible: true }
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Landmark color="#3b82f6" /> Krushi Schemes Matcher
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Automatically matches your profile with eligible government grants and subsidies.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        {schemes.map(scheme => (
          <motion.div key={scheme.id} whileHover={{ scale: 1.01 }} className="glass-panel" style={{ padding: '1.5rem', borderLeft: scheme.eligible ? '4px solid #10b981' : '4px solid #64748b' }}>
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
                      <CheckCircle size={16} /> Highly Eligible
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem' }}>
                      Not Eligible
                    </div>
                  )}
                  
                  <button className="btn" style={{ border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Apply Now <ArrowUpRight size={16} />
                  </button>
               </div>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Schemes;
