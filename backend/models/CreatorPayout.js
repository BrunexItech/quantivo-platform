const mongoose = require('mongoose');

const creatorPayoutSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KSH' },
  paymentMethod: { type: String, enum: ['mpesa', 'bank_transfer'], required: true },
  mpesaNumber: String,
  bankDetails: { bankName: String, accountNumber: String, accountName: String },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  periodStart: Date,
  periodEnd: Date,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreatorPayout', creatorPayoutSchema);
