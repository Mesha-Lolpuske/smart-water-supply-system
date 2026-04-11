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
/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by priority
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of announcements
 *       500:
 *         description: Server error
 */
router.get('/', getAllAnnouncements);

/**
 * @swagger
 * /api/announcements/active:
 *   get:
 *     summary: Get active announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of active announcements
 */
router.get('/active', getActiveAnnouncements);

/**
 * @swagger
 * /api/announcements/urgent:
 *   get:
 *     summary: Get urgent announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of urgent announcements
 */
router.get('/urgent', getUrgentAnnouncements);

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement details
 *       404:
 *         description: Announcement not found
 */
router.get('/:id', getAnnouncementById);

// Admin only routes
/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcements]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *               publishDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticateUser, adminOnly, createAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   put:
 *     summary: Update an announcement
 *     tags: [Announcements]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *               publishDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Announcement not found
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Announcements]
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
 *         description: Announcement deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Announcement not found
 */
router.put('/:id', authenticateUser, adminOnly, updateAnnouncement);
router.delete('/:id', authenticateUser, adminOnly, deleteAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}/toggle:
 *   patch:
 *     summary: Toggle announcement active status
 *     tags: [Announcements]
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
 *         description: Status toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Announcement not found
 */
router.patch('/:id/toggle', authenticateUser, adminOnly, toggleAnnouncementStatus);

/**
 * @swagger
 * /api/announcements/stats/overview:
 *   get:
 *     summary: Get announcement statistics
 *     tags: [Announcements]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Announcement statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/stats/overview', authenticateUser, adminOnly, getAnnouncementStats);

export default router;