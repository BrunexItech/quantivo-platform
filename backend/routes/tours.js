const express = require('express');
const router = express.Router();
const {
  getTours, getTour, createTour, updateTour, deleteTour, getMyTours, recordView
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTours)
  .post(protect, authorize('content_creator'), createTour);

router.route('/my-tours')
  .get(protect, authorize('content_creator'), getMyTours);

router.route('/:id')
  .get(getTour)
  .put(protect, updateTour)
  .delete(protect, deleteTour);

router.post('/:id/view', protect, recordView);

module.exports = router;
