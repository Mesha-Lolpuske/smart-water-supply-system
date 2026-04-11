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
/**
 * @swagger
 * /api/notifications/my-notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/my-notifications', authenticateUser, getMyNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count', authenticateUser, getUnreadCount);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch('/mark-all-read', authenticateUser, markAllAsRead);

/**
 * @swagger
 * /api/notifications/clear-read:
 *   delete:
 *     summary: Delete all read notifications
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Read notifications cleared
 *       401:
 *         description: Unauthorized
 */
router.delete('/clear-read', authenticateUser, clearReadNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get single notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticateUser, getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch('/:id/read', authenticateUser, markAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticateUser, deleteNotification);

// Admin routes
/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient
 *               - type
 *               - title
 *               - message
 *             properties:
 *               recipient:
 *                 type: string
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               relatedId:
 *                 type: string
 *               onModel:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticateUser, adminOnly, createNotification);

/**
 * @swagger
 * /api/notifications/broadcast:
 *   post:
 *     summary: Broadcast notification to all users
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - message
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               relatedId:
 *                 type: string
 *               onModel:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification broadcasted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/broadcast', authenticateUser, adminOnly, broadcastNotification);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications (Admin)
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all notifications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/', authenticateUser, adminOnly, getAllNotifications);

/**
 * @swagger
 * /api/notifications/stats/overview:
 *   get:
 *     summary: Get notification statistics
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/stats/overview', authenticateUser, adminOnly, getNotificationStats);

export default router;