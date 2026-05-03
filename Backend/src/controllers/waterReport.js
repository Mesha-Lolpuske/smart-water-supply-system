// controllers/waterReportController.js
import WaterReport from '../models/WaterReport.js';

// @desc    Create a new water report
// @route   POST /api/reports
// @access  Private (authenticated users)
export const createReport = async (req, res) => {
  try {
    // CHANGED: Extract supplyArea
    const { reportType, title, description, supplyArea, specificLocation, severity } = req.body;

    // CHANGED: Validation checks for supplyArea
    if (!reportType || !title || !description || !supplyArea || !specificLocation) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const report = await WaterReport.create({
      reportType,
      title,
      description,
      supplyArea, // CHANGED: Saved as supplyArea
      specificLocation,
      severity: severity || 'medium',
      reportedBy: req.user.id,
      issueImage: req.file ? `/uploads/reports/${req.file.filename}` : ''
    });

    // Populate the reportedBy field before sending response
    await report.populate('reportedBy', 'name email address');

    res.status(201).json({
      success: true,
      message: 'Water report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error while creating report' });
  }
};

// @desc    Get all water reports
// @route   GET /api/reports
// @access  Public
export const getAllReports = async (req, res) => {
  try {
    const { status, reportType, severity } = req.query;

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (reportType) filter.reportType = reportType;
    if (severity) filter.severity = severity;

    const reports = await WaterReport.find(filter)
      .populate('reportedBy', 'name email address')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
};

// @desc    Get user's own reports
// @route   GET /api/reports/my-reports
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const reports = await WaterReport.find({ reportedBy: req.user.id })
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: 'Server error while fetching your reports' });
  }
};

// @desc    Get pending reports
// @route   GET /api/reports/pending
// @access  Public
export const getPendingReports = async (req, res) => {
  try {
    const reports = await WaterReport.find({ 
      status: { $in: ['Reported', 'Technician Assigned', 'In Progress'] } 
    })
      .populate('reportedBy', 'name email address')
      .sort({ severity: -1, createdAt: -1 }); // Sort by severity first, then date

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching pending reports:', error);
    res.status(500).json({ message: 'Server error while fetching pending reports' });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Public
export const getReportById = async (req, res) => {
  try {
    const report = await WaterReport.findById(req.params.id)
      .populate('reportedBy', 'name email address')
      .populate('resolvedBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
};

// @desc    Update report status (Admin or Technician)
// @route   PATCH /api/reports/:id/status
// @access  Staff only (Admin or Technician)
export const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes, technicianNotes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }

    // SECURITY: Only admins can mark an issue as FIXED or RESOLVED
    if ((status === 'Fixed' || status === 'Resolved') && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Security Violation: Only Administrators can officially declare an issue as Fixed.' 
      });
    }

    const report = await WaterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    if (adminNotes && req.user.role === 'admin') report.adminNotes = adminNotes;
    if (technicianNotes && req.user.role === 'technician') report.technicianNotes = technicianNotes;

    // If status is Fixed or Resolved, mark as resolved
    if (status === 'Fixed' || status === 'Resolved') {
      if (req.user && req.user.id) {
        // Simple check to ensure req.user.id is a valid hex string of 24 chars (standard ObjectId)
        if (req.user.id.length === 24) {
          report.resolvedBy = req.user.id;
          report.resolvedAt = new Date();
        } else {
          console.warn('req.user.id is not a valid ObjectId string:', req.user.id);
        }
      }
    }

    try {
      await report.save();
    } catch (saveError) {
      console.error('Error saving report status:', saveError);
      return res.status(400).json({ message: 'Validation error while saving status', error: saveError.message });
    }
    
    // Consolidate populate calls into one for efficiency and reliability
    try {
      await report.populate([
        { path: 'reportedBy', select: 'name email address' },
        { path: 'resolvedBy', select: 'name email' },
        { path: 'assignedTo', select: 'name email' }
      ]);
    } catch (popError) {
      console.error('Error populating report after status update:', popError);
      // We still return 200 because the save was successful
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ message: 'Server error while updating report status' });
  }
};

// @desc    Assign report to a technician
// @route   PATCH /api/reports/:id/assign
// @access  Admin only
export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({ message: 'Please provide a technician ID' });
    }

    const report = await WaterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.assignedTo = technicianId;
    report.status = 'Technician Assigned'; // Auto-change status when assigned

    await report.save();
    await report.populate('assignedTo', 'name email');
    await report.populate('reportedBy', 'name email address');

    res.status(200).json({
      success: true,
      message: 'Technician assigned successfully',
      report
    });
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({ message: 'Server error while assigning technician' });
  }
};

// @desc    Get reports assigned to current technician
// @route   GET /api/reports/assigned/me
// @access  Technician only
export const getAssignedReports = async (req, res) => {
  try {
    const reports = await WaterReport.find({ assignedTo: req.user.id })
      .populate('reportedBy', 'name email address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching assigned reports:', error);
    res.status(500).json({ message: 'Server error while fetching assigned reports' });
  }
};

// @desc    Update report details (User can update their own report if still pending)
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = async (req, res) => {
  try {
    // CHANGED: Update from location to supplyArea
    const { reportType, title, description, supplyArea, severity } = req.body;

    const report = await WaterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report or is admin
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    // Users can only update pending reports, admins can update any
    if (report.status !== 'Reported' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cannot update report that is already being processed' });
    }

    // Update fields
    if (reportType) report.reportType = reportType;
    if (title) report.title = title;
    if (description) report.description = description;
    // CHANGED: Apply supplyArea
    if (supplyArea) report.supplyArea = supplyArea;
    if (severity) report.severity = severity;

    await report.save();
    await report.populate('reportedBy', 'name email address');

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error while updating report' });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (own reports) / Admin (any report)
export const deleteReport = async (req, res) => {
  try {
    const report = await WaterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report or is admin
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
};

// @desc    Get report statistics (Admin)
// @route   GET /api/reports/stats/overview
// @access  Admin only
export const getReportStats = async (req, res) => {
  try {
    const totalReports = await WaterReport.countDocuments();
    const pendingReports = await WaterReport.countDocuments({ status: 'Reported' });
    const investigatingReports = await WaterReport.countDocuments({ status: 'In Progress' });
    const resolvedReports = await WaterReport.countDocuments({ status: { $in: ['Fixed', 'Resolved'] } });
    const criticalReports = await WaterReport.countDocuments({ severity: 'critical' });

    // Group by report type
    const reportsByType = await WaterReport.aggregate([
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalReports,
        pending: pendingReports,
        investigating: investigatingReports,
        resolved: resolvedReports,
        critical: criticalReports,
        byType: reportsByType
      }
    });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    res.status(500).json({ message: 'Server error while fetching report statistics' });
  }
};