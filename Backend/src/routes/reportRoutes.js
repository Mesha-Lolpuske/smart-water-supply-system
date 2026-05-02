import express from 'express';
import {
  createReport,
  getAllReports,
  getMyReports,
  getPendingReports,
  getReportById,
  updateReportStatus,
  updateReport,
  deleteReport,
  getReportStats,
  assignTechnician,
  getAssignedReports
} from '../controllers/waterReport.js';

import { authenticateUser, adminOnly, technicianOnly, staffOnly } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */
/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all water reports
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get('/', getAllReports);

/**
 * @swagger
 * /api/reports/pending:
 *   get:
 *     summary: Get pending reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of pending reports
 */
router.get('/pending', getPendingReports);

/* =======================
   AUTHENTICATED USER ROUTES
======================= */
/**
 * @swagger
 * /api/reports/my-reports:
 *   get:
 *     summary: Get user's own reports
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's reports
 *       401:
 *         description: Unauthorized
 */
router.get('/my-reports', authenticateUser, getMyReports);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new water report
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - reportType
 *               - title
 *               - description
 *               - location
 *             properties:
 *               reportType:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               severity:
 *                 type: string
 *               issueImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateUser, upload.single('issueImage'), createReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update report details
 *     tags: [Reports]
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
 *               reportType:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               severity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       400:
 *         description: Cannot update report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 */
router.put('/:id', authenticateUser, updateReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete report
 *     tags: [Reports]
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
 *         description: Report deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 */
router.delete('/:id', authenticateUser, deleteReport);

/* =======================
   STAFF ROUTES (ADMIN & TECHNICIAN)
======================= */
/**
 * @swagger
 * /api/reports/{id}/status:
 *   patch:
 *     summary: Update report status (Staff only)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *               adminNotes:
 *                 type: string
 *               technicianNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff only
 *       404:
 *         description: Report not found
 */
router.patch('/:id/status', authenticateUser, staffOnly, updateReportStatus);

/**
 * @swagger
 * /api/reports/assigned/me:
 *   get:
 *     summary: Get reports assigned to current technician
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of assigned reports
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Technicians only
 */
router.get('/assigned/me', authenticateUser, technicianOnly, getAssignedReports);

/* =======================
   ADMIN ONLY ROUTES
======================= */
/**
 * @swagger
 * /api/reports/{id}/assign:
 *   patch:
 *     summary: Assign report to a technician (Admin only)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Report not found
 */
router.patch('/:id/assign', authenticateUser, adminOnly, assignTechnician);

/**
 * @swagger
 * /api/reports/stats/overview:
 *   get:
 *     summary: Get report statistics (Admin only)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Report statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/stats/overview', authenticateUser, adminOnly, getReportStats);

/* ======================= 
   SINGLE REPORT ROUTES
======================= */
/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get single report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
router.get('/:id', getReportById);

export default router;
