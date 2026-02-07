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
router.get('/system-overview', getSystemOverview);

// User route (authenticated)
router.get('/user-stats', authenticateUser, getUserDashboardStats);

// Admin route
router.get('/admin-stats', authenticateUser, adminOnly, getAdminDashboardStats);

export default router;