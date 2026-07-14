const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/locations', (req, res) => {
  const kenyaLocations = require('../utils/kenyaLocations');
  res.status(200).json({ success: true, data: kenyaLocations });
});

module.exports = router;
