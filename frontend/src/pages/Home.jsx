import { Link } from 'react-router-dom';

const Home = () => (
  <div className="container">
    <section style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #1e88e5 0%, #43a047 100%)',
      color: 'white',
      borderRadius: 20,
      marginBottom: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍 Explore Kenya Virtually</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '2rem', maxWidth: 800, margin: '0 auto 2rem' }}>
        Immersive VR & AR field trips aligned with CBC curriculum. Experience Maasai Mara, Nairobi National Museum, Lake Turkana and more.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/tours" className="btn btn-accent">Browse Tours</Link>
        <Link to="/register/creator" className="btn" style={{ background: 'white', color: '#1e88e5' }}>Become a Creator</Link>
      </div>
    </section>

    <section style={{ marginBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1a237e' }}>Who is Quantivo for?</h2>
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🎓</div>
          <h3>Students & Teachers</h3>
          <p>CBC-aligned virtual field trips for Kenyan schools. Ksh 300 per student per visit.</p>
          <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register as School</Link>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>✈️</div>
          <h3>Tourists</h3>
          <p>Experience Kenya's wonders from anywhere in the world through immersive VR tours.</p>
          <Link to="/register/tourist" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register as Tourist</Link>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🎬</div>
          <h3>Content Creators</h3>
          <p>Create virtual tours, earn revenue (70% share), and showcase Kenya to the world.</p>
          <Link to="/register/creator" className="btn btn-primary" style={{ marginTop: '1rem' }}>Become a Creator</Link>
        </div>
      </div>
    </section>

    <section className="card">
      <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>💰 Pricing</h2>
      <div className="grid-2">
        <div>
          <h3>Per Visit Pricing</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>🇰🇪 KES: Ksh 300 per student</li>
            <li>🇺🇸 USD: $2.31 per student</li>
            <li>🇪🇺 EUR: €2.13 per student</li>
            
          </ul>
        </div>
        <div>
          <h3>Creator Revenue Share</h3>
          <p>Content creators earn <strong>70%</strong> of each tour booking. Payouts via M-Pesa or bank transfer monthly.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            See <Link to="/terms">Terms & Conditions</Link> for full details.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
