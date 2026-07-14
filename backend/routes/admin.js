const express = require('express');
const router = express.Router();
const {
  getPendingTours,
  approveTour,
  rejectTour,
  editTour,
  deleteTour,
  getTourById,
  getAllTours,
  getAllUsers,
  getDashboardStats,
  processPayout
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Tour management
router.get('/tours', getAllTours);
router.get('/tours/pending', getPendingTours);
router.get('/tours/:id', getTourById);
router.put('/tours/:id/approve', approveTour);
router.put('/tours/:id/reject', rejectTour);
router.put('/tours/:id/edit', editTour);
router.delete('/tours/:id', deleteTour);

// User management
router.get('/users', getAllUsers);

// Stats
router.get('/stats', getDashboardStats);

// Payouts
router.post('/payouts', processPayout);

module.exports = router;