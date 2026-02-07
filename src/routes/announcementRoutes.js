// routes/announcementRoutes.js
import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getActiveAnnouncements,
  getUrgentAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  getAnnouncementStats
} from '../controllers/Announcement.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllAnnouncements);
router.get('/active', getActiveAnnouncements);
router.get('/urgent', getUrgentAnnouncements);
router.get('/:id', getAnnouncementById);

// Admin only routes
router.post('/', authenticateUser, adminOnly, createAnnouncement);
router.put('/:id', authenticateUser, adminOnly, updateAnnouncement);
router.delete('/:id', authenticateUser, adminOnly, deleteAnnouncement);
router.patch('/:id/toggle', authenticateUser, adminOnly, toggleAnnouncementStatus);
router.get('/stats/overview', authenticateUser, adminOnly, getAnnouncementStats);

export default router;