import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TourDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({ studentCount: 1, currency: 'KSH', phoneNumber: '' });

  useEffect(() => {
    api.get(`/tours/${id}`).then(res => setTour(res.data.data));
  }, [id]);

  const EXCHANGE_RATES = { KSH: 1, USD: 0.0077, EUR: 0.0071, JPY: 1.15 };
  const SYMBOLS = { KSH: 'Ksh ', USD: '$', EUR: '€', JPY: '¥' };

  const calculatePrice = () => {
    const base = 300;
    const total = base * formData.studentCount * EXCHANGE_RATES[formData.currency];
    return `${SYMBOLS[formData.currency]}${total.toFixed(2)} ${formData.currency}`;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/payments/initiate', {
        tourId: id,
        studentCount: formData.studentCount,
        phoneNumber: formData.phoneNumber,
        currency: formData.currency
      });
      alert(`✅ Payment initiated! Check phone ${formData.phoneNumber} for M-Pesa prompt.\nTransaction ID: ${res.data.data.transactionId}`);
      setShowPayment(false);
      navigate(`/vr/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  if (!tour) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <Link to="/tours" style={{ color: '#1e88e5', marginBottom: '1rem', display: 'inline-block' }}>← Back to Tours</Link>

      <div className="card">
        {/* Hero Image - Display thumbnail or fallback to emoji */}
        <div style={{ 
          height: 300, 
          borderRadius: 15, 
          marginBottom: '1.5rem',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e88e5, #43a047)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {tour.thumbnailUrl ? (
            <img 
              src={tour.thumbnailUrl} 
              alt={tour.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '6rem' }}>
              {tour.category === 'wildlife' ? '🦁' : '🌍'}
            </span>
          )}
        </div>

        <h1 style={{ color: '#1a237e', marginBottom: '0.5rem' }}>{tour.title}</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>By: {tour.creatorName} | Category: {tour.category}</p>
        <p style={{ marginBottom: '1.5rem' }}>{tour.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
            <strong>📍 Location:</strong> {tour.location?.county}
          </div>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
            <strong>👁️ Views:</strong> {tour.totalViews}
          </div>
          <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: 10 }}>
            <strong>💰 Price:</strong> Ksh {tour.price?.ksh} / student
          </div>
        </div>

        <button onClick={() => setShowPayment(true)} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
          🎟️ Book This Tour - Ksh {tour.price?.ksh} per student
        </button>
      </div>

      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', margin: 0 }}>
            <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>💳 Book Tour</h2>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Number of Students</label>
                <input type="number" min="1" required value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                  <option value="KSH">KES - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div className="form-group">
                <label>M-Pesa Phone Number</label>
                <input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="07XXXXXXXX" />
              </div>
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10, marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem' }}>Total Amount</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a237e' }}>{calculatePrice()}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowPayment(false)} className="btn" style={{ flex: 1, background: '#ddd' }}>Cancel</button>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>Pay with M-Pesa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;