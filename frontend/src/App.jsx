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
import Ledger from './pages/Ledger';
import Market from './pages/Market';
import Equipment from './pages/Equipment';
import Schemes from './pages/Schemes';
import IrrigationForecaster from './pages/Irrigation';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';

// AnimatedRoutes wrapper to enable Framer Motion exit animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
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
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/market" element={<Market />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthModal />
      <Navbar />
      
      <main className="container pt-8 pb-16" style={{ marginTop: '2rem' }}>
        <AnimatedRoutes />
      </main>

      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
