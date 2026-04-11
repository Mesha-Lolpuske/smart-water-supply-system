// routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getTechnicians,
  updateUserRole
} from '../controllers/adminController.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateUser);
router.use(adminOnly);

// User management routes
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with report counts
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/technicians:
 *   get:
 *     summary: Get all technicians
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all technicians
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get('/technicians', getTechnicians);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, technician]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch('/users/:id/role', updateUserRole);

export default router;
