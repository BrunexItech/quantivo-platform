import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const TourDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { language, translateContent } = useLanguage();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({ studentCount: 1, currency: 'KSH', phoneNumber: '' });
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  const texts = {
    backToTours: '← Back to Tours',
    by: 'By',
    category: 'Category',
    location: '📍 Location',
    views: '👁️ Views',
    price: '💰 Price',
    bookTour: '🎟️ Book This Tour - Ksh {price} per student',
    loading: 'Loading...',
    bookTourTitle: '💳 Book Tour',
    numberOfStudents: 'Number of Students',
    currency: 'Currency',
    mpesaPhone: 'M-Pesa Phone Number',
    totalAmount: 'Total Amount',
    cancel: 'Cancel',
    payWithMpesa: 'Pay with M-Pesa',
    pleaseLogin: 'Please login first',
    paymentInitiated: '📱 STK Push sent to your phone. Please check your M-Pesa and enter PIN.',
    paymentFailed: 'Payment failed',
    paymentSuccess: '✅ Payment successful! Redirecting to VR experience...',
    paymentTimeout: '⏱️ Payment timeout. Please check your M-Pesa and try again.',
    ksh: 'Ksh',
    kes: 'KES - Kenyan Shilling',
    usd: 'USD - US Dollar',
    eur: 'EUR - Euro',
    jpy: 'JPY - Japanese Yen'
  };

  useEffect(() => {
    const translateTexts = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        return;
      }

      const translated = {};
      for (const [key, value] of Object.entries(texts)) {
        try {
          const result = await translateContent(value);
          translated[key] = result || value;
        } catch (err) {
          translated[key] = value;
        }
      }
      setTranslatedTexts(translated);
    };

    translateTexts();
  }, [language]);

  const t = translatedTexts;

  useEffect(() => {
    api.get(`/tours/${id}`).then(res => setTour(res.data.data));
    
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [id]);

  const EXCHANGE_RATES = { KSH: 1, USD: 0.0077, EUR: 0.0071, JPY: 1.15 };
  const SYMBOLS = { KSH: 'Ksh ', USD: '$', EUR: '€', JPY: '¥' };

  // FOR TESTING: Use 1 shilling instead of 300
  const BASE_PRICE = 1;

  const calculatePrice = () => {
    const total = BASE_PRICE * formData.studentCount * EXCHANGE_RATES[formData.currency];
    return `${SYMBOLS[formData.currency]}${total.toFixed(2)} ${formData.currency}`;
  };

  const pollTransactionStatus = (transactionId) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    const interval = setInterval(async () => {
      attempts++;
      try {
        const statusRes = await api.get(`/payments/transaction/${transactionId}`);
        const status = statusRes.data.data.status;
        
        if (status === 'completed') {
          clearInterval(interval);
          setPollingInterval(null);
          setIsProcessing(false);
          toast.success(t.paymentSuccess || '✅ Payment successful! Redirecting to VR experience...');
          setTimeout(() => {
            navigate(`/vr/${id}`);
          }, 1500);
        } else if (status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          setIsProcessing(false);
          toast.error(t.paymentFailed || '❌ Payment failed. Please try again.');
        }
      } catch (err) {
        // Silently continue polling
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPollingInterval(null);
        setIsProcessing(false);
        toast.error(t.paymentTimeout || '⏱️ Payment timeout. Please check your M-Pesa and try again.');
      }
    }, 1000);

    setPollingInterval(interval);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error(t.pleaseLogin || 'Please login first');
      navigate('/login');
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await api.post('/payments/initiate', {
        tourId: id,
        studentCount: formData.studentCount,
        phoneNumber: formData.phoneNumber,
        currency: formData.currency
      });

      toast.success(t.paymentInitiated || '📱 STK Push sent to your phone. Please check your M-Pesa and enter PIN.');

      setShowPayment(false);

      // Start polling for payment status
      pollTransactionStatus(res.data.data.transactionId);

    } catch (err) {
      const errorMsg = err.response?.data?.message || t.paymentFailed || 'Payment failed';
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  };

  const handleImageClick = () => {
    if (!user) {
      toast.error(t.pleaseLogin || 'Please login first');
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  if (!tour) return <div className="container">{t.loading || 'Loading...'}</div>;

  const bookButtonText = t.bookTour ? t.bookTour.replace('{price}', BASE_PRICE) : `🎟️ Book This Tour - Ksh ${BASE_PRICE} per student`;

  return (
    <div className="container">
      <Link to="/tours" style={{ color: '#1e88e5', marginBottom: '1rem', display: 'inline-block' }}>{t.backToTours || '← Back to Tours'}</Link>

      <div className="card">
        <div 
          style={{ 
            height: 300, 
            borderRadius: 15, 
            marginBottom: '1.5rem',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e88e5, #43a047)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={handleImageClick}
        >
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
        <p style={{ color: '#666', marginBottom: '1rem' }}>{t.by || 'By'}: {tour.creatorName} | {t.category || 'Category'}: {tour.category}</p>
        <p style={{ marginBottom: '1.5rem' }}>{tour.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
            <strong>{t.location || '📍 Location'}:</strong> {tour.location?.county}
          </div>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
            <strong>{t.views || '👁️ Views'}:</strong> {tour.totalViews}
          </div>
          <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: 10 }}>
            <strong>{t.price || '💰 Price'}:</strong> Ksh {BASE_PRICE} / student (TEST MODE)
          </div>
        </div>

        <button 
          onClick={() => setShowPayment(true)} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem' }}
          disabled={isProcessing}
        >
          {bookButtonText}
        </button>
      </div>

      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', margin: 0 }}>
            <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>{t.bookTourTitle || '💳 Book Tour'}</h2>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>{t.numberOfStudents || 'Number of Students'}</label>
                <input 
                  type="number" 
                  min="1" 
                  required 
                  value={formData.studentCount} 
                  onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value) })} 
                />
              </div>
              <div className="form-group">
                <label>{t.currency || 'Currency'}</label>
                <select 
                  value={formData.currency} 
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="KSH">{t.kes || 'KES - Kenyan Shilling'}</option>
                  <option value="USD">{t.usd || 'USD - US Dollar'}</option>
                  <option value="EUR">{t.eur || 'EUR - Euro'}</option>
                  <option value="JPY">{t.jpy || 'JPY - Japanese Yen'}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.mpesaPhone || 'M-Pesa Phone Number'}</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                  placeholder="0712345678" 
                />
                <small style={{ fontSize: '0.8rem', color: '#666' }}>
                  Enter phone number without spaces (e.g., 0712345678)
                </small>
              </div>
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: 10, marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem' }}>{t.totalAmount || 'Total Amount'}</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a237e' }}>{calculatePrice()}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPayment(false)} 
                  className="btn" 
                  style={{ flex: 1, background: '#ddd' }}
                  disabled={isProcessing}
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  style={{ flex: 1 }}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : (t.payWithMpesa || 'Pay with M-Pesa')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;