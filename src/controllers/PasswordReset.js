// controllers/passwordResetController.js
import User from '../models/User.js';
import { generateOTP, getOTPExpiry } from '../utils/otp.js';
import { sendPasswordResetOTP } from '../config/nodemailer.js';

// @desc    Request password reset (send OTP)
// @route   POST /api/password-reset/request
// @access  Public
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email' });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Save OTP to user
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendPasswordResetOTP(email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset code. Please try again.' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Verify reset OTP
// @route   POST /api/password-reset/verify-otp
// @access  Public
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    // Find user with OTP
    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists
    if (!user.resetPasswordOTP) {
      return res.status(400).json({ message: 'No reset request found. Please request password reset first.' });
    }

    // Check if OTP is expired
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    });
  } catch (error) {
    console.error('Error verifying reset OTP:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Reset password
// @route   POST /api/password-reset/reset
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    // Password validation
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user with OTP
    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists
    if (!user.resetPasswordOTP) {
      return res.status(400).json({ message: 'No reset request found. Please request password reset first.' });
    }

    // Check if OTP is expired
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Resend password reset OTP
// @route   POST /api/password-reset/resend-otp
// @access  Public
export const resendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Save OTP to user
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendPasswordResetOTP(email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset code. Please try again.' });
    }

    res.status(200).json({
      success: true,
      message: 'New password reset code sent to your email'
    });
  } catch (error) {
    console.error('Error resending reset OTP:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};