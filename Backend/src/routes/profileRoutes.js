// routes/profileRoutes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
    deleteProfile,
  getUserStats
} from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/', authenticateUser, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile (name and address)
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/', authenticateUser, updateProfile);

/**
 * @swagger
 * /api/profile/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or incorrect current password
 *       401:
 *         description: Unauthorized
 */
router.put('/change-password', authenticateUser, changePassword);

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password confirmation required or incorrect
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/',authenticateUser,deleteProfile);

/**
 * @swagger
 * /api/profile/stats:
 *   get:
 *     summary: Get user statistics (reports, unread notifications)
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticateUser, getUserStats);

export default router;