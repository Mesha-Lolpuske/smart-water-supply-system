import User from '../models/User.js';
import WaterReport from '../models/WaterReport.js';
import WaterSchedule from '../models/WaterSchedule.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/notification.js';

// @desc    Get user analytics
// @route   GET /api/analytics/user-analytics
// @access  Admin only
/**
 * Get real-time status of Njoro zones
 */
export const getZoneStatus = async (req, res) => {
  try {
    const zones = [
      'Njoro Center',
      'Egerton University Area',
      'Kihingo Ward',
      'Lare Ward',
      'Nesuit',
      'Mau Narok'
    ];

    const [activeReports, activeSchedules] = await Promise.all([
      WaterReport.find({ status: { $nin: ['Fixed', 'Resolved', 'Cancelled'] } }),
      WaterSchedule.find({ isActive: true })
    ]);

    const zoneStatuses = zones.map(zoneName => {
      // CHANGED: Use supplyArea instead of ward/location
      const zoneReports = activeReports.filter(r => r.supplyArea === zoneName);
      const zoneSchedules = activeSchedules.filter(s => s.supplyArea === zoneName);

      let status = 'good'; // Default
      let reason = 'System operational';

      // 1. Check for Critical Reports (Highest Priority - e.g., "No Water")
      const criticalReport = zoneReports.find(r => r.severity === 'critical' || r.reportType === 'outage');
      if (criticalReport) {
        status = 'critical'; // Turns map RED
        reason = `Critical Incident: ${criticalReport.title}`;
      } 
      // 2. Check for Emergency Schedules
      else if (zoneSchedules.find(s => s.scheduleType === 'emergency')) {
        status = 'critical'; // Turns map RED
        reason = 'Emergency Supply Cut';
      }
      // 3. Check for Warning Reports
      else if (zoneReports.find(r => ['high', 'medium', 'low'].includes(r.severity))) {
        status = 'warning'; // Turns map YELLOW
        reason = 'Active Maintenance Required';
      }
      // 4. Check for Rationing Schedules
      else if (zoneSchedules.find(s => ['rationing', 'maintenance'].includes(s.scheduleType))) {
        status = 'warning'; // Turns map YELLOW
        reason = 'Scheduled Rationing/Maintenance';
      }

      return {
        name: zoneName,
        status,
        reason,
        reportCount: zoneReports.length,
        activeSchedules: zoneSchedules.length
      };
    });

    res.status(200).json({
      success: true,
      data: zoneStatuses
    });
  } catch (error) {
    console.error('Error fetching zone status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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

    // User List for Table
    const userList = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

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
        registrationTrend: formattedTrend,
        userList
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

    // Incident by Category
    const categoryDistribution = await WaterReport.aggregate([
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
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

    // Incident List for Table - CHANGED location to supplyArea
    const incidentList = await WaterReport.find()
      .select('title reportType severity status createdAt supplyArea specificLocation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        severityDistribution,
        categoryDistribution,
        incidentTrend: formattedTrend,
        incidentList
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

    // Schedules by location (top 10) - CHANGED location to supplyArea
    const schedulesByLocation = await WaterSchedule.aggregate([
      { $group: { _id: '$supplyArea', count: { $sum: 1 } } },
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

// @desc    Get detailed reports for tables
// @route   GET /api/analytics/detailed-reports
// @access  Admin only
export const getDetailedReports = async (req, res) => {
  try {
    // 1. Maintenance Ticketing Logs - CHANGED location to supplyArea
    const maintenanceLogs = await WaterReport.find({ reportType: 'outage' })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('assignedTo', 'name')
      .select('title createdAt supplyArea status assignedTo');

    // 2. Technician Performance Roster
    const technicians = await User.find({ role: 'technician' }).select('name');
    
    const performancePromises = technicians.map(async (tech) => {
      const resolved = await WaterReport.countDocuments({ assignedTo: tech._id, status: 'Resolved' });
      const pending = await WaterReport.countDocuments({ 
        assignedTo: tech._id, 
        status: { $in: ['Reported', 'Technician Assigned', 'In Progress'] } 
      });
      return {
        name: tech.name,
        resolved,
        pending,
        total: resolved + pending
      };
    });
    
    const technicianPerformance = await Promise.all(performancePromises);

    // 3. Water Distribution Schedules - CHANGED location to supplyArea
    const waterSchedules = await WaterSchedule.find({ isActive: true })
      .sort({ title: 1 })
      .select('title supplyArea scheduleType daysOfWeek startTime endTime');

    res.status(200).json({
      success: true,
      data: {
        maintenanceLogs,
        technicianPerformance,
        waterSchedules
      }
    });
  } catch (error) {
    console.error('Error fetching detailed reports:', error);
    res.status(500).json({ message: 'Server error while fetching detailed reports' });
  }
};