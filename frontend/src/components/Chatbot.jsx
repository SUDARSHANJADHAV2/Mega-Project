import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import api from '../api';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your KrushiAI Farming Assistant. Ask me about crops, fertilizers, pest control, or government subsidies.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Speech Recognition.");
      }
    }
  };

  const handleReadAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/api/chatbot', { message: userMessage });
      
      if (response.data.reply.includes("Configuration Error:")) {
        setMessages(prev => [...prev, { role: 'assistant', content: "API Key Missing", isError: true, errorType: 'config' }]);
      } else if (response.data.reply.includes("AI Engine Error:")) {
        setMessages(prev => [...prev, { role: 'assistant', content: "The AI engine encountered an error while processing your request.", isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the KrushiAI Server right now.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '380px',
              height: '550px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 998,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#6366f1', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
                 <Bot size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>KrushiAI Assistant</h3>
                <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> 
                   Online
                </p>
              </div>
              <button 
                onClick={toggleChat} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: m.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', 
                    padding: '0.5rem', 
                    borderRadius: '50%', 
                    color: m.role === 'user' ? '#818cf8' : 'var(--text-muted)' 
                  }}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{ 
                    background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : (m.isError ? 'rgba(244, 63, 94, 0.1)' : 'rgba(30, 41, 59, 0.85)'),
                    color: m.role === 'user' ? 'white' : (m.isError ? '#f43f5e' : 'var(--text-main)'),
                    padding: '0.9rem 1.1rem',
                    borderRadius: '1.25rem',
                    borderTopRightRadius: m.role === 'user' ? '0.25rem' : '1.25rem',
                    borderTopLeftRadius: m.role === 'user' ? '1.25rem' : '0.25rem',
                    maxWidth: '85%',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    border: m.role !== 'user' ? (m.isError ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border)') : 'none',
                    boxShadow: m.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                    backdropFilter: m.role !== 'user' ? 'blur(10px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {m.content}
                    
                    {m.errorType === 'config' && (
                      <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                        <p style={{ marginBottom: '0.5rem' }}>To enable the AI Assistant, please add your free Groq token to the backend.</p>
                        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
                          <li>Visit console.groq.com</li>
                          <li>Generate a free API key</li>
                          <li>Add it to <code style={{ color: '#818cf8' }}>backend/.env</code> as <code style={{ color: '#818cf8' }}>GROQ_API_KEY</code></li>
                        </ol>
                      </div>
                    )}
                    
                    {m.role !== 'user' && !m.isError && (
                       <button onClick={() => handleReadAloud(m.content)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', alignSelf: 'flex-end', marginTop: '0.25rem', padding: 0 }} aria-label="Read aloud">
                          <Volume2 size={16} />
                       </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div className="animate-pulse-glow" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
                      <Bot size={16} />
                    </div>
                    <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '1rem', borderRadius: '1.25rem', borderTopLeftRadius: '0.25rem', display: 'flex', gap: '6px', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                    </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask agriculture queries..."
                className="form-input"
                style={{ marginBottom: 0, padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.8)', flexGrow: 1 }}
              />
              <button 
                type="button"
                onClick={toggleListen}
                style={{ 
                   background: isListening ? '#ef4444' : 'rgba(255,255,255,0.05)', 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: '0.5rem', 
                   padding: '0 0.5rem',
                   cursor: 'pointer',
                   transition: 'all 0.3s'
                }}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} color="var(--text-muted)" />}
              </button>
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                style={{ 
                   background: (!loading && input.trim()) ? '#6366f1' : 'rgba(99, 102, 241, 0.5)', 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: '0.5rem', 
                   padding: '0 0.75rem',
                   cursor: (!loading && input.trim()) ? 'pointer' : 'not-allowed',
                   transition: 'all 0.3s'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
