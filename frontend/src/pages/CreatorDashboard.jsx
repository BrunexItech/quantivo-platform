import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { language, translateContent } = useLanguage();
  const [earnings, setEarnings] = useState({ totalEarnings: 0, pendingEarnings: 0, recentTransactions: [] });
  const [myTours, setMyTours] = useState([]);
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    title: '🎬 Creator Dashboard',
    welcome: 'Welcome',
    totalEarnings: 'Total Earnings',
    pendingPayout: 'Pending Payout',
    myTours: 'My Tours',
    myToursTitle: 'My Tours',
    createNewTour: '+ Create New Tour',
    noTours: "You haven't created any tours yet.",
    createFirstTour: 'Create your first tour!',
    titleCol: 'Title',
    statusCol: 'Status',
    viewsCol: 'Views',
    revenueCol: 'Revenue',
    approved: 'approved',
    pending: 'pending',
    rejected: 'rejected',
    revenueShareTitle: '💰 Revenue Share Terms',
    revenueShare1: 'You earn 70% of every tour booking',
    revenueShare2: 'Payouts processed monthly via M-Pesa or bank transfer',
    revenueShare3: 'Minimum payout threshold: Ksh 1,000',
    revenueShare4: 'All tours require admin quality approval before going live',
    revenueShare5: 'See full terms for details',
    fullTerms: 'full terms'
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
    api.get('/creators/earnings').then(res => setEarnings(res.data.data));
    api.get('/tours/my-tours').then(res => setMyTours(res.data.data));
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e' }}>{t.title}</h1>
      <p>{t.welcome}, {user?.name}</p>

      <div className="grid-3" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #43a047, #66bb6a)', color: 'white' }}>
          <h3>{t.totalEarnings}</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Ksh {earnings.totalEarnings?.toLocaleString()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ff6f00, #ffa726)', color: 'white' }}>
          <h3>{t.pendingPayout}</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Ksh {earnings.pendingEarnings?.toLocaleString()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e88e5, #42a5f5)', color: 'white' }}>
          <h3>{t.myTours}</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{myTours.length}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#1a237e' }}>{t.myToursTitle}</h2>
          <Link to="/creator/create-tour" className="btn btn-primary">{t.createNewTour}</Link>
        </div>
        {myTours.length === 0 ? (
          <p>{t.noTours} <Link to="/creator/create-tour">{t.createFirstTour}</Link></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e3f2fd' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.titleCol}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.statusCol}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.viewsCol}</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>{t.revenueCol}</th>
              </tr>
            </thead>
            <tbody>
              {myTours.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.8rem' }}>{t.title}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem', borderRadius: 10, fontSize: '0.85rem',
                      background: t.status === 'approved' ? '#c8e6c9' : t.status === 'pending' ? '#fff3e0' : '#ffcdd2'
                    }}>
                      {t.status === 'approved' ? t.approved : t.status === 'pending' ? t.pending : t.rejected}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>{t.totalViews}</td>
                  <td style={{ padding: '0.8rem' }}>Ksh {t.totalRevenue?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>{t.revenueShareTitle}</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ {t.revenueShare1}</li>
          <li>✅ {t.revenueShare2}</li>
          <li>✅ {t.revenueShare3}</li>
          <li>✅ {t.revenueShare4}</li>
          <li>✅ {t.revenueShare5} <Link to="/terms">{t.fullTerms}</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default CreatorDashboard;