// controllers/announcementController.js
import Announcement from '../models/Announcement.js';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Admin only
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, publishDate, expiryDate } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Check if expiry date is after publish date
    if (expiryDate && publishDate) {
      if (new Date(expiryDate) < new Date(publishDate)) {
        return res.status(400).json({ message: 'Expiry date must be after publish date' });
      }
    }

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'general',
      priority: priority || 'normal',
      publishDate: publishDate || Date.now(),
      expiryDate: expiryDate || null,
      createdBy: req.user.id
    });

    await announcement.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error while creating announcement' });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAllAnnouncements = async (req, res) => {
  try {
    const { category, priority, isActive } = req.query;

    // Build filter
    let filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email')
      .sort({ priority: -1, publishDate: -1 }); // Sort by priority first, then date

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error while fetching announcements' });
  }
};

// @desc    Get active announcements (not expired)
// @route   GET /api/announcements/active
// @access  Public
export const getActiveAnnouncements = async (req, res) => {
  try {
    const currentDate = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    })
      .populate('createdBy', 'name')
      .sort({ priority: -1, publishDate: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    res.status(500).json({ message: 'Server error while fetching active announcements' });
  }
};

// @desc    Get urgent announcements
// @route   GET /api/announcements/urgent
// @access  Public
export const getUrgentAnnouncements = async (req, res) => {
  try {
    const currentDate = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      priority: { $in: ['high', 'urgent'] },
      publishDate: { $lte: currentDate },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: currentDate } }
      ]
    })
      .populate('createdBy', 'name')
      .sort({ priority: -1, publishDate: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (error) {
    console.error('Error fetching urgent announcements:', error);
    res.status(500).json({ message: 'Server error while fetching urgent announcements' });
  }
};

// @desc    Get single announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Increment view count
    announcement.views += 1;
    await announcement.save();

    res.status(200).json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Server error while fetching announcement' });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Admin only
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, publishDate, expiryDate, isActive } = req.body;

    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if expiry date is after publish date
    const newPublishDate = publishDate || announcement.publishDate;
    const newExpiryDate = expiryDate || announcement.expiryDate;
    
    if (newExpiryDate && new Date(newExpiryDate) < new Date(newPublishDate)) {
      return res.status(400).json({ message: 'Expiry date must be after publish date' });
    }

    // Update fields
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.category = category || announcement.category;
    announcement.priority = priority || announcement.priority;
    announcement.publishDate = publishDate || announcement.publishDate;
    if (expiryDate !== undefined) announcement.expiryDate = expiryDate;
    if (isActive !== undefined) announcement.isActive = isActive;

    await announcement.save();
    await announcement.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Server error while updating announcement' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin only
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error while deleting announcement' });
  }
};

// @desc    Toggle announcement active status
// @route   PATCH /api/announcements/:id/toggle
// @access  Admin only
export const toggleAnnouncementStatus = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    res.status(200).json({
      success: true,
      message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
      announcement
    });
  } catch (error) {
    console.error('Error toggling announcement status:', error);
    res.status(500).json({ message: 'Server error while toggling announcement status' });
  }
};

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats/overview
// @access  Admin only
export const getAnnouncementStats = async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({ isActive: true });
    const urgentAnnouncements = await Announcement.countDocuments({ 
      priority: { $in: ['high', 'urgent'] }, 
      isActive: true 
    });

    // Group by category
    const byCategory = await Announcement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Group by priority
    const byPriority = await Announcement.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Get total views
    const totalViews = await Announcement.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalAnnouncements,
        active: activeAnnouncements,
        urgent: urgentAnnouncements,
        byCategory,
        byPriority,
        totalViews: totalViews[0]?.totalViews || 0
      }
    });
  } catch (error) {
    console.error('Error fetching announcement stats:', error);
    res.status(500).json({ message: 'Server error while fetching announcement statistics' });
  }
};