import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Market = () => {
  const [listings, setListings] = useState([
    { id: 1, crop: 'Premium Wheat', variety: 'Lokwan', quantity: '100 Qtl', price: 2350, location: 'Nagpur, MH', farmer: 'Ramesh Patil', rating: 4.8 },
    { id: 2, crop: 'Organic Cotton', variety: 'BT-Cotton', quantity: '50 Qtl', price: 7100, location: 'Yavatmal, MH', farmer: 'Suresh Kumar', rating: 4.5 },
    { id: 3, crop: 'Basmati Rice', variety: 'Pusa 1121', quantity: '200 Qtl', price: 3800, location: 'Karnal, HR', farmer: 'Harjeet Singh', rating: 4.9 },
    { id: 4, crop: 'Red Onions', variety: 'Nashik Red', quantity: '500 Qtl', price: 1800, location: 'Nashik, MH', farmer: 'Vinayak Deshmukh', rating: 4.2 }
  ]);

  const [search, setSearch] = useState('');

  const filtered = listings.filter(l => l.crop.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShoppingBag color="#10b981" /> Krushi Mandi (B2B Market)
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Sell directly to wholesalers and restaurants. Bypass the middleman.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search crops, varieties, or locations..." 
            className="form-input" 
            style={{ paddingLeft: '3rem', marginBottom: 0 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
          <Filter size={18} /> Filters
        </button>
        <button className="btn btn-primary" style={{ background: '#10b981', color: '#0f172a' }}>
          List My Crop
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(item => (
          <motion.div key={item.id} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>{item.crop}</h3>
                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Variety: {item.variety}</p>
               </div>
               <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', color: '#10b981', fontWeight: 600 }}>
                 {item.quantity} available
               </div>
            </div>
            
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
              ₹{item.price.toLocaleString()}<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}> / quintal</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                 <MapPin size={16} /> {item.location}
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                 <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.5rem' }}>{item.farmer[0]}</div>
                 {item.farmer} <span style={{ display: 'flex', alignItems: 'center', color: '#facc15', marginLeft: 'auto' }}><Star size={14} fill="#facc15" /> {item.rating}</span>
               </div>
            </div>

            <button className="btn" style={{ width: '100%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Contact Farmer <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Market;
