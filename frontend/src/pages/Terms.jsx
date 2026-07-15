import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const { language, translateContent } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});

  const texts = {
    title: '📜 Terms & Conditions',
    lastUpdated: 'Last Updated: July 14, 2026',
    section1: '1. Acceptance of Terms',
    section1Text: 'By accessing Quantivo, you agree to be bound by these Terms & Conditions, our Privacy Policy, and all applicable laws including the Kenya Data Protection Act 2019.',
    section2: '2. User Accounts',
    section2Text: 'Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials.',
    section3: '3. Pricing & Payments',
    section3Item1: 'Each virtual tour visit costs Ksh 300 per student',
    section3Item2: 'Equivalent pricing: USD $2.31, EUR €2.13, JPY ¥345 per student',
    section3Item3: 'Payments via M-Pesa STK Push, cards, or bank transfer',
    section3Item4: 'All payments are non-refundable once access is granted',
    section3Item5: "Prices may be adjusted with 30 days' notice",
    section4: '4. Content Creator Terms',
    section4Item1: 'Creators retain copyright of their original content',
    section4Item2: 'By uploading, creators grant Quantivo a non-exclusive license to distribute',
    section4Item3: 'Revenue Share: 70% to creator, 30% to platform',
    section4Item4: 'All tours require admin quality approval before going live',
    section4Item5: 'Quality criteria: educational value, technical quality, CBC alignment, cultural appropriateness',
    section4Item6: 'Payouts processed monthly via M-Pesa or bank transfer',
    section4Item7: 'Minimum payout threshold: Ksh 1,000',
    section4Item8: 'Quantivo may reject or remove content that violates policies',
    section4Item9: 'Creators must ensure they have rights to all uploaded content',
    section5: '5. Tourist Terms',
    section5Text: 'Tourists may access virtual tours for personal, non-commercial use. Commercial use requires separate licensing.',
    section6: '6. Educational Use',
    section6Text: 'Schools and teachers may use Quantivo content for educational purposes. Bulk licensing available upon request.',
    section7: '7. Prohibited Conduct',
    section7Item1: 'Sharing account credentials',
    section7Item2: 'Reverse engineering the platform',
    section7Item3: 'Uploading illegal, offensive, or copyrighted content',
    section7Item4: 'Attempting to bypass payment systems',
    section8: '8. Limitation of Liability',
    section8Text: 'Quantivo is provided "as is". We are not liable for indirect damages or service interruptions beyond our control.',
    section9: '9. Governing Law',
    section9Text: 'These terms are governed by the laws of Kenya. Disputes shall be resolved in Kenyan courts.',
    section10: '10. Contact',
    section10Text: 'For questions: info@quantivo.co.ke | +254 700 000 000'
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

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section1}</h2>
        <p>{t.section1Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section2}</h2>
        <p>{t.section2Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section3}</h2>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>{t.section3Item1}</li>
          <li>{t.section3Item2}</li>
          <li>{t.section3Item3}</li>
          <li>{t.section3Item4}</li>
          <li>{t.section3Item5}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section4}</h2>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>{t.section4Item1}</li>
          <li>{t.section4Item2}</li>
          <li><strong>{t.section4Item3}</strong></li>
          <li>{t.section4Item4}</li>
          <li>{t.section4Item5}</li>
          <li>{t.section4Item6}</li>
          <li>{t.section4Item7}</li>
          <li>{t.section4Item8}</li>
          <li>{t.section4Item9}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section5}</h2>
        <p>{t.section5Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section6}</h2>
        <p>{t.section6Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section7}</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>{t.section7Item1}</li>
          <li>{t.section7Item2}</li>
          <li>{t.section7Item3}</li>
          <li>{t.section7Item4}</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section8}</h2>
        <p>{t.section8Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section9}</h2>
        <p>{t.section9Text}</p>

        <h2 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.section10}</h2>
        <p>{t.section10Text}</p>
      </div>
    </div>
  );
};

export default Terms;