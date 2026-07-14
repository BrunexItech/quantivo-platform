import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1a237e', color: 'white', padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div>
          <h3>Quantivo</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Kenya's premier virtual field trip platform.</p>
        </div>
        <div>
          <h4>Legal</h4>
          <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
            <li><Link to="/terms" style={{ color: 'white' }}>Terms & Conditions</Link></li>
            <li><Link to="/privacy" style={{ color: 'white' }}>Data Protection</Link></li>
            <li><Link to="/faqs" style={{ color: 'white' }}>FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            📧 info@quantivo.co.ke<br />
            📱 +254 700 000 000
          </p>
        </div>
      </div>
      <p style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', fontSize: '0.85rem' }}>
        © 2026 Quantivo Education Platform. Compliant with Kenya Data Protection Act 2019.
      </p>
    </div>
  </footer>
);

export default Footer;
