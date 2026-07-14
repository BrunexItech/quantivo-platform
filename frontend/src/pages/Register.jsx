import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'student', dataConsent: false,
    institution: { name: '', county: '', subCounty: '', ward: '', level: '' }
  });
  const [counties, setCounties] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({ counties: false, constituencies: false, wards: false });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const API_KEY = 'keyPub1569gsvndc123kg9sjhg';
  const BASE_URL = 'https://kenyaareadata.vercel.app/api/areas';

  // Fetch all counties on mount
  useEffect(() => {
    const fetchCounties = async () => {
      setLoading(prev => ({ ...prev, counties: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}`);
        const data = await response.json();
        const countyNames = Object.keys(data).sort();
        setCounties(countyNames);
      } catch (err) {
        console.error('Failed to fetch counties:', err);
        setError('Could not load counties. Please refresh and try again.');
      } finally {
        setLoading(prev => ({ ...prev, counties: false }));
      }
    };
    fetchCounties();
  }, []);

  // Fetch constituencies when county changes
  useEffect(() => {
    if (!formData.institution.county) {
      setConstituencies([]);
      setWards([]);
      return;
    }

    const fetchConstituencies = async () => {
      setLoading(prev => ({ ...prev, constituencies: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(formData.institution.county)}`);
        const data = await response.json();
        const countyData = data[formData.institution.county];
        if (countyData) {
          const constituencyNames = Object.keys(countyData).sort();
          setConstituencies(constituencyNames);
        } else {
          setConstituencies([]);
        }
        setFormData(prev => ({
          ...prev,
          institution: { ...prev.institution, subCounty: '', ward: '' }
        }));
        setWards([]);
      } catch (err) {
        console.error('Failed to fetch constituencies:', err);
        setError('Could not load sub-counties. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, constituencies: false }));
      }
    };
    fetchConstituencies();
  }, [formData.institution.county]);

  // Fetch wards when constituency changes
  useEffect(() => {
    if (!formData.institution.county || !formData.institution.subCounty) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      setLoading(prev => ({ ...prev, wards: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(formData.institution.county)}&constituency=${encodeURIComponent(formData.institution.subCounty)}`);
        const data = await response.json();
        const countyData = data[formData.institution.county];
        if (countyData && countyData[formData.institution.subCounty]) {
          const wardNames = countyData[formData.institution.subCounty].sort();
          setWards(wardNames);
        } else {
          setWards([]);
        }
        setFormData(prev => ({
          ...prev,
          institution: { ...prev.institution, ward: '' }
        }));
      } catch (err) {
        console.error('Failed to fetch wards:', err);
        setError('Could not load wards. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, wards: false }));
      }
    };
    fetchWards();
  }, [formData.institution.county, formData.institution.subCounty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataConsent) {
      setError('You must consent to data processing');
      return;
    }
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const updateInstitution = (field, value) => {
    setFormData({
      ...formData,
      institution: { ...formData.institution, [field]: value }
    });
  };

  return (
    <div className="container" style={{ maxWidth: 700, marginTop: '8rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#1a237e', marginBottom: '1.5rem' }}>Register - Students & Teachers</h2>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <h3 style={{ marginTop: '1.5rem', color: '#1a237e' }}>Institution Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>County</label>
              <select 
                required 
                value={formData.institution.county} 
                onChange={(e) => updateInstitution('county', e.target.value)}
                disabled={loading.counties}
              >
                <option value="">{loading.counties ? 'Loading counties...' : 'Select County'}</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sub-County (Constituency)</label>
              <select 
                required 
                disabled={!formData.institution.county || loading.constituencies} 
                value={formData.institution.subCounty} 
                onChange={(e) => updateInstitution('subCounty', e.target.value)}
              >
                <option value="">
                  {!formData.institution.county 
                    ? 'Select a county first' 
                    : loading.constituencies 
                      ? 'Loading sub-counties...' 
                      : 'Select Sub-County'}
                </option>
                {constituencies.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ward</label>
              <select 
                required 
                disabled={!formData.institution.subCounty || loading.wards} 
                value={formData.institution.ward} 
                onChange={(e) => updateInstitution('ward', e.target.value)}
              >
                <option value="">
                  {!formData.institution.subCounty 
                    ? 'Select a sub-county first' 
                    : loading.wards 
                      ? 'Loading wards...' 
                      : 'Select Ward'}
                </option>
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Institution Level</label>
              <select required value={formData.institution.level} onChange={(e) => updateInstitution('level', e.target.value)}>
                <option value="">Select Level</option>
                <option value="ecd">ECD (PP1-PP2)</option>
                <option value="primary">Primary (Grade 1-6)</option>
                <option value="jss">Junior Secondary (JSS)</option>
                <option value="secondary">Senior Secondary (Form 1-4)</option>
                <option value="tvet">TVET</option>
                <option value="university">University</option>
              </select>
            </div>
          </div>
          
          {/* Institution Name - Now a text input */}
          <div className="form-group">
            <label>Institution Name</label>
            <input 
              type="text"
              required 
              value={formData.institution.name} 
              onChange={(e) => updateInstitution('name', e.target.value)}
              placeholder="Enter your school or institution name"
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #ddd', borderRadius: '8px' }}
            />
            <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '0.3rem' }}>
              Type the full name of your school or institution
            </small>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontWeight: 'normal' }}>
              <input type="checkbox" required checked={formData.dataConsent} onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })} style={{ width: 'auto', marginTop: '0.3rem' }} />
              <span style={{ fontSize: '0.9rem' }}>
                I consent to the processing of my personal data in accordance with the <Link to="/privacy">Kenya Data Protection Act 2019</Link> and <Link to="/terms">Terms & Conditions</Link>.
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Are you a <Link to="/register/tourist">Tourist</Link> or <Link to="/register/creator">Content Creator</Link>?
        </p>
      </div>
    </div>
  );
};

export default Register;