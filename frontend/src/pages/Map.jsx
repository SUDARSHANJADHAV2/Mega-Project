import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Layers, AlertTriangle, ShieldCheck } from 'lucide-react';

// Fix for leaflet marker icon issues in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const center = [20.5937, 78.9629]; // Center of India

// Mock Disease Heatmap Data
const diseaseOutbreaks = [
  { coord: [21.1458, 79.0882], radius: 50000, name: "Tomato Leaf Curl", severity: "High" },
  { coord: [19.0760, 72.8777], radius: 30000, name: "Wheat Rust", severity: "Medium" },
  { coord: [28.6139, 77.2090], radius: 60000, name: "Rice Blight", severity: "High" },
  { coord: [15.3173, 75.7139], radius: 45000, name: "Cotton Aphids", severity: "Low" }
];

// Mock NDVI Farm Polygon
const myFarmPolygon = [
  [20.59, 78.96],
  [20.60, 78.96],
  [20.60, 78.97],
  [20.59, 78.97]
];

const FarmMap = () => {
  const [activeLayer, setActiveLayer] = useState('ndvi');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}
    >
      <div className="text-center mb-6">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <MapIcon color="#6366f1" /> Geospatial Intelligence
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Satellite Farm Health (NDVI) & Crowdsourced Disease Heatmaps</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setActiveLayer('ndvi')}
          className="btn" 
          style={{ 
            background: activeLayer === 'ndvi' ? '#10b981' : 'rgba(255,255,255,0.05)', 
            border: activeLayer === 'ndvi' ? 'none' : '1px solid var(--border)' 
          }}
        >
          <Layers size={18} /> My Farm Health (NDVI)
        </button>
        <button 
          onClick={() => setActiveLayer('disease')}
          className="btn" 
          style={{ 
            background: activeLayer === 'disease' ? '#ef4444' : 'rgba(255,255,255,0.05)', 
            border: activeLayer === 'disease' ? 'none' : '1px solid var(--border)' 
          }}
        >
          <AlertTriangle size={18} /> Epidemic Heatmap
        </button>
      </div>

      <div className="glass-panel" style={{ flexGrow: 1, overflow: 'hidden', borderRadius: '1rem', position: 'relative' }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
          {/* Base Satellite Map */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri &mdash; KrushiAI Geospatial'
          />

          {activeLayer === 'disease' && diseaseOutbreaks.map((outbreak, idx) => (
            <Circle 
              key={idx}
              center={outbreak.coord} 
              pathOptions={{ fillColor: outbreak.severity === 'High' ? '#ef4444' : outbreak.severity === 'Medium' ? '#f59e0b' : '#3b82f6', color: 'transparent', fillOpacity: 0.5 }} 
              radius={outbreak.radius}
            >
              <Popup>
                <strong>{outbreak.name}</strong><br/>
                Severity: {outbreak.severity}<br/>
                Based on crowdsourced ML scans.
              </Popup>
            </Circle>
          ))}

          {activeLayer === 'ndvi' && (
             <Polygon positions={myFarmPolygon} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.6 }}>
                <Popup>
                   <ShieldCheck color="#10b981" /> <strong>Your Farm</strong><br/>
                   Vegetation Index (NDVI): 0.82<br/>
                   Status: Healthy
                </Popup>
             </Polygon>
          )}

        </MapContainer>

        {/* HUD Overlay */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 1000, background: 'rgba(15, 23, 42, 0.85)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backdropFilter: 'blur(10px)' }}>
           <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Legend</h4>
           {activeLayer === 'disease' ? (
             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></span> High Severity</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '4px 0' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></span> Warning Level</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }}></span> Monitored Zone</div>
             </div>
           ) : (
             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, background: '#10b981' }}></span> High NDVI (Healthy)</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '4px 0' }}><span style={{ width: 12, height: 12, background: '#f59e0b' }}></span> Low NDVI (Stress)</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, border: '1px solid #6366f1' }}></span> Registered Boundary</div>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default FarmMap;
