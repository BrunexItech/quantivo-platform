import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CreatorRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', bio: '', portfolio: '', mpesaNumber: '', dataConsent: false
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { language, translateContent } = useLanguage();
  const navigate = useNavigate();
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    title: '🎬 Content Creator Registration',
    subtitle: 'Earn 70% revenue share on every tour booking!',
    fullName: 'Full Name',
    phone: 'Phone (M-Pesa)',
    phonePlaceholder: '07XXXXXXXX',
    email: 'Email',
    password: 'Password',
    bio: 'Bio / Experience',
    portfolio: 'Portfolio URL',
    portfolioPlaceholder: 'https://...',
    mpesaNumber: 'M-Pesa Number (for payouts)',
    mpesaPlaceholder: '07XXXXXXXX',
    consent: 'I agree to the',
    creatorTerms: 'Creator Terms',
    and: 'and',
    dataProtection: 'Data Protection',
    consentEnd: 'I understand I earn 70% of each tour booking after admin quality approval.',
    registerButton: 'Register as Creator',
    registrationFailed: 'Registration failed',
    consentRequired: 'You must consent to data processing'
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
    if (!formData.dataConsent) {
      setError(t.consentRequired || 'You must consent to data processing');
      return;
    }
    try {
      await register(formData, '/auth/register-creator');
      navigate('/creator/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t.registrationFailed || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: '8rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#1a237e' }}>{t.title}</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>{t.subtitle}</p>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: 8, margin: '1rem 0' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>{t.fullName}</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t.phone}</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t.phonePlaceholder} />
            </div>
          </div>
          <div className="form-group">
            <label>{t.email}</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <input type="password" required minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t.bio}</label>
            <textarea rows="3" required value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t.portfolio}</label>
            <input type="url" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} placeholder={t.portfolioPlaceholder} />
          </div>
          <div className="form-group">
            <label>{t.mpesaNumber}</label>
            <input type="tel" required value={formData.mpesaNumber} onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })} placeholder={t.mpesaPlaceholder} />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontWeight: 'normal' }}>
              <input type="checkbox" required checked={formData.dataConsent} onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })} style={{ width: 'auto', marginTop: '0.3rem' }} />
              <span style={{ fontSize: '0.9rem' }}>
                {t.consent} <Link to="/terms">{t.creatorTerms}</Link> {t.and} <Link to="/privacy">{t.dataProtection}</Link>. {t.consentEnd}
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t.registerButton}</button>
        </form>
      </div>
    </div>
  );
};

export default CreatorRegister;