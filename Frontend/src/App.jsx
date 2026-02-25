import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";

// Auth Pages
import Homepage from "./components/pages/Homepage";
import LoginPage from "./components/pages/auth/Login";
import RegisterPage from "./components/pages/auth/Register";
import VerifyOTPPage from "./components/pages/auth/VerifyOTP";
import ForgotPasswordPage from "./components/pages/auth/ForgotPassword";
import ResetPasswordPage from "./components/pages/auth/ResetPassword";

// General Pages
import UnauthorizedPage from "./components/pages/Unauthorizedpage";
import NotFoundPage from "./components/pages/NotFoundPage";

// Dashboard Pages
import UserDashboard from "./components/pages/dashboard/Userdashboard";
import AdminDashboard from "./components/pages/dashboard/Admindashboard";

// Schedule Pages
import Schedules from "./components/pages/Schedules/Schedules";
import ScheduleDetails from "./components/pages/Schedules/ScheduleDetails";
import CreateSchedule from "./components/pages/Schedules/CreateSchedule";
import EditSchedule from "./components/pages/Schedules/EditSchedule";

// Report Pages
import MyReports from "./components/pages/reports/MyReports";
import ReportDetails from "./components/pages/reports/ReportDetails";
import CreateReport from "./components/pages/reports/CreateReport";
import EditReport from "./components/pages/reports/EditReport";
import Reports from "./components/pages/reports/Reports";

// Announcement Pages
import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import AnnouncementDetails from "./components/pages/announcements/AnnouncementDetails";
import CreateAnnouncementPage from "./components/pages/announcements/CreateAnnouncementPage";
import EditAnnouncement from "./components/pages/announcements/EditAnnouncement";

// Profile & Notifications
import Profile from "./components/pages/profile/Profile";
import EditProfile from "./components/pages/profile/EditProfile";
import Notifications from "./components/pages/notifications/Notifications";

// Admin-specific pages
import UserManagement from "./components/pages/admin/UserManagement";
import AdminSettings from "./components/pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ===== USER ROUTES ===== */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* User - Schedules (read only) */}
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/schedules/:id" element={<ScheduleDetails />} />

        {/* User - Reports */}
        <Route path="/reports/my-reports" element={<MyReports />} />
        <Route path="/reports/create" element={<CreateReport />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/reports/:id/edit" element={<EditReport />} />

        {/* User - Announcements (read only) */}
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:id" element={<AnnouncementDetails />} />

        {/* User - Profile & Notifications */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Admin - Schedules (full control) */}
        <Route path="/admin/schedules" element={<Schedules />} />
        <Route path="/admin/schedules/:id" element={<ScheduleDetails />} />
        <Route path="/admin/schedules/create" element={<CreateSchedule />} />
        <Route path="/admin/schedules/:id/edit" element={<EditSchedule />} />

        {/* Admin - Reports (view & manage all) */}
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/reports/:id" element={<ReportDetails />} />

        {/* Admin - Announcements (full control) */}
        <Route path="/admin/announcements" element={<AnnouncementsPage />} />
        <Route
          path="/admin/announcements/:id"
          element={<AnnouncementDetails />}
        />
        <Route
          path="/admin/announcements/create"
          element={<CreateAnnouncementPage />}
        />
        <Route
          path="/admin/announcements/:id/edit"
          element={<EditAnnouncement />}
        />

        {/* Admin - Profile & Notifications */}
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/profile/edit" element={<EditProfile />} />
        <Route path="/admin/notifications" element={<Notifications />} />

        {/* Admin - User Management & Settings */}
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* ===== 404 - MUST BE LAST ===== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
