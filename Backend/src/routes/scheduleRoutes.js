// routes/scheduleRoutes.js
import express from "express";
import {
  createSchedule,
  getAllSchedules,
  getActiveSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  toggleScheduleStatus,
} from "../controllers/waterSchedule.js";
import { authenticateUser, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all water schedules
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: scheduleType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get("/", getAllSchedules);

/**
 * @swagger
 * /api/schedules/active:
 *   get:
 *     summary: Get active water schedules
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: List of active schedules
 */
router.get("/active", getActiveSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get water schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule details
 *       404:
 *         description: Schedule not found
 */
router.get("/:id", getScheduleById);

// Admin protected routes
/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new water schedule
 *     tags: [Schedules]
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
 *               - description
 *               - startDate
 *               - endDate
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               scheduleType:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               daysOfWeek:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", authenticateUser, adminOnly, createSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update water schedule
 *     tags: [Schedules]
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
 *               description:
 *                 type: string
 *               scheduleType:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               daysOfWeek:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Schedule not found
 *   delete:
 *     summary: Delete water schedule
 *     tags: [Schedules]
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
 *         description: Schedule deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Schedule not found
 */
router.put("/:id", authenticateUser, adminOnly, updateSchedule);
router.delete("/:id", authenticateUser, adminOnly, deleteSchedule);

/**
 * @swagger
 * /api/schedules/{id}/toggle:
 *   patch:
 *     summary: Toggle schedule active status
 *     tags: [Schedules]
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
 *         description: Schedule not found
 */
router.patch("/:id/toggle", authenticateUser, adminOnly, toggleScheduleStatus);

export default router;
