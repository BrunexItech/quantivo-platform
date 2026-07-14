import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ totalEarnings: 0, pendingEarnings: 0, recentTransactions: [] });
  const [myTours, setMyTours] = useState([]);

  useEffect(() => {
    api.get('/creators/earnings').then(res => setEarnings(res.data.data));
    api.get('/tours/my-tours').then(res => setMyTours(res.data.data));
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e' }}>🎬 Creator Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <div className="grid-3" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #43a047, #66bb6a)', color: 'white' }}>
          <h3>Total Earnings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Ksh {earnings.totalEarnings?.toLocaleString()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ff6f00, #ffa726)', color: 'white' }}>
          <h3>Pending Payout</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Ksh {earnings.pendingEarnings?.toLocaleString()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e88e5, #42a5f5)', color: 'white' }}>
          <h3>My Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{myTours.length}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#1a237e' }}>My Tours</h2>
          <Link to="/creator/create-tour" className="btn btn-primary">+ Create New Tour</Link>
        </div>
        {myTours.length === 0 ? (
          <p>You haven't created any tours yet. <Link to="/creator/create-tour">Create your first tour!</Link></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e3f2fd' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Views</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Revenue</th>
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
                    }}>{t.status}</span>
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
        <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>💰 Revenue Share Terms</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ You earn <strong>70%</strong> of every tour booking</li>
          <li>✅ Payouts processed monthly via M-Pesa or bank transfer</li>
          <li>✅ Minimum payout threshold: Ksh 1,000</li>
          <li>✅ All tours require admin quality approval before going live</li>
          <li>✅ See <Link to="/terms">full terms</Link> for details</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatorDashboard;
