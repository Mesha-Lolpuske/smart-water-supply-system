import User from '../models/User.js';
import WaterReport from '../models/WaterReport.js';
import WaterSchedule from '../models/WaterSchedule.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/notification.js';

// @desc    Get user analytics
// @route   GET /api/analytics/user-analytics
// @access  Admin only
export const getUserAnalytics = async (req, res) => {
  try {
    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format trend data
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = registrationTrend.map(item => ({
      name: `${monthNames[item._id.month]} ${item._id.year}`,
      users: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        roleDistribution,
        registrationTrend: formattedTrend
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Server error while fetching user analytics' });
  }
};

// @desc    Get incident reports analytics
// @route   GET /api/analytics/incident-analytics
// @access  Admin only
export const getIncidentAnalytics = async (req, res) => {
  try {
    // Status distribution
    const statusDistribution = await WaterReport.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Severity distribution
    const severityDistribution = await WaterReport.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Incident trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const incidentTrend = await WaterReport.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const formattedTrend = incidentTrend.map(item => ({
      date: `${item._id.day}/${item._id.month}`,
      reports: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        severityDistribution,
        incidentTrend: formattedTrend
      }
    });
  } catch (error) {
    console.error('Error fetching incident analytics:', error);
    res.status(500).json({ message: 'Server error while fetching incident analytics' });
  }
};

// @desc    Get system activity analytics
// @route   GET /api/analytics/activity-analytics
// @access  Admin only
export const getActivityAnalytics = async (req, res) => {
  try {
    // Announcements by category
    const announcementsByCategory = await Announcement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Notifications by type
    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Schedules by location (top 10)
    const schedulesByLocation = await WaterSchedule.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        announcementsByCategory,
        notificationsByType,
        schedulesByLocation
      }
    });
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    res.status(500).json({ message: 'Server error while fetching activity analytics' });
  }
};
