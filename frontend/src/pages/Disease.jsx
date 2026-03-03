import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, UploadCloud, Loader2, Search, Info, CheckCircle2 } from 'lucide-react';
import api from '../api';

const Disease = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
    }
  };

  const handleSubmit = async () => {
    if(!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/predict-disease', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze the leaf image");
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
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Activity color="#ef4444" /> Disease Recognition
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload an image of your plant leaf for instant disease classification & cure</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        
        {!preview ? (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: '1rem', 
              padding: '4rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#ef4444'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <UploadCloud size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Drag & drop your leaf image</h3>
            <p style={{ color: 'var(--text-muted)' }}>or click to browse from your device</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
               <img src={preview} alt="Plant Leaf Preview" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
               {loading && (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{
                      width: '60px', height: '60px', border: '4px solid rgba(239, 68, 68, 0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Deep Scan in Progress...</p>
                 </div>
               )}
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }} onClick={clearImage} disabled={loading}>Clear Image</button>
               <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' }} onClick={handleSubmit} disabled={loading}>
                 <Search size={20} /> Analyze Disease
               </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444', marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Diagnosis Error</h3>
              <p>{error}</p>
            </motion.div>
        )}

        {result && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}
          >
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#ef4444' }}>
                   <Activity size={28} />
                 </div>
                 <div>
                   <h2 style={{ fontSize: '1.5rem' }}>{result.disease_details?.name || result.disease_class}</h2>
                   <p style={{ color: 'var(--text-muted)' }}>{result.disease_details?.scientific_name || 'Diagnosis result'}</p>
                 </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong>Severity:</strong> 
                  <span style={{ color: result.disease_details?.severity === 'Critical' ? '#ef4444' : result.disease_details?.severity === 'High' ? '#f97316' : '#10b981' }}>
                    {result.disease_details?.severity || 'Unknown'}
                  </span>
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Confidence Level</p>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', margin: '0.5rem 0' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence_percentage}%` }} transition={{ duration: 1 }} style={{ background: '#ef4444', height: '100%' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem' }}>{result.confidence_message}</p>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.disease_details?.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981' }}>
                  <ShieldCheck size={20} /> Recommendations
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.disease_details?.treatment?.length ? result.disease_details.treatment.map((t, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span> {t}
                    </li>
                  )) : <li style={{ color: 'var(--text-muted)' }}>No specific treatments listed.</li>}
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#6366f1' }}>
                  <Info size={20} /> Common Symptoms
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.disease_details?.symptoms?.length ? result.disease_details.symptoms.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--border)' }}>•</span> {s}
                    </li>
                  )) : <li style={{ color: 'var(--text-muted)' }}>No specific symptoms listed.</li>}
                </ul>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Disease;
