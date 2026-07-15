const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  mpesaCallback,
  getMyTransactions,
  getTransactionStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/initiate', protect, initiatePayment);
router.post('/mpesa/callback', mpesaCallback);
router.get('/my-transactions', protect, getMyTransactions);
router.get('/transaction/:transactionId', protect, getTransactionStatus);

module.exports = router;