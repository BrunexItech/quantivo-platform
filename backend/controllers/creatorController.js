const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getEarnings = async (req, res) => {
  try {
    const creator = await User.findById(req.user.id);

    const transactions = await Transaction.find({
      tour: { $in: creator.creatorProfile.approvedTours },
      status: 'completed'
    }).populate('tour', 'title').sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: creator.creatorProfile.totalEarnings,
        pendingEarnings: creator.creatorProfile.pendingEarnings,
        recentTransactions: transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio, portfolio, bankDetails, mpesaNumber } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, {
      'creatorProfile.bio': bio,
      'creatorProfile.portfolio': portfolio,
      'creatorProfile.bankDetails': bankDetails,
      'creatorProfile.mpesaNumber': mpesaNumber
    }, { new: true });

    res.status(200).json({ success: true, data: user.creatorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
