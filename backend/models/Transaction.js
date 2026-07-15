const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  amount: { ksh: Number, usd: Number, eur: Number, jpy: Number },
  currency: { type: String, enum: ['KSH', 'USD', 'EUR', 'JPY'], default: 'KSH' },
  studentCount: { type: Number, default: 1 },
  mpesaReceiptNumber: String,
  mpesaPhoneNumber: String,
  mpesaCheckoutRequestID: { type: String },
  mpesaMerchantRequestID: { type: String },
  transactionType: {
    type: String,
    enum: ['STK_PUSH', 'C2B', 'B2C', 'CARD'],
    default: 'STK_PUSH'
  },
  creatorEarnings: { type: Number, default: 0 },
  platformEarnings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  failureReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);