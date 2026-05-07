import WaterSchedule from '../models/WaterSchedule.js';

// @desc    Create a new water schedule
// @route   POST /api/schedules
// @access  Admin only
export const createSchedule = async (req, res) => {
  try {
    // ADDED: supplyArea extracted from request body
    const { title, description, supplyArea, scheduleType, startDate, endDate, startTime, endTime, daysOfWeek } = req.body;

    // Validation - ADDED supplyArea to required fields check
    if (!title || !description || !supplyArea || !startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields, including Supply Area' });
    }

    // Check if end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const schedule = await WaterSchedule.create({
      title,
      description,
      supplyArea, // ADDED to creation payload
      scheduleType,
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek: daysOfWeek || [],
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Water schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server error while creating schedule' });
  }
};

// @desc    Get all water schedules
// @route   GET /api/schedules
// @access  Public
export const getAllSchedules = async (req, res) => {
  try {
    const { isActive, scheduleType } = req.query;
    const currentDate = new Date();

    // Build filter - Default to only non-expired
    let filter = {
      endDate: { $gte: currentDate }
    };
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (scheduleType) {
      filter.scheduleType = scheduleType;
    }

    const schedules = await WaterSchedule.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error while fetching schedules' });
  }
};

// @desc    Get active schedules (for users to see current schedule)
// @route   GET /api/schedules/active
// @access  Public
export const getActiveSchedules = async (req, res) => {
  try {
    const currentDate = new Date();

    const schedules = await WaterSchedule.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    console.error('Error fetching active schedules:', error);
    res.status(500).json({ message: 'Server error while fetching active schedules' });
  }
};

// @desc    Get single schedule by ID
// @route   GET /api/schedules/:id
// @access  Public
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await WaterSchedule.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error while fetching schedule' });
  }
};

// @desc    Update water schedule
// @route   PUT /api/schedules/:id
// @access  Admin only
export const updateSchedule = async (req, res) => {
  try {
    // ADDED: supplyArea
    const { title, description, supplyArea, scheduleType, startDate, endDate, startTime, endTime, daysOfWeek, isActive } = req.body;

    let schedule = await WaterSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if end date is after start date
    const newStartDate = startDate || schedule.startDate;
    const newEndDate = endDate || schedule.endDate;
    
    if (new Date(newEndDate) < new Date(newStartDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Update fields including the new supplyArea
    schedule.title = title || schedule.title;
    schedule.description = description || schedule.description;
    schedule.supplyArea = supplyArea || schedule.supplyArea; // ADDED
    schedule.scheduleType = scheduleType || schedule.scheduleType;
    schedule.startDate = startDate || schedule.startDate;
    schedule.endDate = endDate || schedule.endDate;
    schedule.startTime = startTime || schedule.startTime;
    schedule.endTime = endTime || schedule.endTime;
    schedule.daysOfWeek = daysOfWeek || schedule.daysOfWeek;
    if (isActive !== undefined) schedule.isActive = isActive;

    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server error while updating schedule' });
  }
};

// @desc    Delete water schedule
// @route   DELETE /api/schedules/:id
// @access  Admin only
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await WaterSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Server error while deleting schedule' });
  }
};

// @desc    Toggle schedule active status
// @route   PATCH /api/schedules/:id/toggle
// @access  Admin only
export const toggleScheduleStatus = async (req, res) => {
  try {
    const schedule = await WaterSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    schedule.isActive = !schedule.isActive;
    await schedule.save();

    res.status(200).json({
      success: true,
      message: `Schedule ${schedule.isActive ? 'activated' : 'deactivated'} successfully`,
      schedule
    });
  } catch (error) {
    console.error('Error toggling schedule status:', error);
    res.status(500).json({ message: 'Server error while toggling schedule status' });
  }
};