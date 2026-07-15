import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

const Home = () => {
  const { language, translateContent } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(true);

  // Define all text content
  const texts = {
    heroTitle: '🌍 Explore Kenya Virtually',
    heroSubtitle: "Immersive VR & AR field trips aligned with CBC curriculum. Experience Maasai Mara, Nairobi National Museum, Lake Turkana and more.",
    browseTours: 'Browse Tours',
    becomeCreator: 'Become a Creator',
    whoFor: 'Who is Quantivo for?',
    studentsTeachers: 'Students & Teachers',
    studentsDesc: "CBC-aligned virtual field trips for Kenyan schools. Ksh 300 per student per visit.",
    registerSchool: 'Register as School',
    tourists: 'Tourists',
    touristsDesc: "Experience Kenya's wonders from anywhere in the world through immersive VR tours.",
    registerTourist: 'Register as Tourist',
    contentCreators: 'Content Creators',
    creatorsDesc: 'Create virtual tours, earn revenue (70% share), and showcase Kenya to the world.',
    becomeCreator2: 'Become a Creator',
    pricing: '💰 Pricing',
    perVisit: 'Per Visit Pricing',
    ksh: '🇰🇪 KES: Ksh 300 per student',
    usd: '🇺🇸 USD: $2.31 per student',
    eur: '🇪🇺 EUR: €2.13 per student',
    creatorShare: 'Creator Revenue Share',
    creatorShareDesc: 'Content creators earn 70% of each tour booking. Payouts via M-Pesa or bank transfer monthly.',
    seeTerms: 'See Terms & Conditions for full details.'
  };

  useEffect(() => {
    const translateAll = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        setLoading(false);
        return;
      }

      setLoading(true);
      const translated = {};
      
      for (const [key, value] of Object.entries(texts)) {
        const result = await translateContent(value);
        translated[key] = result;
      }
      
      setTranslatedTexts(translated);
      setLoading(false);
    };

    translateAll();
  }, [language]);

  // Show loading state
  if (loading && language !== 'en') {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #1e88e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const t = translatedTexts;

  return (
    <div className="container">
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #1e88e5 0%, #43a047 100%)',
        color: 'white',
        borderRadius: 20,
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.heroTitle}</h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '2rem', maxWidth: 800, margin: '0 auto 2rem' }}>
          {t.heroSubtitle}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/tours" className="btn btn-accent">{t.browseTours}</Link>
          <Link to="/register/creator" className="btn" style={{ background: 'white', color: '#1e88e5' }}>{t.becomeCreator}</Link>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1a237e' }}>{t.whoFor}</h2>
        <div className="grid-3">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <h3>{t.studentsTeachers}</h3>
            <p>{t.studentsDesc}</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t.registerSchool}</Link>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>✈️</div>
            <h3>{t.tourists}</h3>
            <p>{t.touristsDesc}</p>
            <Link to="/register/tourist" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t.registerTourist}</Link>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎬</div>
            <h3>{t.contentCreators}</h3>
            <p>{t.creatorsDesc}</p>
            <Link to="/register/creator" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t.becomeCreator2}</Link>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>{t.pricing}</h2>
        <div className="grid-2">
          <div>
            <h3>{t.perVisit}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>{t.ksh}</li>
              <li>{t.usd}</li>
              <li>{t.eur}</li>
            </ul>
          </div>
          <div>
            <h3>{t.creatorShare}</h3>
            <p>{t.creatorShareDesc}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              {t.seeTerms} <Link to="/terms">Terms & Conditions</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;