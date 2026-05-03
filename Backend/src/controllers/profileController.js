import User from '../models/User.js';
import WaterReport from '../models/WaterReport.js';
import Notification from '../models/notification.js';

/**
 * GET /api/profile
 * Get logged-in user's profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * PUT /api/profile
 * Update profile details
 */
export const updateProfile = async (req, res) => {
  try {
    // 1. Changed zone to supplyArea
    const { name, address, phone, supplyArea } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    // 2. Updated the assignment
    if (supplyArea) user.supplyArea = supplyArea;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // 3. Updated the response payload
        supplyArea: user.supplyArea
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or phone already in use' });
    }
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

/**
 * PUT /api/profile/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    // Find user first (avoid destructuring from possibly undefined req.body)
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Read password safely from body (req.body may be undefined)
    const password = req.body && req.body.password;

    // If the user has a stored password, require confirmation
    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: 'Please provide your password to confirm account deletion' });
      }

      // Verify password
      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
    }

    // Delete user's related data (optional but recommended)
    const WaterReport = (await import('../models/WaterReport.js')).default;
    const Notification = (await import('../models/notification.js')).default;

    // Delete user's reports
    await WaterReport.deleteMany({ reportedBy: user._id });

    // Delete user's notifications
    await Notification.deleteMany({ recipient: user._id });

    // Delete user account
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};

/**
 * GET /api/profile/stats
 */
export const getUserStats = async (req, res) => {
  const reports = await WaterReport.countDocuments({ reportedBy: req.user.id });
  const unreadNotifications = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  res.json({
    success: true,
    stats: {
      reports,
      unreadNotifications
    }
  });
};