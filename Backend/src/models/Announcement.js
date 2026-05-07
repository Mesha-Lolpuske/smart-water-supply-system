// models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'shortage', 'maintenance', 'emergency', 'update'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  supplyArea: {
    type: String,
    enum: [
      'All Areas',
      'Njoro Center', 
      'Egerton University Area', 
      'Kihingo Ward', 
      'Lare Ward', 
      'Nesuit', 
      'Mau Narok'
    ],
    default: 'All Areas'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
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

// TTL Index - MongoDB auto-deletes when current time > expiryDate
announcementSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

// Update the updatedAt timestamp before saving
announcementSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Method to check if announcement is expired
announcementSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

export default mongoose.model('Announcement', announcementSchema);