import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language, translateContent } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    ourPartners: 'Our Partners',
    governmentOfKenya: 'Government of Kenya',
    ministryOfEducation: 'Ministry of Education',
    ministryOfTourism: 'Ministry of Tourism',
    ministryOfCulture: 'Ministry of Culture & Heritage',
    legal: 'Legal',
    terms: 'Terms & Conditions',
    dataProtection: 'Data Protection',
    faqs: 'FAQs',
    contact: 'Contact',
    copyright: '© 2026 Quantivo Virtual Experience Platform. All rights reserved.',
    tagline: "Kenya's premier virtual field trip platform."
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

  return (
    <footer style={{ background: '#1a237e', color: 'white', marginTop: '3rem' }}>
      
      {/* Partner Logos Section - White Background */}
      <div style={{ 
        background: 'white', 
        padding: '3rem 1.5rem',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h4 style={{ 
            color: '#1a237e', 
            fontSize: '1rem', 
            textTransform: 'uppercase', 
            letterSpacing: '3px',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            {t.ourPartners}
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <img 
                src="/GOK.svg" 
                alt={t.governmentOfKenya} 
                style={{ height: '75px', width: 'auto', maxWidth: '160px' }}
              />
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#333', fontWeight: '500' }}>
                {t.governmentOfKenya}
              </p>
            </div>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <img 
                src="/MOE.png" 
                alt={t.ministryOfEducation} 
                style={{ height: '75px', width: 'auto', maxWidth: '160px' }}
              />
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#333', fontWeight: '500' }}>
                {t.ministryOfEducation}
              </p>
            </div>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <img 
                src="/MOT.png" 
                alt={t.ministryOfTourism} 
                style={{ height: '75px', width: 'auto', maxWidth: '160px' }}
              />
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#333', fontWeight: '500' }}>
                {t.ministryOfTourism}
              </p>
            </div>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <img 
                src="/MOC.jpg" 
                alt={t.ministryOfCulture} 
                style={{ height: '75px', width: 'auto', maxWidth: '160px', borderRadius: '4px' }}
              />
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#333', fontWeight: '500' }}>
                {t.ministryOfCulture}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Footer Content */}
      <div style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Footer Links Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div>
              <img 
                src="/Quantivo.svg" 
                alt="Quantivo Logo" 
                style={{ height: '50px', width: 'auto', marginBottom: '0.5rem' }}
              />
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>QuantivoVR</h3>
              <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                {t.tagline}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{t.legal}</h4>
              <ul style={{ listStyle: 'none', marginTop: '0.5rem', padding: 0 }}>
                <li><Link to="/terms" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.terms}</Link></li>
                <li><Link to="/privacy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.dataProtection}</Link></li>
                <li><Link to="/faqs" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.faqs}</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{t.contact}</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                📧 <a href="mailto:quantivo.itech@gmail.com" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>quantivo.itech@gmail.com</a><br />
                📱 <a href="tel:+254715274418" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>+254 715 274 418</a>
              </p>
            </div>
          </div>

          {/* Social Media + Copyright */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.2rem'
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'white', fontSize: '1.3rem', opacity: 0.8 }}
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'white', fontSize: '1.3rem', opacity: 0.8 }}
                aria-label="Twitter"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'white', fontSize: '1.3rem', opacity: 0.8 }}
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'white', fontSize: '1.3rem', opacity: 0.8 }}
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {t.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;