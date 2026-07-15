import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Tours = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, translateContent } = useLanguage();
  const [tours, setTours] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [translating, setTranslating] = useState(false);

  const texts = {
    title: '🎓 Virtual Field Trips',
    searchPlaceholder: 'Search tours...',
    allCategories: 'All Categories',
    wildlife: 'Wildlife',
    history: 'History',
    geography: 'Geography',
    culture: 'Culture',
    science: 'Science',
    environment: 'Environment',
    noTours: 'No tours found. Check back soon!',
    loadingText: 'Loading virtual tours...',
    by: 'By:'
  };

  useEffect(() => {
    const translateTexts = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        setTranslating(false);
        return;
      }

      setTranslating(true);
      const translated = {};
      for (const [key, value] of Object.entries(texts)) {
        const result = await translateContent(value);
        translated[key] = result;
      }
      setTranslatedTexts(translated);
      setTranslating(false);
    };

    translateTexts();
  }, [language]);

  useEffect(() => {
    loadTours();
  }, [category, search]);

  const loadTours = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    api.get(`/tours?${params.toString()}`)
      .then(res => setTours(res.data.data))
      .catch(() => setTours([]))
      .finally(() => setLoading(false));
  };

  const handleTourClick = (e, tourId) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/tours/${tourId}`);
    }
  };

  const t = translatedTexts;

  if (loading) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        padding: '2rem 1rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #e0e0e0',
          borderTop: '6px solid #1e88e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1.5rem'
        }} />
        <p style={{ color: '#666', fontSize: '1.1rem' }}>{t.loadingText || 'Loading virtual tours...'}</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="tours-page">
      <div className="container">
        <h1 className="tours-title">{t.title}</h1>

        <div className="search-filter-card">
          <div className="search-filter-wrapper">
            <input 
              className="search-input"
              placeholder={t.searchPlaceholder} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            <select 
              className="category-select"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t.allCategories}</option>
              <option value="wildlife">{t.wildlife}</option>
              <option value="history">{t.history}</option>
              <option value="geography">{t.geography}</option>
              <option value="culture">{t.culture}</option>
              <option value="science">{t.science}</option>
              <option value="environment">{t.environment}</option>
            </select>
          </div>
        </div>

        {tours.length === 0 ? (
          <div className="empty-state">
            <p>{t.noTours}</p>
          </div>
        ) : (
          <div className="tours-grid">
            {tours.map(tour => (
              <div 
                key={tour._id} 
                className="tour-card"
                onClick={(e) => handleTourClick(e, tour._id)}
              >
                <div className="tour-image">
                  {tour.thumbnailUrl ? (
                    <img src={tour.thumbnailUrl} alt={tour.title} />
                  ) : tour.mediaUrl ? (
                    <img src={tour.mediaUrl} alt={tour.title} />
                  ) : (
                    <span className="tour-emoji">
                      {tour.category === 'wildlife' ? '🦁' : tour.category === 'history' ? '🏛️' : tour.category === 'geography' ? '🏔️' : '🌍'}
                    </span>
                  )}
                </div>
                <div className="tour-content">
                  <span className="tour-price">Ksh {tour.price?.ksh} / student</span>
                  <h3 className="tour-title">{tour.title}</h3>
                  <p className="tour-description">{tour.description.substring(0, 100)}...</p>
                  <p className="tour-creator">{t.by} {tour.creatorName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .tours-page {
          padding: 6rem 1.5rem 2rem;
        }

        .tours-title {
          color: #1a237e;
          margin-bottom: 1.5rem;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          text-align: center;
        }

        .search-filter-card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .search-filter-wrapper {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 0.7rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .category-select {
          padding: 0.7rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          min-width: 180px;
        }

        .tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .tour-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }

        .tour-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .tour-image {
          height: 180px;
          overflow: hidden;
          background: linear-gradient(135deg, #1e88e5, #43a047);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tour-emoji {
          font-size: 4rem;
        }

        .tour-content {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tour-price {
          background: #ff6f00;
          color: white;
          padding: 0.2rem 0.7rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          display: inline-block;
          align-self: flex-start;
          margin-bottom: 0.5rem;
        }

        .tour-title {
          margin: 0 0 0.4rem 0;
          color: #1a237e;
          font-size: clamp(1rem, 1.2vw, 1.2rem);
          line-height: 1.3;
        }

        .tour-description {
          font-size: 0.85rem;
          color: #666;
          margin: 0 0 0.5rem 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tour-creator {
          font-size: 0.8rem;
          color: #999;
          margin: 0;
        }

        .empty-state {
          background: white;
          text-align: center;
          padding: 3rem 1.5rem;
          border-radius: 12px;
        }

        .empty-state p {
          font-size: 1.1rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .tours-page {
            padding: 5rem 1rem 1.5rem;
          }
          .search-filter-wrapper {
            flex-direction: column;
          }
          .search-input,
          .category-select {
            min-width: 100%;
          }
          .tours-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .tours-page {
            padding: 4.5rem 0.8rem 1rem;
          }
          .tours-grid {
            grid-template-columns: 1fr;
          }
          .tour-image {
            height: 160px;
          }
          .tour-content {
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Tours;