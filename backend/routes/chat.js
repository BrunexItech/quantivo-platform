const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');

// POST /api/chat - Send a message and get a response
router.post('/', sendMessage);

module.exports = router;