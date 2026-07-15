import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { language, translateContent } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    welcome: 'Welcome',
    role: 'Role',
    toursTaken: 'Tours Taken',
    institution: 'Institution',
    notAvailable: 'N/A',
    browseTitle: '🎓 Browse Virtual Tours',
    browseDesc: "Start exploring Kenya's wonders through immersive VR & AR experiences.",
    viewAllTours: 'View All Tours',
    recentBookings: '📜 Recent Bookings',
    tour: 'Tour',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    completed: 'completed',
    pending: 'pending'
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
    api.get('/payments/my-transactions').then(res => setTransactions(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>{t.welcome}, {user?.name} 👋</h1>
      <div className="grid-3">
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e88e5, #43a047)', color: 'white' }}>
          <h3>{t.role}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{user?.role?.toUpperCase()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ff6f00, #ff8f00)', color: 'white' }}>
          <h3>{t.toursTaken}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{transactions.length}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)', color: 'white' }}>
          <h3>{t.institution}</h3>
          <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{user?.institution?.name || user?.touristProfile?.country || t.notAvailable}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>{t.browseTitle}</h2>
        <p>{t.browseDesc}</p>
        <Link to="/tours" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t.viewAllTours}</Link>
      </div>

      {transactions.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>{t.recentBookings}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e3f2fd' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.tour}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.amount}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.status}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.8rem' }}>{t.tour?.title}</td>
                  <td style={{ padding: '0.8rem' }}>Ksh {t.amount?.ksh}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ 
                      background: t.status === 'completed' ? '#c8e6c9' : '#fff3e0', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: 10, 
                      fontSize: '0.85rem' 
                    }}>
                      {t.status === 'completed' ? t.completed : t.pending}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;