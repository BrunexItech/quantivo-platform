import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
  const { language, translateContent } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    title: '🔒 Data Protection Policy',
    lastUpdated: 'Last Updated: July 14, 2026',
    compliance: 'Compliance: This policy complies with the Kenya Data Protection Act, 2019 and the Data Protection (General) Regulations, 2021. Quantivo is registered with the Office of the Data Protection Commissioner (ODPC) of Kenya.',
    section1: '1. Data Controller',
    section1Text: 'Quantivo Education Platform Ltd is the data controller. Contact our Data Protection Officer at dpo@quantivo.co.ke.',
    section2: '2. Data We Collect',
    section2Item1: 'Personal Data: Name, email, phone number, institution details',
    section2Item2: 'Tourists: Country, interests',
    section2Item3: 'Creators: Bank details, M-Pesa number, portfolio',
    section2Item4: 'Usage Data: Tours viewed, time spent, device type',
    section2Item5: 'Payment Data: M-Pesa transaction IDs (processed securely by Safaricom)',
    section3: '3. Legal Basis for Processing (Section 30, DPA 2019)',
    section3Item1: 'Consent: Explicit consent obtained at registration',
    section3Item2: 'Contract: Necessary to fulfill service agreements',
    section3Item3: 'Legal Obligation: Tax and regulatory compliance',
    section3Item4: 'Legitimate Interest: Platform improvement and security',
    section4: '4. How We Use Your Data',
    section4Item1: 'Provide virtual tour services',
    section4Item2: 'Process payments and creator payouts',
    section4Item3: 'Send service notifications',
    section4Item4: 'Improve platform quality',
    section4Item5: 'Comply with legal obligations',
    section5: '5. Data Sharing',
    section5Text: 'We do NOT sell your data. Data is shared only with:',
    section5Item1: 'Safaricom (M-Pesa payments)',
    section5Item2: 'Payment processors (Flutterwave/Paystack)',
    section5Item3: 'Cloud service providers (with Kenyan data residency where possible)',
    section5Item4: 'Regulators when legally required',
    section6: '6. Cross-Border Transfers (Section 48, DPA 2019)',
    section6Text: 'Any data transferred outside Kenya is protected by adequate safeguards and your explicit consent.',
    section7: '7. Your Rights (Sections 26-31, DPA 2019)',
    section7Item1: 'Right to be informed about data processing',
    section7Item2: 'Right of access to your data',
    section7Item3: 'Right to rectification of inaccurate data',
    section7Item4: 'Right to erasure ("right to be forgotten")',
    section7Item5: 'Right to object to processing',
    section7Item6: 'Right to data portability',
    section7Item7: 'Right to withdraw consent at any time',
    section7Item8: 'Right to complain to ODPC (complaints@odpc.go.ke)',
    section8: '8. Data Retention',
    section8Text: 'Personal data is retained only as long as necessary for the purposes collected, or as required by law (typically 7 years for financial records under Kenyan tax law).',
    section9: '9. Security Measures',
    section9Item1: 'End-to-end encryption (TLS 1.3)',
    section9Item2: 'Password hashing (bcrypt)',
    section9Item3: 'JWT authentication',
    section9Item4: 'Regular security audits',
    section9Item5: 'Access controls and monitoring',
    section10: '10. Children\'s Data',
    section10Text: 'For users under 18, parental/guardian consent is required. Schools act as data controllers for student data under their care.',
    section11: '11. Data Breach Notification (Section 43, DPA 2019)',
    section11Text: 'In case of a data breach, we will notify ODPC within 72 hours and affected users without undue delay.',
    section12: '12. Contact DPO',
    section12Text: 'Data Protection Officer: dpo@quantivo.co.ke\nODPC Complaints: complaints@odpc.go.ke | +254 20 205 2000'
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

  return (
    <div className="container" style={{ maxWidth: 900, paddingTop: '6rem' }}>
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>{t.title}</h1>

      <div className="card">
        <p><strong>{t.lastUpdated}</strong></p>

        <p style={{ marginTop: '1rem', background: '#e3f2fd', padding: '1rem', borderRadius: 10 }}>
          <strong>{t.compliance}</strong>
        </p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section1}</h2>
        <p>{t.section1Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section2}</h2>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>{t.section2Item1}</strong></li>
          <li><strong>{t.section2Item2}</strong></li>
          <li><strong>{t.section2Item3}</strong></li>
          <li><strong>{t.section2Item4}</strong></li>
          <li><strong>{t.section2Item5}</strong></li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section3}</h2>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>{t.section3Item1}</strong></li>
          <li><strong>{t.section3Item2}</strong></li>
          <li><strong>{t.section3Item3}</strong></li>
          <li><strong>{t.section3Item4}</strong></li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section4}</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>{t.section4Item1}</li>
          <li>{t.section4Item2}</li>
          <li>{t.section4Item3}</li>
          <li>{t.section4Item4}</li>
          <li>{t.section4Item5}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section5}</h2>
        <p>{t.section5Text}</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>{t.section5Item1}</li>
          <li>{t.section5Item2}</li>
          <li>{t.section5Item3}</li>
          <li>{t.section5Item4}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section6}</h2>
        <p>{t.section6Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section7}</h2>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>✅ <strong>{t.section7Item1}</strong></li>
          <li>✅ <strong>{t.section7Item2}</strong></li>
          <li>✅ <strong>{t.section7Item3}</strong></li>
          <li>✅ <strong>{t.section7Item4}</strong></li>
          <li>✅ <strong>{t.section7Item5}</strong></li>
          <li>✅ <strong>{t.section7Item6}</strong></li>
          <li>✅ <strong>{t.section7Item7}</strong></li>
          <li>✅ <strong>{t.section7Item8}</strong></li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section8}</h2>
        <p>{t.section8Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section9}</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>{t.section9Item1}</li>
          <li>{t.section9Item2}</li>
          <li>{t.section9Item3}</li>
          <li>{t.section9Item4}</li>
          <li>{t.section9Item5}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section10}</h2>
        <p>{t.section10Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section11}</h2>
        <p>{t.section11Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section12}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{t.section12Text}</p>
      </div>
    </div>
  );
};

export default Privacy;