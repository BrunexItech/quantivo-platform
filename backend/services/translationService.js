const translateGoogle = require('translate-google');

/**
 * Translation Service with Google Translate fallback
 */

// Track if MyMemory quota is exhausted
let myMemoryQuotaExhausted = false;
let googleTranslateWorking = true;

/**
 * Translate text using MyMemory (free, 5000 words/day)
 */
async function translateWithMyMemory(text, targetLang, sourceLang = 'en') {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    
    // Check if quota is exhausted
    if (data.quotaFinished === true || data.responseStatus === 403) {
      myMemoryQuotaExhausted = true;
      console.warn('MyMemory quota exhausted');
      return null;
    }
    
    if (data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      // If the translated text contains "MYMEMORY WARNING", it's not a real translation
      if (translated && translated.includes('MYMEMORY WARNING')) {
        myMemoryQuotaExhausted = true;
        console.warn('MyMemory returned a warning message');
        return null;
      }
      return translated;
    }
    
    return null;
  } catch (error) {
    console.error('MyMemory error:', error.message);
    return null;
  }
}

/**
 * Translate text using Google Translate (fallback)
 */
async function translateWithGoogle(text, targetLang, sourceLang = 'en') {
  if (!googleTranslateWorking) return null;
  
  try {
    const result = await translateGoogle(text, {
      from: sourceLang,
      to: targetLang
    });
    return result;
  } catch (error) {
    console.error('Google Translate error:', error.message);
    googleTranslateWorking = false;
    return null;
  }
}

/**
 * Translate text to a target language
 */
async function translateText(text, targetLang, sourceLang = 'en') {
  // If target is English or text is empty, return as-is
  if (targetLang === 'en' || !text || text.trim() === '') {
    return text;
  }

  // If both translation services are down, return original text
  if (myMemoryQuotaExhausted && !googleTranslateWorking) {
    return text;
  }

  let translated = null;

  // Try MyMemory first (if quota not exhausted)
  if (!myMemoryQuotaExhausted) {
    translated = await translateWithMyMemory(text, targetLang, sourceLang);
    
    // If translated text contains warning, treat as failure
    if (translated && translated.includes('MYMEMORY WARNING')) {
      myMemoryQuotaExhausted = true;
      translated = null;
    }
  }

  // Fallback to Google Translate if MyMemory failed
  if (!translated && googleTranslateWorking) {
    translated = await translateWithGoogle(text, targetLang, sourceLang);
  }

  // If both fail, return original text (no warnings)
  return translated || text;
}

/**
 * Detect language of text
 */
async function detectLanguage(text) {
  if (!text || text.trim() === '') return 'en';
  
  // Simple detection: check for Swahili common words
  const swahiliWords = ['habari', 'sasa', 'nzuri', 'asante', 'karibu', 'ndio', 'hapana', 'jina', 'mimi', 'wewe'];
  const lowerText = text.toLowerCase();
  if (swahiliWords.some(word => lowerText.includes(word))) {
    return 'sw';
  }
  
  return 'en';
}

module.exports = {
  translateText,
  detectLanguage,
  resetQuota: () => { 
    myMemoryQuotaExhausted = false;
    googleTranslateWorking = true;
  }
};