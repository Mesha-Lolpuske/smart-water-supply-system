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
router.get('/', authenticateUser, getProfile);
router.put('/', authenticateUser, updateProfile);
router.put('/change-password', authenticateUser, changePassword);
router.delete('/',authenticateUser,deleteProfile);
router.get('/stats', authenticateUser, getUserStats);

export default router;