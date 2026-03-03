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
  getReportStats
} from '../controllers/waterReport.js';

import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */
router.get('/', getAllReports);
router.get('/pending', getPendingReports);

/* =======================
   AUTHENTICATED USER ROUTES
======================= */
router.post('/', authenticateUser, createReport);
router.get('/user/my-reports', authenticateUser, getMyReports);
router.put('/:id', authenticateUser, updateReport);
router.delete('/:id', authenticateUser, deleteReport);

/* =======================
   ADMIN ONLY ROUTES
======================= */
router.put('/:id/status', authenticateUser, adminOnly, updateReportStatus);
router.get('/stats/overview', authenticateUser, adminOnly, getReportStats);

/* ======================= 
   SINGLE REPORT ROUTES
======================= */
router.get('/:id', getReportById);

export default router;
