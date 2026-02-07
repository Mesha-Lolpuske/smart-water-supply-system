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
router.get("/", getAllSchedules);
router.get("/active", getActiveSchedules);
router.get("/:id", getScheduleById);

// Admin protected routes
router.post("/", authenticateUser, adminOnly, createSchedule);
router.put("/:id", authenticateUser, adminOnly, updateSchedule);
router.delete("/:id", authenticateUser, adminOnly, deleteSchedule);
router.patch("/:id/toggle", authenticateUser, adminOnly, toggleScheduleStatus);

export default router;
