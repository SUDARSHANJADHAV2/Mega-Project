import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, CloudLightning, Loader2, MapPin } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Free Open-Meteo API without an API key requirement
            const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
            setWeather(res.data);
            setLoading(false);
          } catch (err) {
            setError("Failed to fetch weather data.");
            setLoading(false);
          }
        },
        (err) => {
          // Fallback to a default location (e.g., Delhi, India)
          fetchFallbackWeather();
        }
      );
    } else {
      fetchFallbackWeather();
    }
  }, []);

  const fetchFallbackWeather = async () => {
    try {
      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`);
      setWeather(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch default weather data.");
      setLoading(false);
    }
  };

  const getWeatherIcon = (code, size = 48) => {
    if (code === 0 || code === 1) return <Sun size={size} color="#facc15" />;
    if (code > 1 && code < 5) return <Cloud size={size} color="#94a3b8" />;
    if (code >= 50 && code <= 67) return <CloudRain size={size} color="#60a5fa" />;
    if (code >= 80) return <CloudLightning size={size} color="#818cf8" />;
    return <Sun size={size} color="#facc15" />;
  };

  const getWeatherDesc = (code) => {
    if (code === 0) return "Clear sky";
    if (code === 1 || code === 2 || code === 3) return "Mainly clear to overcast";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rain/Drizzle";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
  };

  if (loading) return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
      <Loader2 className="animate-spin" color="#6366f1" size={32} />
    </div>
  );

  if (error) return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #ef4444' }}>
      <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
    </div>
  );

  const current = weather?.current;
  
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', opacity: 0.1 }}>
        {getWeatherIcon(current?.weather_code, 150)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> My Farm Location
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            {getWeatherIcon(current?.weather_code, 32)}
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>
              {current?.temperature_2m}°C
            </h2>
          </div>
          <p style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {getWeatherDesc(current?.weather_code)}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Humidity: <span style={{ color: 'var(--text-main)'}}>{current?.relative_humidity_2m}%</span></p>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Wind: <span style={{ color: 'var(--text-main)'}}>{current?.wind_speed_10m} km/h</span></p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
