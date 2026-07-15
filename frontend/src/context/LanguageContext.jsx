import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translateContent = async (text) => {
    // If language is English or text is empty, return as-is
    if (language === 'en' || !text) return text;

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${language}`
      );
      const data = await response.json();
      
      // Check if translation was successful
      if (data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText;
        // If the response contains a warning, return original text
        if (translated && translated.includes('MYMEMORY WARNING')) {
          console.warn('Translation quota exceeded, returning original text');
          return text;
        }
        return translated;
      }
      
      // If translation failed, return original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translateContent, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);