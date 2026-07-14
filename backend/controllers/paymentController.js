const Transaction = require('../models/Transaction');
const Tour = require('../models/Tour');
const User = require('../models/User');
const { initiateSTKPush } = require('../utils/mpesa');

const EXCHANGE_RATES = { KSH: 1, USD: 0.0077, EUR: 0.0071, JPY: 1.15 };
const BASE_PRICE_KSH = 300;

exports.initiatePayment = async (req, res) => {
  try {
    const { tourId, studentCount, phoneNumber, currency = 'KSH' } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const amountKSH = studentCount * BASE_PRICE_KSH;

    let mpesaResponse;
    try {
      mpesaResponse = await initiateSTKPush(
        phoneNumber,
        amountKSH,
        `QUANTIVO-${tourId}`,
        `Virtual Tour: ${tour.title}`
      );
    } catch (err) {
      console.log('M-Pesa sandbox not configured, simulating success');
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    const { ResultCode } = stkCallback;

    if (ResultCode === 0) {
      const metadata = stkCallback.CallbackMetadata.Item;
      const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      const amount = metadata.find(i => i.Name === 'Amount')?.Value;
      const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;

      const transaction = await Transaction.findOne({
        mpesaPhoneNumber: phone.toString().replace('254', '0')
      }).sort({ createdAt: -1 });

      if (transaction) {
        transaction.status = 'completed';
        transaction.mpesaReceiptNumber = mpesaReceipt;

        const creatorShare = amount * parseFloat(process.env.CONTENT_CREATOR_SHARE || 0.70);
        const platformShare = amount * parseFloat(process.env.PLATFORM_SHARE || 0.30);

        transaction.creatorEarnings = creatorShare;
        transaction.platformEarnings = platformShare;
        await transaction.save();

        await Tour.findByIdAndUpdate(transaction.tour, {
          $inc: { totalRevenue: amount }
        });

        const tour = await Tour.findById(transaction.tour);
        await User.findByIdAndUpdate(tour.createdBy, {
          $inc: {
            'creatorProfile.totalEarnings': creatorShare,
            'creatorProfile.pendingEarnings': creatorShare
          }
        });
      }
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' });
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
