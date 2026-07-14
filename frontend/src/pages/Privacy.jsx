const Privacy = () => (
  <div className="container" style={{ maxWidth: 900 }}>
    <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>🔒 Data Protection Policy</h1>

    <div className="card">
      <p><strong>Last Updated:</strong> July 14, 2026</p>

      <p style={{ marginTop: '1rem', background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
        <strong>Compliance:</strong> This policy complies with the <strong>Kenya Data Protection Act, 2019</strong> and the Data Protection (General) Regulations, 2021. Quantivo is registered with the Office of the Data Protection Commissioner (ODPC) of Kenya.
      </p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>1. Data Controller</h2>
      <p>Quantivo Education Platform Ltd is the data controller. Contact our Data Protection Officer at dpo@quantivo.co.ke.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>2. Data We Collect</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li><strong>Personal Data:</strong> Name, email, phone number, institution details</li>
        <li><strong>Tourists:</strong> Country, interests</li>
        <li><strong>Creators:</strong> Bank details, M-Pesa number, portfolio</li>
        <li><strong>Usage Data:</strong> Tours viewed, time spent, device type</li>
        <li><strong>Payment Data:</strong> M-Pesa transaction IDs (processed securely by Safaricom)</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>3. Legal Basis for Processing (Section 30, DPA 2019)</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li><strong>Consent:</strong> Explicit consent obtained at registration</li>
        <li><strong>Contract:</strong> Necessary to fulfill service agreements</li>
        <li><strong>Legal Obligation:</strong> Tax and regulatory compliance</li>
        <li><strong>Legitimate Interest:</strong> Platform improvement and security</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>4. How We Use Your Data</h2>
      <ul style={{ marginLeft: '1.5rem' }}>
        <li>Provide virtual tour services</li>
        <li>Process payments and creator payouts</li>
        <li>Send service notifications</li>
        <li>Improve platform quality</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>5. Data Sharing</h2>
      <p>We do NOT sell your data. Data is shared only with:</p>
      <ul style={{ marginLeft: '1.5rem' }}>
        <li>Safaricom (M-Pesa payments)</li>
        <li>Payment processors (Flutterwave/Paystack)</li>
        <li>Cloud service providers (with Kenyan data residency where possible)</li>
        <li>Regulators when legally required</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>6. Cross-Border Transfers (Section 48, DPA 2019)</h2>
      <p>Any data transferred outside Kenya is protected by adequate safeguards and your explicit consent.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>7. Your Rights (Sections 26-31, DPA 2019)</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>✅ <strong>Right to be informed</strong> about data processing</li>
        <li>✅ <strong>Right of access</strong> to your data</li>
        <li>✅ <strong>Right to rectification</strong> of inaccurate data</li>
        <li>✅ <strong>Right to erasure</strong> ("right to be forgotten")</li>
        <li>✅ <strong>Right to object</strong> to processing</li>
        <li>✅ <strong>Right to data portability</strong></li>
        <li>✅ <strong>Right to withdraw consent</strong> at any time</li>
        <li>✅ <strong>Right to complain</strong> to ODPC (complaints@odpc.go.ke)</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>8. Data Retention</h2>
      <p>Personal data is retained only as long as necessary for the purposes collected, or as required by law (typically 7 years for financial records under Kenyan tax law).</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>9. Security Measures</h2>
      <ul style={{ marginLeft: '1.5rem' }}>
        <li>End-to-end encryption (TLS 1.3)</li>
        <li>Password hashing (bcrypt)</li>
        <li>JWT authentication</li>
        <li>Regular security audits</li>
        <li>Access controls and monitoring</li>
      </ul>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>10. Children's Data</h2>
      <p>For users under 18, parental/guardian consent is required. Schools act as data controllers for student data under their care.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>11. Data Breach Notification (Section 43, DPA 2019)</h2>
      <p>In case of a data breach, we will notify ODPC within 72 hours and affected users without undue delay.</p>

      <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>12. Contact DPO</h2>
      <p>Data Protection Officer: dpo@quantivo.co.ke<br />ODPC Complaints: complaints@odpc.go.ke | +254 20 205 2000</p>
    </div>
  </div>
);

export default Privacy;
