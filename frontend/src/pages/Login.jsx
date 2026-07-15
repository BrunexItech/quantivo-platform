import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { language, translateContent } = useLanguage();
  const navigate = useNavigate();
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    title: 'Login to Quantivo',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    noAccount: "Don't have an account?",
    registerHere: 'Register here',
    loginFailed: 'Login failed'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'content_creator') navigate('/creator/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t.loginFailed || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: '8rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#1a237e', marginBottom: '1.5rem' }}>{t.title}</h2>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.email}</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? t.loggingIn : t.loginButton}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {t.noAccount} <Link to="/register">{t.registerHere}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;