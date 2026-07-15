import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, translateContent } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    tours: 'Tours',
    faqs: 'FAQs',
    creator: 'Creator',
    admin: 'Admin',
    dashboard: 'Dashboard',
    logout: 'Logout',
    login: 'Login',
    getStarted: 'Get Started',
    toursIcon: '🎓 Tours',
    faqsIcon: '❓ FAQs',
    creatorDashboard: '🎬 Creator Dashboard',
    adminIcon: '🛡️ Admin',
    dashboardIcon: '📊 Dashboard',
    loginIcon: '🔑 Login',
    getStartedIcon: 'Get Started',
    logoutIcon: '🚪 Logout'
  };

  useEffect(() => {
    const translateTexts = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        return;
      }

      const translated = {};
      for (const [key, value] of Object.entries(texts)) {
        const result = await translateContent(value);
        translated[key] = result;
      }
      setTranslatedTexts(translated);
    };

    translateTexts();
  }, [language]);

  const t = translatedTexts;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' }
  ];

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 50%, #1e88e5 100%)',
        padding: '0.8rem 2rem',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}>
            <img 
              src="/Quantivo.svg" 
              alt="Quantivo Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
            <span style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}>
              QuantivoVR
            </span>
          </Link>

          {/* Desktop Menu */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <Link to="/tours" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s', padding: '0.5rem 0', borderBottom: '2px solid transparent' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.85)'}>{t.tours}</Link>
            <Link to="/faqs" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s', padding: '0.5rem 0', borderBottom: '2px solid transparent' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.85)'}>{t.faqs}</Link>

            {user ? (
              <>
                {user.role === 'content_creator' && (
                  <Link to="/creator/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>{t.creator}</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>{t.admin}</Link>
                )}
                <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>{t.dashboard}</Link>
                <span style={{
                  background: 'rgba(255,255,255,0.12)',
                  padding: '0.4rem 1rem',
                  borderRadius: 50,
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  👤 {user.name}
                </span>
                <button onClick={handleLogout} style={{
                  background: 'rgba(255,82,82,0.2)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255,82,82,0.3)',
                  padding: '0.4rem 1.2rem',
                  borderRadius: 50,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }} onMouseEnter={(e) => { e.target.style.background = '#ff5252'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(255,82,82,0.2)'; e.target.style.color = '#ff6b6b'; }}>
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  padding: '0.4rem 1.2rem',
                  borderRadius: 50,
                  background: 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s'
                }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}>
                  {t.login}
                </Link>
                <Link to="/register" style={{
                  background: 'linear-gradient(135deg, #ff6f00, #f57c00)',
                  color: 'white',
                  padding: '0.4rem 1.5rem',
                  borderRadius: 50,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 4px 15px rgba(255,111,0,0.3)'
                }} onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 25px rgba(255,111,0,0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 15px rgba(255,111,0,0.3)'; }}>
                  {t.getStarted}
                </Link>
              </>
            )}

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.4rem 1rem',
                borderRadius: 50,
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                backdropFilter: 'blur(5px)'
              }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: '#1a237e', color: 'white' }}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            style={{
              display: isMobile ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              width: '40px',
              height: '40px',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
            aria-label="Toggle menu"
          >
            <span style={{
              display: 'block',
              width: '28px',
              height: '3px',
              background: 'white',
              borderRadius: '3px',
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)'
            }} />
            <span style={{
              display: 'block',
              width: '28px',
              height: '3px',
              background: 'white',
              borderRadius: '3px',
              transition: 'all 0.3s ease',
              opacity: isOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block',
              width: '28px',
              height: '3px',
              background: 'white',
              borderRadius: '3px',
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'rotate(0)'
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div style={{
        position: 'fixed',
        top: '70px',
        left: 0,
        right: 0,
        background: 'rgba(13, 27, 42, 0.98)',
        backdropFilter: 'blur(20px)',
        padding: isOpen ? '2rem 2rem' : '0 2rem',
        maxHeight: isOpen ? 'calc(100vh - 70px)' : '0',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        borderBottom: isOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: 400,
          margin: '0 auto'
        }}>
          <Link to="/tours" onClick={() => setIsOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            transition: 'background 0.3s',
            fontWeight: '500'
          }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
            {t.toursIcon}
          </Link>
          <Link to="/faqs" onClick={() => setIsOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            transition: 'background 0.3s',
            fontWeight: '500'
          }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
            {t.faqsIcon}
          </Link>

          {/* Mobile Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
              marginTop: '0.5rem'
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} style={{ background: '#1a237e', color: 'white' }}>
                {lang.label}
              </option>
            ))}
          </select>

          {user ? (
            <>
              {user.role === 'content_creator' && (
                <Link to="/creator/dashboard" onClick={() => setIsOpen(false)} style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  transition: 'background 0.3s',
                  fontWeight: '500'
                }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                  {t.creatorDashboard}
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  transition: 'background 0.3s',
                  fontWeight: '500'
                }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                  {t.adminIcon}
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                transition: 'background 0.3s',
                fontWeight: '500'
              }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                {t.dashboardIcon}
              </Link>
              <div style={{
                padding: '0.8rem 1rem',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '0.5rem',
                paddingTop: '1rem'
              }}>
                👤 {user.name}
              </div>
              <button onClick={handleLogout} style={{
                background: 'linear-gradient(135deg, #ff5252, #d32f2f)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '0.5rem',
                transition: 'transform 0.3s'
              }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                {t.logoutIcon}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                transition: 'background 0.3s',
                fontWeight: '500'
              }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                {t.loginIcon}
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} style={{
                background: 'linear-gradient(135deg, #ff6f00, #f57c00)',
                color: 'white',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                textAlign: 'center',
                marginTop: '0.5rem',
                transition: 'transform 0.3s'
              }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                {t.getStartedIcon}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;