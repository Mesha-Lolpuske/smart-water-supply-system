import express from 'express';
import {
  getUserAnalytics,
  getIncidentAnalytics,
  getActivityAnalytics,
  getDetailedReports
} from '../controllers/analyticsController.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateUser);
router.use(adminOnly);

/**
 * @swagger
 * /api/analytics/user-analytics:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/user-analytics', getUserAnalytics);

/**
 * @swagger
 * /api/analytics/incident-analytics:
 *   get:
 *     summary: Get incident analytics
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Incident analytics data
 */
router.get('/incident-analytics', getIncidentAnalytics);

/**
 * @swagger
 * /api/analytics/activity-analytics:
 *   get:
 *     summary: Get activity analytics
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Activity analytics data
 */
router.get('/activity-analytics', getActivityAnalytics);

/**
 * @swagger
 * /api/analytics/detailed-reports:
 *   get:
 *     summary: Get detailed reports for tables
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Detailed reports data
 */
router.get('/detailed-reports', getDetailedReports);

export default router;
