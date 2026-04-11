import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./components/hooks/useAuth";
import { ToastContainer } from "react-toastify";

import { SearchProvider } from "./components/context/SearchContext";
import FAQ from "./components/pages/FAQ";

// Import route protection components
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import TechnicianRoute from "./components/routes/TechnicianRoute";
import StaffRoute from "./components/routes/StaffRoute";

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
import TechnicianDashboard from "./components/pages/dashboard/TechnicianDashboard";
import StaffDirectory from "./components/pages/dashboard/StaffDirectory";

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
import CreateNotification from "./components/pages/notifications/CreateNotification";

// Admin-specific pages
import AdminSettings from "./components/pages/admin/AdminSettings";
import UserManagement from "./components/pages/admin/UserManagement";

// New Analytics Report Pages
import UserRegistrationTrends from "./components/pages/System reports/UserRegistrationTrends";
import IncidentSeverityDistribution from "./components/pages/System reports/IncidentSeverityDistribution";
import ScheduleDistributionByLocation from "./components/pages/System reports/ScheduleDistributionByLocation";
import AnnouncementCategories from "./components/pages/System reports/AnnouncementCategories";
import InteractiveGISMap from "./components/pages/maps/InteractiveGISMap";



// Dashboard Route - Auto-redirect based on role
function DashboardRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-sky-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ AUTO-REDIRECT based on role
  if (user.role === "admin") {
    return <AdminDashboard />;
  } else if (user.role === "technician") {
    return <TechnicianDashboard />;
  } else {
    return <UserDashboard />;
  }
}
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            ...
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            {/* ===== SINGLE DASHBOARD ROUTE - Auto-redirects based on role ===== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
            {/* ===== USER ROUTES (Protected) ===== */}
            {/* User - Schedules (read only) */}
            <Route
              path="/schedules"
              element={
                <ProtectedRoute>
                  <Schedules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedules/:id"
              element={
                <ProtectedRoute>
                  <ScheduleDetails />
                </ProtectedRoute>
              }
            />
            {/* User - Reports */}
            <Route
              path="/reports/my-reports"
              element={
                <ProtectedRoute>
                  <MyReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/create"
              element={
                <ProtectedRoute>
                  <CreateReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:id"
              element={
                <ProtectedRoute>
                  <ReportDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:id/edit"
              element={
                <ProtectedRoute>
                  <EditReport />
                </ProtectedRoute>
              }
            />
            {/* User - Announcements (read only) */}
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements/:id"
              element={
                <ProtectedRoute>
                  <AnnouncementDetails />
                </ProtectedRoute>
              }
            />
            {/* User - Profile & Notifications */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            {/* ===== TECHNICIAN ROUTES (Technician Only) ===== */}
            <Route
              path="/technician/dashboard"
              element={
                <TechnicianRoute>
                  <TechnicianDashboard />
                </TechnicianRoute>
              }
            />
            <Route
              path="/technician/directory"
              element={
                <TechnicianRoute>
                  <StaffDirectory />
                </TechnicianRoute>
              }
            />

            {/* ===== STAFF ROUTES (Admin & Technician) ===== */}
            <Route
              path="/staff/reports/:id"
              element={
                <StaffRoute>
                  <ReportDetails />
                </StaffRoute>
              }
            />
            {/* ===== ADMIN ROUTES (Admin Only - Protected) ===== */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            {/* Admin - Schedules (full control) */}
            <Route
              path="/admin/schedules"
              element={
                <AdminRoute>
                  <Schedules />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schedules/:id"
              element={
                <AdminRoute>
                  <ScheduleDetails />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schedules/create"
              element={
                <AdminRoute>
                  <CreateSchedule />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schedules/:id/edit"
              element={
                <AdminRoute>
                  <EditSchedule />
                </AdminRoute>
              }
            />
            {/* Admin - Reports (view & manage all) */}
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports/:id"
              element={
                <AdminRoute>
                  <ReportDetails />
                </AdminRoute>
              }
            />
            {/* Admin - Analytics Reports */}
            <Route
              path="/admin/reports/user-registration-trends"
              element={
                <AdminRoute>
                  <UserRegistrationTrends />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports/incident-severity-distribution"
              element={
                <AdminRoute>
                  <IncidentSeverityDistribution />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports/schedule-distribution"
              element={
                <AdminRoute>
                  <ScheduleDistributionByLocation />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports/announcement-categories"
              element={
                <AdminRoute>
                  <AnnouncementCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports/interactive-gis-mapping"
              element={
                <AdminRoute>
                  <InteractiveGISMap />
                </AdminRoute>
              }
            />
            {/* Admin - Announcements (full control) */}
            <Route
              path="/admin/announcements"
              element={
                <AdminRoute>
                  <AnnouncementsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/announcements/:id"
              element={
                <AdminRoute>
                  <AnnouncementDetails />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/announcements/create"
              element={
                <AdminRoute>
                  <CreateAnnouncementPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/announcements/:id/edit"
              element={
                <AdminRoute>
                  <EditAnnouncement />
                </AdminRoute>
              }
            />
            {/* Admin - Profile & Notifications */}
            <Route
              path="/admin/profile"
              element={
                <AdminRoute>
                  <Profile />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/profile/edit"
              element={
                <AdminRoute>
                  <EditProfile />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <AdminRoute>
                  <Notifications />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/notifications/create"
              element={
                <AdminRoute>
                  <CreateNotification />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/faq"
              element={
                <AdminRoute>
                  <FAQ />
                </AdminRoute>
              }
            />
          
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />
       
          
            {/* ===== 404 - MUST BE LAST ===== */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </>
  );
}

export default App;
