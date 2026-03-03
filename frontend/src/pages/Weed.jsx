import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Upload, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';

const WeedDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/api/predict-weed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
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
          <span style={{ color: '#10b981' }}>🌿 Weed Detection Engine</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload an image of your field to identify invasive weeds and protect your crops.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div 
            style={{ 
              border: '2px dashed rgba(255,255,255,0.2)', 
              borderRadius: '1rem', 
              padding: '2rem', 
              textAlign: 'center',
              background: 'rgba(0,0,0,0.2)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, { borderColor: 'var(--primary)', background: 'rgba(99, 102, 241, 0.05)' })}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, { borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)' })}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            
            {preview ? (
              <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', color: '#818cf8' }}>
                  <Upload size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Click or drag image to upload</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={!selectedFile || loading} style={{ opacity: (!selectedFile || loading) ? 0.7 : 1 }}>
            {loading ? <><Loader2 className="animate-spin" size={20} /> Analyzing Image...</> : <><Search size={20} /> Detect Weeds</>}
          </button>
        </form>

        {result && !loading && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle color="#10b981" /> Detection Results
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Classification Category</p>
                    <h2 style={{ color: result.is_weed ? '#ef4444' : '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {result.category}
                    </h2>
                 </div>
                 
                 <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Confidence Level</p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#818cf8' }}>
                      {result.confidence}%
                    </h2>
                 </div>
              </div>
              
              {result.recommendation && (
                 <div className="mt-4 p-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <p style={{ lineHeight: 1.6 }}>{result.recommendation}</p>
                 </div>
              )}
           </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Search icon polyfill
const Search = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default WeedDetection;
