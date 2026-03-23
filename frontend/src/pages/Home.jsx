import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Activity, ChevronRight, CheckCircle, Shield, Zap, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WeatherWidget from '../components/WeatherWidget';

const Home = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 400px)', gap: '4rem', alignItems: 'center', marginBottom: '6rem', marginTop: '2rem' }}>
        <div>
          <motion.div variants={itemVariants} style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '2rem', color: '#818cf8', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {t('edition')}
          </motion.div>
          <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 700 }}>
            {t('hero_title').split('Intelligence')[0]}<span style={{ color: '#10b981' }}>{t('hero_title').includes('Intelligence') ? 'Intelligence' : 'बुद्धिमत्ता'}</span>{t('hero_title').split('Intelligence')[1] || t('hero_title').replace('बुद्धिमत्ता', '')}
          </motion.h1>
          <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {t('hero_desc')}
          </motion.p>
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/crop" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {t('Start Analysis')} <ChevronRight size={20} />
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <WeatherWidget />
        </motion.div>
      </div>

      {/* Trust Badges */}
      <motion.div variants={containerVariants} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0', marginBottom: '6rem', color: 'var(--text-muted)' }}>
        <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}><CheckCircle size={20} color="#10b981" /> <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}>99.5%</motion.span> {t('AI Accuracy')}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}><Shield size={20} color="#6366f1" /> {t('PWA Offline Capable')}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}><Zap size={20} color="#f59e0b" /> {t('Real-time Telemetry')}</motion.div>
      </motion.div>

      {/* Core Features */}
      <div className="text-center mb-12">
         <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('Modules Title')}</motion.h2>
         <motion.p variants={itemVariants} style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>{t('Modules Desc')}</motion.p>
      </div>

      <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -8 }} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="animate-float" style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
            <Leaf size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Yield Maximizer</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.6 }}>
            Calculates atmospheric and lithospheric telemetry to predict the mathematically optimal crop for your acreage.
          </p>
          <Link to="/crop" className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>Execute Model <ChevronRight size={16} /></Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -8 }} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="animate-float" style={{ animationDelay: '1s', background: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#3b82f6' }}>
            <Droplets size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Irrigation Forecaster</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.6 }}>
            Accurately models exact crop water deficits using live climatic evaporation metrics (Penman-Monteith).
          </p>
          <Link to="/irrigation" className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>Execute Model <ChevronRight size={16} /></Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -8 }} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(15, 23, 42, 0.6))', borderColor: 'rgba(99,102,241,0.3)' }}>
          <div className="animate-pulse-glow" style={{ background: 'rgba(99, 102, 241, 0.2)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#818cf8' }}>
            <Droplets size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Nutrient Synthesizer</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.6 }}>
            Analyzes existing Nitrogen, Potassium, and Phosphorus ratios to recommend precise chemical augmentation.
          </p>
          <Link to="/fertilizer" className="btn btn-primary">Execute Model <ChevronRight size={16} /></Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -8 }} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="animate-float" style={{ animationDelay: '2s', background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#ef4444' }}>
            <Activity size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pathology Deep Scan</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.6 }}>
            Utilizes a high-dimensional Convolutional Neural Network to spot biological anomalies in leaf cellular structures.
          </p>
          <Link to="/disease" className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{t('Execute Model')} <ChevronRight size={16} /></Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -8 }} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="animate-float" style={{ animationDelay: '0.5s', background: 'rgba(234, 179, 8, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#eab308' }}>
            <Bug size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('Pest Recognition')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, lineHeight: 1.6 }}>
            Upload insect images to receive instant identification and professional eradication guidance.
          </p>
          <Link to="/pest" className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{t('Execute Model')} <ChevronRight size={16} /></Link>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer variants={itemVariants} style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem', paddingBottom: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '4rem' }}>
        <div>
           <div className="nav-brand" style={{ marginBottom: '1rem' }}><Leaf size={24} color="#10b981" /> KrushiAI</div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '300px' }}>Empowering the world's farmers with next-generation artificial intelligence and planetary-scale data.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
           <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Platform</h4>
           <Link to="/crop" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Crop Intelligence</Link>
           <Link to="/fertilizer" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fertilizer Optimization</Link>
           <Link to="/disease" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Disease Pipeline</Link>
           <Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Farm Analytics</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
           <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Resources</h4>
           <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Research Paper (IEEE)</a>
           <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>API Documentation</a>
           <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>PWA Install Guide</a>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;
