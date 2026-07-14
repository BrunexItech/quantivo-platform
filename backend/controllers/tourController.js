const Tour = require('../models/Tour');

exports.getTours = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved', isActive: true };

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const tours = await Tour.find(query)
      .populate('createdBy', 'name')
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

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('createdBy', 'name');
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      createdBy: req.user.id,
      creatorName: req.user.name,
      status: 'pending'
    };
    const tour = await Tour.create(tourData);
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    if (tour.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    if (tour.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await tour.deleteOne();
    res.status(200).json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyTours = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordView = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    tour.totalViews += 1;
    await tour.save();
    res.status(200).json({ success: true, message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
