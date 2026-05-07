import User from '../models/User.js';
import WaterReport from '../models/WaterReport.js';
import WaterSchedule from '../models/WaterSchedule.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/notification.js';

// Helper function to calculate zone status based on business rules
const calculateZoneStatuses = async (zones) => {
  const now = new Date();

  // 1. Auto-deactivate expired schedules
  await WaterSchedule.updateMany(
    { isActive: true, endDate: { $lt: now } },
    { isActive: false }
  );

  // 2. Fetch active reports and schedules
  // Active reports = NOT Resolved and NOT Cancelled
  const [activeReports, activeSchedules] = await Promise.all([
    WaterReport.find({ status: { $nin: ['Resolved', 'Cancelled'] } }),
    WaterSchedule.find({ 
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now }
    })
  ]);

  return zones.map(zoneName => {
    const normalizedZoneName = zoneName.trim().toLowerCase();
    
    // Filter reports for this zone
    // activeReports already filters out 'Resolved' and 'Cancelled' in the query above
    const zoneReports = activeReports.filter(r => 
      r.supplyArea && r.supplyArea.trim().toLowerCase() === normalizedZoneName
    );
    const zoneSchedules = activeSchedules.filter(s => 
      s.supplyArea && s.supplyArea.trim().toLowerCase() === normalizedZoneName
    );

    let status = 'good'; // Default - GREEN
    let reason = 'System operational - All clear';

    // Priority 1: Critical Reports (RED)
    // MUST stay RED until Admin resolves (status is NOT Resolved/Cancelled)
    const criticalReports = zoneReports.filter(r => {
      const type = (r.reportType || '').trim().toLowerCase();
      return type === 'outage' || type === 'contamination';
    });
    
    if (criticalReports.length > 0) {
      status = 'critical';
      // If a technician marked it as Fixed, but Admin hasn't Resolved it yet
      const firstFixed = criticalReports.find(r => r.status === 'Fixed');
      reason = firstFixed 
        ? `Fixed - Pending Admin Verification: ${firstFixed.title}` 
        : `CRITICAL: ${criticalReports[0].title}`;
    } 
    // Priority 2: Warning Reports (YELLOW)
    // MUST stay YELLOW until Admin resolves
    else if (zoneReports.some(r => {
      const type = (r.reportType || '').trim().toLowerCase();
      return ['leak', 'low_pressure', 'other'].includes(type);
    })) {
      const warningReports = zoneReports.filter(r => {
        const type = (r.reportType || '').trim().toLowerCase();
        return ['leak', 'low_pressure', 'other'].includes(type);
      });
      status = 'warning';
      const firstFixed = warningReports.find(r => r.status === 'Fixed');
      reason = firstFixed
        ? `Fixed - Pending Admin Verification: ${firstFixed.title}`
        : `${warningReports.length} incident(s) pending resolution`;
    }
    // Priority 3: Schedules (Stay GREEN but update reason)
    else if (zoneSchedules.length > 0) {
      status = 'good'; // Schedules do not turn the map Red/Yellow
      reason = `${zoneSchedules[0].scheduleType.toUpperCase()}: ${zoneSchedules[0].title}`;
    }

    return {
      name: zoneName,
      status: status, 
      reason: reason,
      reportCount: zoneReports.length,
      criticalCount: criticalReports.length,
      warningCount: zoneReports.length - criticalReports.length,
      activeSchedules: zoneSchedules.length,
      lastUpdated: now
    };
  });
};

// @desc    Get real-time status of Njoro zones
// @route   GET /api/analytics/zones/status
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

    const data = await calculateZoneStatuses(zones);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching zone status:', error);
    res.status(500).json({ message: 'Server error while fetching zone status' });
  }
};

// @desc    Manually refresh/expire schedules and reports
// @route   POST /api/analytics/zones/refresh
export const refreshZoneStatus = async (req, res) => {
  try {
    const zones = [
      'Njoro Center',
      'Egerton University Area',
      'Kihingo Ward',
      'Lare Ward',
      'Nesuit',
      'Mau Narok'
    ];

    const data = await calculateZoneStatuses(zones);

    res.status(200).json({
      success: true,
      message: 'Zone status refreshed successfully',
      data
    });
  } catch (error) {
    console.error('Error refreshing zone status:', error);
    res.status(500).json({ message: 'Server error while refreshing zone status' });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const { days } = req.query;
    let dateFilter = {};
    
    if (days && days !== 'all') {
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - parseInt(days));
      dateFilter = { createdAt: { $gte: filterDate } };
    }

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Registration trend
    const registrationTrend = await User.aggregate([
      {
        $match: dateFilter
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

    // User List for Table
    const userList = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    // Format trend data
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = registrationTrend.map(item => ({
      name: days === 'all' || parseInt(days) > 31 
        ? `${monthNames[item._id.month]} ${item._id.year}`
        : `${item._id.day}/${item._id.month}`,
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
    const { days } = req.query;
    let dateFilter = {};
    
    if (days && days !== 'all') {
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - parseInt(days));
      dateFilter = { createdAt: { $gte: filterDate } };
    }

    // Status distribution
    const statusDistribution = await WaterReport.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Severity distribution
    const severityDistribution = await WaterReport.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Incident by Category
    const categoryDistribution = await WaterReport.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
    ]);

    // Incident trend
    const incidentTrend = await WaterReport.aggregate([
      {
        $match: dateFilter
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

    // Incident List for Table
    const incidentList = await WaterReport.find()
      .populate('reportedBy', 'name')
      .select('title reportType severity status createdAt supplyArea specificLocation reportedBy')
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
    const { days } = req.query;
    let dateFilter = {};
    
    if (days && days !== 'all') {
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - parseInt(days));
      dateFilter = { createdAt: { $gte: filterDate } };
    }

    // Announcements by category
    const announcementsByCategory = await Announcement.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Notifications by type
    const notificationsByType = await Notification.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Schedules by supplyArea (top 10) - Only active non-expired
    const now = new Date();
    const schedulesByLocation = await WaterSchedule.aggregate([
      { 
        $match: { 
          ...dateFilter,
          isActive: true,
          endDate: { $gt: now }
        } 
      },
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
    const { days } = req.query;
    let dateFilter = {};
    
    if (days && days !== 'all') {
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - parseInt(days));
      dateFilter = { createdAt: { $gte: filterDate } };
    }

    // 1. Maintenance Ticketing Logs
    const maintenanceLogs = await WaterReport.find({ 
      reportType: 'outage',
      ...dateFilter
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('assignedTo', 'name')
      .select('title createdAt supplyArea status assignedTo');

    // 2. Technician Performance Roster
    const technicians = await User.find({ role: 'technician' }).select('name');
    
    const performancePromises = technicians.map(async (tech) => {
      const resolved = await WaterReport.countDocuments({ 
        assignedTo: tech._id, 
        status: 'Resolved',
        ...dateFilter
      });
      const pending = await WaterReport.countDocuments({ 
        assignedTo: tech._id, 
        status: { $in: ['Reported', 'Technician Assigned', 'In Progress', 'Fixed'] },
        ...dateFilter
      });
      return {
        name: tech.name,
        resolved,
        pending,
        total: resolved + pending
      };
    });
    
    const technicianPerformance = await Promise.all(performancePromises);

    // 3. Water Distribution Schedules - Only active non-expired
    const now = new Date();
    const waterSchedules = await WaterSchedule.find({ 
      isActive: true,
      endDate: { $gt: now },
      ...dateFilter
    })
      .sort({ title: 1 })
      .select('title supplyArea scheduleType daysOfWeek startTime endDate');

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