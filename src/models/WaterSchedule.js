
import mongoose from 'mongoose';

const waterScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  scheduleType: {
    type: String,
    enum: ['regular', 'rationing', 'maintenance', 'emergency'],
    default: 'regular'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "HH:MM" e.g., "06:00"
    required: true
  },
  endTime: {
    type: String, // Format: "HH:MM" e.g., "18:00"
    required: true
  },
  daysOfWeek: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt timestamp before saving
waterScheduleSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default mongoose.model('WaterSchedule', waterScheduleSchema);