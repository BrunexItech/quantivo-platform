const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: {
    type: String,
    enum: ['student', 'teacher', 'tourist', 'content_creator', 'admin'],
    default: 'student'
  },
  phone: { type: String },
  institution: {
    name: String,
    county: String,
    subCounty: String,
    ward: String,
    level: {
      type: String,
      enum: ['ecd', 'primary', 'jss', 'secondary', 'tvet', 'university']
    }
  },
  creatorProfile: {
    bio: String,
    portfolio: String,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String
    },
    mpesaNumber: String,
    totalEarnings: { type: Number, default: 0 },
    pendingEarnings: { type: Number, default: 0 },
    approvedTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    revenueSharePercentage: { type: Number, default: 70 }
  },
  touristProfile: {
    country: String,
    interests: [String]
  },
  isActive: { type: Boolean, default: true },
  dataConsent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
