import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import passwordResetRoutes from "./routes/PasswordResetRoute.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { seedAdmin } from './config/seedAdmin.js';
import { swaggerDocs } from "./config/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//basic test route
app.get("/", (req, res) => {
  res.send("Api is running successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

swaggerDocs(app, PORT);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

connectDB().then(async () => {
  await seedAdmin(); 
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
