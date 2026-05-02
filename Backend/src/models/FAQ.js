// models/FAQ.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    default: '' // Empty if not yet answered by admin
  },
  category: {
    type: String,
    enum: ['general', 'reports', 'schedules', 'account', 'other'],
    default: 'general'
  },
  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: false // Only show in public FAQ once answered and approved
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

faqSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default mongoose.model('FAQ', faqSchema);