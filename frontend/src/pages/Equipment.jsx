import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tractor, Clock, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';

const Equipment = () => {
  const [inventory] = useState([
    { id: 1, name: 'Mahindra 575 DI Tractor', type: 'Tractor', hp: '45 HP', rate: 600, location: '5km away', owner: 'FarmTech Co.', img: 'T' },
    { id: 2, name: 'John Deere Combine Harvester', type: 'Harvester', hp: '75 HP', rate: 2500, location: '12km away', owner: 'Raju Rentals', img: 'H' },
    { id: 3, name: 'Honda Water Pump 5HP', type: 'Pump', hp: '5 HP', rate: 100, location: '2km away', owner: 'Suresh P', img: 'P' },
    { id: 4, name: 'Rotavator Attachment', type: 'Implement', hp: 'N/A', rate: 200, location: '5km away', owner: 'FarmTech Co.', img: 'R' }
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Tractor color="#f59e0b" /> Krushi Rental Hub
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Rent tractors, harvesters, and tools from nearby farmers by the hour.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {inventory.map(item => (
          <motion.div key={item.id} whileHover={{ y: -5 }} className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(30, 41, 59, 0.8))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#f59e0b' }}>
               <Tractor size={60} />
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                 <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{item.name}</h3>
                 <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.type}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                   <Lightning size={16} /> {item.hp}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                   <MapPin size={16} /> {item.location}
                 </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                 <div>
                   <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Rental Rate</p>
                   <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                     ₹{item.rate} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/ hr</span>
                   </p>
                 </div>
                 <button className="btn btn-primary" style={{ background: '#f59e0b', color: '#0f172a', padding: '0.5rem 1rem' }}>
                    Book Now
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Placeholder for missing lucide icon fix in next step */}
      </div>
    </motion.div>
  );
};
const Lightning = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

export default Equipment;
