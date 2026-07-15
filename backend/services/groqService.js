const Groq = require('groq-sdk');
const { translateText, detectLanguage } = require('./translationService');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// System prompt with Quantivo context
const SYSTEM_PROMPT = `
You are a helpful assistant for QuantivoVR, Kenya's premier virtual tour platform.

Key Information:
- Platform: Quantivo offers immersive VR/AR virtual field trips for Kenyan education and tourism.
- Pricing: Ksh 300 per student per visit. International pricing: USD $2.31, EUR €2.13.
- Tours: 360° images, 360° videos, VR scenes, and AR models.
- Content Creators: Earn 70% revenue share on every tour booking. Payouts via M-Pesa or bank transfer.
- CBC Alignment: All tours are aligned with Kenya's Competency-Based Curriculum.
- Partners: Government of Kenya, Ministry of Education, Ministry of Tourism, Ministry of Culture & Heritage.
- Contact: Email quantivo.itech@gmail.com | Phone +254 715 274 418.

Quick Answers:
- "I want to see virtual tours" → "You can browse all available virtual tours on our Tours page. Would you like me to help you find something specific?"
- "How much does a tour cost?" → "Each virtual tour costs Ksh 300 per student. International pricing: USD $2.31, EUR €2.13. Schools can contact us for bulk discounts."
- "How do I become a content creator?" → "To become a content creator, register as a Creator on our platform. You'll earn 70% revenue share on every tour booking. Your tours go through admin quality approval before going live."
- "I have a question" → "I'm here to help! What would you like to know about Quantivo?"

Instructions:
- Answer questions accurately based on the information above.
- Be friendly, professional, and helpful.
- If you don't know the answer or the question is outside this scope, respond with:
  "I don't have that information. Let me connect you to a human assistant who can help you better."
- Keep responses concise and clear.
- For pricing questions, always mention the Ksh 300 per student rate.
- For creator questions, always mention the 70% revenue share.
`;

/**
 * Send a message to Groq LLM and get a response
 * @param {string} message - User's message
 * @param {Array} history - Previous messages (optional)
 * @param {string} userLanguage - User's preferred language (e.g., 'sw', 'fr')
 * @returns {Promise<string>} - Bot response
 */
async function getChatResponse(message, history = [], userLanguage = 'en') {
  try {
    // Step 1: Detect language if not provided
    let detectedLang = userLanguage;
    if (userLanguage === 'en') {
      detectedLang = await detectLanguage(message);
    }

    // Step 2: Translate user message to English if not already English
    let englishMessage = message;
    let translationFailed = false;
    
    if (detectedLang !== 'en') {
      try {
        englishMessage = await translateText(message, 'en', detectedLang);
        // If translation failed or returned same text, use original
        if (!englishMessage || englishMessage === message || englishMessage.includes('MYMEMORY WARNING')) {
          translationFailed = true;
          englishMessage = message;
        }
      } catch (err) {
        console.log('Translation to English failed, using original:', err.message);
        translationFailed = true;
        englishMessage = message;
      }
    }

    // Build messages array with system prompt and history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add history if provided (limit to last 10 messages)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        let historyText = msg.text;
        if (msg.language && msg.language !== 'en') {
          try {
            historyText = await translateText(msg.text, 'en', msg.language) || msg.text;
            if (historyText.includes('MYMEMORY WARNING')) {
              historyText = msg.text;
            }
          } catch (err) {
            historyText = msg.text;
          }
        }
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: historyText
        });
      }
    }

    // Add current message (already in English)
    messages.push({ role: 'user', content: englishMessage });

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 500,
      top_p: 0.9
    });

    let response = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process that. Please try again.";

    // Step 3: Translate response back to user's language if needed
    if (detectedLang !== 'en' && !translationFailed) {
      try {
        const translated = await translateText(response, detectedLang);
        if (translated && translated !== response && !translated.includes('MYMEMORY WARNING')) {
          response = translated;
        }
      } catch (err) {
        console.log('Translation to user language failed, keeping English:', err.message);
        // Keep English response
      }
    }

    return response;

  } catch (error) {
    console.error('Groq API Error:', error);
    
    if (error.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }
    
    return "I'm having trouble connecting. Please try again in a moment.";
  }
}

module.exports = { getChatResponse };