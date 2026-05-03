import mongoose from 'mongoose';

const waterReportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ['outage', 'low_pressure', 'contamination', 'leak', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // CHANGED: renamed from 'ward' to 'supplyArea' and added the Njoro enum
  supplyArea: {
    type: String,
    required: [true, 'Supply area is required'],
    trim: true,
    enum: [
      'Njoro Center', 
      'Egerton University Area', 
      'Kihingo Ward', 
      'Lare Ward', 
      'Nesuit', 
      'Mau Narok'
    ]
  },
  specificLocation: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['Reported', 'Technician Assigned', 'In Progress', 'Fixed', 'Resolved', 'Cancelled'],
    default: 'Reported'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminNotes: {
    type: String,
    default: ''
  },
  technicianNotes: {
    type: String,
    default: ''
  },
  issueImage: {
    type: String, // URL to the image
    default: ''
  },
  resolutionImage: {
    type: String, // URL to the image
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
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
waterReportSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default mongoose.model('WaterReport', waterReportSchema);
