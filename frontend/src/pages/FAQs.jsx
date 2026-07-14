const FAQs = () => {
  const faqs = [
    { q: 'What is Quantivo?', a: "Quantivo is Kenya's premier virtual field trip platform offering immersive VR/AR educational experiences aligned with the Competency-Based Curriculum (CBC)." },
    { q: 'How much does a virtual tour cost?', a: 'Each virtual tour costs Ksh 300 per student per visit. Equivalent pricing available in USD ($2.31), EUR (€2.13), and JPY (¥345).' },
    { q: 'What devices are supported?', a: 'Quantivo works on all devices: cheap cardboard VR viewers (Ksh 500-1000), smartphones, Meta Quest, HTC Vive, and PC VR headsets. No expensive equipment required!' },
    { q: 'How do content creators earn?', a: "Creators earn 70% of every tour booking. After creating a tour, it goes through admin quality approval. Once live, you earn revenue automatically. Payouts monthly via M-Pesa or bank transfer." },
    { q: 'Is my data safe?', a: "Yes! We comply fully with the Kenya Data Protection Act 2019. Your data is encrypted, never sold, and you can request deletion anytime. See our Privacy Policy." },
    { q: 'Can tourists use Quantivo?', a: "Absolutely! Tourists worldwide can register and experience Kenya's wonders through immersive virtual tours." },
    { q: 'What payment methods are accepted?', a: 'M-Pesa (Lipa Na M-Pesa), credit/debit cards (Visa/Mastercard), and bank transfers for institutions.' },
    { q: 'How do I become a content creator?', a: "Register as a Content Creator, submit your virtual tour (360° video/image/VR scene), and wait for admin quality approval. Once approved, your tour goes live and you start earning!" },
    { q: 'Is Quantivo CBC-aligned?', a: 'Yes, all tours are tagged with CBC grades and subjects (Geography, Biology, History, etc.) for easy curriculum integration.' },
    { q: 'Can schools get bulk discounts?', a: 'Yes! Contact us at info@quantivo.co.ke for institutional licensing and bulk pricing.' }
  ];

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>❓ Frequently Asked Questions</h1>
      {faqs.map((faq, i) => (
        <div key={i} className="card">
          <h3 style={{ color: '#1e88e5', marginBottom: '0.5rem' }}>{faq.q}</h3>
          <p>{faq.a}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
