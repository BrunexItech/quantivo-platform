import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TouristRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', county: '', interests: [], dataConsent: false
  });
  const [counties, setCounties] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(true);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const interestOptions = ['Wildlife', 'History', 'Culture', 'Beaches', 'Mountains', 'Cities'];

  const API_KEY = 'keyPub1569gsvndc123kg9sjhg';
  const BASE_URL = 'https://kenyaareadata.vercel.app/api/areas';

  // Fetch Kenyan counties on component mount
  useEffect(() => {
    const fetchCounties = async () => {
      setLoadingCounties(true);
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}`);
        const data = await response.json();
        const countyNames = Object.keys(data).sort();
        setCounties(countyNames);
      } catch (err) {
        console.error('Failed to fetch counties:', err);
        setError('Could not load counties. Please refresh and try again.');
      } finally {
        setLoadingCounties(false);
      }
    };

    fetchCounties();
  }, []);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataConsent) {
      setError('You must consent to data processing');
      return;
    }
    try {
      await register(formData, '/auth/register-tourist');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: '8rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#1a237e' }}>✈️ Tourist Registration</h2>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: 8, margin: '1rem 0' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
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
            <label>County</label>
            <select 
              required 
              value={formData.county} 
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              disabled={loadingCounties}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #ddd', borderRadius: '8px' }}
            >
              <option value="">
                {loadingCounties ? 'Loading counties...' : 'Select county'}
              </option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Interests</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {interestOptions.map(i => (
                <button key={i} type="button" onClick={() => toggleInterest(i)} style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid',
                  borderColor: formData.interests.includes(i) ? '#1e88e5' : '#ddd',
                  background: formData.interests.includes(i) ? '#e3f2fd' : 'white',
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>{i}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontWeight: 'normal' }}>
              <input type="checkbox" required checked={formData.dataConsent} onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })} style={{ width: 'auto', marginTop: '0.3rem' }} />
              <span style={{ fontSize: '0.9rem' }}>I consent to data processing per <Link to="/privacy">Kenya DPA 2019</Link>.</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register as Tourist</button>
        </form>
      </div>
    </div>
  );
};

export default TouristRegister;