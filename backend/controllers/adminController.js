const Tour = require('../models/Tour');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const CreatorPayout = require('../models/CreatorPayout');

exports.getPendingTours = async (req, res) => {
  try {
    const tours = await Tour.find({ status: 'pending' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    tour.status = 'approved';
    tour.approvedAt = new Date();
    tour.approvedBy = req.user.id;
    tour.adminNotes = req.body.notes || '';
    await tour.save();

    await User.findByIdAndUpdate(tour.createdBy, {
      $push: { 'creatorProfile.approvedTours': tour._id }
    });

    res.status(200).json({ success: true, message: 'Tour approved', data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    tour.status = 'rejected';
    tour.adminNotes = req.body.notes || 'Does not meet quality standards';
    await tour.save();

    res.status(200).json({ success: true, message: 'Tour rejected', data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== NEW: Edit Tour =====
exports.editTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const { title, description, category, mediaType, mediaUrl, thumbnailUrl, location, price, autoRotate, autoRotateSpeed, backgroundMusic, narration, hotspots } = req.body;

    // Update only provided fields
    if (title) tour.title = title;
    if (description) tour.description = description;
    if (category) tour.category = category;
    if (mediaType) tour.mediaType = mediaType;
    if (mediaUrl) tour.mediaUrl = mediaUrl;
    if (thumbnailUrl) tour.thumbnailUrl = thumbnailUrl;
    if (location) tour.location = location;
    if (price) tour.price = price;
    if (autoRotate !== undefined) tour.autoRotate = autoRotate;
    if (autoRotateSpeed) tour.autoRotateSpeed = autoRotateSpeed;
    if (backgroundMusic !== undefined) tour.backgroundMusic = backgroundMusic;
    if (narration !== undefined) tour.narration = narration;
    if (hotspots) tour.hotspots = hotspots;

    tour.updatedAt = new Date();
    await tour.save();

    res.status(200).json({ success: true, message: 'Tour updated successfully', data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== NEW: Delete Tour =====
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    await tour.deleteOne();
    res.status(200).json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== NEW: Get Single Tour for Edit =====
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('createdBy', 'name email');
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== NEW: Get All Tours (for admin) =====
exports.getAllTours = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};

    const tours = await Tour.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Tour.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tours.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: tours
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query).select('-password')
      .limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTours = await Tour.countDocuments({ status: 'approved' });
    const pendingTours = await Tour.countDocuments({ status: 'pending' });
    const rejectedTours = await Tour.countDocuments({ status: 'rejected' });

    const revenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount.ksh' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTours,
        pendingTours,
        rejectedTours,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayout = async (req, res) => {
  try {
    const { creatorId, amount, paymentMethod, mpesaNumber, bankDetails, notes } = req.body;

    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== 'content_creator') {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    if (creator.creatorProfile.pendingEarnings < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient earnings' });
    }

    const payout = await CreatorPayout.create({
      creator: creatorId,
      amount,
      paymentMethod,
      mpesaNumber,
      bankDetails,
      notes,
      status: 'processing',
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      processedBy: req.user.id
    });

    creator.creatorProfile.pendingEarnings -= amount;
    await creator.save();

    res.status(201).json({ success: true, message: 'Payout initiated', data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};