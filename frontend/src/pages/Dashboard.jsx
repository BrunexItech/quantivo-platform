import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/payments/my-transactions').then(res => setTransactions(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>Welcome, {user?.name} 👋</h1>
      <div className="grid-3">
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e88e5, #43a047)', color: 'white' }}>
          <h3>Role</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{user?.role?.toUpperCase()}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ff6f00, #ff8f00)', color: 'white' }}>
          <h3>Tours Taken</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{transactions.length}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)', color: 'white' }}>
          <h3>Institution</h3>
          <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{user?.institution?.name || user?.touristProfile?.country || 'N/A'}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>🎓 Browse Virtual Tours</h2>
        <p>Start exploring Kenya's wonders through immersive VR & AR experiences.</p>
        <Link to="/tours" className="btn btn-primary" style={{ marginTop: '1rem' }}>View All Tours</Link>
      </div>

      {transactions.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>📜 Recent Bookings</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e3f2fd' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Tour</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.8rem' }}>{t.tour?.title}</td>
                  <td style={{ padding: '0.8rem' }}>Ksh {t.amount?.ksh}</td>
                  <td style={{ padding: '0.8rem' }}><span style={{ background: t.status === 'completed' ? '#c8e6c9' : '#fff3e0', padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.85rem' }}>{t.status}</span></td>
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
