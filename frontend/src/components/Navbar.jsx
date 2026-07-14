import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '800',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.8rem' }}>🌍</span>
            Quantivo
          </Link>

          {/* Desktop Menu */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link to="/tours" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s', padding: '0.5rem 0', borderBottom: '2px solid transparent' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.85)'}>Tours</Link>
            <Link to="/faqs" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s', padding: '0.5rem 0', borderBottom: '2px solid transparent' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.85)'}>FAQs</Link>

            {user ? (
              <>
                {user.role === 'content_creator' && (
                  <Link to="/creator/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Creator</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Admin</Link>
                )}
                <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Dashboard</Link>
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
                  Logout
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
                  Login
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
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button - Animated */}
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

      {/* Mobile Dropdown Menu - Modern */}
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
            🎓 Tours
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
            ❓ FAQs
          </Link>

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
                  🎬 Creator Dashboard
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
                  🛡️ Admin
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
                📊 Dashboard
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
                🚪 Logout
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
                🔑 Login
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
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
