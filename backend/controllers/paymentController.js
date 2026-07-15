const Transaction = require('../models/Transaction');
const Tour = require('../models/Tour');
const User = require('../models/User');
const { initiateSTKPush } = require('../utils/mpesa');

const EXCHANGE_RATES = { KSH: 1, USD: 0.0077, EUR: 0.0071, JPY: 1.15 };
const BASE_PRICE_KSH = 1; // TESTING: Use 1 shilling

exports.initiatePayment = async (req, res) => {
  try {
    const { tourId, studentCount, phoneNumber, currency = 'KSH' } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid phone number required' });
    }

    // Format phone number
    const formattedPhone = phoneNumber.replace(/^0/, '254');

    const amountKSH = studentCount * BASE_PRICE_KSH;

    // Check minimum amount
    if (amountKSH < 1) {
      return res.status(400).json({ success: false, message: 'Amount must be at least Ksh 1' });
    }

    let mpesaResponse;
    try {
      mpesaResponse = await initiateSTKPush(
        formattedPhone,
        amountKSH,
        `QUANTIVO-${tourId}`,
        `Virtual Tour: ${tour.title}`
      );
    } catch (err) {
      console.error('M-Pesa STK Push error:', err.message);
      // Simulate success for development
      mpesaResponse = {
        MerchantRequestID: 'SIM-' + Date.now(),
        CheckoutRequestID: 'SIM-CHK-' + Date.now()
      };
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      tour: tourId,
      amount: {
        ksh: amountKSH,
        usd: amountKSH * EXCHANGE_RATES.USD,
        eur: amountKSH * EXCHANGE_RATES.EUR,
        jpy: amountKSH * EXCHANGE_RATES.JPY
      },
      currency,
      studentCount,
      mpesaPhoneNumber: phoneNumber,
      mpesaCheckoutRequestID: mpesaResponse.CheckoutRequestID,
      mpesaMerchantRequestID: mpesaResponse.MerchantRequestID,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      message: 'STK Push initiated',
      data: {
        MerchantRequestID: mpesaResponse.MerchantRequestID,
        CheckoutRequestID: mpesaResponse.CheckoutRequestID,
        transactionId: transaction._id,
        amount: amountKSH
      }
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    // ===== LOGGING: See what M-Pesa is sending =====
    console.log('========== M-PESA CALLBACK RECEIVED ==========');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('===============================================');

    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      console.error('❌ Invalid callback structure:', req.body);
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback' });
    }

    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    console.log(`📱 M-Pesa Callback: ResultCode ${ResultCode}, ResultDesc: ${ResultDesc}`);

    // Log CheckoutRequestID for debugging
    console.log(`🔍 CheckoutRequestID: ${stkCallback.CheckoutRequestID}`);
    console.log(`🔍 MerchantRequestID: ${stkCallback.MerchantRequestID}`);

    // Find transaction by CheckoutRequestID or MerchantRequestID
    const transaction = await Transaction.findOne({
      $or: [
        { mpesaCheckoutRequestID: stkCallback.CheckoutRequestID },
        { mpesaMerchantRequestID: stkCallback.MerchantRequestID }
      ]
    });

    if (!transaction) {
      console.error('❌ Transaction not found for CheckoutRequestID:', stkCallback.CheckoutRequestID);
      return res.status(404).json({ ResultCode: 1, ResultDesc: 'Transaction not found' });
    }

    console.log(`✅ Transaction found: ${transaction._id}, Current status: ${transaction.status}`);

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      const amount = metadata.find(i => i.Name === 'Amount')?.Value || transaction.amount.ksh;
      const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;

      console.log(`💳 Payment details: Receipt: ${mpesaReceipt}, Amount: ${amount}, Phone: ${phone}`);

      transaction.status = 'completed';
      transaction.mpesaReceiptNumber = mpesaReceipt || 'RECEIPT-' + Date.now();

      const creatorShare = amount * parseFloat(process.env.CONTENT_CREATOR_SHARE || 0.70);
      const platformShare = amount * parseFloat(process.env.PLATFORM_SHARE || 0.30);

      transaction.creatorEarnings = creatorShare;
      transaction.platformEarnings = platformShare;
      await transaction.save();

      await Tour.findByIdAndUpdate(transaction.tour, {
        $inc: { totalRevenue: amount }
      });

      const tour = await Tour.findById(transaction.tour);
      if (tour && tour.createdBy) {
        await User.findByIdAndUpdate(tour.createdBy, {
          $inc: {
            'creatorProfile.totalEarnings': creatorShare,
            'creatorProfile.pendingEarnings': creatorShare
          }
        });
      }

      console.log(`✅ Payment completed for transaction ${transaction._id}`);
    } else {
      // Payment failed
      transaction.status = 'failed';
      transaction.failureReason = ResultDesc || 'Payment failed';
      await transaction.save();
      console.log(`❌ Payment failed for transaction ${transaction._id}: ${ResultDesc}`);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('❌ M-Pesa callback error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('tour', 'title thumbnailUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        status: transaction.status,
        transaction: transaction
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};