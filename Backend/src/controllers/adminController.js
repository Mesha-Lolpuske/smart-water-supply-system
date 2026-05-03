import User from '../models/User.js';
import WaterReport from '../models/WaterReport.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    // Enrich with report counts
    const usersWithReportCount = await Promise.all(users.map(async (user) => {
      const reportCount = await WaterReport.countDocuments({ reportedBy: user._id });
      return {
        ...user._doc,
        id: user._id,
        reports: reportCount
      };
    }));

    res.status(200).json({
      success: true,
      users: usersWithReportCount
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
export const updateUser = async (req, res) => {
  try {
    // 1. Changed zone to supplyArea here
    const { name, email, address, isVerified, role, phone, supplyArea } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    // 2. Updated the assignment logic
    if (supplyArea) user.supplyArea = supplyArea;
    if (typeof isVerified !== 'undefined') user.isVerified = isVerified;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or phone already in use' });
    }
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

/**
 * @desc    Update user role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Admin
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'technician'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

/**
 * @desc    Get all technicians
 * @route   GET /api/admin/technicians
 * @access  Admin
 */
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select('-password');
    
    res.status(200).json({
      success: true,
      technicians
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ message: 'Server error while fetching technicians' });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};