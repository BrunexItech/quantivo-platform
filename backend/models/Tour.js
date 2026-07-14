const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['wildlife', 'history', 'geography', 'culture', 'science', 'environment', 'other'],
    required: true
  },
  mediaType: {
    type: String,
    enum: ['360_video', '360_image', 'vr_scene', 'ar_model'],
    required: true
  },
  mediaUrl: { type: String, required: false }, // ← Changed to false for multi-scene support
  thumbnailUrl: String,
  location: {
    county: String,
    subCounty: String,
    ward: String,
    coordinates: { lat: Number, lng: Number }
  },
  cbcAlignment: {
    grades: [String],
    subjects: [String],
    learningOutcomes: [String]
  },
  price: {
    ksh: { type: Number, default: 300 },
    usd: { type: Number, default: 2.31 },
    eur: { type: Number, default: 2.13 },
    jpy: { type: Number, default: 345 }
  },
  voiceOver: {
    enabled: { type: Boolean, default: true },
    languages: [{ code: String, audioUrl: String }]
  },
  arEnabled: { type: Boolean, default: false },
  arModelUrl: String,
  
  // ===== PHASE 2 & 3 FIELDS =====
  autoRotate: { type: Boolean, default: true },
  autoRotateSpeed: { type: Number, default: 2 },
  backgroundMusic: { type: String, default: '' },
  narration: { type: String, default: '' },
  hotspots: [{
    pitch: Number,
    yaw: Number,
    text: String,
    sceneId: String
  }],
  scenes: [{
    id: String,
    title: String,
    mediaUrl: { type: String, required: true },
    hotspots: [{
      pitch: Number,
      yaw: Number,
      text: String
    }]
  }],
  hasMultipleScenes: { type: Boolean, default: false },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'draft'],
    default: 'pending'
  },
  adminNotes: String,
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalViews: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tourSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Tour', tourSchema);