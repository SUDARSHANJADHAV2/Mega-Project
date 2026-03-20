import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LogOut, UserIcon, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setShowAuthModal, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Close mobile menu when route changes
  React.useEffect(() => { setIsMobileMenuOpen(false); setIsAiDropdownOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Farm Maps', path: '/map' },
    { name: 'Krushi Mandi', path: '/market' },
    { name: 'Ledger', path: '/ledger' },
    { name: 'Rent Equipment', path: '/equipment' },
    { name: 'Govt Schemes', path: '/schemes' },
    { name: 'Data Dashboard', path: '/dashboard' }
  ];

  return (
    <nav className="navbar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <NavLink to="/" className="nav-brand">
          <Leaf size={28} color="#10b981" /> KrushiAI
        </NavLink>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          
          {/* AI Models Dropdown */}
          <div 
            className="dropdown-container" 
            onMouseEnter={() => setIsAiDropdownOpen(true)} 
            onMouseLeave={() => setIsAiDropdownOpen(false)}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <button className="nav-link" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <Sparkles size={16} color="#818cf8" /> Enterprise AI <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {isAiDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="dropdown-menu glass-panel"
                >
                  <NavLink to="/crop" className="dropdown-item">Crop Recommender</NavLink>
                  <NavLink to="/yield" className="dropdown-item">Yield Predictor <span className="badge">New</span></NavLink>
                  <NavLink to="/weed" className="dropdown-item">Weed Detector <span className="badge">New</span></NavLink>
                  <NavLink to="/pest" className="dropdown-item">Pest Recognition <span className="badge">New</span></NavLink>
                  <NavLink to="/irrigation" className="dropdown-item">Irrigation Forecaster <span className="badge">New</span></NavLink>
                  <NavLink to="/fertilizer" className="dropdown-item">Fertilizer Recommender</NavLink>
                  <NavLink to="/disease" className="dropdown-item">Disease Diagnosis</NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/map" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Farm Maps</NavLink>
          <NavLink to="/market" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Krushi Mandi</NavLink>
          <NavLink to="/ledger" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Ledger</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          
          {/* Auth UI */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
            {user ? (
              <>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserIcon size={16} /> {user.name?.split(' ')[0] || "User"}
                </span>
                <button onClick={logout} className="btn" style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign In</button>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>
      </div>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-menu glass-panel"
            style={{ overflow: 'hidden', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}
          >
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div style={{ color: '#818cf8', fontWeight: 600, padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Sparkles size={16} /> Enterprise AI Models
               </div>
               <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '1rem' }}>
                  <NavLink to="/crop" className="mobile-nav-link">Crop Recommender</NavLink>
                  <NavLink to="/yield" className="mobile-nav-link" style={{ display: 'flex', justifyContent: 'space-between' }}>Yield Predictor <span className="badge">New</span></NavLink>
                  <NavLink to="/weed" className="mobile-nav-link" style={{ display: 'flex', justifyContent: 'space-between' }}>Weed Detector <span className="badge">New</span></NavLink>
                  <NavLink to="/pest" className="mobile-nav-link" style={{ display: 'flex', justifyContent: 'space-between' }}>Pest Recognition <span className="badge">New</span></NavLink>
                  <NavLink to="/irrigation" className="mobile-nav-link" style={{ display: 'flex', justifyContent: 'space-between' }}>Irrigation <span className="badge">New</span></NavLink>
                  <NavLink to="/fertilizer" className="mobile-nav-link">Fertilizer Recommender</NavLink>
                  <NavLink to="/disease" className="mobile-nav-link">Disease Diagnosis</NavLink>
               </div>

               <div style={{ component: 'hr', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

               {navLinks.map(link => (
                 link.name !== 'Home' && <NavLink key={link.path} to={link.path} className="mobile-nav-link">{link.name}</NavLink>
               ))}
               
               <div style={{ component: 'hr', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

               {user ? (
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserIcon size={16} /> {user.name?.split(' ')[0] || "User"}
                    </span>
                    <button onClick={logout} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                      <LogOut size={16} /> Logout
                    </button>
                 </div>
               ) : (
                 <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Sign In / Register</button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
