const express = require('express');
const router = express.Router();
const {
  initiatePayment, mpesaCallback, getMyTransactions
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/initiate', protect, initiatePayment);
router.post('/mpesa/callback', mpesaCallback);
router.get('/my-transactions', protect, getMyTransactions);

module.exports = router;
