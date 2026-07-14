const express = require('express');
const router = express.Router();
const {
  register, registerTourist, registerCreator, login, getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-tourist', registerTourist);
router.post('/register-creator', registerCreator);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
