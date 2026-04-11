// routes/dashboardRoutes.js
import express from 'express';
import {
  getAdminDashboardStats,
  getUserDashboardStats,
  getSystemOverview
} from '../controllers/dashboardController.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
/**
 * @swagger
 * /api/dashboard/system-overview:
 *   get:
 *     summary: Get system overview (public)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: System overview statistics
 *       500:
 *         description: Server error
 */
router.get('/system-overview', getSystemOverview);

// User route (authenticated)
/**
 * @swagger
 * /api/dashboard/user-stats:
 *   get:
 *     summary: Get user dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User specific statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user-stats', authenticateUser, getUserDashboardStats);

// Admin route
/**
 * @swagger
 * /api/dashboard/admin-stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin specific statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get('/admin-stats', authenticateUser, adminOnly, getAdminDashboardStats);

export default router;