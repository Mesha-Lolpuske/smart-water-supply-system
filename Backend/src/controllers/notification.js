// controllers/notificationController.js
import Notification from '../models/notification.js';

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Admin only
export const createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, relatedId, onModel, priority } = req.body;

    // Validation
    if (!recipient || !type || !title || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedId: relatedId || null,
      onModel: onModel || null,
      priority: priority || 'normal'
    });

    await notification.populate('recipient', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error while creating notification' });
  }
};

// @desc    Broadcast notification to all users
// @route   POST /api/notifications/broadcast
// @access  Admin only
export const broadcastNotification = async (req, res) => {
  try {
    const { type, title, message, relatedId, onModel, priority, supplyArea } = req.body;

    // Validation
    if (!type || !title || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Import User model
    const User = (await import('../models/User.js')).default;

    // Build user filter
    let userFilter = { isVerified: true };
    if (supplyArea && supplyArea !== 'All Areas') {
      userFilter.supplyArea = supplyArea;
    }

    // Get targeted users
    const users = await User.find(userFilter, '_id name phone');

    // Create notifications for all users
    const notifications = users.map(user => ({
      recipient: user._id,
      type,
      title,
      message,
      relatedId: relatedId || null,
      onModel: onModel || null,
      priority: priority || 'normal',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Notification sent to ${users.length} users ${supplyArea ? `in ${supplyArea}` : 'globally'}`,
      count: users.length
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ message: 'Server error while broadcasting notification' });
  }
};

// @desc    Get user's notifications
// @route   GET /api/notifications/my-notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const { isRead, type } = req.query;

    // Build filter
    let filter = { recipient: req.user.id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error while fetching unread count' });
  }
};

// @desc    Get all notifications (Admin)
// @route   GET /api/notifications
// @access  Admin only
export const getAllNotifications = async (req, res) => {
  try {
    const { type, isRead } = req.query;

    // Build filter
    let filter = {};
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const notifications = await Notification.find(filter)
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('recipient', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification or is admin.
    // Handle case where `recipient` is null (orphaned notification).
    if (notification.recipient) {
      if (notification.recipient._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this notification' });
      }
    } else {
      // If there's no recipient, only allow admins to view it.
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this notification' });
      }
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Server error while fetching notification' });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification or is admin. Handle null recipient.
    if (notification.recipient) {
      if (notification.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this notification' });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this notification' });
      }
    }

    const updated = await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: updated
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error while marking notification as read' });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error while marking all notifications as read' });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user owns this notification or is admin. Handle null recipient.
    if (notification.recipient) {
      if (notification.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this notification' });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this notification' });
      }
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error while deleting notification' });
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const clearReadNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user.id,
      isRead: true
    });

    res.status(200).json({
      success: true,
      message: 'Read notifications cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    res.status(500).json({ message: 'Server error while clearing read notifications' });
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats/overview
// @access  Admin only
export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    const readNotifications = await Notification.countDocuments({ isRead: true });

    // Group by type
    const byType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Group by priority
    const byPriority = await Notification.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        byType,
        byPriority
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: 'Server error while fetching notification statistics' });
  }
};