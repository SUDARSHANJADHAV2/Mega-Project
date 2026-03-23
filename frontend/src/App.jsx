import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Crop from './pages/Crop';
import Fertilizer from './pages/Fertilizer';
import Disease from './pages/Disease';
import Pest from './pages/Pest';
import WeedDetection from './pages/Weed';
import YieldPredictor from './pages/Yield';
import Dashboard from './pages/Dashboard';
import FarmMap from './pages/Map';
import Soil from './pages/Soil';
import Profit from './pages/Profit';
import Calendar from './pages/Calendar';
import Ledger from './pages/Ledger';
import Market from './pages/Market';
import Equipment from './pages/Equipment';
import Schemes from './pages/Schemes';
import IrrigationForecaster from './pages/Irrigation';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';
import SatelliteDashboard from './pages/Satellite';
import OCRTools from './pages/OCRTools';
import ForecastDashboard from './pages/Forecast';
import VoiceAssistant from './pages/VoiceAssistant';
import SustainabilityDashboard from './pages/Sustainability';
import FinancialDashboard from './pages/Financial';
import HealthLegalDashboard from './pages/HealthLegal';
import EducationSimulator from './pages/Education';
import MLOpsDashboard from './pages/MLOps';

// AnimatedRoutes wrapper to enable Framer Motion exit animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/crop" element={<Crop />} />
        <Route path="/yield" element={<YieldPredictor />} />
        <Route path="/fertilizer" element={<Fertilizer />} />
        <Route path="/disease" element={<Disease />} />
        <Route path="/pest" element={<Pest />} />
        <Route path="/weed" element={<WeedDetection />} />
        <Route path="/irrigation" element={<IrrigationForecaster />} />
        <Route path="/map" element={<FarmMap />} />
        <Route path="/soil" element={<Soil />} />
        <Route path="/profit" element={<Profit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/market" element={<Market />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/satellite" element={<SatelliteDashboard />} />
        <Route path="/tools/ocr" element={<OCRTools />} />
        <Route path="/forecast" element={<ForecastDashboard />} />
        <Route path="/voice" element={<VoiceAssistant />} />
        <Route path="/sustainability" element={<SustainabilityDashboard />} />
        <Route path="/financial" element={<FinancialDashboard />} />
        <Route path="/health" element={<HealthLegalDashboard />} />
        <Route path="/education" element={<EducationSimulator />} />
        <Route path="/mlops" element={<MLOpsDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthModal />
      <Navbar />
      
      {isOffline && (
        <motion.div 
           initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
           style={{ background: '#f59e0b', color: '#000', textAlign: 'center', padding: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', zIndex: 999, position: 'relative' }}
        >
          <span>⚠️</span> You are currently offline. Running in limited PWA heuristic mode.
        </motion.div>
      )}

      <main className="container pt-8 pb-16" style={{ marginTop: '2rem' }}>
        <AnimatedRoutes />
      </main>

      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
