// controllers/dashboardController.js
import User from '../models/User.js';
import WaterSchedule from '../models/WaterSchedule.js';
import WaterReport from '../models/WaterReport.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/notification.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin-stats
// @access  Admin only
export const getAdminDashboardStats = async (req, res) => {
  try {
    // User Statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Schedule Statistics
    const totalSchedules = await WaterSchedule.countDocuments();
    const activeSchedules = await WaterSchedule.countDocuments({ isActive: true });
    const currentDate = new Date();
    const currentActiveSchedules = await WaterSchedule.countDocuments({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });

    // Report Statistics
    const totalReports = await WaterReport.countDocuments();
    const pendingReports = await WaterReport.countDocuments({ status: 'pending' });
    const investigatingReports = await WaterReport.countDocuments({ status: 'investigating' });
    const resolvedReports = await WaterReport.countDocuments({ status: 'resolved' });
    const criticalReports = await WaterReport.countDocuments({ severity: 'critical' });

    // Reports by type
    const reportsByType = await WaterReport.aggregate([
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
    ]);

    // Reports by severity
    const reportsBySeverity = await WaterReport.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Announcement Statistics
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({ 
      isActive: true,
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    });
    const urgentAnnouncements = await Announcement.countDocuments({ 
      priority: { $in: ['high', 'urgent'] },
      isActive: true 
    });

    // Announcements by category
    const announcementsByCategory = await Announcement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Notification Statistics
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Recent Activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentReports = await WaterReport.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentAnnouncements = await Announcement.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          admins: adminUsers,
          recentSignups: recentUsers
        },
        schedules: {
          total: totalSchedules,
          active: activeSchedules,
          currentlyActive: currentActiveSchedules
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          investigating: investigatingReports,
          resolved: resolvedReports,
          critical: criticalReports,
          recentReports: recentReports,
          byType: reportsByType,
          bySeverity: reportsBySeverity
        },
        announcements: {
          total: totalAnnouncements,
          active: activeAnnouncements,
          urgent: urgentAnnouncements,
          recent: recentAnnouncements,
          byCategory: announcementsByCategory
        },
        notifications: {
          total: totalNotifications,
          unread: unreadNotifications,
          byType: notificationsByType
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
};

// @desc    Get user dashboard statistics
// @route   GET /api/dashboard/user-stats
// @access  Private (authenticated users)
export const getUserDashboardStats = async (req, res) => {
  try {
    // User's Report Statistics
    const totalReports = await WaterReport.countDocuments({ reportedBy: req.user.id });
    const pendingReports = await WaterReport.countDocuments({ 
      reportedBy: req.user.id, 
      status: 'pending' 
    });
    const resolvedReports = await WaterReport.countDocuments({ 
      reportedBy: req.user.id, 
      status: 'resolved' 
    });

    // User's Notification Statistics
    const totalNotifications = await Notification.countDocuments({ recipient: req.user.id });
    const unreadNotifications = await Notification.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    // Active Schedules
    const currentDate = new Date();
    const activeSchedules = await WaterSchedule.countDocuments({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });

    // Active Announcements
    const activeAnnouncements = await Announcement.countDocuments({
      isActive: true,
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    });

    // Urgent Announcements
    const urgentAnnouncements = await Announcement.countDocuments({
      isActive: true,
      priority: { $in: ['high', 'urgent'] },
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    });

    res.status(200).json({
      success: true,
      stats: {
        myReports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports
        },
        myNotifications: {
          total: totalNotifications,
          unread: unreadNotifications
        },
        system: {
          activeSchedules: activeSchedules,
          activeAnnouncements: activeAnnouncements,
          urgentAnnouncements: urgentAnnouncements
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching user dashboard statistics' });
  }
};

// @desc    Get system overview (public)
// @route   GET /api/dashboard/system-overview
// @access  Public
export const getSystemOverview = async (req, res) => {
  try {
    const currentDate = new Date();

    // Active Schedules
    const activeSchedules = await WaterSchedule.countDocuments({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });

    // Pending Reports
    const pendingReports = await WaterReport.countDocuments({ 
      status: { $in: ['pending', 'investigating'] }
    });

    // Active Announcements
    const activeAnnouncements = await Announcement.countDocuments({
      isActive: true,
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    });

    // Urgent Announcements
    const urgentAnnouncements = await Announcement.countDocuments({
      isActive: true,
      priority: { $in: ['high', 'urgent'] },
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    });

    res.status(200).json({
      success: true,
      overview: {
        activeSchedules,
        pendingReports,
        activeAnnouncements,
        urgentAnnouncements
      }
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ message: 'Server error while fetching system overview' });
  }
};