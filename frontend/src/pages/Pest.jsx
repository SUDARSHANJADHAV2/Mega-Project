import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, UploadCloud, Loader2, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../api';

const Pest = () => {
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
      const response = await api.post('/api/predict-pest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze the image");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
        case 'Critical': return '#ef4444';
        case 'Severe': return '#f97316';
        case 'High': return '#eab308';
        case 'Moderate': return '#fcd34d';
        default: return '#10b981';
    }
  }

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
          <Bug color="#eab308" /> Pest Recognition
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload an image of your crop to identify destructive insects and receive immediate management strategies.</p>
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
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#eab308'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <UploadCloud size={64} color="#eab308" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Drag & drop pest image</h3>
            <p style={{ color: 'var(--text-muted)' }}>or click to browse from your device</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
               <img src={preview} alt="Crop Preview" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
               {loading && (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{
                      width: '60px', height: '60px', border: '4px solid rgba(234, 179, 8, 0.3)', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Analyzing Image...</p>
                 </div>
               )}
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }} onClick={clearImage} disabled={loading}>Clear Image</button>
               <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #eab308, #d97706)', boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.39)' }} onClick={handleSubmit} disabled={loading}>
                 <Search size={20} /> Identify Pest
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
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${getRiskColor(result.risk_level)}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: getRiskColor(result.risk_level) }}>
                   <Bug size={28} />
                 </div>
                 <div>
                   <h2 style={{ fontSize: '1.5rem' }}>{result.pest_identified}</h2>
                   <p style={{ color: 'var(--text-muted)' }}>Risk Level: <strong style={{ color: getRiskColor(result.risk_level) }}>{result.risk_level}</strong></p>
                 </div>
                 <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                   <h2 style={{ fontSize: '2rem', margin: 0, color: '#10b981' }}>{result.confidence}%</h2>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Confidence</p>
                 </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <AlertTriangle size={18} /> Management Recommendation
                  </h3>
                  <p style={{ lineHeight: 1.6 }}>{result.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Pest;
