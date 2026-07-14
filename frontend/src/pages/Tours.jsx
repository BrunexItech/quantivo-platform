import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTours();
  }, [category, search]);

  const loadTours = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    api.get(`/tours?${params.toString()}`).then(res => setTours(res.data.data));
  };

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>🎓 Virtual Field Trips</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="wildlife">Wildlife</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="culture">Culture</option>
            <option value="science">Science</option>
            <option value="environment">Environment</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tours.map(tour => (
          <Link key={tour._id} to={`/tours/${tour._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.3s', height: '100%' }}>
              <div style={{ 
                height: 180, 
                borderRadius: 10, 
                marginBottom: '1rem',
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
                  <span style={{ fontSize: '4rem' }}>
                    {tour.category === 'wildlife' ? '🦁' : tour.category === 'history' ? '🏛️' : tour.category === 'geography' ? '🏔️' : '🌍'}
                  </span>
                )}
              </div>
              <span style={{ background: '#ff6f00', color: 'white', padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold' }}>
                Ksh {tour.price?.ksh} / student
              </span>
              <h3 style={{ marginTop: '0.5rem', color: '#1a237e' }}>{tour.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{tour.description.substring(0, 100)}...</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#999' }}>By: {tour.creatorName}</p>
            </div>
          </Link>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No tours found. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Tours;