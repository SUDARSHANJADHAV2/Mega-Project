import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Headphones, PhoneCall, RadioTower, AlertTriangle, PlayCircle, StopCircle } from 'lucide-react';

export default function VoiceAssistant() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('journal');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ivrLog, setIvrLog] = useState([]);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      processAudioTranscript();
    } else {
      setTranscript('');
      setResult(null);
      // Set language based on active UI lang
      if (recognitionRef.current) {
        recognitionRef.current.lang = i18n.language === 'en' ? 'en-IN' : 'hi-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech Recognition is not supported in this browser. Please use Chrome.");
      }
    }
  };

  const processAudioTranscript = async () => {
    if (!transcript.trim()) return;
    
    try {
      let endpoint = '';
      if (activeTab === 'journal') endpoint = '/api/audio/parse-log';
      if (activeTab === 'pest') endpoint = '/api/audio/pest-query';
      
      if (endpoint) {
        const res = await axios.post(`http://localhost:8000${endpoint}`, { transcript });
        setResult(res.data);
      }
      
      // Feature A3: Global Voice Command Demo Simulation
      if (activeTab === 'nav') {
         if(transcript.toLowerCase().includes("market")) window.location.href = "/dashboard";
         if(transcript.toLowerCase().includes("weather")) window.location.href = "/forecast";
         setResult({ interpreted_command: transcript, action: "Triggering UI Navigation Event" });
      }
    } catch (e) {
      console.error(e);
      setResult({ error: "Failed to process voice command." });
    }
  };

  const playPodcast = async () => {
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/audio/daily-briefing?lang=${i18n.language}`);
      const utterance = new SpeechSynthesisUtterance(res.data.briefing_script);
      utterance.lang = res.data.recommended_voice_lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      
      synthRef.current.speak(utterance);
      setIsPlaying(true);
      setResult({ ...res.data, status: "Playing Audio" });
    } catch (e) {
      console.error(e);
    }
  };

  const simulateIVRPress = (digit) => {
    setIvrLog(prev => [...prev, `Pressed: ${digit}`]);
    const responses = {
      '1': "You selected Weather Alerts. No active cyclones. Press 0 to return.",
      '2': "You selected Market Prices. Wheat is 2300 rupees. Press 0 to return.",
      '3': "Routing you to Kisan Call Center agent. Please hold...",
      '0': "Main Menu. Press 1 for Weather, 2 for Market, 3 for Agent."
    };
    
    const text = responses[digit] || "Invalid input.";
    setIvrLog(prev => [...prev, `IVR: ${text}`]);
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    synthRef.current.speak(utterance);
  };

  const tabs = [
    { id: 'journal', label: 'Voice Logbook', icon: PlayCircle },
    { id: 'pest', label: 'Describe Pest', icon: Mic },
    { id: 'podcast', label: 'Agri-Podcast', icon: RadioTower },
    { id: 'nav', label: 'Voice Command', icon: Headphones },
    { id: 'ivr', label: 'Offline IVR Demo', icon: PhoneCall },
    { id: 'alert', label: 'TTS Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent">
          {t('Voice & Audio AI')}
        </h1>
        <div className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/30 flex items-center gap-2">
          <Headphones size={16}/> Voice Navigation Ready
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); setTranscript(''); if(synthRef.current) synthRef.current.cancel(); setIsPlaying(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.2)] border-pink-500/50 text-pink-400'
                : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[400px]">
        {/* Dynamic Content based on tabs */}
        {(activeTab === 'journal' || activeTab === 'pest' || activeTab === 'nav') && (
          <div className="flex flex-col items-center justify-center space-y-8 py-8">
            <button
              onClick={toggleListening}
              className={`p-8 rounded-full transition-all duration-300 shadow-xl ${
                isListening 
                  ? 'bg-rose-500 animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.6)]' 
                  : 'bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-pink-500'
              }`}
            >
              {isListening ? <MicOff size={48} className="text-white" /> : <Mic size={48} className="text-slate-300" />}
            </button>
            <div className="w-full max-w-2xl bg-slate-900/50 min-h-[100px] p-6 rounded-2xl border border-white/5 font-mono text-slate-300 text-lg">
               {transcript || (isListening ? "Listening intently..." : "Tap the microphone to speak...")}
            </div>

            {result && !result.error && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-2xl bg-pink-500/10 border border-pink-500/20 p-6 rounded-2xl">
                 <h3 className="text-pink-400 font-bold mb-4 font-mono">NLP PROCESSING RESULT:</h3>
                 {Object.entries(result).map(([k,v]) => {
                   if(typeof v === 'object') v = JSON.stringify(v);
                   return <div key={k} className="mb-2"><span className="text-slate-400 capitalize">{k.replace(/_/g, ' ')}:</span> <span className="text-white font-semibold">{v}</span></div>
                 })}
              </motion.div>
            )}
            
            {result && result.error && <div className="text-red-400">{result.error}</div>}
          </div>
        )}

        {activeTab === 'podcast' && (
          <div className="flex flex-col items-center justify-center space-y-8 py-12">
             <RadioTower size={80} className={`text-pink-500 ${isPlaying ? 'animate-pulse drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]' : 'opacity-50'}`} />
             <div className="text-center">
               <h2 className="text-2xl font-bold text-white mb-2">KrushiAI Autonomous Briefing</h2>
               <p className="text-slate-400 max-w-md mx-auto">A personalized daily podcast summarizing your farm's weather, imminent risks, and local market swings, entirely synthesized by Artificial Intelligence.</p>
             </div>
             <button onClick={playPodcast} className="px-8 py-4 bg-pink-600 hover:bg-pink-700 rounded-full font-bold text-white flex items-center gap-3 transition-colors shadow-lg">
                {isPlaying ? <><StopCircle size={24}/> Stop Playback</> : <><PlayCircle size={24}/> Generate & Play Daily Briefing</>}
             </button>
             {result && result.briefing_script && (
               <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full">
                 <p className="text-slate-300 italic">"{result.briefing_script}"</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'ivr' && (
          <div className="grid md:grid-cols-2 gap-8 items-center justify-center p-4">
            <div className="flex flex-col items-center">
              <div className="bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 w-[280px]">
                 <div className="bg-slate-800 h-16 rounded-xl mb-6 flex items-center justify-center border border-slate-600">
                    <span className="text-green-400 font-mono text-xl animate-pulse">Call Connected...</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                   {['1','2','3','4','5','6','7','8','9','*','0','#'].map((btn) => (
                     <button key={btn} onClick={() => simulateIVRPress(btn)} className="w-14 h-14 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-2xl text-white font-bold transition-transform active:scale-90">
                       {btn}
                     </button>
                   ))}
                 </div>
                 <div className="mt-6 flex justify-center">
                   <button onClick={() => { setIvrLog([]); if(synthRef.current) synthRef.current.cancel(); simulateIVRPress('0'); }} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">Dial System</button>
                 </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-white/5 h-full p-6 font-mono text-sm overflow-y-auto max-h-[400px]">
               <h3 className="text-slate-400 mb-4 border-b border-slate-700 pb-2">IVR System Log</h3>
               {ivrLog.map((log, i) => (
                 <div key={i} className={`mb-2 ${log.startsWith('Pressed') ? 'text-pink-400 text-right' : 'text-emerald-400'}`}>
                   {log}
                 </div>
               ))}
               {ivrLog.length === 0 && <span className="text-slate-600" >Press "Dial System" to initiate interface...</span>}
            </div>
          </div>
        )}

        {activeTab === 'alert' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
             <AlertTriangle size={64} className="text-amber-500 opacity-50 block mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-white">Multi-Speaker Emergency System</h2>
             <p className="text-slate-400 max-w-lg">In production, this module broadcasts loud TTS weather alarms (e.g., "Cyclone hitting in 2 hours") bypassing silent protocols purely utilizing browser AudioContext override hooks.</p>
             <button onClick={() => {
                const u = new SpeechSynthesisUtterance("WARNING: Extreme weather front approaching from North. Secure farm equipment immediately.");
                u.volume = 1; u.rate = 1.1; u.lang = 'en-IN';
                synthRef.current.speak(u);
             }} className="px-6 py-3 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-lg hover:bg-amber-500 hover:text-white transition-colors font-bold flex items-center gap-2">
                <AlertTriangle size={20}/> Trigger Test Alert
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
