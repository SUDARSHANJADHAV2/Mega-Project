import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, CloudRain, Sun, Newspaper, ArrowRight } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  // Mock data for soil health
  const soilData = [
    { month: 'Jan', nitrogen: 45, phosphorus: 30, potassium: 50 },
    { month: 'Feb', nitrogen: 48, phosphorus: 35, potassium: 45 },
    { month: 'Mar', nitrogen: 42, phosphorus: 32, potassium: 48 },
    { month: 'Apr', nitrogen: 55, phosphorus: 40, potassium: 55 },
    { month: 'May', nitrogen: 50, phosphorus: 38, potassium: 52 },
    { month: 'Jun', nitrogen: 60, phosphorus: 45, potassium: 60 },
  ];

  // Mock data for historic yield
  const yieldData = [
    { year: '2020', yield: 4000 },
    { year: '2021', yield: 4500 },
    { year: '2022', yield: 4200 },
    { year: '2023', yield: 5100 },
    { year: '2024', yield: 5800 },
  ];

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch News
      try {
        const res = await api.get('/api/agri-news');
        if (res.data.status === 'success') {
          setNews(res.data.articles);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoadingNews(false);
      }

      // Fetch Live Weather (Open-Meteo, Free API, Lat/Long for Central India)
      try {
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.14&longitude=79.08&current_weather=true');
        const weatherData = await weatherRes.json();
        setWeather(weatherData.current_weather);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Weather icon logic
  const WeatherIcon = weather?.temperature > 30 ? Sun : CloudRain;
  const weatherColor = weather?.temperature > 30 ? '#ef4444' : '#3b82f6';

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Activity color="#6366f1" /> Farm Analytics Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor historical yields, track soil nutrient changes, and view atmospheric forecasts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="animate-pulse-glow" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Expected Yield</p>
            <h3 style={{ fontSize: '1.5rem' }}>5,800 kg/ha</h3>
            <span style={{ color: '#10b981', fontSize: '0.875rem' }}>+12% from last year</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', color: '#6366f1' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Overall Soil Health</p>
            <h3 style={{ fontSize: '1.5rem' }}>Excellent</h3>
            <span style={{ color: '#6366f1', fontSize: '0.875rem' }}>Optimal NPK balance</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: `rgba(${weather?.temperature > 30 ? '244, 63, 94' : '59, 130, 246'}, 0.1)`, padding: '1rem', borderRadius: '50%', color: weatherColor }}>
            <WeatherIcon size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Live Regional Weather</p>
            {weather ? (
               <>
                 <h3 style={{ fontSize: '1.5rem' }}>{weather.temperature}°C</h3>
                 <span style={{ color: weatherColor, fontSize: '0.875rem' }}>Wind: {weather.windspeed} km/h</span>
               </>
            ) : (
               <div style={{ animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.1)', height: '2rem', width: '4rem', borderRadius: '0.5rem', marginTop: '0.25rem' }} />
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1.5fr)', gap: '2rem' }}>
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#6366f1" /> 6-Month Soil NPK Analysis
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={soilData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="nitrogen" name="Nitrogen" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#020617', strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#020617', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="potassium" name="Potassium" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#020617', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#10b981" /> Historical Farm Yield
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={yieldData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="yield" name="Yield (kg/ha)" stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Live Market & Agri News Section */}
      <motion.div variants={itemVariants} className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Newspaper size={20} color="#3b82f6" /> Live Agriculture News
        </h3>
        
        {loadingNews ? (
           <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Fetching live updates...</div>
        ) : news.length > 0 ? (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
             {news.map((article, idx) => (
                <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }} onMouseOver={(e) => Object.assign(e.currentTarget.style, {background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)'})} onMouseOut={(e) => Object.assign(e.currentTarget.style, {background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'})}>
                   <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.05rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h4>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                     <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{article.source}</span>
                     <span style={{ color: '#3b82f6', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>Read <ArrowRight size={14} /></span>
                   </div>
                </a>
             ))}
           </div>
        ) : (
           <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No recent news found.</div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
