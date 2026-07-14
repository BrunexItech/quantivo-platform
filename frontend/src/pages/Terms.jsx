const Terms = () => (
  <div className="container" style={{ maxWidth: 900 }}>
    <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>📜 Terms & Conditions</h1>

    <div className="card">
      <p><strong>Last Updated:</strong> July 14, 2026</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>1. Acceptance of Terms</h2>
      <p>By accessing Quantivo, you agree to be bound by these Terms & Conditions, our Privacy Policy, and all applicable laws including the Kenya Data Protection Act 2019.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>2. User Accounts</h2>
      <p>Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>3. Pricing & Payments</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>Each virtual tour visit costs <strong>Ksh 300 per student</strong></li>
        <li>Equivalent pricing: USD $2.31, EUR €2.13, JPY ¥345 per student</li>
        <li>Payments via M-Pesa STK Push, cards, or bank transfer</li>
        <li>All payments are non-refundable once access is granted</li>
        <li>Prices may be adjusted with 30 days' notice</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>4. Content Creator Terms</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>Creators retain copyright of their original content</li>
        <li>By uploading, creators grant Quantivo a non-exclusive license to distribute</li>
        <li><strong>Revenue Share: 70% to creator, 30% to platform</strong></li>
        <li>All tours require admin quality approval before going live</li>
        <li>Quality criteria: educational value, technical quality, CBC alignment, cultural appropriateness</li>
        <li>Payouts processed monthly via M-Pesa or bank transfer</li>
        <li>Minimum payout threshold: Ksh 1,000</li>
        <li>Quantivo may reject or remove content that violates policies</li>
        <li>Creators must ensure they have rights to all uploaded content</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>5. Tourist Terms</h2>
      <p>Tourists may access virtual tours for personal, non-commercial use. Commercial use requires separate licensing.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>6. Educational Use</h2>
      <p>Schools and teachers may use Quantivo content for educational purposes. Bulk licensing available upon request.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>7. Prohibited Conduct</h2>
      <ul style={{ marginLeft: '1.5rem' }}>
        <li>Sharing account credentials</li>
        <li>Reverse engineering the platform</li>
        <li>Uploading illegal, offensive, or copyrighted content</li>
        <li>Attempting to bypass payment systems</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>8. Limitation of Liability</h2>
      <p>Quantivo is provided "as is". We are not liable for indirect damages or service interruptions beyond our control.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>9. Governing Law</h2>
      <p>These terms are governed by the laws of Kenya. Disputes shall be resolved in Kenyan courts.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>10. Contact</h2>
      <p>For questions: info@quantivo.co.ke | +254 700 000 000</p>
    </div>
  </div>
);

export default Terms;
