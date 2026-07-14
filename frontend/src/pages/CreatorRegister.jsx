import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', bio: '', portfolio: '', mpesaNumber: '', dataConsent: false
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataConsent) {
      setError('You must consent to data processing');
      return;
    }
    try {
      await register(formData, '/auth/register-creator');
      navigate('/creator/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: '8rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#1a237e' }}>🎬 Content Creator Registration</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>Earn 70% revenue share on every tour booking!</p>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: 8, margin: '1rem 0' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone (M-Pesa)</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="07XXXXXXXX" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bio / Experience</label>
            <textarea rows="3" required value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Portfolio URL</label>
            <input type="url" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>M-Pesa Number (for payouts)</label>
            <input type="tel" required value={formData.mpesaNumber} onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })} placeholder="07XXXXXXXX" />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontWeight: 'normal' }}>
              <input type="checkbox" required checked={formData.dataConsent} onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })} style={{ width: 'auto', marginTop: '0.3rem' }} />
              <span style={{ fontSize: '0.9rem' }}>
                I agree to the <Link to="/terms">Creator Terms</Link> and <Link to="/privacy">Data Protection</Link>. I understand I earn 70% of each tour booking after admin quality approval.
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register as Creator</button>
        </form>
      </div>
    </div>
  );
};

export default CreatorRegister;
