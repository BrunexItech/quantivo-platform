const express = require('express');
const router = express.Router();
const { getEarnings, updateProfile } = require('../controllers/creatorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/earnings', protect, authorize('content_creator'), getEarnings);
router.put('/profile', protect, authorize('content_creator'), updateProfile);

module.exports = router;
