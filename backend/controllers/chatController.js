const { getChatResponse } = require('../services/groqService');

/**
 * Handle chat messages
 * POST /api/chat
 * Body: { message: string, history: array, language: string }
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, history = [], language = 'en' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get response from Groq with language support
    const reply = await getChatResponse(message, history, language);

    res.status(200).json({
      success: true,
      data: {
        reply: reply
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    });
  }
};