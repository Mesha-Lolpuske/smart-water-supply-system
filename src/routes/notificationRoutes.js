// routes/notificationRoutes.js
import express from 'express';
import {
  createNotification,
  broadcastNotification,
  getMyNotifications,
  getUnreadCount,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getNotificationStats
} from '../controllers/notification.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes (authenticated)
router.get('/my-notifications', authenticateUser, getMyNotifications);
router.get('/unread-count', authenticateUser, getUnreadCount);
router.patch('/mark-all-read', authenticateUser, markAllAsRead);
router.delete('/clear-read', authenticateUser, clearReadNotifications);
router.get('/:id', authenticateUser, getNotificationById);
router.patch('/:id/read', authenticateUser, markAsRead);
router.delete('/:id', authenticateUser, deleteNotification);

// Admin routes
router.post('/', authenticateUser, adminOnly, createNotification);
router.post('/broadcast', authenticateUser, adminOnly, broadcastNotification);
router.get('/', authenticateUser, adminOnly, getAllNotifications);
router.get('/stats/overview', authenticateUser, adminOnly, getNotificationStats);

export default router;