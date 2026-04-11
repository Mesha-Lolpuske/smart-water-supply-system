import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'technician'],
    default: 'user',
  },
  address: {
    type: String,
    required: true,
  },
  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  smsOTP: { type: String, select: false },
  smsOTPExpires: { type: Date, select: false },
  isVerified: { type: Boolean, default: false },
  resetPasswordOTP: { type: String, select: false },
  resetPasswordOTPExpires: { type: Date, select: false },
  smsNotificationsEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

